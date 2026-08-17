# PHASE 8 — AI TRUST SCORE & UI POLISH
Status: LOCKED | Gate: PENDING
Goal: Trust Score animated, UI polished, media integrated, observability active.
Depends on: Phase 7 APPROVED | Blocks: Phase 9

## CHECKLIST
- [ ] P8.1  Verify nightly trust score cron is running (check cron.job_run_details)
- [ ] P8.2  Create TrustScoreGauge: src/components/trust/TrustScoreGauge.tsx
             SVG arc gauge 0-100 | Red 0-39 | Amber 40-69 | Green 70-100
             CSS animation on page load (arc draws itself)
- [ ] P8.3  Add Trust Score + explanation tooltip to profile page
- [ ] P8.4  Add Trust Score mini-badge to navbar avatar
- [ ] P8.5  Show trust score impact on join page (which position tier user qualifies for)
- [ ] P8.6  Create upload API: POST /api/upload (server-side signed Cloudinary upload)
             Validates: image/* only, max 2MB | Signs with Cloudinary preset (200x200 face-crop)
- [ ] P8.7  Add avatar upload to profile page
- [ ] P8.8  Update all avatar displays to use Cloudinary CDN URLs
- [ ] P8.9  Initialize Sentry: npx @sentry/wizard@latest -i nextjs
- [ ] P8.10 Add Sentry PII scrubbing: remove email from error events in beforeSend
- [ ] P8.11 Add Vercel Analytics to layout.tsx (import Analytics from @vercel/analytics)
- [ ] P8.12 Add Umami Analytics to layout.tsx (lazyOnload script)
- [ ] P8.13 Set up OneSignal web push:
             Add OneSignal service worker snippet
             Request permission on dashboard load (non-intrusive, deferred)
             Wire up notifyPayout() and notifyContributionDue()
- [ ] P8.14 Add security headers to next.config.ts:
             Content-Security-Policy | X-Frame-Options: DENY
             Strict-Transport-Security | X-Content-Type-Options: nosniff
- [ ] P8.15 UI Polish: Mobile responsiveness audit (375px, 390px, 414px widths)
- [ ] P8.16 UI Polish: Loading skeletons for all async data sections
- [ ] P8.17 UI Polish: Empty states (no circles | no transactions | no members)
- [ ] P8.18 UI Polish: Error boundary for graceful failures
- [ ] P8.19 Run npm run build: must be zero TypeScript errors, zero warnings
- [ ] P8.20 git commit: "feat: trust score gauge, Cloudinary avatars, push notifs, UI polish"

## GATE CRITERIA (ALL must be TRUE before Phase 9 starts)
- [ ] GATE-8A Trust score gauge animates correctly on profile page
- [ ] GATE-8B Score changes payout position eligibility correctly
- [ ] GATE-8C Profile photo uploads to Cloudinary and displays
- [ ] GATE-8D Sentry captures a manually triggered test error
- [ ] GATE-8E App fully responsive at 375px (iPhone SE)
- [ ] GATE-8F All empty states have messaging (no blank pages)
- [ ] GATE-8G npm run build passes with zero errors

## DEFERRED FROM THIS PHASE
- [~] DEFER-8A (-> V2): KYC Tier 2 BVN verification via Dojah API
      Reason: Paid API + CBN compliance — out of MVP scope
- [~] DEFER-8B (-> V2): AI chatbot for payment dispute resolution
      Reason: LLM API costs — V2 feature

---

# PHASE 9 — DOCUMENTATION & CODE CLEANUP
Status: LOCKED | Gate: PENDING
Goal: Code clean. Docs publication-ready. GitHub impressive for judges.
Depends on: Phase 8 APPROVED | Blocks: Phase 10

## CHECKLIST
- [ ] P9.1  Generate Supabase TypeScript types (resolves DEFER-1A + DEFER-2D):
             npx supabase gen types typescript --project-id [ref] > src/types/database.types.ts
- [ ] P9.2  Write README.md (most important file):
             Banner image | Problem statement | Live URL | Video link
             Feature list + screenshots | Tech stack badges
             Install guide | .env guide | Security summary | Roadmap | Fellow info
- [ ] P9.3  Write SECURITY.md: all 10 security layers, RLS rationale, webhook flow, env policy
- [ ] P9.4  Write API.md: document every route (method, URL, body, response, auth required)
- [ ] P9.5  Write ARCHITECTURE.md: system diagram, data flow, tech stack justification
- [ ] P9.6  Add CONTRIBUTING.md (shows professionalism to judges)
- [ ] P9.7  Code cleanup: remove ALL console.log statements (use structured logging)
- [ ] P9.8  Code cleanup: resolve or file-as-issue all TODO comments
- [ ] P9.9  Run ESLint: fix ALL warnings and errors
- [ ] P9.10 Run Prettier: format all files
- [ ] P9.11 Confirm .env.example has all variables (no real values)
- [ ] P9.12 Security audit: verify every API route has Zod validation
- [ ] P9.13 Security audit: verify every DB table still has RLS enabled
- [ ] P9.14 Take UI screenshots for README (desktop + mobile views)
- [ ] P9.15 Final npm run build: must pass with zero errors and zero warnings
- [ ] P9.16 git commit: "docs: README, SECURITY, API, ARCHITECTURE documentation"

## GATE CRITERIA (ALL must be TRUE before Phase 10 starts)
- [ ] GATE-9A README.md complete with all sections, screenshots, and links
- [ ] GATE-9B SECURITY.md explains all 10 security layers
- [ ] GATE-9C API.md documents every API route
- [ ] GATE-9D npm run build passes with zero errors
- [ ] GATE-9E ESLint reports zero errors
- [ ] GATE-9F All deferred items resolved OR explicitly documented in DEFERRED.md

## DEFERRED FROM THIS PHASE
NONE — this is the cleanup phase, all deferrals should be resolved or documented

---

# PHASE 10 — DEPLOYMENT, DEMO VIDEO & SUBMISSION
Status: LOCKED | Gate: PENDING
Goal: App live on Vercel. Demo video recorded. 3MTT form submitted.
Depends on: Phase 9 APPROVED | Blocks: NOTHING (finish line!)

## CHECKLIST
- [ ] P10.1  Connect GitHub repo to Vercel (import project)
- [ ] P10.2  Add ALL environment variables to Vercel dashboard
- [ ] P10.3  Trigger first Vercel deployment
- [ ] P10.4  Verify deployed app loads on vercel URL
- [ ] P10.5  TEST on production: signup -> OTP -> create circle -> invite -> join -> pay -> ledger
- [ ] P10.6  Update README.md with actual Vercel URL
- [ ] P10.7  Update BRAIN.md KEY LINKS with Vercel URL
- [ ] P10.8  Configure Paystack webhook to production Supabase Edge Function URL
- [ ] P10.9  Run Lighthouse on production URL: target >= 90 all categories
- [ ] P10.10 Record demo video (Loom or OBS), 3-5 minutes:
              signup | create circle | invite link | join | pay | Glass Ledger | Trust Score
- [ ] P10.11 Upload video (YouTube unlisted or Loom — anyone with link)
- [ ] P10.12 Verify video URL opens without login required
- [ ] P10.13 Final GitHub check: repo is PUBLIC, README has all links
- [ ] P10.14 SUBMIT 3MTT form with:
              Fellow: Nuhu Lawal | ID: FE/23/84783109 | Email: nuhulawal20@gmail.com
              State: Kaduna | ALC: Almara Hub - Paragon Nigeria
              Title: Alajo Digital Savings Circle
              Project link: [GitHub URL] | Video: [YouTube/Loom URL]
- [ ] P10.15 Screenshot submission confirmation -> save to .brain/
- [ ] P10.16 Update BRAIN.md status to: SUBMITTED
- [ ] P10.17 Write final diary entry celebrating completion

## GATE CRITERIA (DONE = PROJECT SUBMITTED)
- [ ] GATE-10A Vercel production URL is live and accessible to anyone
- [ ] GATE-10B Demo video is publicly accessible without login
- [ ] GATE-10C GitHub repo is public with complete README
- [ ] GATE-10D 3MTT submission form submitted successfully
- [ ] GATE-10E Screenshot of submission confirmation saved to .brain/
