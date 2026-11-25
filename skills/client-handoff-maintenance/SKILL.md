---
name: client-handoff-maintenance
description: Handles project launch, client handoff, and ongoing care plans for freelance web/AI projects — launch checklist, ownership and credential transfer, client training guide, handoff documentation, maintenance/retainer packages, monthly reports, change requests, and invoicing follow-ups. Use this whenever the user is launching or delivering a client site or automation, wrapping up a project, writing handoff docs or a "how to edit your site" guide, offering a maintenance plan or retainer, writing a monthly client report, handling a scope-creep request, or chasing an unpaid invoice.
---

# Client Handoff & Maintenance

Clean handoffs create referrals and retainers; messy ones create 11pm "the site is down" texts. The goal is that the client owns everything, understands what they have, and has an easy reason to keep paying you to look after it.

## 1. Launch checklist
Before go-live, confirm:
- [ ] Final client approval in writing (email is fine)
- [ ] Final payment received or scheduled per contract (transfer ownership on full payment)
- [ ] Ran `website-security-hardening` and `seo-launch-kit` checks
- [ ] Forms, chatbot, and email automations tested end-to-end with the client's real inbox
- [ ] Analytics + Search Console verified
- [ ] Backups and uptime monitoring on
- [ ] DNS cutover planned (lower TTL a day before), SSL active after cutover
- [ ] 301 redirects from old URLs live
- [ ] Staging site password-protected or `noindex`

## 2. Ownership & access transfer
The client should own the accounts; the freelancer gets invited as a user. This protects both sides — if the relationship ends, nobody is held hostage.
- Domain registrar, DNS/Cloudflare, hosting (Vercel/Netlify/WordPress host), GitHub repo, Anthropic Console workspace, email provider, analytics, Search Console, Google Business Profile
- Transfer via each platform's "add member/transfer ownership" feature
- Share any remaining credentials through a password manager share (1Password/Bitwarden), never plain email/chat
- Rotate any credentials the freelancer created and no longer needs; remove your own admin access if the client isn't on a care plan

## 3. Handoff document
Write a plain-language guide for a non-technical owner:

```
# Your Website — Owner's Guide
## What you have
Site URL, what's included (pages, chatbot, email automations), where it's hosted, monthly costs and who bills them.
## Your accounts
Table: service | what it's for | login owner | monthly cost
## How to…
- Edit text and images (step-by-step with screenshots placeholders)
- Update the chatbot's answers (edit the knowledge doc)
- Pause or edit email automations
- See leads and analytics
## If something breaks
Checklist + how to contact you + response times by plan
## Recommended next steps
```

Also record a short (5–10 min) screen-recording walkthrough if possible; clients rewatch these.

## 4. Care plans (recurring revenue)
Offer tiers right at launch, when the client values the site most:

| Plan | Includes | Typical response |
|---|---|---|
| **Essential** | Hosting management, updates, daily backups, uptime + security monitoring, monthly report | 2 business days |
| **Growth** | Essential + 1–2 hrs content changes/month, SEO monitoring, chatbot/email tuning | 1 business day |
| **Partner** | Growth + 4–6 hrs dev/month, new landing pages, A/B tests, AI automation improvements, quarterly strategy call | Same day |

Price based on your rate × included hours + tooling costs + margin; AI API and email usage either included up to a cap or passed through. Unused hours don't roll over (say so in the agreement).

## 5. Monthly report template
Keep it to one screen; clients want to know "is it working and is it safe":
```
# [Client] — [Month] Website Report
✅ Uptime: 99.98% · Backups: 30/30 · Updates applied: 6 · Security issues: 0
📈 Visitors: X (▲/▼ % vs last month) · Leads: X · Top lead source: ...
🤖 Chatbot: X conversations, X leads captured, top questions: ...
✉️ Emails: X sent, open rate X%, unsubscribes X
🛠 Work done this month: ...
💡 Recommendation for next month: one specific, revenue-focused idea
```
Never fabricate numbers — pull them from analytics or mark as "pending data".

## 6. Change requests & scope creep
When a request falls outside scope, respond warmly and convert it to paid work:
> "Great idea! That's outside the original scope, so I've put together a quick quote: [X hours / $Y], and I can have it done by [date]. Want me to go ahead?"
On a care plan, deduct from included hours and report the balance.

## 7. Getting paid
- Invoice on milestones per contract; use Stripe/PayPal/Wise invoicing with auto-reminders
- Polite reminder cadence: due date → +3 days → +7 days (mention late fee per contract) → +14 days (pause work/access to unpaid deliverables as the contract allows)
- Ask for a testimonial and a referral at the moment the client is happiest — right after launch results show up.
