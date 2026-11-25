"""
AI-personalized email sender — starter template.

Flow: load contacts -> skip suppressed / no-consent -> Claude drafts JSON email
-> validate -> send via Resend -> log result.

Setup:
    pip install anthropic resend python-dotenv
    .env:
        ANTHROPIC_API_KEY=...
        RESEND_API_KEY=...
        FROM_EMAIL="Jane at Acme <jane@mail.acme.com>"
        BUSINESS_ADDRESS="123 Main St, Springfield, USA"
        UNSUBSCRIBE_BASE_URL=https://acme.com/unsubscribe
        DRY_RUN=true

Run:
    python ai_email_sender.py contacts.csv
contacts.csv columns: email,first_name,company,interest,consent_source
"""

import csv
import hashlib
import hmac
import json
import os
import re
import sys
import time

import anthropic
import resend
from dotenv import load_dotenv

load_dotenv()

# Default is Claude Opus 5.5. For high-volume sends you may choose claude-sonnet-5-5 or
# claude-haiku-5-5 (cheaper/faster) by setting CLAUDE_MODEL in .env.
MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-5-5")
FROM_EMAIL = os.environ["FROM_EMAIL"]
BUSINESS_ADDRESS = os.environ["BUSINESS_ADDRESS"]
UNSUB_BASE = os.environ["UNSUBSCRIBE_BASE_URL"]
UNSUB_SECRET = os.environ.get("UNSUB_SECRET", "change-me").encode()
DRY_RUN = os.environ.get("DRY_RUN", "true").lower() == "true"
SEND_DELAY_SECONDS = 1.0  # stay well under provider rate limits
SUPPRESSION_FILE = "suppressed.txt"
LOG_FILE = "send_log.jsonl"

resend.api_key = os.environ.get("RESEND_API_KEY")
client = anthropic.Anthropic()

BUSINESS_CONTEXT = """
Business: Acme Web Studio — builds fast, AI-powered websites for local service businesses.
Offer: free 20-minute website review call.
Booking link: https://acme.com/book
Tone: friendly, concise, no hype.
"""

SYSTEM_PROMPT = f"""You write short, helpful follow-up emails for a small business.
{BUSINESS_CONTEXT}
Rules:
- Use ONLY facts given here and in the contact data. Never invent results, clients, prices, or discounts.
- 60-120 words in the body. One clear call to action using the booking link.
- No spammy phrasing (no ALL CAPS, no "act now", no excessive exclamation marks).
- Do not include a signature or footer; the system adds it.
Return ONLY JSON: {{"subject": str (<=60 chars), "preview_text": str (<=90 chars), "body_text": str}}"""


def load_suppressed() -> set[str]:
    if not os.path.exists(SUPPRESSION_FILE):
        return set()
    with open(SUPPRESSION_FILE) as f:
        return {line.strip().lower() for line in f if line.strip()}


def unsub_url(email: str) -> str:
    token = hmac.new(UNSUB_SECRET, email.lower().encode(), hashlib.sha256).hexdigest()
    return f"{UNSUB_BASE}?e={email}&t={token}"


def draft_email(contact: dict) -> dict:
    msg = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        output_config={"effort": "low"},
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": "Contact data:\n" + json.dumps({
                k: contact.get(k, "") for k in ("first_name", "company", "interest")
            }),
        }],
    )
    text = msg.content[0].text.strip()
    text = re.sub(r"^```(?:json)?|```$", "", text).strip()
    return json.loads(text)


def validate(draft: dict) -> list[str]:
    problems = []
    for key in ("subject", "preview_text", "body_text"):
        if not isinstance(draft.get(key), str) or not draft[key].strip():
            problems.append(f"missing {key}")
    if len(draft.get("subject", "")) > 60:
        problems.append("subject too long")
    if re.search(r"\{\{|\[\w+\]", draft.get("body_text", "")):
        problems.append("unresolved placeholder")
    words = len(draft.get("body_text", "").split())
    if not 30 <= words <= 180:
        problems.append(f"body length {words} words")
    return problems


def footer_text(email: str) -> str:
    return (
        f"\n\n—\nAcme Web Studio, {BUSINESS_ADDRESS}\n"
        f"You're getting this because you contacted us. Unsubscribe: {unsub_url(email)}"
    )


def to_html(body: str, email: str) -> str:
    import html
    paras = "".join(f"<p>{html.escape(p)}</p>" for p in body.split("\n\n") if p.strip())
    u = html.escape(unsub_url(email))
    return (
        f'<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">{paras}'
        f'<hr><p style="font-size:12px;color:#666">Acme Web Studio, {html.escape(BUSINESS_ADDRESS)}<br>'
        f'<a href="{u}">Unsubscribe</a></p></div>'
    )


def send(contact: dict, draft: dict) -> dict:
    email = contact["email"]
    params = {
        "from": FROM_EMAIL,
        "to": [email],
        "subject": draft["subject"],
        "text": draft["body_text"] + footer_text(email),
        "html": to_html(draft["body_text"], email),
        "headers": {
            "List-Unsubscribe": f"<{unsub_url(email)}>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
    }
    if DRY_RUN:
        return {"dry_run": True, "subject": draft["subject"]}
    return resend.Emails.send(params)


def log(entry: dict) -> None:
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")


def main(path: str) -> None:
    suppressed = load_suppressed()
    with open(path, newline="") as f:
        contacts = list(csv.DictReader(f))

    for c in contacts:
        email = c.get("email", "").strip().lower()
        if not email or email in suppressed:
            continue
        if not c.get("consent_source"):
            log({"email": email, "status": "skipped_no_consent"})
            continue
        try:
            draft = draft_email(c)
            problems = validate(draft)
            if problems:
                log({"email": email, "status": "rejected", "problems": problems, "draft": draft})
                continue
            result = send(c, draft)
            log({"email": email, "status": "sent", "result": result})
        except Exception as e:  # keep going; one bad contact shouldn't stop the batch
            log({"email": email, "status": "error", "error": str(e)})
        time.sleep(SEND_DELAY_SECONDS)

    print(f"Done. See {LOG_FILE}. DRY_RUN={DRY_RUN}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "contacts.csv")
