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

---

## D012 — Visual Theme: Authentic Nigerian Banknote & Deep Emerald
- **Decision:** Use deep Nigerian money green (`#021A10`) background with authentic Naira currency artwork (`public/images/naira-bg.jpg`), glowing mint accents (`#00E583`), and frosted `.glass-vault` styling.
- **Reason:** Instantly communicates financial trust and cultural authenticity to Nigerian users and 3MTT evaluators.
- **Date:** 2026-08-17 | **Session:** 5

---

## D013 — Dedicated Customer Explainer: `/how-it-works`
- **Decision:** Build a standalone `/how-it-works` 5-step visual guide page with FAQ and Nigerian context instead of keeping explainer text in a small modal or buried section.
- **Reason:** Gives non-technical users, market traders, and salary earners total clarity on the 5-step savings cycle before signing up.
- **Date:** 2026-08-17 | **Session:** 5

---

## D014 — Customer-Facing Copy: 100% Results-Driven (Zero Tech Jargon)
- **Decision:** Scrub all internal tech library names (`Supabase`, `Paystack`, `PostgreSQL`, `Upstash`, `Redis`, `Cloudinary`, `Sentry`, `OneSignal`, `Dexie`, `Service Worker`, `RLS`) from customer-facing screens.
- **Reason:** Users are motivated by financial guarantees and outcomes (Escrow Protection, Live Transparent Ledger, Offline Resilience, Signed Receipts), not developer tooling. Technical stack details are reserved strictly for developer documentation (`README.md`, `API.md`, `SECURITY.md`).
- **Date:** 2026-08-17 | **Session:** 5

---

## D015 — Mobile-First Responsive Navigation: Centered Stack with Luminous Micro-Pill
- **Decision:** Structure mobile header navigation with `Get Started` on top and a centered, luminous emerald glowing `Sign In` micro-pill directly below it.
- **Reason:** Solves vertical crowding and avoids edge clipping on small mobile viewports (390px iPhone/Android) while keeping both CTAs prominent.
- **Date:** 2026-08-17 | **Session:** 5

---

## D016 — React 19 SSR Hydration Safety: `useSyncExternalStore`
- **Decision:** Use `useSyncExternalStore` with server snapshot fallbacks for all browser globals (`navigator.onLine`, `window.location`).
- **Reason:** Eliminates React 19 hydration mismatch warnings on Turbopack App Router SSR.
- **Date:** 2026-08-17 | **Session:** 5

