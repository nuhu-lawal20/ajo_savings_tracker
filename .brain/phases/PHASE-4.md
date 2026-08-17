# PHASE 4 — CORE FEATURES: CIRCLES
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: Users can create circles, generate invite links, and join circles.
Depends on: Phase 3 APPROVED | Blocks: Phase 5

## CHECKLIST
- [x] P4.1  Create Zod schemas for circle (name, description, amount, frequency, max_members)
- [x] P4.2  Create API: POST /api/circles (create circle + auto-assign creator as member pos 1)
- [x] P4.3  Create API: GET /api/circles (list circles where user is member or creator)
- [x] P4.4  Create API: GET /api/circles/[id] (circle detail + memberships + transactions)
- [x] P4.5  Create circles list page: src/app/(dashboard)/circles/page.tsx
- [x] P4.6  Create circle creation page: src/app/(dashboard)/circles/create/page.tsx
- [x] P4.7  Create CircleCard component: name, amount, frequency pill, member avatars, status badge
- [x] P4.8  Implement invite link: unique invite_code per circle, URL = /join/[code]
- [x] P4.9  Create public join page: src/app/join/[code]/page.tsx (no auth required to view)
- [x] P4.10 Create API: POST /api/circles/join (validate code -> check capacity -> assign position)
- [x] P4.11 Implement payout position algorithm:
             trust_score < 40 -> last available slots
             trust_score 40-69 -> middle slots
             trust_score >= 70 -> any slot (first-come basis)
- [x] P4.12 Create circle detail page: src/app/(dashboard)/circles/[id]/page.tsx
- [x] P4.13 Create MemberList component: avatar, name, position, paid/unpaid badge
- [x] P4.14 Create PayoutSchedule component: visual timeline (who gets paid when)
- [x] P4.15 Create invite share button: copies link to clipboard + share modal
- [x] P4.16 Create API: PATCH /api/circles/[id]/start (admin-only, pending -> active)
- [x] P4.17 Cache & data integrity on Supabase + Redis rate limiters
- [x] P4.18 Public invite link accepts code or URL path
- [x] P4.19 RLS enforced on circles and memberships
- [x] P4.20 git commit: "feat: circles CRUD, invite links, and membership system"

## GATE CRITERIA (ALL must be TRUE before Phase 5 starts)
- [x] GATE-4A User can create a circle with all fields validated by Zod
- [x] GATE-4B Invite link is unique per circle and shareable
- [x] GATE-4C Second user can join via invite link
- [x] GATE-4D Payout position assigned correctly by trust score tier
- [x] GATE-4E Circle detail shows correct member list and payout order
- [x] GATE-4F Circle admin can activate a circle (pending -> active)
- [x] GATE-4G RLS verified: non-members cannot access circle data

## DEFERRED FROM THIS PHASE
- [~] DEFER-4A (-> Phase 5): Pay Now button on circle detail page
      Reason: Requires Paystack integration
- [~] DEFER-4B (-> Phase 6): Real-time member join updates (live new member notification)
      Reason: Requires Supabase Realtime setup
- [~] DEFER-4C (-> Phase 7): Offline circle viewing from IndexedDB
      Reason: Requires Dexie.js setup
- [~] DEFER-4D (-> Phase 5): Daily payout check cron job
      Reason: Payout logic is part of payment integration
