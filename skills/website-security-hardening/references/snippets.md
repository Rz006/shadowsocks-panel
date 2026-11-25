# Ready-to-adapt Security Snippets

Adjust CSP sources to match the scripts the site actually loads. Start with Report-Only if unsure.

## Next.js (`next.config.js`)
```js
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

module.exports = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};
```
For strict CSP without `'unsafe-inline'`, use nonces via middleware (see Next.js CSP docs).

## Netlify (`_headers`) / Cloudflare Pages (`_headers`)
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'
```

## Vercel (`vercel.json`)
```json
{ "headers": [ { "source": "/(.*)", "headers": [
  { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
  { "key": "X-Content-Type-Options", "value": "nosniff" },
  { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
] } ] }
```

## Nginx
```nginx
server_tokens off;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; frame-ancestors 'self'" always;
location ~ /\.(?!well-known) { deny all; }
```

## Apache / WordPress `.htaccess`
```apache
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header unset X-Powered-By
</IfModule>
<FilesMatch "^(wp-config\.php|\.env|.*\.bak|.*\.sql)$">
  Require all denied
</FilesMatch>
Options -Indexes
```
wp-config.php:
```php
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
```

## Rate limiting an API route (Next.js + Upstash)
```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anon';
  const { success } = await ratelimit.limit(`chat:${ip}`);
  if (!success) return new Response('Too many requests', { status: 429 });
  // ... handle request
}
```

## Cloudflare Turnstile server-side verification
```ts
async function verifyTurnstile(token: string, ip?: string) {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET!, response: token, ...(ip ? { remoteip: ip } : {}) }),
  });
  const data = await res.json();
  return data.success === true;
}
```

## Passive header check
```bash
curl -sI https://example.com | grep -iE 'strict-transport|content-security|x-content-type|referrer-policy|permissions-policy|x-frame|server|x-powered'
for p in .env .git/HEAD wp-config.php.bak backup.zip; do echo -n "$p: "; curl -s -o /dev/null -w '%{http_code}\n' "https://example.com/$p"; done
```
