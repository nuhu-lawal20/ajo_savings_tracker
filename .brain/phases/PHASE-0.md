# PHASE 0 — PRE-DEVELOPMENT SETUP
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: All accounts created, all API keys obtained. No code written.
Depends on: Nothing | Blocks: Phase 1

## CHECKLIST
- [x] P0.1  Create GitHub repo: alajo-savings (PUBLIC, Node .gitignore)
- [x] P0.2  Clone repo to C:\Users\USER\Documents\capstone\alajo\
- [x] P0.3  Create Supabase project named alajo-savings (save DB password!)
- [x] P0.4  Copy Supabase URL + anon key + service_role key to .env.local
- [x] P0.5  Log Supabase URL in BRAIN.md KEY LINKS section
- [x] P0.6  Create Cloudinary account — copy cloud_name, api_key, api_secret to .env.local
- [x] P0.7  Create Resend account — copy API key to .env.local
- [x] P0.8  Create Upstash Redis DB — copy REST URL + token to .env.local
- [x] P0.9  Create Paystack account (test mode) — copy public + secret keys to .env.local
- [x] P0.10 Create OneSignal account — copy App ID + REST key to .env.local
- [x] P0.11 Create Vercel account — connect to GitHub
- [x] P0.12 Create Sentry project (Next.js) — copy DSN to .env.local
- [x] P0.13 Create .env.example with ALL variable names (zero real values)
- [x] P0.14 Verify .gitignore includes: .env.local, .env, .env*.local

## GATE CRITERIA (ALL must be TRUE before Phase 1 starts)
- [x] GATE-0A GitHub repo exists and is PUBLIC
- [x] GATE-0B Supabase project is active (green status)
- [x] GATE-0C .env.local has ALL required keys populated
- [x] GATE-0D .env.example committed with no real values
- [x] GATE-0E .gitignore confirmed — git status does NOT show .env.local

## DEFERRED FROM THIS PHASE
NONE — this phase has no upstream dependencies
