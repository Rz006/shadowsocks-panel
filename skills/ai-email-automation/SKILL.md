---
name: ai-email-automation
description: Designs and builds AI-powered automated email systems — lead follow-ups, welcome/nurture sequences, abandoned-cart and booking reminders, AI-personalized outreach, newsletter drafting, and auto-replies — using Claude plus a sending provider (Resend, SendGrid, Postmark, Amazon SES, Mailgun) with good deliverability and legal compliance. Use this whenever the user mentions automated emails, email sequences, drip campaigns, cold email, AI email writer, email sender/bot, follow-up automation, n8n/Make/Zapier email flows, or SPF/DKIM/DMARC — even for a quick "send an email when someone fills out the form".
---

# AI Email Automation

Automated email is one of the most valuable things a freelancer can sell — and one of the easiest to get wrong. A system that lands in spam, or gets the client's domain blacklisted or fined, is worse than no system. So this skill treats **deliverability and consent as part of the build**, not an afterthought.

## 1. Clarify the use case
Identify which type it is, since the rules differ:

| Type | Consent basis | Notes |
|---|---|---|
| Transactional (receipts, confirmations, password resets, booking reminders) | Implied by the action | Highest priority; separate stream/subdomain from marketing |
| Lead follow-up / nurture (someone filled a form) | Form consent | Say on the form what they'll receive |
| Newsletter / marketing | Opt-in (double opt-in recommended; required in practice for EU/Canada) | Unsubscribe in every email |
| B2B cold outreach | Varies by country — allowed in US under CAN-SPAM with rules, restricted in EU/UK/Canada | Low volume, genuinely relevant, honest, easy opt-out |

Don't build systems that buy or scrape email lists, spoof senders, rotate domains to evade spam filters, hide who is sending, or send to people who opted out. Those burn the client's domain and break laws (CAN-SPAM, GDPR/PECR, CASL). If asked, explain why and offer the compliant version — it performs better anyway.

## 2. Architecture
Default design (adapt to the user's stack):

```
Trigger (form submit / webhook / CRM event / schedule)
   → Queue or workflow step (store contact + consent + source + timestamp)
   → AI step: Claude drafts/personalizes from a template + contact data
   → Guardrails: length, required footer, no invented facts, optional human approval
   → Send via provider API (idempotency key, rate limit)
   → Log + handle webhooks (delivered, bounced, complained, unsubscribed)
   → Suppression list checked before every send
```

Tool options:
- **Code**: Node/Next.js API routes or Python (FastAPI) + a scheduler (cron, Vercel Cron, Cloudflare Cron Triggers, or a queue like BullMQ/Inngest/Trigger.dev)
- **No-code**: n8n (self-hostable), Make, or Zapier with an Anthropic step
- **Providers**: Resend/Postmark (great for developer + transactional), SendGrid/SES/Mailgun (volume), or the client's existing platform (Mailchimp, Brevo, ConvertKit) for marketing lists

A working Python starter is in `assets/ai_email_sender.py` — copy and adapt it rather than writing from scratch.

## 3. Using Claude for the email content
- Model choice: default `claude-opus-5-5` with `effort: "low"`. `claude-sonnet-5-5` and `claude-haiku-5-5` are cheaper/faster options for high volume — present the cost/quality tradeoff to the user rather than choosing for them.
- Give Claude: the business facts, the template/goal of this email, the recipient's data (name, company, what they asked about), tone, and hard constraints (length, one CTA, no prices unless provided).
- Ask for structured output (JSON with `subject`, `preview_text`, `body_text`, `body_html`) so the code can validate it.
- Tell the model to use only facts provided — invented case studies or discounts create real liability.
- Validate before sending: subject length ≤ 60 chars, no unresolved `{{placeholders}}`, required footer present, no links outside an allowlist.
- For replies to inbound emails, default to **draft for human approval** until the client trusts the system.

## 4. Deliverability setup (do this for every client domain)
Read `references/deliverability.md` for exact DNS records and warm-up schedule. Summary:
1. Send from a subdomain (e.g. `mail.client.com` for marketing, `notify.client.com` for transactional) to protect the root domain's reputation.
2. Configure **SPF**, **DKIM**, and **DMARC** (start at `p=none` with reporting, move to `quarantine` once aligned). Gmail and Yahoo require these for bulk senders.
3. Add one-click unsubscribe (`List-Unsubscribe` + `List-Unsubscribe-Post` headers) for marketing mail.
4. Warm up new domains/IPs gradually.
5. Keep spam complaint rate under 0.1% (hard ceiling 0.3%) and bounce rate under 2%; suppress hard bounces and complainers immediately.

## 5. Compliance footer & data
Every marketing/outreach email includes: sender's real name/business, physical postal address, clear unsubscribe link that works within a few days (do it instantly). Store consent source and timestamp per contact. Keep personal data minimal and don't send it to third parties beyond the email + AI providers needed; mention these processors in the client's privacy policy.

## 6. Deliverables to the client
- The working automation (code or exported workflow)
- Email templates/sequence map (trigger → delay → email → goal)
- DNS records to add, and verification that SPF/DKIM/DMARC pass (e.g. send to mail-tester.com or check headers)
- Dashboard or log location; how to pause the automation
- Monthly cost estimate: provider + AI API usage

## Testing
Before going live: send to seed inboxes (Gmail, Outlook, Yahoo), check spam placement, test unsubscribe end-to-end, test a bounce, and run the AI step on 10+ varied contacts to catch weird outputs.
