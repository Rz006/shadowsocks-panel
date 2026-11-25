# Email Deliverability Setup

## DNS records (example for sending subdomain `mail.example.com`)

The provider dashboard gives the exact values — always copy from there. Shapes:

**SPF** (TXT on `mail.example.com`):
```
v=spf1 include:<provider-spf-domain> ~all
```
Only one SPF record per hostname; merge includes if multiple providers. Max 10 DNS lookups.

**DKIM** (CNAME or TXT provided by the ESP, e.g. `resend._domainkey.mail.example.com`). Use 2048-bit keys.

**DMARC** (TXT on `_dmarc.example.com`):
```
v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com; adkim=r; aspf=r; pct=100
```
After 2–4 weeks of clean reports, move to `p=quarantine`, then optionally `p=reject`.

**Return-Path / bounce domain**: set the custom MAIL FROM / bounce CNAME the provider offers so SPF aligns.

**Optional**: BIMI (logo in inbox) once DMARC is at quarantine/reject.

## Verify
- `dig TXT mail.example.com`, `dig TXT _dmarc.example.com`
- Send a test to mail-tester.com, aim for 9+/10
- In Gmail, "Show original" → SPF, DKIM, DMARC all PASS
- Register the domain in Google Postmaster Tools to watch reputation

## Warm-up schedule (new domain or dedicated IP)
| Days | Max emails/day | Who to send to |
|---|---|---|
| 1–3 | 20–50 | Most engaged contacts |
| 4–7 | 100 | Engaged |
| Week 2 | 250–500 | Recent opt-ins |
| Week 3 | 1,000 | Broader list |
| Week 4+ | Double weekly while metrics stay healthy |

Pause and investigate if bounces > 2% or complaints > 0.1%.

## Content hygiene
- Text-to-image ratio: mostly text; always include a plain-text part
- Avoid URL shorteners and mismatched link text/URLs
- One or two links for cold/outreach mail; no attachments in first contact
- Consistent From name and address
- Required headers for bulk marketing:
  ```
  List-Unsubscribe: <https://example.com/unsub?t=TOKEN>, <mailto:unsub@example.com?subject=unsubscribe>
  List-Unsubscribe-Post: List-Unsubscribe=One-Click
  ```

## Legal quick reference (not legal advice)
- **US CAN-SPAM**: accurate headers, non-deceptive subject, identify as ad if marketing, physical address, opt-out honored within 10 business days
- **EU/UK GDPR + ePrivacy/PECR**: prior opt-in for marketing to individuals; legitimate-interest B2B rules vary by country; record consent
- **Canada CASL**: express or implied consent required, identification, unsubscribe within 10 business days
- **Australia Spam Act**: consent, identify sender, functional unsubscribe
