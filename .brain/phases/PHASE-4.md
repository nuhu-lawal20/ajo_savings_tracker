# PHASE 4 — CORE FEATURES: CIRCLES
Status: LOCKED | Gate: PENDING
Goal: Users can create circles, generate invite links, and join circles.
Depends on: Phase 3 APPROVED | Blocks: Phase 5

## CHECKLIST
- [ ] P4.1  Create Zod schemas for circle (name, description, amount, frequency, max_members)
- [ ] P4.2  Create API: POST /api/circles (create circle + auto-assign creator as member pos 1)
- [ ] P4.3  Create API: GET /api/circles (list circles where user is member or creator)
- [ ] P4.4  Create API: GET /api/circles/[id] (circle detail + memberships + transactions)
- [ ] P4.5  Create circles list page: src/app/(dashboard)/circles/page.tsx
- [ ] P4.6  Create circle creation page: src/app/(dashboard)/circles/create/page.tsx
- [ ] P4.7  Create CircleCard component: name, amount, frequency pill, member avatars, status badge
- [ ] P4.8  Implement invite link: unique invite_code per circle, URL = /join/[code]
- [ ] P4.9  Create public join page: src/app/join/[code]/page.tsx (no auth required to view)
- [ ] P4.10 Create API: POST /api/circles/join (validate code -> check capacity -> assign position)
- [ ] P4.11 Implement payout position algorithm:
             trust_score < 40 -> last available slots
             trust_score 40-69 -> middle slots
             trust_score >= 70 -> any slot (first-come basis)
- [ ] P4.12 Create circle detail page: src/app/(dashboard)/circles/[id]/page.tsx
- [ ] P4.13 Create MemberList component: avatar, name, position, paid/unpaid badge
- [ ] P4.14 Create PayoutSchedule component: visual timeline (who gets paid when)
- [ ] P4.15 Create invite share button: copies link to clipboard + share modal
- [ ] P4.16 Create API: PATCH /api/circles/[id]/start (admin-only, pending -> active)
- [ ] P4.17 Cache circle members in Upstash Redis (5-min TTL key: circle:members:[id])
- [ ] P4.18 TEST: User A creates circle -> copies invite -> User B joins via link
- [ ] P4.19 TEST: RLS verified — User C (not in circle) cannot see circle data
- [ ] P4.20 git commit: "feat: circles CRUD, invite links, and membership system"

## GATE CRITERIA (ALL must be TRUE before Phase 5 starts)
- [ ] GATE-4A User can create a circle with all fields validated by Zod
- [ ] GATE-4B Invite link is unique per circle and shareable
- [ ] GATE-4C Second user can join via invite link
- [ ] GATE-4D Payout position assigned correctly by trust score tier
- [ ] GATE-4E Circle detail shows correct member list and payout order
- [ ] GATE-4F Circle admin can activate a circle (pending -> active)
- [ ] GATE-4G RLS verified: non-members cannot access circle data

## DEFERRED FROM THIS PHASE
- [~] DEFER-4A (-> Phase 5): Pay Now button on circle detail page
      Reason: Requires Paystack integration
- [~] DEFER-4B (-> Phase 6): Real-time member join updates (live new member notification)
      Reason: Requires Supabase Realtime setup
- [~] DEFER-4C (-> Phase 7): Offline circle viewing from IndexedDB
      Reason: Requires Dexie.js setup
- [~] DEFER-4D (-> Phase 5): Daily payout check cron job
      Reason: Payout logic is part of payment integration
