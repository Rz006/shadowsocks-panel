# Pre-delivery Quality Checklist

Go through each section; fix or flag anything that fails.

## Performance
- [ ] Images compressed, modern format (WebP/AVIF), explicit width/height, `loading="lazy"` below the fold, hero image `fetchpriority="high"`
- [ ] Fonts: max 2 families, `font-display: swap`, self-hosted or preconnected
- [ ] No unused JS libraries (jQuery, sliders) unless needed; third-party scripts deferred
- [ ] Static pages are statically generated / cached at the CDN
- [ ] Lighthouse mobile run: Performance ≥ 90

## Accessibility
- [ ] One `<h1>` per page, logical heading order
- [ ] All images have meaningful `alt` (decorative: `alt=""`)
- [ ] Form inputs have `<label>`s; errors announced and described in text
- [ ] Contrast ≥ 4.5:1 for body text; tap targets ≥ 44px
- [ ] Works by keyboard only; visible focus outline
- [ ] `lang` attribute set on `<html>`

## SEO basics
- [ ] Unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars) per page
- [ ] Open Graph + Twitter card tags with a 1200×630 image
- [ ] `sitemap.xml`, `robots.txt`, canonical URLs
- [ ] Structured data (LocalBusiness / Organization / Product / FAQ) as JSON-LD
- [ ] Clean URLs, 301 redirects from any old site URLs

## Forms & conversion
- [ ] Primary CTA above the fold on mobile and desktop
- [ ] Phone numbers are `tel:` links; emails `mailto:`
- [ ] Form: server-side validation, honeypot/Turnstile, success state, client gets notified, submitter gets confirmation
- [ ] Conversion events tracked in analytics
- [ ] Privacy policy linked near forms; consent checkbox if adding to marketing lists

## Security (quick pass — full audit in website-security-hardening)
- [ ] HTTPS everywhere, HSTS
- [ ] Security headers: CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors
- [ ] No API keys in frontend code or git history; secrets in env vars
- [ ] Dependencies up to date (`npm audit`)

## Content
- [ ] No lorem ipsum or `[PLACEHOLDER]` left unless flagged to client
- [ ] Testimonials and stats are real and approved by the client
- [ ] Contact details, hours, and address correct
- [ ] 404 page exists and links home
