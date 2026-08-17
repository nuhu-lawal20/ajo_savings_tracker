# 🧠 ALAJO — PROJECT BRAIN
> **The Living Intelligence of This Project. Read This First. Always.**
> Last Updated: 2026-08-13 | Status: 🟡 PLANNING COMPLETE → READY TO BUILD

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
| Tagline | "Replacing physical trust with programmatic trust" |
| Type | Offline-First PWA (Progressive Web App) |
| Purpose | 3MTT NextGen Capstone Submission |
| Fellow | Nuhu Lawal |
| Fellow ID | FE/23/84783109 |
| Email | nuhulawal20@gmail.com |
| ALC | Almara Hub - Paragon Nigeria |
| State | Kaduna |
| Submission | GitHub repo (public) + Loom/YouTube demo video |

---

## 🎯 WHAT THIS PROJECT IS

Alajo digitizes the Nigerian traditional Ajo/Esusu/Adashe rotating savings system.

### The 3 Problems It Solves
| # | Problem | Solution |
|---|---|---|
| 1 | Hit-and-Run Defaults — member collects payout, disappears | Trust Score algorithm (MVP) / BVN mandate (V2) |
| 2 | Alajo (Admin) Fraud — organizer steals pooled money | Escrow via Paystack — admin NEVER touches money |
| 3 | Zero Transparency — nobody knows who paid | Real-time Glass Ledger via Supabase Realtime |

---

## 🏗️ FINAL TECH STACK (LOCKED)

| Layer | Technology | Free Tier |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel 6000 build-min/mo |
| Styling | Tailwind CSS + shadcn/ui | Free forever |
| Database | Supabase PostgreSQL | 500MB + 50k MAU |
| Auth | Supabase Auth (Email OTP) | 50k MAU |
| Backend | Supabase Edge Functions | 500k invocations/mo |
| Real-time | Supabase Realtime | Included |
| Media CDN | Cloudinary | 25 credits/mo |
| Email | Resend | 3k emails/mo 100/day |
| Rate Limiting | Upstash Redis | 500k cmds/mo |
| Push Notifications | OneSignal | 10k subscribers free |
| Cron Jobs | Supabase pg_cron | Free (native Postgres) |
| PWA | @ducanh2912/next-pwa + Workbox | Free |
| Local DB | Dexie.js (IndexedDB) | Free (browser) |
| Payments | Paystack (Test Mode) | Free for demo |
| Analytics | Vercel Analytics + Umami | Free |
| Error Tracking | Sentry | 5k errors/mo |
| Hosting | Vercel | 100GB bandwidth/mo |

---

## 🔐 SECURITY LAYERS (ALL 10 MUST REMAIN INTACT)

L1  Zod input validation on ALL API inputs
L2  Supabase OTP auth (no passwords stored)
L3  JWT 15-min access / 7-day refresh HttpOnly cookies
L4  Supabase RLS policies — DB-level enforcement
L5  Upstash rate limiting in middleware.ts
L6  Paystack HMAC-SHA512 webhook verification
L7  paystack_reference UNIQUE constraint (no double charges)
L8  All secrets in Vercel/Supabase env vaults
L9  next.config.ts security headers (CSP HSTS X-Frame)
L10 CORS — whitelist only vercel domain

---

## 📊 CURRENT STATUS

[x] Session 1 — Brainstorming & Strategy Complete
[x] Session 1 — Tech Stack Decided
[x] Session 1 — Free Tier Optimization Mapped
[x] Session 1 — PWA Architecture Designed
[x] Session 1 — Security Architecture Designed
[x] Session 1 — DB Schema Designed
[x] Session 1 — Brain System Created
[ ] Session 2 — Project Scaffolding (Next.js + Supabase setup)
[ ] Session 2 — Database Schema SQL + RLS Policies
[ ] Session 2 — Auth System (OTP login)
[ ] Session 3 — Core Features (Circles Memberships Invite links)
[ ] Session 4 — Payments (Paystack integration)
[ ] Session 5 — Glass Ledger + Realtime
[ ] Session 6 — PWA + Offline Layer + AI Trust Score
[ ] Session 7 — Polish + Docs + Deploy + Video

---

## 🗓️ 7-DAY SPRINT PLAN

| Day | Focus | Status |
|---|---|---|
| Day 1 | Scaffold + DB Schema + Auth + GitHub setup | NEXT |
| Day 2 | Circles CRUD + Invite system + Memberships | TODO |
| Day 3 | Paystack payments + Edge Functions + Webhooks | TODO |
| Day 4 | Glass Ledger + Supabase Realtime | TODO |
| Day 5 | PWA + Service Worker + Dexie.js offline layer | TODO |
| Day 6 | AI Trust Score + UI Polish + Security headers | TODO |
| Day 7 | Docs + Vercel deploy + Demo video + Submit | TODO |

---

## 🔗 KEY LINKS (Update as project grows)

| Resource | URL |
|---|---|
| GitHub Repo | https://github.com/nuhu-lawal20/ajo_savings_tracker |
| Vercel Deploy | TBD — deploy on Day 7 |
| Supabase Project | https://teknpdpogjqipurpgofk.supabase.co |
| Demo Video | TBD — record on Day 7 |

---

## ARCHITECTURAL RULES (NEVER VIOLATE)

1. Admin never touches money — escrow enforced architecturally
2. RLS at database layer — not just middleware
3. BVN never stored raw — hash only or verify-and-discard
4. Paystack ref = idempotency key — UNIQUE constraint in DB
5. Webhook HMAC — always verify x-paystack-signature
6. Secrets in env vars — never in source code never committed
