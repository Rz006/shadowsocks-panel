---
name: website-security-hardening
description: Audits and hardens client websites and web apps you build or maintain — security headers, HTTPS, authentication, forms, secrets, dependencies, WordPress/Next.js/Node specifics, AI/LLM feature risks (prompt injection, API key exposure, cost abuse), backups, and monitoring — and produces a client-ready security report. Use this whenever the user mentions website security, hardening, "is my site secure", a security checklist, a pre-launch check, a hacked or defaced site, malware cleanup, OWASP, CSP, rate limiting, WordPress security, protecting API keys, or securing an AI chatbot/email feature.
---

# Website Security Hardening

This is **defensive** work on sites the user owns or is authorized to maintain for a client. Get confirmation of authorization if the user wants to scan a site that isn't obviously theirs or their client's; don't run intrusive scans against third-party sites.

Small-business sites get compromised mostly through boring causes: outdated plugins, weak/reused admin passwords, leaked API keys, unprotected forms. Fix those first; they cover most real risk.

## Workflow

### 1. Inventory
Identify: stack (WordPress, Next.js, static, Shopify, custom Node/Python), hosting, domain registrar/DNS, admin accounts, third-party scripts, forms, payment handling, any AI features and which API keys they use, and where personal data is stored.

### 2. Check — in priority order
Work through `references/checklist.md`. When you have the code, read it and verify directly; when you only have a URL, use passive checks (response headers via `curl -sI`, TLS config, exposed files like `/.env`, `/.git/`, `/wp-config.php.bak` — request only, never exploit).

Priority order:
1. **Secrets** — API keys in frontend bundles, git history (`git log -p | grep -i key`, gitleaks/trufflehog), public env files
2. **Access** — admin MFA, unique strong passwords, least-privilege accounts, remove ex-contractor access, registrar & DNS account MFA
3. **Updates** — CMS core, plugins, themes, npm/pip dependencies (`npm audit`, `pip-audit`), remove unused plugins
4. **Transport & headers** — HTTPS + HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors
5. **Input handling** — server-side validation, parameterized queries, output escaping, CSRF on state-changing forms, file upload restrictions
6. **Abuse protection** — rate limiting on login, forms, and AI endpoints; CAPTCHA/Turnstile on public forms; WAF (Cloudflare) in front
7. **AI-specific** — see below
8. **Resilience** — automated off-site backups with a tested restore, uptime monitoring, error logging, incident contact

### 3. AI feature security (chatbots, email writers, AI forms)
- API keys live server-side only; frontend calls your own endpoint, never the AI provider directly.
- Rate-limit per IP/session and set a spending cap in the provider console — an open AI endpoint can rack up a large bill overnight.
- Treat user input and any fetched content (web pages, emails, documents) as untrusted. Prompt injection can make the model ignore instructions, so don't give the model tools or data access the end user shouldn't have; the model's permissions should equal the user's permissions.
- Don't put secrets or other customers' data in the system prompt.
- Validate/escape model output before rendering as HTML (XSS) or using it in queries, emails, or shell commands.
- Log conversations with PII handling disclosed in the privacy policy; set retention.
- Restrict email-sending tools to allowlisted recipients/templates so the bot can't be turned into a spam relay.

### 4. Fix
Provide concrete config/code changes for the stack — e.g. `next.config.js` headers, `.htaccess`/nginx snippets, Cloudflare rules, middleware for rate limiting. Ready-to-paste examples are in `references/snippets.md`. Test that CSP doesn't break the site (start with `Content-Security-Policy-Report-Only` if unsure).

### 5. Report
Produce a client-friendly report:

```
# Security Review — [Site] — [Date]
## Summary
Overall rating (Good / Needs attention / Critical) and the top 3 actions.
## Findings
| # | Issue | Risk (Critical/High/Medium/Low) | Fixed? | Recommendation |
## What was done
## Ongoing recommendations (maintenance plan)
```

Explain risks in business terms ("an attacker could take over the admin and redirect customers") rather than jargon. Be honest about what wasn't checked — a review is not a guarantee.

## If the site is already hacked
1. Take a snapshot/backup of the current state for evidence.
2. Put the site in maintenance mode or restore a known-clean backup.
3. Rotate **all** credentials: hosting, CMS admins, database, FTP/SFTP, API keys, email.
4. Find the entry point (outdated plugin, leaked password) and fix it, or it'll happen again.
5. Clean or reinstall core/plugins from official sources; scan for backdoors (unknown PHP files in uploads, modified core files, rogue admin users, cron jobs).
6. Request a review in Google Search Console if flagged; notify affected users if personal data was exposed (may be legally required).
