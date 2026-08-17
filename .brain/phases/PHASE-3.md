# PHASE 3 — AUTHENTICATION SYSTEM
Status: 🟡 IN PROGRESS | Gate: PENDING | Started: 2026-08-17
Goal: Users can sign up and log in via email OTP. Routes are protected.
Depends on: Phase 2 APPROVED | Blocks: Phase 4

## CHECKLIST
- [ ] P3.1  Enable Email OTP in Supabase Auth (Auth -> Providers -> Email -> OTP mode)
- [ ] P3.2  Brand OTP email template in Supabase (Alajo name + green style)
- [ ] P3.3  Create signup page: src/app/(auth)/signup/page.tsx (fields: name, email, phone)
- [ ] P3.4  Create OTP verify page: src/app/(auth)/verify/page.tsx (6-digit input)
- [ ] P3.5  Create login page: src/app/(auth)/login/page.tsx (email only -> sends OTP)
- [ ] P3.6  Create auth actions: src/app/(auth)/actions.ts (signUp, signInWithOtp, verifyOtp, signOut)
- [ ] P3.7  Update middleware.ts: protect all /dashboard/* routes -> redirect to /login
- [ ] P3.8  Create auth callback: src/app/auth/callback/route.ts (Supabase PKCE flow)
- [ ] P3.9  Create dashboard layout: src/app/(dashboard)/layout.tsx (sidebar nav)
- [ ] P3.10 Create dashboard home: src/app/(dashboard)/dashboard/page.tsx
- [ ] P3.11 Create profile page: src/app/(dashboard)/profile/page.tsx
- [ ] P3.12 Create sign-out button component
- [ ] P3.13 Add Upstash rate limiting: max 5 OTP requests per IP per 15 minutes
- [ ] P3.14 Add DB OTP spam guard: max 3 OTPs per email per hour (check otp_log table)
- [ ] P3.15 Configure Resend as email provider (via Supabase SMTP settings)
- [ ] P3.16 Create Welcome email template with React Email
- [ ] P3.17 TEST: Full signup flow end-to-end (email -> OTP -> dashboard)
- [ ] P3.18 TEST: Login flow (email -> OTP -> dashboard)
- [ ] P3.19 TEST: /dashboard without auth -> confirm redirect to /login
- [ ] P3.20 TEST: Profile row auto-created in DB after signup (handle_new_user trigger)
- [ ] P3.21 git commit: "feat: email OTP auth with rate limiting and route protection"

## GATE CRITERIA (ALL must be TRUE before Phase 4 starts)
- [ ] GATE-3A New user can sign up end-to-end (email -> OTP -> dashboard)
- [ ] GATE-3B Existing user can log in (email -> OTP -> dashboard)
- [ ] GATE-3C /dashboard/* redirects unauthenticated users to /login
- [ ] GATE-3D Profile row auto-created in DB on signup
- [ ] GATE-3E Rate limiting active on auth endpoints
- [ ] GATE-3F Sign-out clears session and redirects to /login

## DEFERRED FROM THIS PHASE
- [~] DEFER-3A (-> Post-MVP V2): KYC Tier 2 BVN verification via Dojah API
      Reason: Paid API + CBN compliance required — out of MVP scope
- [~] DEFER-3B (-> Phase 8): Profile photo upload to Cloudinary
      Reason: Core auth must work first; photo upload is polish
