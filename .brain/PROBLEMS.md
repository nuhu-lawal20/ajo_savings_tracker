# 🐛 ALAJO — PROBLEMS & SOLUTIONS LOG
> Every bug, error, or blocker encountered — and exactly how it was fixed.
> PURPOSE: Never solve the same problem twice.

---

## LOG FORMAT
### P[NUMBER] — [Short Title]
- **Session:** N | **Date:** YYYY-MM-DD
- **Context:** What were we trying to do?
- **Problem:** Exact error message or description
- **Root Cause:** Why did it happen?
- **Solution:** Exact fix applied
- **Prevention:** How to avoid this in future
- **Status:** RESOLVED / WORKAROUND / OPEN

---

## ⚠️ NO PROBLEMS YET — SESSION 1 WAS BRAINSTORMING ONLY

---

## 🔖 KNOWN RISKS TO WATCH (Pre-emptive)

### RISK-001 — Supabase Project Inactivity Pause
- **Risk:** Supabase free tier pauses projects after 7 days of no activity
- **Prevention:** pg_cron keep-alive query scheduled every 6 days:
  `SELECT cron.schedule(keep-alive, 0 12 */6 * *, $$SELECT 1$$);`
- **Status:** PREVENTION IN PLACE (implement on Day 1)

### RISK-002 — Cloudinary Credit Overrun
- **Risk:** 25 credits/month exhausted by heavy image transforms
- **Prevention:**
  - All avatars resized to 200x200 on upload (1 transform each)
  - WebP auto-format saves 30-40% bandwidth
  - Monitor at 80% usage threshold
- **Status:** PREVENTION DESIGNED

### RISK-003 — Resend Daily Limit (100 emails/day)
- **Risk:** OTP spam or notification burst hits 100/day cap
- **Prevention:**
  - Max 3 OTP requests per user per hour (DB check)
  - Batch weekly reminders into single email per user
  - Idempotent welcome email (check sent_at flag before sending)
- **Status:** PREVENTION DESIGNED

### RISK-004 — Paystack Webhook Replay Attack
- **Risk:** Attacker replays a valid Paystack webhook to credit a transaction twice
- **Prevention:**
  - paystack_reference column has UNIQUE constraint in DB
  - HMAC-SHA512 signature verification on every webhook
  - Check transaction status before processing
- **Status:** PREVENTION DESIGNED (implement on Day 3)

### RISK-005 — Next.js Service Worker Conflicts
- **Risk:** Service worker caches stale Next.js build chunks after deployment
- **Prevention:**
  - next-pwa auto-generates versioned service worker on each build
  - reloadOnOnline: true in PWA config
  - Cache names include build hash
- **Status:** PREVENTION DESIGNED

### RISK-006 — Supabase RLS Policy Gaps
- **Risk:** Missing RLS policy allows user to query another user's data
- **Prevention:**
  - Test ALL policies with Supabase Policy Tester in dashboard
  - Test with a secondary test user account
  - Every table MUST have RLS enabled before launch
- **Status:** PREVENTION DESIGNED (test on Day 1)

### RISK-007 — Environment Variables Leaked to Client
- **Risk:** Secret keys (SUPABASE_SERVICE_ROLE_KEY, PAYSTACK_SECRET_KEY) accidentally exposed to browser
- **Prevention:**
  - All server-only keys: NO NEXT_PUBLIC_ prefix
  - Audit .env.example before every commit
  - next.config.ts: never put secrets in publicRuntimeConfig
- **Status:** PREVENTION DESIGNED

### RISK-008 — Vercel Cold Start on Edge Functions
- **Risk:** First request after inactivity has high latency
- **Prevention:**
  - Edge Functions (not Serverless) have no cold starts
  - Use next/headers and middleware at edge runtime
- **Status:** PREVENTION DESIGNED

---

## 📋 RESOLVED PROBLEMS LOG

### P001 — Resend Sandbox Restriction Causing "Error sending confirmation email"
- **Session:** 6 | **Date:** 2026-08-18
- **Context:** User was signing up with `nuhulawal20@gmail.com` on the `/signup` screen using Supabase with Custom SMTP configured via Resend.
- **Problem:** Supabase returned `500 AuthRetryableFetchError: Error sending confirmation email`.
- **Root Cause:** Resend's free default sandbox (`onboarding@resend.dev`) restricts outgoing emails strictly to the single email registered on the Resend account (`nuhu7777@gmail.com`). Attempts to send to any other recipient return HTTP 403 `validation_error`.
- **Solution:** 
  1. For Capstone evaluation & testing: Disabled Custom SMTP in Supabase Dashboard so Supabase's built-in mailer sends to ANY email address with 0 restrictions.
  2. For Production V2: Developers can purchase/connect a verified custom domain (`alajo.ng`) in Resend to send from `hello@alajo.ng` to any address.
- **Status:** RESOLVED

### P002 — Network Packet Drop / ECONNRESET Causing "fetch failed"
- **Session:** 5 | **Date:** 2026-08-17
- **Context:** Submitting the auth forms during local development when network blips occurred.
- **Problem:** Client-side JavaScript threw raw `TypeError: fetch failed` without helpful context.
- **Root Cause:** Server actions and client-side form submission handlers lacked top-level `try...catch` wrappers.
- **Solution:** Added structured `try...catch` blocks to `src/app/(auth)/actions.ts`, `signup/page.tsx`, `login/page.tsx`, and `verify/page.tsx` with user-friendly retry messages.
- **Status:** RESOLVED

### P003 — Supabase Default Email Templates Sent Links Instead of 6-Digit Codes
- **Session:** 5 | **Date:** 2026-08-17
- **Context:** Verification screen expected a 6-digit number, but Supabase sent a click confirmation link.
- **Problem:** Default Supabase email templates use `{{ .ConfirmationURL }}` instead of `{{ .Token }}`.
- **Solution:** Configured emerald-branded custom email templates in Supabase containing `{{ .Token }}` and updated `src/app/auth/callback/route.ts` to handle both token hashes and 6-digit codes.
- **Status:** RESOLVED

