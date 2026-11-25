---
name: converting-website-builder
description: Builds effective, high-converting, fast, accessible client websites and landing pages — from structure and copy to code and deployment. Use this whenever the user wants to build, redesign, or improve a website, landing page, portfolio, business site, or small e-commerce front for a client or themselves, asks for "a site that gets leads/sales", or wants a Next.js, Astro, HTML/Tailwind, WordPress, or Webflow build — even if they just say "make me a website for a dentist/gym/restaurant".
---

# Converting Website Builder

A client doesn't really want a website; they want calls, bookings, or sales. Every decision here — layout, copy, speed — should serve one primary conversion action. Pretty but unclear sites lose money.

## 1. Brief (do this first, briefly)
Pin down: business type, target customer, **one primary call to action** (call, book, buy, get a quote), secondary CTA, location (local vs online), brand colors/fonts if any, and existing content. If the user gives little, make sensible industry assumptions and state them.

## 2. Choose the stack
Pick the simplest thing that meets the need, because the client (or you) must maintain it:

| Situation | Recommended stack |
|---|---|
| Brochure / landing page, dev maintains | Astro or plain HTML + Tailwind, deploy to Vercel/Netlify/Cloudflare Pages |
| Needs app features, auth, AI routes | Next.js (App Router) + Tailwind, Vercel |
| Client edits content themselves | WordPress (lightweight theme, few plugins) or Webflow |
| Selling products | Shopify |

## 3. Page structure that converts
For a home or landing page, use this order unless there's a reason not to:
1. **Hero** — headline stating the outcome for the customer (not "Welcome to X"), subhead with who it's for, primary CTA button, trust cue (rating, "500+ clients", logos)
2. **Problem / pain** — 2–3 bullets the visitor recognizes
3. **Solution / services** — cards with benefit-first copy
4. **Social proof** — real testimonials with names/photos, reviews, case results. Use placeholders marked `[REAL TESTIMONIAL NEEDED]`; never invent reviews or stats, since fake testimonials are deceptive and illegal in many places (e.g. FTC rules).
5. **How it works** — 3 steps
6. **Offer / pricing** or lead magnet
7. **FAQ** — handle objections (price, time, trust)
8. **Final CTA** — repeat the primary action
9. **Footer** — NAP (name, address, phone) for local businesses, links, privacy policy

Keep the primary CTA visible on mobile (sticky bar for call/book on local service sites). One page, one goal.

## 4. Copywriting rules
- Speak to the customer ("you"), lead with benefits, back with specifics.
- Headlines: outcome + timeframe or specificity ("Pain-free dental implants in one visit").
- Buttons say what happens: "Book my free consult", not "Submit".
- Short paragraphs, scannable bullets, 6th–8th grade reading level.

## 5. Build quality bar
Read `references/quality-checklist.md` before delivering — it covers performance, accessibility, SEO basics, forms, and security headers. Core targets:
- Lighthouse ≥ 90 on mobile for Performance, Accessibility, Best Practices, SEO
- LCP < 2.5s, CLS < 0.1; images in WebP/AVIF with width/height set, lazy-loaded below the fold
- Semantic HTML, alt text, color contrast ≥ 4.5:1, keyboard navigable, visible focus
- Forms: server-side validation, spam protection (honeypot or Turnstile/hCaptcha), confirmation message, notifications to client
- Analytics (GA4 or privacy-friendly Plausible/Umami) + conversion event on the primary CTA
- Cookie consent only if trackers require it in the client's region

## 6. Deliver
Produce working code (complete files, not fragments), a short README with run/deploy steps, and a list of content the client still needs to provide. If you can run the site, take a mobile screenshot and check the hero and CTA actually look right before saying it's done.

## Related skills
For AI chat features use `ai-chatbot-integration`; for lead nurture emails use `ai-email-automation`; before launch, run `website-security-hardening` and `seo-launch-kit`.
