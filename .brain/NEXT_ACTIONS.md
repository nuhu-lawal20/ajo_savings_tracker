# 🎯 ALAJO — NEXT ACTIONS
> THIS IS THE FIRST FILE AFTER BRAIN.md IN EVERY SESSION.
> Updated: 2026-08-17 | Current Phase: 10 — DEPLOYMENT, DEMO VIDEO & 3MTT SUBMISSION (FINAL MILESTONE)

---

## 🚀 ACTIVE PHASE: PHASE 10 — VERCEL DEPLOYMENT & 3MTT SUBMISSION
Read: `.brain/phases/PHASE-8-9-10.md` for full breakdown

### ✅ CURRENT REPOSITORY STATUS:
- **Build Status**: 100% Pass (0 errors across 19 routes on `next build`).
- **Code Sanitization**: 100% Clean (0 internal tech library mentions on customer UI).
- **Aesthetics & Theme**: Deep Nigerian Money Green (`#021A10`), high-res banknote wallpaper (`/images/naira-bg.jpg`), glowing mint accents (`#00E583`), mobile-responsive navigation.
- **Git Repo**: Linked and synced at `https://github.com/nuhu-lawal20/ajo_savings_tracker`.

---

### 📋 IMMEDIATE ACTIONS (PHASE 10 EXECUTION):

1. **Vercel Production Deployment**:
   - Go to [https://vercel.com/new](https://vercel.com/new).
   - Import repository: `nuhu-lawal20/ajo_savings_tracker`.
   - Framework Preset: `Next.js`.
   - Add all environment variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
     - `PAYSTACK_SECRET_KEY`
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
     - `RESEND_API_KEY`
     - `RESEND_FROM_EMAIL`
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `NEXT_PUBLIC_ONESIGNAL_APP_ID`
     - `ONESIGNAL_REST_API_KEY`
     - `NEXT_PUBLIC_SENTRY_DSN`
     - `NEXT_PUBLIC_APP_URL` (Set to the generated Vercel domain e.g., `https://alajo-savings.vercel.app`)
   - Click **Deploy**.

2. **Configure Paystack Live Webhook**:
   - Go to Paystack Dashboard -> Settings -> API Keys & Webhooks.
   - Set Webhook URL to: `https://<YOUR_VERCEL_DOMAIN>/api/webhooks/paystack`.

3. **Record 3–5 Min Capstone Demo Video**:
   - Tool: Loom / OBS Studio / Screen Recorder.
   - Flow:
     - Introduce fellow: Nuhu Lawal (`FE/23/84783109`), Almara Hub - Paragon Nigeria (Kaduna).
     - Show Hero & `/how-it-works` 5-step visual walkthrough.
     - Show Email OTP authentication.
     - Create a savings circle (`Market Traders Weekly Ajo`).
     - Copy invite link and join from a second user/tab.
     - Demonstrate real-time contribution via Paystack test card.
     - Show Live Glass Ledger instant update and Trust Score gauge.
     - Demonstrate offline mode (toggle network offline in DevTools — show cached data).
   - Upload as Unlisted on YouTube or share Loom URL.

4. **Submit 3MTT NextGen Capstone Form**:
   - **Fellow Name**: Nuhu Lawal
   - **Fellow ID**: `FE/23/84783109`
   - **Fellow Email**: `nuhulawal20@gmail.com`
   - **ALC & State**: Almara Hub - Paragon Nigeria, Kaduna State
   - **Project Title**: Alajo — Digital Savings Circle
   - **Link to Capstone Project**: `https://github.com/nuhu-lawal20/ajo_savings_tracker`
   - **Link to Demo Video**: `<YOUR_YOUTUBE_OR_LOOM_LINK>`
