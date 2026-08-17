# PHASE 5 — PAYMENTS & EDGE FUNCTIONS
Status: LOCKED | Gate: PENDING
Goal: Members can pay via Paystack. Webhooks verified. Payout status tracked.
Depends on: Phase 4 APPROVED | Blocks: Phase 6

## CHECKLIST
- [ ] P5.1  Install: npm install react-paystack
- [ ] P5.2  Create Edge Function: supabase/functions/verify-payment/index.ts
             Accepts: {reference, membership_id, circle_id}
             Calls Paystack API -> updates transaction in DB using service role
- [ ] P5.3  Create Edge Function: supabase/functions/paystack-webhook/index.ts
             Verifies HMAC-SHA512 from x-paystack-signature header
             Handles charge.success -> marks transaction confirmed
             Returns 200 immediately (Paystack requires fast ack)
- [ ] P5.4  Deploy Edge Functions: npx supabase functions deploy
- [ ] P5.5  Configure Paystack webhook URL in Paystack Dashboard:
             URL: https://[ref].supabase.co/functions/v1/paystack-webhook
- [ ] P5.6  Create PaymentButton component: Paystack popup with test public key
             On success -> calls verify-payment Edge Function
- [ ] P5.7  Add PaymentButton to circle detail page
             Visible only: circle is active AND user has not paid current round
- [ ] P5.8  Create API: POST /api/contributions (create pending transaction before popup)
- [ ] P5.9  Create transaction history page: src/app/(dashboard)/transactions/page.tsx
- [ ] P5.10 Create TransactionItem component: status badge (confirmed/pending/failed)
- [ ] P5.11 Add paystack_plan_code column to circles table (resolves DEFER-2A)
- [ ] P5.12 Schedule daily payout check cron in Supabase (resolves DEFER-4D and DEFER-2C)
- [ ] P5.13 Schedule weekly reminder cron: Resend email + OneSignal push to pending members
- [ ] P5.14 TEST: Make test payment -> verify webhook fires -> check DB updated
- [ ] P5.15 TEST: Pay twice with same reference -> confirm UNIQUE constraint blocks it
- [ ] P5.16 TEST: Send invalid webhook signature -> confirm 401 returned
- [ ] P5.17 git commit: "feat: Paystack integration, Edge Functions, webhook verification"

## GATE CRITERIA (ALL must be TRUE before Phase 6 starts)
- [ ] GATE-5A Paystack popup opens with test card 4084 0840 8408 4081
- [ ] GATE-5B Payment creates confirmed transaction in DB
- [ ] GATE-5C Webhook verifies HMAC signature correctly
- [ ] GATE-5D Duplicate reference rejected by UNIQUE constraint
- [ ] GATE-5E Invalid webhook signature returns 401
- [ ] GATE-5F Transaction history page shows correct records

## DEFERRED FROM THIS PHASE (POST-MVP V2 only)
- [~] DEFER-5A (-> V2): Real Paystack disbursement to recipient bank account
      Reason: Requires verified Paystack business account + real KYC
- [~] DEFER-5B (-> V2): Monnify DVA per circle (dedicated virtual accounts)
      Reason: Requires Monnify business verification
- [~] DEFER-5C (-> V2): NIBSS/GSI auto-debit mandate on circle join
      Reason: Requires CBN-licensed partner API
