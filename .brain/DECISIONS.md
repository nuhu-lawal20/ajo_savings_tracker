# 🗂️ ALAJO — ARCHITECTURAL DECISIONS LOG
> Every decision, why it was made, and what alternatives were rejected.
> NEVER change a decision without adding a new entry explaining the change.

---

## DECISION LOG FORMAT
Each entry: Decision → Reason → Alternatives Rejected → Date → Session

---

## D001 — App Name: "Alajo"
- **Decision:** Name the app "Alajo"
- **Reason:** Pure Yoruba/Hausa roots. Authentic Nigerian identity. The word IS the product — no translation needed. Judges will immediately understand the cultural context.
- **Alternatives Rejected:**
  - AjoSafe — too generic, sounds like a product name
  - CircleSave — too international, loses Nigerian identity
  - PocketCircle — friendly but doesn't resonate with target users
- **Date:** 2026-08-13 | **Session:** 1

---

## D002 — Backend: Supabase Edge Functions (NOT Express/Node.js)
- **Decision:** Use Supabase Edge Functions (Deno runtime) as the backend
- **Reason:** Co-located with the database = near-zero latency on DB queries. No separate server to maintain. No Railway/Render deployment complexity. Fits the 7-day sprint. Free tier: 500k invocations/month.
- **Alternatives Rejected:**
  - Separate Express server on Railway — adds deployment complexity, Railway free tier has cold starts
  - Next.js API routes only — limited for webhooks and cron (Edge Functions handle these better)
- **Date:** 2026-08-13 | **Session:** 1

---

## D003 — Hosting: Vercel (NOT Netlify)
- **Decision:** Deploy on Vercel
- **Reason:**
  - Native Next.js support (Vercel created Next.js) — zero config
  - 6,000 build minutes/month vs Netlify's 300
  - 100 GB bandwidth/month flat (Netlify new accounts only get ~15 GB via credit system)
  - Netlify post-Sept 2025: 300 credits ÷ 20 credits/GB = only 15 GB bandwidth for new accounts
  - Each Netlify production deploy costs 15 credits = only 20 deploys free
- **Alternatives Rejected:**
  - Netlify — credit system too restrictive for new accounts
  - Render — cold starts on free tier, less Next.js-native
- **Important Note:** Vercel Hobby prohibits commercial use. This project is a non-commercial academic capstone — legally fine.
- **Date:** 2026-08-13 | **Session:** 1

---

## D004 — Database: Supabase PostgreSQL (NOT Neon)
- **Decision:** Use Supabase for the database
- **Reason:** Supabase = DB + Auth + Storage + Edge Functions + Realtime + RLS all in one free tier. Neon is DB-only — we would need separate services for Auth, Realtime, etc.
- **Alternatives Rejected:**
  - Neon — excellent DB branching but no bundled Auth/Realtime/Storage
  - MongoDB Atlas — NoSQL wrong fit for financial ACID-compliant data
- **Date:** 2026-08-13 | **Session:** 1

---

## D005 — Payments: Paystack Test Mode
- **Decision:** Use Paystack in test mode for the demo
- **Reason:** Free, full API functionality, no real money, Nigerian-context payment gateway that judges will recognize.
- **Alternatives Rejected:**
  - Monnify — better for DVA/escrow (real money) but test mode more complex to demo
  - Stripe — not Nigerian-focused, less relevant for 3MTT judges
  - Mock payments only — weakens the technical depth of the submission
- **Date:** 2026-08-13 | **Session:** 1

---

## D006 — AI Feature: Rule-Based Trust Score (NOT LLM chatbot)
- **Decision:** Implement an algorithmic AI Trust Score, not an LLM chatbot
- **Reason:** No API costs. No rate limits. Runs in Supabase pg_cron nightly. Deterministic and explainable. Visually impressive as an animated gauge on the profile page.
- **Formula:** ((contributions - missed) / total) × 60 + (kyc_tier - 1) × 20
- **Ranges:** 0-39 = last payout slots | 40-69 = middle slots | 70-100 = any slot
- **Alternatives Rejected:**
  - OpenAI/Gemini LLM chatbot — API costs, rate limits, complex to demo in 7 days
- **Date:** 2026-08-13 | **Session:** 1

---

## D007 — PWA: Offline-First Architecture
- **Decision:** Build as an offline-first PWA
- **Reason:** Nigerian mobile reality — unreliable internet coverage. Members can view circles, ledger, and trust score offline. Payments queue for sync. This is a product-market fit feature, not a gimmick.
- **Libraries:**
  - @ducanh2912/next-pwa — maintained fork, Workbox integration
  - Dexie.js — IndexedDB wrapper for local data
- **Caching Strategy:**
  - App Shell → Cache First
  - /api/circles → Stale While Revalidate
  - /api/transactions → Network First
  - Paystack → Network Only
- **Date:** 2026-08-13 | **Session:** 1

---

## D008 — Rate Limiting: Upstash Redis (NOT express-rate-limit)
- **Decision:** Use Upstash Redis for rate limiting in Next.js middleware
- **Reason:** HTTP-based Redis = works in Vercel Edge Middleware. express-rate-limit is Node.js only, cannot run at the edge. Upstash free: 500k commands/month. Using ephemeralCache cuts commands by ~70%.
- **Date:** 2026-08-13 | **Session:** 1

---

## D009 — Email: Resend (NOT Nodemailer/SendGrid)
- **Decision:** Use Resend for transactional email
- **Reason:** Cleanest developer API. React Email templates (JSX-based). 3k emails/month free. 30-day log retention. Permanent free tier (not a trial).
- **Alternatives Rejected:**
  - Nodemailer — requires SMTP server, no free tier
  - SendGrid — complex setup, free tier has restrictions
  - Brevo — 300/day but less developer-friendly API
- **Date:** 2026-08-13 | **Session:** 1

---

## D010 — Cron Jobs: Supabase pg_cron (NOT cron-job.org)
- **Decision:** Use Supabase pg_cron for all scheduled tasks
- **Reason:** Native to the database — no network round-trip. Free with Supabase. Can query DB tables directly in cron logic. More robust than external HTTP pings.
- **Jobs Scheduled:**
  - Daily payout check (8:00 UTC = 9:00 WAT)
  - Weekly reminders (Sunday 7:00 UTC)
  - Nightly trust score recalculation (1:00 UTC)
  - 6-day keep-alive ping (prevents Supabase 7-day inactivity pause)
- **Date:** 2026-08-13 | **Session:** 1

---

## D011 — Submission Link: GitHub Repo (NOT deployed URL)
- **Decision:** Submit GitHub repo URL as the "Link to Capstone Project"
- **Reason:** "Project" = code artifact. Judges need README, code quality, documentation. Permanently accessible (Vercel free tier can go down). README will contain the live URL — judges get both.
- **Separate field:** Demo video URL goes in the "Link to demo video" field.
- **Date:** 2026-08-13 | **Session:** 1
