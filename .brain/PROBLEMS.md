# 🚨 KADASHE — PROBLEMS & RISKS TRACKER
> Updated after every issue encountered. Never delete resolved entries.

---

## ⚡ ACTIVE PROBLEMS (NONE)
- All core features, auth flows, database policies, and theme styling are 100% operational.

---

## 🛡️ RISKS & MITIGATIONS

### RISK-001 — Free Tier Overages
- **Risk:** Exceeding Supabase, Upstash, or Vercel limits
- **Prevention:** Guardrails in code, rate limiting, caching
- **Status:** MITIGATED

### RISK-002 — Paystack Webhook Failure
- **Risk:** Webhook dropped, transaction not recorded
- **Prevention:** Idempotency keys + manual verification fallback
- **Status:** MITIGATED

### RISK-003 — Supabase Realtime Disconnection
- **Risk:** WebSocket drops, live ledger stops updating
- **Prevention:** Auto-reconnect + fallback polling every 30s
- **Status:** MITIGATED

### RISK-004 — RLS Policy Bypass
- **Risk:** Users accessing data belonging to other circles
- **Prevention:** RLS enabled on all 4 tables with strict user_id checks
- **Status:** MITIGATED

### RISK-005 — Hit-and-Run Default on Rotation Payout
- **Risk:** Member receives lump sum early, stops contributing
- **Prevention:** AI Trust Score gating + KYC Tier limits (Tier 1: ₦10k, Tier 2: ₦100k, Tier 3: Unlimited)
- **Status:** MITIGATED

---

## 📋 RESOLVED PROBLEMS LOG

### P001 — Resend Sandbox Restriction Causing "Error sending confirmation email"
- **Session:** 6 | **Date:** 2026-08-18
- **Context:** User was signing up with `nuhulawal20@gmail.com` on the `/signup` screen using Supabase with Custom SMTP configured via Resend.
- **Problem:** Supabase returned `500 AuthRetryableFetchError: Error sending confirmation email`.
- **Root Cause:** Resend's free default sandbox (`onboarding@resend.dev`) restricts outgoing emails strictly to the single email registered on the Resend account (`nuhu7777@gmail.com`).
- **Solution:** Configured Brevo (Sendinblue) Free SMTP in Supabase Settings (`smtp-relay.brevo.com:587`), delivering custom 6-digit branded OTP codes (`{{ .Token }}`) to ANY recipient email address worldwide without domain gatekeeping (300 emails/day free).
- **Status:** RESOLVED

### P002 — Network Packet Drop / ECONNRESET Causing "fetch failed"
- **Session:** 5 | **Date:** 2026-08-17
- **Context:** Submitting auth forms during local development when network blips occurred.
- **Problem:** Client-side JavaScript threw raw `TypeError: fetch failed` without helpful context.
- **Root Cause:** Server actions and client-side form submission handlers lacked top-level `try...catch` wrappers.
- **Solution:** Added structured `try...catch` blocks to `src/app/(auth)/actions.ts`, `signup/page.tsx`, `login/page.tsx`, and `verify/page.tsx` with user-friendly retry messages.
- **Status:** RESOLVED

### P003 — Supabase Default Email Templates Sent Links Instead of 6-Digit Codes
- **Session:** 5 | **Date:** 2026-08-17
- **Context:** Verification screen expected a 6-digit number, but Supabase sent a click confirmation link.
- **Problem:** Default Supabase email templates use `{{ .ConfirmationURL }}` instead of `{{ .Token }}`.
- **Solution:** Configured custom email templates in Supabase containing `{{ .Token }}` and updated `src/app/auth/callback/route.ts` to handle both token hashes and 6-digit codes.
- **Status:** RESOLVED

### P004 — Residual Green / Emerald Elements Across Multiple Dashboard Pages
- **Session:** 7 | **Date:** 2026-08-19
- **Context:** After adopting Option 2 (Sovereign Navy & Electric Cyan), legacy green badges, borders (`#e6ece8`), and icons remained in auth, circles, admin, and ledger pages.
- **Problem:** Inconsistent visual palette across dashboard routes.
- **Solution:** Conducted codebase-wide audit and replaced all instances of `emerald`, `teal`, and `#032316` with Sovereign Navy (`#0F2744`) and Electric Cyan (`#0284C7` / `#38BDF8`). Verified with grep & `npm run build` (0 errors).
- **Status:** RESOLVED

### P005 — Brandmark Contrast on Dark Navy Surfaces
- **Session:** 8 | **Date:** 2026-08-20
- **Context:** The bottom tier wordmark (`DASHE`) blended into dark navy backgrounds (`#071322`).
- **Problem:** Reduced brandmark legibility on dark surfaces.
- **Solution:** Implemented multi-stop linear gradients across `<KadasheLogo />`: upper ice-blue crystal highlights (`#BAE6FD` &rarr; `#60A5FA`), mid-body royal cobalt (`#2563EB`), and deep sovereign navy base (`#1E3A8A` &rarr; `#0F2744`). Gives rich depth and 100% contrast without defaulting to flat white text.
- **Status:** RESOLVED

### P006 — Super Admin Circle Approval Returning Error
- **Session:** 9 | **Date:** 2026-08-21
- **Context:** Super Admin clicking "Approve Circle" on `/admin` received a failed error.
- **Problem:** HTTP method mismatch (`AdminCircleCard.tsx` sent `POST`, but `/api/circles/[id]/start` only exported `PATCH`) and PostgreSQL RLS policy on `circles` restricted updates to `creator_id = auth.uid()`, blocking non-creator Super Admins.
- **Solution:** Added dual `POST` and `PATCH` support, used `createAdminClient()` (Service Role) when `isAdmin === true` to safely bypass RLS, and added instant `revalidatePath` calls.
- **Status:** RESOLVED

### P007 — Stale KYC Tier Display in Admin Console
- **Session:** 9 | **Date:** 2026-08-21
- **Context:** When a user upgraded from Tier 1 to Tier 2 in `/profile`, the Admin console still displayed Tier 1.
- **Problem:** Next.js 16 Server Component caching served stale rendered HTML for `/admin`.
- **Solution:** Added `export const dynamic = "force-dynamic"` to `admin/page.tsx`, `profile/page.tsx`, and `dashboard/page.tsx`, and triggered `revalidatePath("/admin")` inside `/api/kyc/verify`.
- **Status:** RESOLVED

### P008 — Identity Verification Gating & Biometric Avatar Assignment
- **Session:** 9 | **Date:** 2026-08-21
- **Context:** Users could join circles without verified identity or profile details, and avatars could be set to arbitrary images.
- **Problem:** Lack of identity verification before joining circles created risk of ghost accounts and impersonation.
- **Solution:** Enforced mandatory profile completion for all circles, required Tier 2 BVN/NIN verification for circles > ₦10,000, added in-place KYC modal triggers on `/join/[code]`, and automatically bound the verified biometric identity photo upon KYC verification. Documented live vs sandbox API costs for 3MTT supervisors.
- **Status:** RESOLVED

### P009 — Admin Console PostgREST Foreign Key Resolution (0 Listed / 0 Profiles)
- **Session:** 11 | **Date:** 2026-08-21
- **Context:** Opening `/admin` showed `0 Listed` circles and `0 Profiles` in Member Directory.
- **Problem:** In `admin/page.tsx`, PostgREST queries joined `profiles` using `!creator_id` instead of the exact PostgreSQL constraint name `!circles_creator_id_fkey`, and reverse profile sub-queries failed under standard user client sessions.
- **Solution:** Upgraded all server-side administrative metrics and listing queries to `createAdminClient()`, updated the foreign key constraint qualifier to `!circles_creator_id_fkey`, and mapped created circles count in memory.
- **Status:** RESOLVED

### P010 — Circle Details 404 Not Found When Inspected by Platform Administrators
- **Session:** 11 | **Date:** 2026-08-21
- **Context:** When an admin or moderator clicked on an active savings pool from `/admin` or `/circles`, the page returned `404 Not Found`.
- **Problem:** Because administrators adhere to Segregation of Duties and are not members of consumer savings pools, standard RLS queries on `circles/[id]` filtered the circle record out, triggering `notFound()`.
- **Solution:** Switched circle and membership data retrieval in `src/app/(dashboard)/circles/[id]/page.tsx` to `createAdminClient()`, allowing supervisors to inspect rotation orders and Glass Ledgers without RLS blocking.
- **Status:** RESOLVED

### P011 — Helper Admin Displaying Super Admin Badges & Consumer Onboarding Links
- **Session:** 11 | **Date:** 2026-08-21
- **Context:** Helper Admin accounts (`moderator1@kadashe.ng`) showed `👑 Super Admin` badge and consumer "How It Works" links.
- **Problem:** UI components checked `isAdmin` without distinguishing `is_super_admin` vs `is_helper_admin`.
- **Solution:** Differentiated Super Admin (`👑 Super Admin`, Amber theme) from Helper Admin (`🛡️ Helper Admin / Moderator`, Sky-Blue theme) across all headers, profile cards, and sidebars. Removed consumer tutorials ("How It Works" & "HELP") from administrative views.
- **Status:** RESOLVED


