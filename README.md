<p align="center">
  <img src="public/icons/icon-512.png" alt="Alajo Logo" width="120" height="120" />
</p>

<h1 align="center">Alajo — Digital Savings Circle</h1>

<p align="center">
  <strong>Offline-first PWA digitalizing Nigerian rotating savings (Ajo / Esusu / Adashe)</strong><br/>
  with real-time transparent ledgers, Paystack escrow, and AI trust scoring.
</p>

<p align="center">
  <a href="https://github.com/nuhu-lawal20/ajo_savings_tracker"><img src="https://img.shields.io/badge/GitHub-Public-black?logo=github" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/Paystack-Escrow-00C3F7?logo=paystack" />
  <img src="https://img.shields.io/badge/PWA-Offline--First-5A0FC8?logo=pwa" />
  <img src="https://img.shields.io/badge/3MTT-NextGen%20Capstone-green" />
</p>

---

## 🇳🇬 The Problem

Over **40 million Nigerians** participate in rotating savings groups (*Ajo*, *Esusu*, *Adashe*) — pooling money weekly or monthly so each member receives a lump sum in turn. These pools lose **₦2+ billion annually** to:

- Admin theft and fund mismanagement (zero custody audit trail)
- Late/missed payments with no automated enforcement
- Trust disputes between members (no reputation system)
- No digital record — everything is verbal or paper-based
- Mobile internet gaps in underserved communities

**Alajo** solves this with programmatic trust — moving every naira through verified Paystack escrow, exposing every event on a real-time transparent ledger, and computing an AI trust score for every member from their payment history.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Passwordless Auth** | Email OTP via Supabase — no password to forget |
| **Savings Circles** | Create or join rotating pools with 2–20 members |
| **AI Trust Score** | Postgres algorithm: +5 on-time, +10 full cycle, -25 default |
| **Payout Priority** | Score ≥70 → priority slots; 40–69 → mid; <40 → last |
| **Paystack Escrow** | Zero admin custody — all money flows through Paystack |
| **Real-Time Ledger** | Supabase Realtime: every payment broadcasts live to all members |
| **Invite Links** | Shareable `/join/ALAJO-XXXX` invite codes |
| **Offline-First PWA** | Service worker + Dexie.js IndexedDB — works without internet |
| **Install Prompt** | "Add to Home Screen" native app experience |
| **Cloudinary Avatars** | Face-crop CDN avatars with server-side upload |
| **Rate Limiting** | Upstash Redis sliding window — 5 auth requests / 15 min |
| **Row Level Security** | PostgreSQL RLS — users can only see their own data |
| **HMAC Webhooks** | SHA-512 signature verification on every Paystack event |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui (Base UI) |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (Email OTP / PKCE) |
| **Realtime** | Supabase Realtime (postgres_changes) |
| **Payments** | Paystack Inline v1 + Webhooks |
| **Rate Limiting** | Upstash Redis |
| **Media CDN** | Cloudinary |
| **Offline** | @ducanh2912/next-pwa + Dexie.js (IndexedDB) |
| **Error Tracking** | Sentry |
| **Analytics** | Vercel Analytics + Speed Insights |
| **Hosting** | Vercel |
| **Cron Jobs** | Supabase pg_cron |

---

## 🗄 Database Architecture

```
profiles         → mirrors auth.users + trust_score + kyc_tier + avatar_url
circles          → name, amount, frequency, invite_code, status, current_round
memberships      → circle_id × user_id, payout_position, has_paid_current_round
transactions     → amount, type (contribution/payout/penalty), paystack_reference (UNIQUE)
```

All 4 tables have **Row Level Security enabled**. Users can only read/write their own data.

---

## 🔐 Security Architecture (10 Layers)

1. **RLS** — PostgreSQL Row Level Security on all tables
2. **PKCE** — Supabase Auth with Proof Key for Code Exchange
3. **Rate Limiting** — Upstash Redis sliding window (auth endpoints)
4. **HMAC-SHA512** — Paystack webhook signature verification
5. **Zod Validation** — Every API route validates with Zod schemas
6. **Service Role Isolation** — Admin client only used in webhook handler
7. **UNIQUE Constraint** — `paystack_reference` prevents double-processing
8. **CSP Headers** — Content-Security-Policy in next.config.ts
9. **Env Isolation** — All secrets in `.env.local` (gitignored)
10. **Sentry PII Scrubbing** — Email removed from error events in `beforeSend`

---

## 🚀 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/nuhu-lawal20/ajo_savings_tracker.git
cd ajo_savings_tracker

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy environment variables
cp .env.example .env.local
# Then fill in all values — see .env.example for descriptions

# 4. Run database migrations (requires Supabase CLI or MCP)
# OR apply migrations in Supabase dashboard SQL editor

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Environment Variables

See [`.env.example`](.env.example) for all required variables with descriptions. Key services:

- **Supabase** — Database, Auth, Realtime
- **Paystack** — Payment processing (use test keys locally)
- **Upstash Redis** — Rate limiting
- **Cloudinary** — Avatar CDN
- **Sentry** — Error tracking

---

## 📱 PWA Installation

1. Open the app on mobile Chrome/Safari
2. Tap the "Add Alajo to Home Screen" prompt (appears automatically)
3. App works offline — circles and transactions cached in IndexedDB
4. Offline actions queue and sync automatically on reconnect

---

## 🧪 Test Payments (Paystack Test Mode)

Use Paystack's Nigerian test card:

```
Card: 4084 0840 8408 4081
Expiry: any future date
CVV: any 3 digits
PIN: 1234
OTP: 123456
```

---

## 🏗 Architecture Overview

```
Browser (PWA)
  └─ Next.js App Router (Vercel Edge)
       ├─ (auth) — signup / login / verify (OTP)
       ├─ (dashboard) — circles / profile / transactions
       ├─ join/[code] — public invite landing page
       └─ api/
            ├─ circles / circles/join / circles/[id]/start
            ├─ contributions  → creates Paystack reference
            ├─ upload         → Cloudinary signed upload
            └─ webhooks/paystack → HMAC verify → round rotation

Supabase PostgreSQL
  ├─ RLS on all tables
  ├─ pg_cron: nightly trust score + keep-alive
  └─ Realtime: transactions + memberships broadcast

Paystack
  └─ Inline popup → reference → webhook → confirm → advance round
```

---

## 👨‍💻 Fellow Information

| Field | Value |
|---|---|
| **Fellow Name** | Nuhu Lawal |
| **Fellow ID** | FE/23/84783109 |
| **Email** | nuhulawal20@gmail.com |
| **State** | Kaduna |
| **ALC** | Almara Hub - Paragon Nigeria |
| **Track** | 3MTT NextGen Capstone |

---

## 📄 License

MIT — Open source for the Nigerian developer community.

---

<p align="center">Built with ❤️ for the 3MTT NextGen Capstone Fellowship</p>
