# Motion, Interaction & Uniqueness

Contents: 1. Creative direction (uniqueness) · 2. Motion principles · 3. Technique catalog with code · 4. Interactive media · 5. Libraries · 6. Page transitions · 7. Performance & accessibility rules · 8. Choosing the right amount

Working examples of almost everything here live in `assets/interactive-template.html` — copy the pieces you need.

---

## 1. Creative direction — make every site unique

Before building, pick **one art direction** and **one signature moment**. Write them down in one line each and keep every decision consistent with them.

| Direction | Look | Motion personality | Fits |
|---|---|---|---|
| **Vibrant modern** | Off-white or ink base, 1–2 saturated accents (signal orange, lime, cobalt), big grotesk type, rounded cards | Snappy, springy (200–400ms), playful hovers | Agencies, startups, creators, gyms, events |
| **Swiss / editorial** | Strict grid, huge type, lots of whitespace, hairlines, 1 accent | Precise, linear reveals, text masks | Architects, studios, consultants, portfolios |
| **Soft premium** | Warm neutrals, serif display, large imagery, subtle shadows | Slow, smooth (500–800ms), gentle fades & parallax | Dental/medical, spas, hotels, real estate, law |
| **Bento / product** | Modular tiles of mixed sizes, product UI shots, crisp borders | Tiles animate in sequence, hover lift, live UI demos | SaaS, apps, tech services |
| **Dark luxe** | Near-black, champagne/gold or neon accent, glassy surfaces | Spotlight cursor, glow, slow reveals | Luxury, nightlife, high-end automotive, crypto-free fintech |
| **Neo-brutalist** | Thick borders, hard shadows, flat bright colors, raw type | Hard offsets, instant snaps, stamp effects | Creative brands, Gen-Z products, food trucks |
| **Organic / natural** | Earthy palette, blob shapes, hand-drawn accents, textures | Floating, breathing, morphing blobs | Wellness, food, kids, eco brands |

**Signature moment** — one memorable interaction that relates to the business (not random effects):
- Dentist: before/after smile slider. Restaurant: menu dish hover reveals photo following the cursor. Gym: animated counters of member results. Architect: horizontal-scroll project gallery. SaaS: live interactive product demo in the hero. Plumber: "Get a quote in 3 taps" interactive estimator. Agency: magnetic CTA + cursor spotlight + marquee of capabilities.

**More uniqueness levers** (pick 2–3, not all): custom illustrated icons; a distinctive shape language (pills, notches, blobs, angled sections); an unusual layout (asymmetric hero, overlapping images, sticky side titles); a brand pattern/texture; custom cursor *only* for creative brands; real photography with a consistent grade; microcopy with personality.

---

## 2. Motion principles

- **Purpose first**: motion should guide attention (to the CTA), explain (steps, before/after), give feedback (hover, press, submit), or create delight once. Never block reading.
- **Durations**: micro (hover/press) 120–200ms · UI (accordion, tabs, menu) 200–300ms · reveals 400–700ms · hero intro ≤ 1.2s total.
- **Easing**: entrances `cubic-bezier(.2,.8,.2,1)` (ease-out-expo-ish); exits `cubic-bezier(.4,0,1,1)`; springy `cubic-bezier(.34,1.56,.64,1)` for playful brands. Avoid `linear` except marquees/progress.
- **Stagger** related items by 60–100ms; cap total stagger at ~500ms.
- **Distance**: reveals move 12–32px; never slide whole sections across the screen.
- **Animate only `transform` and `opacity`** (and `filter`/`clip-path` sparingly) — they run on the compositor and stay smooth.
- **Once is enough**: reveal on first view, don't re-animate when scrolling back up.
- **Respect `prefers-reduced-motion`**: disable non-essential motion, keep instant state changes. This is an accessibility requirement (vestibular disorders), not optional.

Token block:
```css
:root{
  --ease-out:cubic-bezier(.2,.8,.2,1); --ease-in:cubic-bezier(.4,0,1,1); --ease-spring:cubic-bezier(.34,1.56,.64,1);
  --dur-1:160ms; --dur-2:280ms; --dur-3:600ms;
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
```

---

## 3. Technique catalog

All are vanilla CSS/JS, progressive (content is visible without JS), and implemented in the interactive template.

### Scroll reveal with stagger
```js
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms'); io.observe(el);
});
```
```css
.js [data-reveal]{opacity:0;transform:translateY(24px);transition:opacity var(--dur-3) var(--ease-out) var(--d,0ms),transform var(--dur-3) var(--ease-out) var(--d,0ms)}
.js [data-reveal].in{opacity:1;transform:none}
```
Add `.js` to `<html>` from script so no-JS users see content.

### Headline word/letter reveal
Split words into `<span>`s with JS (keep the original text in `aria-label` on the heading, set spans `aria-hidden`), then animate each with a stagger via `--i`. Use a mask (`overflow:hidden` on a wrapper) and translateY(100%) → 0 for a premium "rising" effect.

### Scroll progress bar (CSS scroll-driven animation)
```css
.progress{position:fixed;inset:0 0 auto;height:3px;transform-origin:0 50%;background:var(--c-accent);transform:scaleX(0);z-index:100}
@supports (animation-timeline: scroll()){
  .progress{animation:grow linear both;animation-timeline:scroll(root)}
  @keyframes grow{to{transform:scaleX(1)}}
}
```
Fallback: update `scaleX` on scroll with `requestAnimationFrame`.

### Scroll-driven element animation (no JS)
```css
@supports (animation-timeline: view()){
  .parallax-img{animation:drift linear both;animation-timeline:view();animation-range:entry 0% exit 100%}
  @keyframes drift{from{transform:translateY(-6%) scale(1.08)}to{transform:translateY(6%) scale(1.08)}}
}
```

### Magnetic button
On `pointermove` inside the button's area, translate it toward the cursor by ~25% of the offset; reset on `pointerleave`. Only for `(hover:hover) and (pointer:fine)`.

### Cursor spotlight / glow cards
Track pointer position in CSS variables and draw a radial gradient:
```css
.spot{background:radial-gradient(400px circle at var(--x,50%) var(--y,50%),rgb(255 255 255/.12),transparent 40%),var(--card-bg)}
```
```js
el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--x', e.clientX - r.left + 'px'); el.style.setProperty('--y', e.clientY - r.top + 'px'); });
```

### 3D tilt cards
`perspective` on the parent, rotateX/rotateY up to ±6° from pointer position, reset on leave. Fine pointers only.

### Infinite marquee
Duplicate the list once (second copy `aria-hidden="true"`), animate `translateX(-50%)` linearly, pause on hover/focus, stop under reduced motion.

### Animated counters
On reveal, animate from 0 to `data-count` over ~1.2s with ease-out using `requestAnimationFrame`; render final value immediately under reduced motion. Only real numbers.

### Animated gradient mesh / blobs
2–4 blurred, absolutely-positioned circles (`filter: blur(60px)`) in brand colors drifting with slow keyframes (15–25s). Put them behind content with `pointer-events:none`; keep text contrast on top ≥ 4.5:1 (add a subtle overlay if needed).

### Sticky scroll storytelling
Two columns: left a sticky visual (`position: sticky; top: 15vh`), right a list of steps; an IntersectionObserver sets the active step, swapping the visual (crossfade). Great for "How it works".

### Horizontal scroll gallery
On desktop, a tall section with a sticky inner track translated horizontally based on scroll; on mobile fall back to native `overflow-x:auto` with `scroll-snap-type: x mandatory`. Simplest robust version: native horizontal scroll-snap for all sizes with arrow buttons.

### Accessible tabs
`role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"`; arrow keys move between tabs; animate the active indicator with a transform.

### Smooth accordion
Native `<details>`; for smooth height use `interpolate-size: allow-keywords` on `:root` and `details::details-content{transition:height .3s, content-visibility .3s allow-discrete;height:0;overflow:clip} details[open]::details-content{height:auto}` — progressive (older browsers just snap).

### Micro-interactions
Button press `scale(.97)`; arrow icon slides 3px on hover; link underline grows from left (`background-size` transition); form field float labels; success checkmark draw (SVG `stroke-dashoffset`); toast notifications for form feedback (with `role="status"`).

---

## 4. Interactive media

| Media | How | Notes |
|---|---|---|
| **Hero video** | `<video autoplay muted loop playsinline poster="poster.webp" preload="metadata">` with WebM + MP4 sources | ≤ 3–5 MB, 8–15s loop, no sound, pause button (WCAG 2.2.2), don't autoplay under reduced motion |
| **Before/after slider** | `<input type="range">` controlling `clip-path: inset(0 0 0 X%)` on the "after" image | Keyboard accessible for free; label it |
| **Lottie animations** | `lottie-web` or `@lottiefiles/dotlottie-web`, lazy-load when visible | Small vector animations for icons/illustrations |
| **3D** | Spline embed (no-code) or Three.js / React Three Fiber | Heavy — lazy-load, show static image on mobile/low-power, never in the critical path |
| **Image hover reveal** | List of items; on hover a floating image follows the cursor | Great for menus, portfolios; disable on touch |
| **Interactive estimator / quiz** | 3–5 steps with progress bar, ends in a lead form with result | Strong lead generator for trades, services, coaching |
| **Maps** | Static map image linking to Google Maps; load the interactive iframe on click | Saves ~500KB+ |
| **Embedded booking/demo** | Calendly/Cal.com inline, product demo GIF → video on click | Lazy-load third-party embeds |

---

## 5. Libraries (when vanilla isn't enough)

| Library | Use for | Notes |
|---|---|---|
| **GSAP** (+ ScrollTrigger, SplitText) | Complex timelines, pinned scroll sequences, text splitting | Free for all uses including the formerly paid plugins; the industry standard for award-style sites |
| **Motion** (motion.dev; formerly Framer Motion) | React/Vue/vanilla animations, layout animations, gestures | Great in Next.js; small vanilla `animate()` API |
| **Lenis** | Smooth scrolling | Use lightly; never hijack scroll speed; respect reduced motion |
| **Auto-Animate** | Zero-config list add/remove transitions | Tiny |
| **Swiper / Embla** | Carousels when truly needed | Prefer Embla (lighter) |
| **Lottie / dotLottie** | After Effects animations | Lazy-load |
| **Three.js / R3F / Spline** | 3D scenes | Only when 3D is the signature moment |

Load from a pinned CDN version or npm; import only the plugins used.

---

## 6. Page transitions

- **Multi-page sites (Astro/static)**: cross-document **View Transitions** — add `@view-transition { navigation: auto; }` in CSS on both pages; give shared elements matching `view-transition-name` (e.g. a project thumbnail → hero image). Browsers without support just navigate normally.
- **Astro**: `<ClientRouter />` (formerly ViewTransitions) for SPA-like transitions with fallbacks.
- **Next.js / SPA**: `document.startViewTransition()` around state changes, or Motion's `AnimatePresence`.
- Keep transitions ≤ 400ms; disable under reduced motion.

```css
@view-transition { navigation: auto; }
::view-transition-old(root){animation:fade-out .2s var(--ease-in) both}
::view-transition-new(root){animation:fade-in .3s var(--ease-out) both}
@keyframes fade-out{to{opacity:0}} @keyframes fade-in{from{opacity:0}}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
```

---

## 7. Performance & accessibility rules (non-negotiable)

- Content and CTAs must be visible and usable **without JS** and **with reduced motion**.
- Animate `transform`/`opacity`; use `will-change` only during the animation.
- Throttle pointer/scroll handlers with `requestAnimationFrame`; use passive listeners.
- Hover-only effects gated by `@media (hover:hover) and (pointer:fine)`; touch users get the content without the effect.
- No scroll-jacking (don't change scroll speed/direction), no animation that loops forever in the reading area except subtle backgrounds/marquees with a pause control or hover-pause.
- Nothing flashes more than 3 times per second (WCAG 2.3.1).
- Videos/carousels/marquees that move > 5s need a pause mechanism (WCAG 2.2.2).
- Keep Interaction to Next Paint (INP) < 200ms: no heavy work in click handlers.
- Hero intro animation must not delay LCP: render the headline immediately (animate with transform from a visible state, or start the animation within ~100ms).
- Test on a mid-range phone and with DevTools CPU 4× slowdown.

---

## 8. Choosing the right amount

| Site type | Motion level |
|---|---|
| Medical, legal, finance, government | Low: reveals, hovers, accordion, counters |
| Local services, restaurants, salons | Medium: + marquee/gallery, before/after, sticky CTA animation, light parallax |
| Agencies, creatives, startups, events, portfolios | High: + split-text, magnetic buttons, spotlight, tilt, sticky storytelling, page transitions |
| Award-style showcase | Very high: GSAP timelines, pinned scenes, WebGL — budget the time and performance work |

When unsure, do fewer effects with better polish. One signature moment executed perfectly beats ten effects done halfway.
