# Website Security Checklist

Mark each: ✅ pass, ❌ fail, ➖ not applicable, ❓ not checked.

## Domain & DNS
- [ ] Registrar account has MFA and is owned by the client (not the freelancer)
- [ ] Registrar lock enabled; auto-renew on
- [ ] DNS provider account has MFA
- [ ] CAA record restricts certificate issuers (optional)
- [ ] SPF/DKIM/DMARC set even if the domain doesn't send mail (`v=spf1 -all`, DMARC `p=reject`) to prevent spoofing

## Transport
- [ ] Valid TLS cert, auto-renewing
- [ ] HTTP → HTTPS redirect
- [ ] HSTS `max-age=31536000; includeSubDomains` (add `preload` only when sure)
- [ ] TLS 1.2+ only

## Headers
- [ ] `Content-Security-Policy` (or Report-Only while tuning)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` disabling unused features (camera, microphone, geolocation)
- [ ] `frame-ancestors 'self'` in CSP (or `X-Frame-Options: SAMEORIGIN`)
- [ ] Server/framework version headers removed (`X-Powered-By`)

## Authentication & access
- [ ] MFA on every admin (CMS, hosting, Git, Vercel/Netlify, Cloudflare, email provider, AI provider)
- [ ] Unique strong passwords in a password manager; shared via the manager, not chat/email
- [ ] Login rate-limited / lockout; no default `admin` username
- [ ] Session cookies `Secure; HttpOnly; SameSite=Lax`
- [ ] Passwords hashed with bcrypt/argon2 (custom apps)
- [ ] Each person has their own account; departed people removed

## Secrets
- [ ] No secrets in client-side code (check built JS bundles; `NEXT_PUBLIC_*` vars are public)
- [ ] No secrets in git history; `.env` in `.gitignore`
- [ ] `/.env`, `/.git/`, backups, and debug pages return 404/403
- [ ] Keys scoped to minimum permissions; rotated when people leave

## Software
- [ ] CMS core, plugins, themes up to date; auto-updates for minor/security releases
- [ ] Unused plugins/themes deleted (not just deactivated)
- [ ] Plugins only from reputable sources; no "nulled" premium plugins
- [ ] `npm audit` / `pip-audit` clean or risks accepted
- [ ] Dependabot/Renovate enabled on the repo

## Input & output
- [ ] Server-side validation on all forms and APIs
- [ ] Parameterized queries / ORM; no string-built SQL
- [ ] Output escaped; no `dangerouslySetInnerHTML` / `v-html` with user or AI content unless sanitized (DOMPurify)
- [ ] CSRF protection on state-changing requests
- [ ] File uploads: type allowlist, size limit, stored outside web root or in object storage, renamed
- [ ] Redirect parameters validated (no open redirects)

## Abuse & availability
- [ ] Cloudflare (or similar) proxy/WAF in front
- [ ] Rate limits on login, contact forms, search, AI endpoints
- [ ] Bot protection (Turnstile/hCaptcha/honeypot) on public forms
- [ ] AI provider monthly spend limit set

## WordPress specifics
- [ ] `DISALLOW_FILE_EDIT` true in wp-config.php
- [ ] XML-RPC disabled if unused
- [ ] File permissions: 644 files, 755 dirs, wp-config 600/640
- [ ] Security plugin (Wordfence or Solid Security) or host-level firewall
- [ ] Database prefix not relevant to security — don't waste time changing it

## Data & privacy
- [ ] Only necessary personal data collected; retention defined
- [ ] Privacy policy lists processors (hosting, email, AI provider, analytics)
- [ ] Database not publicly reachable; backups encrypted
- [ ] Payment handled by Stripe/PayPal hosted fields — card data never touches the server

## Resilience
- [ ] Daily automated off-site backups, 30-day retention
- [ ] Restore tested at least once
- [ ] Uptime monitoring with alerts (UptimeRobot, Better Stack)
- [ ] Error logging (Sentry) without logging secrets/PII
- [ ] Documented who to call and what to do in an incident
