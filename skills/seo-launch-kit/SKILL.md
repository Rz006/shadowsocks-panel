---
name: seo-launch-kit
description: Sets up technical, on-page, and local SEO for a client website at launch or during a refresh — keyword map, titles/meta, headings, schema markup, sitemap/robots, Google Search Console and Business Profile, page speed, internal links, and AI-search readiness — and writes SEO-friendly page copy. Use this whenever the user mentions SEO, ranking on Google, "nobody finds my site", keywords, meta tags, schema/structured data, Google Business Profile, local SEO, site migration redirects, or launching a new site.
---

# SEO Launch Kit

Small businesses rarely need complex SEO; they need the basics done right, done once, and a page for each thing customers search for. Focus on what moves rankings and leads for a local or niche business.

## 1. Keyword & page map
For each core service × location, define one target page. Build a table:

| Page URL | Primary keyword | Secondary keywords | Search intent | CTA |
|---|---|---|---|---|
| /emergency-plumber-austin | emergency plumber austin | 24 hour plumber, burst pipe repair | Urgent/local | Call now |

Use what the business actually does and how customers phrase it. If keyword tools aren't available, derive from Google autocomplete patterns, "People also ask"-style questions, and competitor page titles — and label volumes as estimates rather than inventing numbers.

Avoid creating dozens of thin near-duplicate city pages; each location page needs genuinely local content (team, projects, reviews, directions) or it won't rank and can be treated as spam.

## 2. On-page for each page
- `<title>`: Primary keyword + differentiator + brand, ≤ 60 chars
- Meta description: benefit + CTA, ≤ 155 chars
- One H1 matching intent; H2s covering sub-questions
- First 100 words mention the main topic naturally
- 600–1,500 words of genuinely useful content for service pages; FAQs answering real questions
- Descriptive image file names + alt text
- Internal links: every service page linked from home/nav and to related services; descriptive anchor text
- Clean URL slug

## 3. Technical
- `sitemap.xml` submitted in Google Search Console and Bing Webmaster Tools
- `robots.txt` not blocking important pages (and staging sites blocked with auth/noindex!)
- Canonical tags; one version of the domain (https, www or non-www) with 301s
- 301 redirect map from any old URLs when replacing a site — losing this is the #1 way redesigns tank traffic
- Core Web Vitals passing on mobile
- No broken links / 404s in nav; custom 404 page
- Structured data as JSON-LD, validated with Google's Rich Results Test:
  - `LocalBusiness` (or a subtype like `Dentist`, `Plumber`) with name, address, phone, hours, geo, sameAs
  - `Service`, `FAQPage` (where FAQs are visible on the page), `BreadcrumbList`, `Product`/`Review` where truthful

Example:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Rapid Flow Plumbing",
  "url": "https://rapidflow.example",
  "telephone": "+1-512-555-0100",
  "address": {"@type": "PostalAddress","streetAddress": "100 Main St","addressLocality": "Austin","addressRegion": "TX","postalCode": "78701","addressCountry": "US"},
  "openingHours": "Mo-Su 00:00-23:59",
  "areaServed": "Austin, TX",
  "sameAs": ["https://www.facebook.com/rapidflow"]
}
</script>
```

## 4. Local SEO
- Google Business Profile: correct category, services, hours, photos, booking link, weekly posts
- NAP (name, address, phone) identical everywhere: site footer, GBP, Yelp, Facebook, industry directories
- Review generation: a short link/QR to the GBP review form, sent after each job (asking all customers — not only happy ones — and never offering incentives for positive reviews, which violates Google's policies)
- Embed a map on the contact page

## 5. AI search readiness
AI assistants and AI search overviews pull from clear, well-structured pages. Help them: answer questions directly in the first sentence of a section, use FAQ blocks, keep facts (prices, hours, service areas) in plain text rather than images, and keep the GBP and schema consistent.

## 6. Measurement
- GA4 or Plausible with conversion events (calls, form submits, bookings)
- Search Console: verify, submit sitemap, check indexing after launch
- Baseline report at launch; monthly report of clicks, impressions, top queries, conversions

## Output
Deliver: keyword/page map, title+meta for every page, schema JSON-LD, redirect map (if migrating), launch checklist with each item marked done/pending, and a 90-day content plan (e.g. 2 helpful posts/month answering customer questions). Be honest with the client that SEO results take roughly 3–6 months and no one can guarantee #1 rankings.
