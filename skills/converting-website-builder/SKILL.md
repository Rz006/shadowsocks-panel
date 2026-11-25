---
name: converting-website-builder
description: Expert website development skill for building professional, high-converting, fast, accessible, distinctive websites and landing pages for clients — strategy, design system, conversion copy, section-by-section build, SEO, forms, deployment, and automated visual/quality audit with screenshots. Use this whenever the user wants to build, generate, redesign, clone-the-structure-of, or improve any website, landing page, homepage, portfolio, business site, booking site, restaurant/dentist/gym/salon/law/trades/real-estate/coach/SaaS site, or small online store front — in HTML/CSS, Tailwind, Astro, Next.js, React, WordPress, Webflow or Shopify — even if they just say "make me a website for my bakery" or "website gen".
---

# Website Builder (Converting, Professional, Distinctive)

You are acting as a senior web designer + conversion copywriter + front-end engineer. The client doesn't actually want "a website" — they want calls, bookings, sales, or credibility. Every decision serves **one primary conversion action**, and the result must look like a real studio made it for *this* business, not a generic template.

Work through the phases below. For a quick request, compress them (state assumptions instead of asking), but don't skip the design system or the verification — those are what separate a professional site from an AI-looking one.

---

## Phase 1 — Brief (2 minutes, not 20 questions)

Extract or assume:
| Item | Example |
|---|---|
| Business + offer | Family dentist, implants & Invisalign |
| Audience + their main worry | Nervous adults, worried about pain and cost |
| **Primary CTA** | Book appointment (online booking link) |
| Secondary CTA | Call; get free consult |
| Location / market | Austin TX, local |
| Proof available | Google rating, years, before/afters, logos |
| Brand assets | Logo, colors, photos — or none |
| Pages | Home, services, about, contact (+ location pages?) |
| Stack constraint | Client edits content? → CMS |

If the user gives little, open `references/industry-playbooks.md`, take the matching industry defaults, and write down your assumptions at the top of your answer. Ask at most 3 questions, only ones that change the build.

## Phase 2 — Strategy & sitemap

1. Choose the stack with the table below.
2. Write the sitemap and, for the home/landing page, the **section order** with the job of each section (see `references/sections.md` for the section library).
3. Decide the conversion mechanics: sticky mobile CTA? booking embed? quote form? click-to-call? lead magnet?

| Situation | Stack |
|---|---|
| Single landing page / brochure, you maintain it | Static HTML + CSS (start from `assets/starter-template.html`) or Astro |
| Multi-page marketing site, you maintain it | Astro + Tailwind (or plain CSS), deploy Netlify/Vercel/Cloudflare Pages |
| Needs app logic, auth, AI chat, dashboards | Next.js (App Router) + Tailwind on Vercel |
| Client edits content regularly | WordPress (block theme, ≤ 8 plugins) or Webflow; or Astro + a headless CMS (Decap, Sanity) |
| Selling > 10 products | Shopify |

Setup commands and form/booking backends are in `references/stacks.md`.

## Phase 3 — Design system (do this before writing markup)

Generic AI sites all look the same: centered hero, purple-blue gradient, Inter everywhere, three identical cards with emoji icons. Avoid that by making deliberate choices **from the brand and industry**, then encoding them as tokens. Read `references/design-system.md` for type pairings, palette construction, spacing, and layout patterns.

Produce a short token block like this and use it everywhere:
```css
:root{
  --font-display:"Fraunces",Georgia,serif; --font-body:"Inter",system-ui,sans-serif;
  --c-bg:#FBF8F3; --c-surface:#FFFFFF; --c-ink:#1C1B19; --c-muted:#5E5A53;
  --c-brand:#0F5C4D; --c-brand-ink:#FFFFFF; --c-accent:#E9A23B; --c-line:#E7E1D6;
  --radius:14px; --shadow:0 1px 2px rgb(0 0 0/.05),0 8px 24px rgb(0 0 0/.06);
  --step--1:clamp(.83rem,.8rem + .15vw,.9rem); --step-0:clamp(1rem,.96rem + .2vw,1.13rem);
  --step-1:clamp(1.25rem,1.1rem + .6vw,1.5rem); --step-2:clamp(1.6rem,1.3rem + 1.3vw,2.2rem);
  --step-3:clamp(2.1rem,1.6rem + 2.4vw,3.4rem); --step-4:clamp(2.6rem,1.8rem + 3.8vw,4.6rem);
  --space:clamp(4rem,3rem + 5vw,8rem); --max:1180px;
}
```
State in one line *why* the choices fit the business (e.g. "warm off-white + deep green + serif display = calm, established, premium dental care").

## Phase 4 — Copy

Write real copy, not lorem ipsum. Follow `references/copywriting.md`. The essentials:
- **Hero headline = the outcome the customer wants**, specific to them ("Pain-free implants in Austin — done in one visit"), never "Welcome to X".
- Subhead says who it's for + the key differentiator. CTA button says what happens ("Book my free consult").
- Benefits before features; specifics before adjectives; objections answered in the FAQ.
- Proof: use real testimonials/stats the client provided. If none, insert clearly marked placeholders like `[REAL REVIEW — client to supply]`. **Never invent reviews, ratings, client logos, awards or statistics** — fake social proof is deceptive, illegal under consumer-protection rules (e.g. the FTC's fake review rule), and destroys trust if spotted.

## Phase 5 — Build

Build rules (these are what make a site feel professional):
- **Mobile-first.** Design at 375px, then enhance. Primary CTA visible without scrolling on mobile. For local services add a sticky bottom bar (Call / Book).
- **Semantic HTML**: `header`, `nav`, `main`, `section[aria-labelledby]`, `footer`; one `h1`; logical `h2/h3`.
- **Layout**: CSS grid/flex, a max-width container, generous vertical rhythm (`--space`), asymmetry where it helps (split hero, offset image, bento grid) instead of everything centered.
- **Images**: real photos > stock > illustrations. Always `width`/`height`, `alt`, `loading="lazy"` below the fold, hero `fetchpriority="high"`, AVIF/WebP via `<picture>` or framework image component. Use placeholder services only with a note to replace (e.g. `https://images.unsplash.com/...` with photographer credit, or solid color blocks).
- **Icons**: inline SVG (Lucide/Heroicons/Phosphor) — not emoji.
- **Interaction**: visible hover/focus states, `prefers-reduced-motion` respected, subtle motion only (fade/slide 150–300ms). No carousels for key content; no autoplay video with sound.
- **Forms**: labels, autocomplete attributes, inline errors, honeypot + Turnstile, server-side validation, success state, client notification. See `references/stacks.md` for backends.
- **Trust & legal**: NAP in footer for local businesses, privacy policy link, cookie consent only if trackers require it.
- **SEO basics**: unique title/meta, OG image, JSON-LD (`LocalBusiness` subtype etc.), sitemap, robots, canonical.
- **Performance**: ≤ 2 font families (with `font-display:swap` and preconnect), no jQuery/slider libraries, defer third-party scripts, static generation.
- Produce **complete files**, never fragments with "…rest of code here".

For a fast, high-quality single page, copy `assets/starter-template.html` and adapt it: it already contains the token system, accessible nav, split hero, services, proof, process, FAQ (native `<details>`), CTA band, footer, sticky mobile CTA, and JSON-LD. Restyle it to the brand — don't ship it looking like the template.

## Phase 6 — Verify (don't skip)

If you can run code, audit what you built:
```bash
node scripts/audit_site.mjs <path-or-url-to-page> [output-dir]
```
It serves local files, captures desktop + mobile screenshots, and reports: h1 count, missing alt text, title/meta lengths, horizontal overflow on mobile, primary CTA above the fold on mobile, small tap targets, low-contrast text, broken internal links/anchors, console errors, and missing viewport/lang/OG/JSON-LD. **Look at the screenshots yourself** and fix anything that looks off (cramped spacing, awkward line breaks, weak hierarchy, contrast). Re-run until the report is clean.

Then run through `references/quality-checklist.md` (performance, accessibility, SEO, forms, security, content).

## Phase 7 — Deliver

Give the user:
1. The site files (or repo) and how to run/deploy it (one command each).
2. A short design rationale (palette, type, layout choices tied to the brand).
3. **Client to-do list**: real photos, testimonials, logo files, legal pages, form destination email, domain access.
4. Screenshots (mobile + desktop) if you generated them.
5. Suggested upsells that genuinely fit: AI chatbot (`ai-chatbot-integration`), lead follow-up emails (`ai-email-automation`), security hardening (`website-security-hardening`), SEO launch (`seo-launch-kit`), care plan (`client-handoff-maintenance`).

## Redesigns of an existing site

Before changing anything: capture screenshots and the URL list of the old site, note what's working (pages with traffic, rankings), keep URLs or create a 301 redirect map, carry over real testimonials and content, and present a before/after with specific conversion improvements. If asked to copy another company's site, take inspiration from structure and patterns only — don't copy their text, images, logo or brand.
