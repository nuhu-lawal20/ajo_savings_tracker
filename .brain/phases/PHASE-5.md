# PHASE 5 — PAYMENTS & EDGE FUNCTIONS
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: Members can pay via Paystack. Webhooks verified. Payout status tracked.
Depends on: Phase 4 APPROVED | Blocks: Phase 6

## CHECKLIST
- [x] P5.1  Install: npm install react-paystack
- [x] P5.2  Create Supabase Admin client: src/lib/supabase/admin.ts
- [x] P5.3  Create Paystack webhook handler: src/app/api/webhooks/paystack/route.ts
             Verifies HMAC-SHA512 from x-paystack-signature header
             Handles charge.success -> marks transaction confirmed
             Calculates trust score and advances round rotation
             Returns 200 immediately
- [x] P5.4  Configure Paystack keys in .env.local
- [x] P5.5  Configure webhook handler route in Next.js backend
- [x] P5.6  Create PaymentButton component: src/components/payments/PaymentButton.tsx (Paystack inline popup)
- [x] P5.7  Add PaymentButton to circle detail page
             Visible only: circle is active AND user has not paid current round
- [x] P5.8  Create API: POST /api/contributions (create pending transaction with unique Paystack reference)
- [x] P5.9  Create transaction history page: src/app/(dashboard)/transactions/page.tsx
- [x] P5.10 Display transaction badges (confirmed/pending/failed)
- [x] P5.11 paystack_plan_code included in circles schema
- [x] P5.12 Schedule keep-alive & trust score calculation crons in Supabase
- [x] P5.13 Type-safe API error handling & transaction state transitions
- [x] P5.14 Zero admin custody — funds escrowed via Paystack
- [x] P5.15 Unique paystack_reference constraint enforced
- [x] P5.16 Verified HMAC signature security on webhook
- [x] P5.17 git commit: "feat: Paystack integration, Edge Functions, webhook verification"

## GATE CRITERIA (ALL must be TRUE before Phase 6 starts)
- [x] GATE-5A Paystack popup configured with test keys
- [x] GATE-5B Payment creates confirmed transaction in DB
- [x] GATE-5C Webhook verifies HMAC signature correctly
- [x] GATE-5D Duplicate reference rejected by UNIQUE constraint
- [x] GATE-5E Invalid webhook signature returns 401
- [x] GATE-5F Transaction history page shows correct records

## DEFERRED FROM THIS PHASE (POST-MVP V2 only)
- [~] DEFER-5A (-> V2): Real Paystack disbursement to recipient bank account
      Reason: Requires verified Paystack business account + real KYC
- [~] DEFER-5B (-> V2): Monnify DVA per circle (dedicated virtual accounts)
      Reason: Requires Monnify business verification
- [~] DEFER-5C (-> V2): NIBSS/GSI auto-debit mandate on circle join
      Reason: Requires CBN-licensed partner API
