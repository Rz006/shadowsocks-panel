# Design System Guide

Contents: 1. Principles · 2. Typography · 3. Color · 4. Spacing & layout · 5. Components · 6. Imagery · 7. Motion · 8. Anti-patterns

## 1. Principles
- **Derive, don't decorate.** Every choice (font, color, shape) should come from the brand's personality and audience. A law firm and a skate shop should not share a look.
- **Hierarchy wins.** A visitor should see in 3 seconds: what this is, who it's for, what to do next. Size, weight, color and space create that hierarchy — not borders and boxes.
- **Restraint.** 1 brand color + 1 accent + neutrals. 2 font families max. 3–4 type sizes on a screen.
- **Consistency through tokens.** All colors, sizes, radii, shadows come from CSS variables / Tailwind theme.

## 2. Typography

Pick a pairing by personality:

| Personality | Display | Body | Good for |
|---|---|---|---|
| Established, premium, warm | Fraunces / Playfair Display / Cormorant | Inter / Source Sans 3 | Dentists, law, wealth, interiors, hotels |
| Modern, clean, trustworthy | Manrope / Plus Jakarta Sans | Inter / same family | Clinics, SaaS, consultants, accountants |
| Bold, energetic | Archivo Black / Anton / Bebas Neue (headings only) | Archivo / Barlow | Gyms, sports, events, trades |
| Friendly, approachable | Nunito / Quicksand / DM Serif Display | DM Sans / Nunito Sans | Kids, pets, cafés, bakeries, wellness |
| Editorial, creative | Instrument Serif / DM Serif Display | Instrument Sans / Work Sans | Agencies, photographers, architects, portfolios |
| Technical, precise | Space Grotesk / JetBrains Mono (accents) | IBM Plex Sans | Dev tools, engineering, cybersecurity |
| Luxury | Bodoni Moda / Italiana (sparingly) | Jost / Montserrat (light) | Fashion, jewelry, spas, real estate |

Rules:
- Body 16–18px, line-height 1.5–1.7, measure 60–75 characters (`max-width: 65ch`).
- Headings line-height 1.05–1.2, slightly negative letter-spacing for large display (`-0.02em`).
- Fluid sizes with `clamp()` (scale ratio ~1.25 mobile → ~1.333 desktop).
- Use weight contrast (400 body vs 600–800 headings) rather than many sizes.
- Load from Google Fonts with `preconnect` + `display=swap`, or self-host (better for privacy/perf). Subset if possible.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

## 3. Color

Build the palette:
1. **Brand color** — from the logo, or chosen by industry psychology (see table). Make sure it passes 4.5:1 contrast with white if buttons use white text; darken if not.
2. **Neutrals** — tint them slightly toward the brand hue (warm brand → warm greys; cool → cool greys). Use off-white backgrounds (`#FAF8F5`, `#F7F8FA`) rather than pure white for warmth; text near-black (`#14161A`), not `#000`.
3. **Accent** — one complementary or analogous color for highlights, badges, small details. Not for large areas.
4. **Semantic** — success/error/warning only where needed.
5. **Dark sections** — one or two dark bands (brand-dark or ink) create rhythm on long pages.

Industry starting points (adjust to brand):
| Industry | Brand | Accent | Feel |
|---|---|---|---|
| Healthcare/dental | Deep teal `#0F5C4D` / calm blue `#1D4ED8` | Warm gold `#E9A23B` | Calm, clean, trusted |
| Legal/finance | Navy `#13294B` / forest `#1F3A2E` | Brass `#B08D57` | Serious, established |
| Trades/home services | Strong blue `#1749B3` / safety orange `#F26A1B` | Yellow `#FFC83D` | Reliable, urgent |
| Restaurants/cafés | Tomato `#C8442B` / olive `#5B6B2F` | Cream `#F4E9D8` | Appetite, warmth |
| Fitness | Near-black `#111` | Electric `#D7FF3A` / red `#FF3B30` | Energy |
| Beauty/spa | Blush `#E8C4C0` / sage `#9BAA8F` | Deep plum `#4A2C3A` | Soft, premium |
| Tech/SaaS | Indigo `#4F46E5` / ink `#0B1020` | Mint `#34D399` | Modern, capable |
| Real estate/luxury | Charcoal `#1E1E1E` | Champagne `#C9A96E` | Exclusive |
| Kids/education | Sunny `#FFB020` / sky `#3BA3FF` | Coral `#FF6B6B` | Playful, safe |

Check contrast for every text/background pair: body text ≥ 4.5:1, large text (≥ 24px or 19px bold) ≥ 3:1, UI borders/icons ≥ 3:1.

Dark mode: optional for marketing sites. If added, redefine tokens under `@media (prefers-color-scheme: dark)` — don't just invert.

## 4. Spacing & layout
- 4/8px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: `clamp(4rem, 3rem + 5vw, 8rem)` vertical.
- Container: `max-width: 1120–1240px`, side padding 20–24px on mobile.
- Grid: 12 columns desktop, 4 mobile; or `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` for cards.
- Vary layouts down the page so it doesn't feel repetitive: split (text|image) → 3-up cards → full-bleed dark band → bento grid → timeline → centered CTA.
- Align to a consistent left edge; center only short, symmetrical content (CTA bands, section intros).
- Whitespace is a feature — premium sites have more of it.

## 5. Components
- **Buttons**: primary (filled brand, high contrast), secondary (outline/ghost). Min height 44–48px, padding 0.9rem 1.4rem, radius from tokens, clear hover (darken 8%) and `:focus-visible` ring (2–3px offset). One primary button per view.
- **Cards**: surface color, 1px line border *or* soft shadow (not both heavy), consistent padding (24–32px), icon/visual → title → 1–2 lines → link.
- **Nav**: logo left, 4–6 links, CTA button right. Mobile: hamburger using `<button aria-expanded>` controlling a panel; phone number visible on mobile for local businesses.
- **Badges/eyebrows**: small uppercase label above headings (`letter-spacing:.08em; font-size: var(--step--1)`), used sparingly.
- **Testimonials**: real name, role/location, photo or initial avatar, star rating only if real; quote the specific result.
- **Stats strip**: 3–4 real numbers with labels (years, jobs done, rating, response time).
- **Forms**: single column, labels above fields, 16px+ input font (prevents iOS zoom), clear error text, button text says the outcome.

## 6. Imagery
- Real photos of the team, location, work and customers convert best — ask the client.
- If none: high-quality relevant stock (Unsplash/Pexels, credit when required), consistent in color temperature and style; or tasteful abstract shapes/gradients from the palette; never mismatched clip art.
- Use `aspect-ratio` + `object-fit: cover` for consistent crops.
- Hero image should show the outcome (smiling patient, finished kitchen), not a generic office.
- Add subtle treatment for cohesion: rounded corners from tokens, a brand-color offset block behind an image, or a duotone overlay.

## 7. Motion
- Purposeful only: reveal on scroll (opacity + 12px translate, 200–400ms, once), button hover, accordion open.
- Wrap in `@media (prefers-reduced-motion: no-preference)`.
- No parallax-heavy, scroll-jacking, or long intro animations; they hurt performance and conversions.

## 8. Anti-patterns that make sites look "AI-generated" or amateur
- Purple→blue gradient hero with centered headline and two buttons, for every industry
- Emoji as icons; identical 3-card rows repeated down the page
- Every section centered, same padding, same background
- Vague headlines ("Innovative solutions for your needs", "Elevate your experience")
- Fake testimonials ("John D. — Happy Customer"), fake logos, "Trusted by 10,000+ businesses" with no basis
- Pure black on pure white with default system fonts and no spacing system
- Low-contrast grey text on light backgrounds
- Walls of text; tiny tap targets; hero taller than the screen with no CTA visible
- Stock photos of people pointing at whiteboards / handshakes
- Cookie banners covering the CTA; chat widgets popping up instantly
