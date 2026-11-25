# Section Library

Pick sections by job. Each entry: purpose · layout options · content checklist · pitfalls. Markup patterns for most of these are implemented in `assets/starter-template.html` — reuse its classes.

## Header / nav
- Purpose: orientation + always-available CTA.
- Layout: logo left, links center/right, primary button right. Sticky with a subtle background on scroll.
- Mobile: hamburger `<button aria-expanded aria-controls>`; show phone/book button even when collapsed.
- Pitfalls: >7 links, mega-menus for small sites, low-contrast transparent header over busy hero images.

## Hero
Variants:
- **Split** (text left, image right) — default for services; strong on mobile (image stacks below text or becomes background).
- **Full-bleed image with overlay** — restaurants, real estate, hospitality. Ensure overlay gives ≥ 4.5:1 contrast.
- **Product screenshot** — SaaS; screenshot in a browser frame, angled or cropped.
- **Editorial/typographic** — portfolios, agencies; huge display type, minimal imagery.
Content: eyebrow (optional), H1 outcome headline, subhead, primary + secondary CTA, reassurance microcopy, trust row (rating, logos, credentials).
Pitfalls: 100vh heroes that push the CTA below the fold on mobile; sliders; vague headlines.

## Trust bar
Real logos, review rating, certifications, "as featured in" (real only). Grayscale logos, 4–6 max.

## Problem / empathy
3 pain points in the customer's words, or a short paragraph. Leads into the solution.

## Services / features
Layouts: 3-up cards, 2×2 with images, bento grid (one large + smaller tiles), alternating zig-zag rows (image/text) for 3–5 key services.
Each: icon or image, benefit-led title, 1–2 lines, link to detail page.

## Stats strip
3–4 big numbers with labels. Only verified numbers.

## How it works
3–4 numbered steps horizontally (desktop) / vertical timeline (mobile). Reduces perceived risk.

## Social proof
Layouts: featured large quote + 2 smaller; masonry of review cards; video testimonials; before/after slider (accessible).
Each: quote of a specific result, name, context (location/company), photo or initial; source (Google) if applicable.

## Offer / pricing
2–3 tiers, highlight the recommended one, list what's included, CTA per tier, guarantee below. For services without fixed prices: "Starting from" or "Free quote in 24h".

## About / team
Human photo(s), short story focused on why it matters to the customer, credentials. Builds trust for local and personal services.

## Gallery / portfolio
Grid with consistent aspect ratios, lazy-loaded, lightbox optional. Captions with project type/location.

## FAQ
Native `<details><summary>` (accessible, no JS). 5–8 questions addressing objections. Mark up with `FAQPage` JSON-LD only if visible on page.

## Lead magnet / newsletter
Specific value ("Free 10-point roof inspection checklist"), single email field, consent text.

## Location / contact
Address, map (lazy-loaded iframe or static image linking to Google Maps), hours table, phone (`tel:`), email, form. Parking/transit notes for local businesses.

## Final CTA band
Contrasting background, outcome headline, button, reassurance. Repeat the primary CTA wording.

## Footer
NAP, hours, quick links, social icons (SVG), legal links (privacy, terms), small credit. Not a second sitemap dump.

## Sticky mobile CTA bar
Fixed bottom bar on ≤ 768px with 1–2 buttons (Call / Book). Add bottom padding to `body` so it doesn't cover content; respect `env(safe-area-inset-bottom)`.

## Recommended page orders
- **Local service home**: Hero → Trust bar → Services → Why us/Stats → How it works → Reviews → Offer → FAQ → Location → Final CTA
- **Restaurant**: Hero → Story → Menu highlights → Reservations → Gallery → Reviews → Hours/Location
- **SaaS landing**: Hero → Logos → Problem → Features (bento) → How it works → Testimonials → Pricing → Security → FAQ → CTA
- **Coach/consultant**: Hero → Who it's for → Method → Results → Offer → About → FAQ → CTA
- **Portfolio**: Hero (name + specialty) → Selected work → Services → About → Testimonials → Contact
