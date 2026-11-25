# Stacks, Forms & Deployment

## Static HTML/CSS (fastest for 1–5 pages)
- Start from `assets/starter-template.html`. Split into pages by copying the shell (header/footer).
- Optimize images to WebP/AVIF (e.g. the `sharp` npm package, Squoosh.app, or your image editor's export); export 2 widths (≈800 and ≈1600px) and serve with `srcset`/`sizes`.
- Deploy: drag-and-drop folder to Netlify, or `npx wrangler pages deploy ./site` (Cloudflare), or `npx vercel ./site`.

## Astro (recommended multi-page marketing site)
```bash
npm create astro@latest client-site -- --template minimal --typescript strict --install --git
cd client-site
npx astro add tailwind sitemap   # optional tailwind; sitemap needs `site` in astro.config
npm run dev
```
- Layout in `src/layouts/Base.astro` (head, meta, header, footer); pages in `src/pages/`.
- Images via `astro:assets` `<Image />` for automatic sizing/format.
- Content collections (`src/content/`) for services, testimonials, blog — easy for you to edit.
- Client-editable: add Decap CMS (git-based, free) or Sanity/Storyblok.

## Next.js (when it needs app logic / AI)
```bash
npx create-next-app@latest client-site --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
```
- Use `next/image`, `next/font` (self-hosts Google fonts), `generateMetadata` for SEO, `app/sitemap.ts`, `app/robots.ts`.
- Server Actions or route handlers for forms; keep secrets server-side.
- Deploy on Vercel; set env vars in the dashboard.

## Tailwind tips
- Put brand tokens in the theme (Tailwind v4: `@theme { --color-brand: #0F5C4D; --font-display: "Fraunces", serif; }` in CSS).
- Extract repeated patterns into components, not giant class strings copy-pasted 20 times.

## WordPress (client edits a lot)
- Lightweight block theme (e.g. a custom child of Twenty Twenty-Five, Kadence, or GeneratePress) + Gutenberg patterns; avoid heavy page builders when possible.
- Essential plugins only: SEO (Yoast or Rank Math), forms (Fluent Forms/Gravity Forms), caching (host-provided or WP Rocket), security (Wordfence/host firewall), backups (host or UpdraftPlus), image optimization.
- Hosting with staging + daily backups (e.g. managed WP hosts).

## Webflow / Framer
- Good for design-heavy sites where the client wants visual editing. Build with a class naming system (Client-First), set up CMS collections, hand off with Editor access.

## Shopify
- Use an Online Store 2.0 theme (Dawn or a premium theme), customize sections; avoid app bloat; set up product schema, shipping, policies, and abandoned-checkout emails.

## Form backends
| Option | Best for |
|---|---|
| Netlify Forms | Static sites on Netlify; zero backend |
| Formspree / Basin / Web3Forms | Any static host |
| Next.js route handler + Resend | Custom logic, auto-reply, CRM push |
| Cloudflare Pages Function + email service | Cloudflare-hosted |
| Tally / Typeform embed | Complex multi-step forms quickly |
Always add a honeypot field + Cloudflare Turnstile (free) and server-side validation. Send to the client's inbox and optionally CRM/Sheets.

## Booking & payments
- Booking: Calendly, Cal.com (open source), industry-specific tools (see playbooks). Embed inline or use a popup link; keep a plain link fallback.
- Payments: Stripe Payment Links / Checkout for simple sales and deposits.

## Analytics
- Privacy-friendly: Plausible, Umami, Fathom (often no cookie banner needed).
- GA4 if the client needs Google Ads integration; then consent management in EU/UK.
- Track conversion events: `cta_click`, `form_submit`, `phone_click`, `booking_start`.

## Deployment checklist
- Custom domain + HTTPS, www/non-www redirect
- Environment variables set; no secrets in client code
- 404 page; favicon + apple-touch-icon; OG image 1200×630
- Submit sitemap to Search Console
