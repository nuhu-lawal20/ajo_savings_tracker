# ALAJO — NEXT ACTIONS
> THIS IS THE FIRST FILE AFTER BRAIN.md IN EVERY SESSION.
> Updated: 2026-08-17 (Phase 7 APPROVED -> Phase 8 Active)
> Current Phase: 8 — IN PROGRESS

---

## ACTIVE PHASE: PHASE 8 — AI TRUST SCORE & UI POLISH
Read: .brain/phases/PHASE-8-9.md for full checklist

### WHAT TO DO RIGHT NOW (in this exact order):

STEP 1 — Create GitHub Repo
  Action: Go to github.com -> New Repository
  Name: alajo-savings
  Visibility: PUBLIC (mandatory for submission)
  .gitignore: Node
  Do NOT initialize with README (we write our own)
  After: Copy repo URL -> paste into BRAIN.md KEY LINKS

STEP 2 — Create Supabase Project
  Action: Go to supabase.com -> New Project
  Name: alajo-savings
  SAVE the DB password in a password manager
  Region: Europe West (closest to Nigeria with free tier)
  After: Copy Project URL, anon key, service_role key

STEP 3 — Create All Other Accounts
  Cloudinary: cloudinary.com -> Free account
  Resend: resend.com -> Free account
  Upstash: upstash.com -> Free Redis DB
  Paystack: paystack.com -> Test mode keys
  OneSignal: onesignal.com -> Web Push app
  Vercel: vercel.com -> Connect to GitHub
  Sentry: sentry.io -> New Next.js project

STEP 4 — Collect All Keys to .env.local
  Create C:\Users\USER\Documents\capstone\alajo\.env.local
  Paste all keys (see .env.example template for variable names)
  NEVER commit this file (it is in .gitignore)

STEP 5 — Verify Phase 0 Gates
  Read PHASE-0.md gate criteria
  Confirm ALL gates are TRUE before starting Phase 1

---

## PHASE PROGRESSION RULES (NEVER SKIP)

1. Complete ALL checklist items in current phase file
2. Verify ALL gate criteria are TRUE
3. Any item that cannot be done now -> log in DEFERRED.md with reason
4. Update the phase file: change status from NOT STARTED to COMPLETE
5. Update PHASES.md: mark phase COMPLETE, unlock next phase
6. Update BRAIN.md: tick off completed items in status section
7. Append to PROGRESS.md: what was done this session
8. Update THIS FILE: set next phase as active
9. Write diary entry in .brain/diary/YYYY/MM/YYYY-MM-DD-alajo.md
10. Git commit the .brain updates

---

## FULL PHASE SCHEDULE

Phase 0 — Pre-Development Setup (ACTIVE)
Phase 1 — Project Scaffolding
Phase 2 — Database & Security Foundation
Phase 3 — Authentication System
Phase 4 — Core Features Circles
Phase 5 — Payments & Edge Functions
Phase 6 — Real-Time Glass Ledger
Phase 7 — PWA & Offline Layer
Phase 8 — AI Trust Score & UI Polish
Phase 9 — Documentation & Code Cleanup
Phase 10 — Deployment Demo Video Submission

Each phase file: .brain/phases/PHASE-[N].md

---

## DEFERRED ITEMS TRACKER
File: .brain/DEFERRED.md
Always check this after each phase to see what should now be resolved.

---

## NOTES FOR AGENT
- Project root: C:\Users\USER\Documents\capstone\alajo\
- Brain root: C:\Users\USER\Documents\capstone\alajo\.brain\
- Run boot script to reload context: powershell -File .brain\BOOT_SESSION.ps1
- ALL decisions -> DECISIONS.md | ALL problems -> PROBLEMS.md
- Check DEFERRED.md when starting each phase (items targeting that phase)
