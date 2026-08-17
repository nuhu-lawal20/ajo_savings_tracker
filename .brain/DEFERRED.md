# ALAJO — DEFERRED ITEMS TRACKER
> Items that could NOT be completed in their original phase due to dependencies.
> Every item here MUST be resolved before Phase 9 gate is approved — or explicitly marked V2.
> Updated: 2026-08-13

---

## FORMAT
DEFER-ID | Original Phase | Target Phase | Item | Reason | Status

---

## OPEN DEFERRALS

| ID | From | Resolve In | Item | Reason | Status |
|---|---|---|---|---|---|
| DEFER-1A | Phase 1 | Phase 9 | Generate Supabase TypeScript types via CLI | DB schema must be stable first | OPEN |
| DEFER-2A | Phase 2 | Phase 5 | Add paystack_plan_code to circles table | Paystack plan code only exists post-integration | OPEN |
| DEFER-2B | Phase 2 | V2 | Add monnify_account_number to circles table | Requires Monnify business verification | V2 - ACCEPTED |
| DEFER-2C | Phase 2 | Phase 5 | Schedule daily payout check cron | Payout logic must exist before scheduling | OPEN |
| DEFER-2D | Phase 2 | Phase 9 | Generate TypeScript types from schema | Schema must be stable | OPEN (same as DEFER-1A) |
| DEFER-3A | Phase 3 | V2 | KYC Tier 2 BVN verification via Dojah API | Paid API + CBN compliance out of MVP scope | V2 - ACCEPTED |
| DEFER-3B | Phase 3 | Phase 8 | Profile photo upload to Cloudinary | Auth must work first; photo is polish | OPEN |
| DEFER-4A | Phase 4 | Phase 5 | Pay Now button on circle detail page | Requires Paystack integration | OPEN |
| DEFER-4B | Phase 4 | Phase 6 | Real-time member join updates | Requires Supabase Realtime | OPEN |
| DEFER-4C | Phase 4 | Phase 7 | Offline circle viewing from IndexedDB | Requires Dexie.js setup | OPEN |
| DEFER-4D | Phase 4 | Phase 5 | Daily payout check cron | Payout logic is part of payment integration | OPEN |
| DEFER-5A | Phase 5 | V2 | Real Paystack disbursement to bank account | Requires verified business + real KYC | V2 - ACCEPTED |
| DEFER-5B | Phase 5 | V2 | Monnify DVA per circle | Requires Monnify business verification | V2 - ACCEPTED |
| DEFER-5C | Phase 5 | V2 | NIBSS/GSI auto-debit mandate | Requires CBN-licensed partner API | V2 - ACCEPTED |
| DEFER-6A | Phase 6 | Phase 7 | GlassLedger offline cache display | Requires Dexie.js | OPEN |
| DEFER-7A | Phase 7 | V2 | Background sync for offline payments | Payments MUST be online (financial integrity) | V2 - ACCEPTED |
| DEFER-8A | Phase 8 | V2 | KYC Tier 2 BVN verification | Paid API + CBN out of scope | V2 - ACCEPTED |
| DEFER-8B | Phase 8 | V2 | AI chatbot for payment disputes | LLM API costs — V2 feature | V2 - ACCEPTED |

---

## RESOLVED DEFERRALS

| ID | Resolved In | How It Was Resolved |
|---|---|---|
| (none yet — will be updated as phases complete) | | |

---

## V2 ROADMAP (Post-Submission)
These items are intentionally out of MVP scope:
- BVN verification via Dojah API (KYC Tier 2)
- Real Paystack bank disbursements
- Monnify DVA (dedicated virtual accounts per circle)
- NIBSS/GSI auto-debit mandates
- AI chatbot for dispute resolution
- Background payment sync (offline payments)
