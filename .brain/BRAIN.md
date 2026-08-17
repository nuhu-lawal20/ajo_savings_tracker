# 🧠 ALAJO — PROJECT BRAIN
> **The Living Intelligence of This Project. Read This First. Always.**
> Last Updated: 2026-08-17 | Status: 🟢 PHASES 0–9 COMPLETE (100%) → READY FOR VERCEL DEPLOYMENT (PHASE 10)

---

## ⚡ AGENT BOOT PROTOCOL
> 🔴 MANDATORY FOR EVERY SESSION — NO EXCEPTIONS
>
> Before writing a single line of code or answering any question, the agent MUST:
> 1. Read THIS file (BRAIN.md) completely
> 2. Read PROGRESS.md — what was done last session
> 3. Read DECISIONS.md — what was decided and why
> 4. Read PROBLEMS.md — known issues and their fixes
> 5. Read NEXT_ACTIONS.md — exactly what to do next
> 6. Then and ONLY then, begin work

---

## 📌 PROJECT IDENTITY

| Field | Value |
|---|---|
| Project Name | Alajo — Digital Savings Circle |
| Tagline | "Save in Circles With Peace of Mind. Zero Stories. 100% Safe." |
| Type | Offline-First PWA (Progressive Web App) |
| Purpose | 3MTT NextGen Capstone Submission |
| Fellow | Nuhu Lawal |
| Fellow ID | FE/23/84783109 |
| Email | nuhulawal20@gmail.com |
| ALC | Almara Hub - Paragon Nigeria |
| State | Kaduna State |
| Submission | GitHub repo (public) + Loom/YouTube demo video |
| Active Routes | 19 routes (All TypeScript verified, 0 build errors) |

---

## 🎯 WHAT THIS PROJECT IS

Alajo digitizes the Nigerian traditional Ajo/Esusu/Adashe rotating savings system with programmatic guarantees.

### The 3 Core Problems It Solves
| # | Problem | Solution |
|---|---|---|
| 1 | Hit-and-Run Defaults — member collects payout, disappears | Trust Score algorithm + Priority Slot Locking + Collateral Safeguards |
| 2 | Alajo (Admin) Fraud — organizer steals pooled money | Automated Escrow Vault — Admin NEVER touches pooled funds (₦0.00 custody) |
| 3 | Zero Transparency — nobody knows who paid | Real-time Live Glass Ledger with cryptographic receipts and instant broadcasts |

---

## 🏗️ PRODUCTION TECH STACK

| Layer | Technology | Status |
|---|---|---|
| Framework | Next.js 16 (App Router + Turbopack) | ✅ 19 routes compiling cleanly |
| Styling | Tailwind CSS + Plus Jakarta Sans + shadcn/ui | ✅ Deep Nigerian money green theme + Banknote art |
| Database | Supabase PostgreSQL | ✅ 4 tables (profiles, circles, memberships, transactions) |
| Auth | Supabase Auth (Email OTP + PKCE callback) | ✅ Tested & Working |
| Security | Row Level Security (RLS) + Zod + HMAC Webhook | ✅ All 10 security layers verified |
| Payments | Paystack Inline + Webhook Gateway | ✅ Automated round disbursement & tracking |
| Real-time | Supabase Realtime Channels | ✅ Live Glass Ledger broadcasts |
| Media CDN | Cloudinary | ✅ Server-side avatar upload API & CDN delivery |
| Error Tracking | Sentry | ✅ Configured with PII data scrubbing |
| Push Notifications | OneSignal | ✅ Configured |
| Offline / Local DB | Dexie.js (IndexedDB) + Service Worker | ✅ Offline-first caching active |

---

## 🔐 SECURITY LAYERS (ALL 10 ACTIVE & VERIFIED)

- **L1** Zod input validation on ALL API inputs
- **L2** Supabase OTP auth (no passwords stored)
- **L3** JWT access / refresh HttpOnly cookies
- **L4** Supabase RLS policies — DB-level enforcement on all 4 tables
- **L5** Upstash rate limiting in middleware.ts
- **L6** Paystack HMAC-SHA512 webhook verification
- **L7** paystack_reference UNIQUE constraint (idempotency key)
- **L8** All secrets in env vaults (`.env.local` / Vercel)
- **L9** next.config.ts security headers (CSP, HSTS, X-Frame)
- **L10** CORS & Sanitized user-facing UI (0 internal library mentions)

---

## 📊 MILESTONE COMPLETION SUMMARY

- [x] **Phase 0** — Pre-Development Setup & Credentials Gathering (100%)
- [x] **Phase 1** — Project Scaffolding & Core Architecture (100%)
- [x] **Phase 2** — Database Schema, Migrations & RLS Policies (100%)
- [x] **Phase 3** — Authentication System (Email OTP) (100%)
- [x] **Phase 4** — Circle Management & Invite System (100%)
- [x] **Phase 5** — Payments & Automated Escrow Engine (100%)
- [x] **Phase 6** — Live Glass Ledger & Real-Time Sync (100%)
- [x] **Phase 7** — PWA Offline Layer & Service Worker (100%)
- [x] **Phase 8** — AI Trust Score Engine & UI Polish (100%)
- [x] **Phase 9** — Documentation, Security Audit & Code Sanitization (100%)
- [ ] **Phase 10** — Vercel Deployment, Demo Video & 3MTT Submission (🟡 READY TO EXECUTE)

---

## 🔗 KEY LINKS

| Resource | URL |
|---|---|
| GitHub Repo | https://github.com/nuhu-lawal20/ajo_savings_tracker |
| Supabase Project | https://teknpdpogjqipurpgofk.supabase.co |
| Vercel Live URL | TBD (Deploy via vercel.com/new) |
| Demo Video | TBD (3–5 min walkthrough) |
| How It Works Page | `/how-it-works` (Dedicated customer step-by-step guide) |
