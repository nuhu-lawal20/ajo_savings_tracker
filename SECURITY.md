# Security Architecture — Kadashe

Kadashe implements **10 security layers** to protect member funds, data, and identity.

---

## 1. PostgreSQL Row Level Security (RLS)

All 4 tables — `profiles`, `circles`, `memberships`, `transactions` — have RLS **enabled**.

Policies ensure:
- A user can only `SELECT` their own profile
- Circle data is readable only by members of that circle
- `memberships` and `transactions` are restricted to their respective `user_id` or circle members
- The `service_role` key (admin client) bypasses RLS — used **only** in the webhook handler

---

## 2. Supabase Auth — PKCE Flow

Authentication uses **Proof Key for Code Exchange (PKCE)** via Supabase Auth:
- Email OTP is verified before any session token is issued
- Session tokens are stored in HttpOnly cookies (via `@supabase/ssr`)
- The `src/middleware.ts` (proxy) refreshes sessions on every request and redirects unauthenticated users

---

## 3. Upstash Redis Rate Limiting

Auth endpoints (`/signup`, `/login`, `/verify`) are protected by a **sliding window rate limiter**:
- **Limit**: 5 requests per 15 minutes per IP
- **Backend**: Upstash Redis REST API
- **Library**: `@upstash/ratelimit` with `slidingWindow` algorithm
- Excess requests return `429 Too Many Requests`

---

## 4. Paystack Webhook HMAC-SHA512 Verification

Every incoming webhook at `/api/webhooks/paystack` is verified:

```ts
const hash = crypto
  .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
  .update(rawBody)
  .digest("hex");

if (hash !== request.headers.get("x-paystack-signature")) {
  return 401; // Reject
}
```

Only Paystack-signed events can trigger transaction state changes.

---

## 5. Zod Schema Validation

Every API route validates its request body with a **Zod schema** before any DB operation:

| Route | Schema |
|---|---|
| `POST /api/circles` | `CreateCircleSchema` |
| `POST /api/circles/join` | `JoinCircleSchema` |
| `POST /api/contributions` | `MakeContributionSchema` |
| `POST /api/upload` | MIME + size checks |

Invalid requests return `400 Bad Request` before touching the database.

---

## 6. Supabase Admin Client Isolation

The `createAdminClient()` (using `SUPABASE_SERVICE_ROLE_KEY`) is:
- **Only** imported in `src/lib/supabase/admin.ts`
- **Only** used in `src/app/api/webhooks/paystack/route.ts`
- Never exposed to the browser or used in any client component

All user-facing routes use the standard `createClient()` which respects RLS.

---

## 7. Unique Paystack Reference Constraint

The `transactions.paystack_reference` column has a **UNIQUE constraint** at the database level:

```sql
UNIQUE(paystack_reference)
```

This prevents a replay attack from processing the same payment twice, even if Paystack fires the webhook multiple times (which it does for retries).

---

## 8. Security Headers

`next.config.ts` applies the following headers to all routes:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' js.paystack.co; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

---

## 9. Secret Management

- All secrets live in `.env.local` (gitignored — never committed)
- `.env.example` documents every variable with placeholder values
- Vercel environment variables are set in the Vercel dashboard (not in code)
- No secrets are passed to client components (`NEXT_PUBLIC_` prefix is only used for non-sensitive public keys)

---

## 10. Sentry PII Scrubbing

Sentry error events are filtered before transmission:

```ts
beforeSend(event) {
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
  }
  return event;
}
```

User emails and IP addresses are stripped from all Sentry reports.

---

## Responsible Disclosure

If you discover a security vulnerability, please email **nuhulawal20@gmail.com** directly. Do not open a public GitHub issue for security reports.
