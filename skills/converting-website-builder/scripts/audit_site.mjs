#!/usr/bin/env node
/**
 * Website quality audit: screenshots + automated checks.
 *
 * Usage:
 *   node audit_site.mjs <file.html | http(s)://url> [outDir=./audit]
 *
 * Requires Playwright (npm i -D playwright && npx playwright install chromium),
 * or a pre-installed Playwright/Chromium.
 *
 * Output: <outDir>/desktop.png, mobile.png (full page), mobile-fold.png (first screen),
 * report.json, and a readable summary on stdout. Exit code 0 always; read the report.
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = await import('playwright')); }

const target = process.argv[2];
const outDir = path.resolve(process.argv[3] || './audit');
if (!target) { console.error('Usage: node audit_site.mjs <file.html|url> [outDir]'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const isUrl = /^https?:\/\//i.test(target);
const pageUrl = isUrl ? target : pathToFileURL(path.resolve(target)).href;

const issues = []; // {level: 'error'|'warn'|'info', check, detail}
const add = (level, check, detail) => issues.push({ level, check, detail });

const browser = await chromium.launch();

async function openPage(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const failed = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(String(e)));
  page.on('requestfailed', r => failed.push(`${r.url()} (${r.failure()?.errorText})`));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.url()} (HTTP ${r.status()})`); });
  await page.goto(pageUrl, { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(800);
  // Trigger reveal-on-scroll animations so full-page screenshots show content.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  });
  await page.waitForTimeout(600);
  return { ctx, page, consoleErrors, failed };
}

// ---------- Desktop ----------
const d = await openPage({ width: 1366, height: 900 });
await d.page.screenshot({ path: path.join(outDir, 'desktop.png'), fullPage: true });

const meta = await d.page.evaluate(() => {
  const q = s => document.querySelector(s);
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => {
    try { const j = JSON.parse(s.textContent); return { ok: true, type: j['@type'] || (Array.isArray(j) ? 'array' : '?') }; }
    catch (e) { return { ok: false, error: String(e) }; }
  });
  const ids = new Set([...document.querySelectorAll('[id]')].map(e => e.id));
  const anchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1);
  const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
  const imgs = [...document.images].map(i => ({ src: i.currentSrc || i.src, alt: i.getAttribute('alt'), w: i.getAttribute('width'), h: i.getAttribute('height'), natural: i.naturalWidth }));
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  const placeholders = (document.body.innerText.match(/\[[^\]\n]{2,80}\]|lorem ipsum/gi) || []);
  return {
    title: document.title, desc: q('meta[name="description"]')?.content || '',
    lang: document.documentElement.lang, viewport: !!q('meta[name="viewport"]'),
    canonical: !!q('link[rel="canonical"]'), ogImage: !!q('meta[property="og:image"]'),
    ogTitle: !!q('meta[property="og:title"]'), favicon: !!q('link[rel~="icon"]'),
    h1: document.querySelectorAll('h1').length, headings, ld,
    brokenAnchors: [...new Set(anchors.filter(h => !ids.has(decodeURIComponent(h.slice(1)))))],
    links, imgs, placeholders: [...new Set(placeholders)].slice(0, 30),
    forms: [...document.forms].map(f => ({
      action: f.getAttribute('action'),
      unlabeled: [...f.querySelectorAll('input:not([type=hidden]):not([type=submit]),select,textarea')]
        .filter(el => !el.closest('[aria-hidden="true"]'))
        .filter(el => !(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) && !el.closest('label') && !el.getAttribute('aria-label'))
        .map(el => el.name || el.id || el.tagName),
    })),
  };
});

if (!meta.title) add('error', 'title', 'Missing <title>');
else if (meta.title.length > 60) add('warn', 'title', `Title is ${meta.title.length} chars (aim ≤ 60): "${meta.title}"`);
if (!meta.desc) add('error', 'meta-description', 'Missing meta description');
else if (meta.desc.length > 160 || meta.desc.length < 70) add('warn', 'meta-description', `Meta description is ${meta.desc.length} chars (aim 70–155)`);
if (!meta.lang) add('error', 'lang', '<html> has no lang attribute');
if (!meta.viewport) add('error', 'viewport', 'Missing viewport meta tag');
if (!meta.canonical) add('warn', 'canonical', 'No canonical link');
if (!meta.ogImage || !meta.ogTitle) add('warn', 'open-graph', 'Missing og:title and/or og:image (link previews)');
if (!meta.favicon) add('warn', 'favicon', 'No favicon');
if (meta.h1 !== 1) add('error', 'h1', `Found ${meta.h1} <h1> elements (should be exactly 1)`);
for (let i = 1; i < meta.headings.length; i++) {
  if (meta.headings[i] - meta.headings[i - 1] > 1) { add('warn', 'heading-order', `Heading level jumps from h${meta.headings[i - 1]} to h${meta.headings[i]}`); break; }
}
if (!meta.ld.length) add('warn', 'structured-data', 'No JSON-LD structured data');
meta.ld.filter(x => !x.ok).forEach(x => add('error', 'structured-data', `Invalid JSON-LD: ${x.error}`));
meta.brokenAnchors.forEach(h => add('error', 'anchor', `Link to ${h} but no element with that id`));
meta.imgs.filter(i => i.alt === null).forEach(i => add('error', 'img-alt', `Image without alt: ${i.src}`));
meta.imgs.filter(i => !i.w || !i.h).forEach(i => add('warn', 'img-size', `Image without width/height (layout shift): ${i.src}`));
meta.imgs.filter(i => i.natural === 0).forEach(i => add('error', 'img-broken', `Image failed to load: ${i.src}`));
meta.forms.forEach(f => {
  if (!f.action || /^\[|^#?$/.test(f.action)) add('warn', 'form', `Form action not set to a real endpoint (${f.action ?? 'none'})`);
  f.unlabeled.forEach(n => add('error', 'form-label', `Form field without label: ${n}`));
});
if (meta.placeholders.length) add('info', 'placeholders', `Placeholder text still on page (client must supply): ${meta.placeholders.slice(0, 10).join(' | ')}${meta.placeholders.length > 10 ? ' …' : ''}`);

// Local relative links: check files exist.
if (!isUrl) {
  const base = path.dirname(path.resolve(target));
  for (const href of new Set(meta.links)) {
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(href) || /^\[/.test(href)) continue;
    const p = path.resolve(base, href.split('#')[0].split('?')[0]);
    if (!fs.existsSync(p)) add('error', 'link', `Broken local link: ${href}`);
  }
} else {
  const origin = new URL(target).origin;
  const internal = [...new Set(meta.links)].filter(h => !/^(mailto:|tel:|#|javascript:)/i.test(h))
    .map(h => { try { return new URL(h, target).href; } catch { return null; } })
    .filter(u => u && u.startsWith(origin)).slice(0, 40);
  for (const u of internal) {
    try { const r = await d.ctx.request.get(u, { timeout: 15000 }); if (r.status() >= 400) add('error', 'link', `Broken link ${u} (HTTP ${r.status()})`); }
    catch (e) { add('warn', 'link', `Could not check ${u}: ${e.message}`); }
  }
}

// Contrast (desktop)
const contrast = await d.page.evaluate(() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const blend = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const bgOf = el => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // can't know (image/gradient)
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    return bg;
  };
  const out = []; const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (cs.visibility === 'hidden' || cs.display === 'none' || r.width === 0 || +cs.opacity === 0) continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    const fg = parse(cs.color); const bg = bgOf(el); if (!fg || !bg) continue;
    const fgb = blend(fg, bg);
    const L1 = lum(fgb), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize); const bold = +cs.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) out.push({ text: t.textContent.trim().slice(0, 50), ratio: ratio.toFixed(2), need, color: cs.color });
  }
  return out;
});
contrast.slice(0, 15).forEach(c => add('error', 'contrast', `"${c.text}" contrast ${c.ratio}:1 (needs ${c.need}:1, color ${c.color})`));
if (contrast.length > 15) add('error', 'contrast', `…and ${contrast.length - 15} more low-contrast text elements`);

// ---------- Mobile ----------
const m = await openPage({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
await m.page.screenshot({ path: path.join(outDir, 'mobile-fold.png') });
await m.page.screenshot({ path: path.join(outDir, 'mobile.png'), fullPage: true });

const mob = await m.page.evaluate(() => {
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const overflow = document.documentElement.scrollWidth > vw + 1;
  const wide = overflow ? [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > vw + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; })
    .slice(0, 8).map(e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''}`) : [];
  const visible = e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const ctaRe = /(book|call|quote|order|reserve|buy|shop|start|get|contact|schedule|apply|join|try|request|donate|sign up|enquire|inquire)/i;
  const ctas = [...document.querySelectorAll('a,button')].filter(e => visible(e) && ctaRe.test(e.textContent))
    .map(e => ({ text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), top: e.getBoundingClientRect().top, bottom: e.getBoundingClientRect().bottom }));
  const ctaAboveFold = ctas.filter(c => c.top >= 0 && c.bottom <= vh);
  const small = [...document.querySelectorAll('a,button,input,select,textarea,summary')].filter(e => {
    if (!visible(e) || e.closest('p,small,blockquote')) return false; // inline text links are exempt (WCAG 2.5.8)
    if (e.matches('input[type=hidden]') || e.closest('[aria-hidden="true"]')) return false;
    const r = e.getBoundingClientRect(); return r.height < 24 || r.width < 24;
  }).slice(0, 10).map(e => `${e.tagName.toLowerCase()} "${(e.textContent || e.name || '').trim().slice(0, 30)}" ${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`);
  const tinyText = [...document.querySelectorAll('p,li,a,span,small,label')].filter(e => visible(e) && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 12).length;
  const inputsSmallFont = [...document.querySelectorAll('input,select,textarea')].filter(e => visible(e) && !e.closest('[aria-hidden="true"]') && parseFloat(getComputedStyle(e).fontSize) < 16).length;
  return { overflow, wide, ctaAboveFold, ctaCount: ctas.length, small, tinyText, inputsSmallFont, pageHeight: document.documentElement.scrollHeight };
});
if (mob.overflow) add('error', 'mobile-overflow', `Horizontal scroll on mobile. Elements wider than screen: ${mob.wide.join(', ')}`);
if (!mob.ctaAboveFold.length) add('error', 'mobile-cta', 'No call-to-action visible on the first mobile screen');
else add('info', 'mobile-cta', `CTA above fold on mobile: ${mob.ctaAboveFold.map(c => `"${c.text}"`).join(', ')}`);
mob.small.forEach(s => add('warn', 'tap-target', `Small tap target on mobile: ${s} (WCAG min 24px; aim for 44px on primary actions)`));
if (mob.tinyText) add('warn', 'font-size', `${mob.tinyText} text elements under 12px on mobile`);
if (mob.inputsSmallFont) add('warn', 'input-font', `${mob.inputsSmallFont} form fields under 16px font (iOS will zoom on focus)`);

// Page weight + errors
const perf = await d.page.evaluate(() => {
  const res = performance.getEntriesByType('resource');
  const nav = performance.getEntriesByType('navigation')[0];
  const total = res.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0) + (nav?.transferSize || nav?.encodedBodySize || 0);
  const scripts = res.filter(r => r.initiatorType === 'script').length;
  return { totalKB: Math.round(total / 1024), requests: res.length + 1, scripts };
});
if (perf.totalKB > 2500) add('warn', 'page-weight', `Page transfers ~${perf.totalKB} KB (aim < 1500 KB)`);
if (perf.scripts > 10) add('warn', 'scripts', `${perf.scripts} script requests — consider removing/deferring third-party scripts`);
[...new Set([...d.consoleErrors, ...m.consoleErrors])].forEach(e => add('error', 'console', e.slice(0, 200)));
[...new Set([...d.failed, ...m.failed])].forEach(f => add('error', 'request', `Failed request: ${f.slice(0, 200)}`));

await browser.close();

const counts = { error: 0, warn: 0, info: 0 }; issues.forEach(i => counts[i.level]++);
const report = { target, generated: new Date().toISOString(), counts, perf, mobile: { pageHeight: mob.pageHeight, ctaCount: mob.ctaCount }, issues,
  screenshots: ['desktop.png', 'mobile.png', 'mobile-fold.png'].map(f => path.join(outDir, f)) };
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

const icon = { error: '✖', warn: '⚠', info: 'ℹ' };
console.log(`\nAudit: ${target}`);
console.log(`Errors: ${counts.error}  Warnings: ${counts.warn}  Info: ${counts.info}  ·  ~${perf.totalKB} KB, ${perf.requests} requests\n`);
for (const lvl of ['error', 'warn', 'info']) issues.filter(i => i.level === lvl).forEach(i => console.log(`${icon[lvl]} [${i.check}] ${i.detail}`));
console.log(`\nScreenshots + report.json in ${outDir}`);
console.log('Next: open the screenshots and judge the design visually; fix errors, then re-run.');
