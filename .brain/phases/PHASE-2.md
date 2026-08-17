# PHASE 2 — DATABASE & SECURITY FOUNDATION
Status: LOCKED | Gate: PENDING
Goal: All tables, RLS policies, and cron jobs live in Supabase.
Depends on: Phase 1 APPROVED | Blocks: Phase 3

## CHECKLIST
- [ ] P2.1  Open Supabase SQL Editor
- [ ] P2.2  Run Migration 001: Create profiles table (id, full_name, email, phone, kyc_tier, trust_score, etc.)
- [ ] P2.3  Run Migration 001: Create circles table (id, creator_id, name, contribution_amount, frequency, invite_code, status)
- [ ] P2.4  Run Migration 001: Create memberships table (user_id, circle_id, payout_position — UNIQUE user+circle)
- [ ] P2.5  Run Migration 001: Create transactions table (paystack_reference UNIQUE constraint)
- [ ] P2.6  Run Migration 002: Enable RLS on ALL 4 tables
- [ ] P2.7  Run Migration 002: RLS policy — profiles (own profile only: auth.uid() = id)
- [ ] P2.8  Run Migration 002: RLS policy — circles (member OR creator access)
- [ ] P2.9  Run Migration 002: RLS policy — memberships (own memberships only)
- [ ] P2.10 Run Migration 002: RLS policy — transactions (circle members only)
- [ ] P2.11 Run Migration 003: Create handle_new_user() trigger (auto-creates profile on auth signup)
- [ ] P2.12 Run Migration 003: Create calculate_trust_score(user_id) function
- [ ] P2.13 Enable pg_cron extension (Database -> Extensions -> pg_cron -> Enable)
- [ ] P2.14 Enable pg_net extension (Database -> Extensions -> pg_net -> Enable)
- [ ] P2.15 Run Migration 004: Schedule keep-alive cron (every 6 days at noon)
- [ ] P2.16 Run Migration 004: Schedule trust score recalculation (nightly 1:00 UTC)
- [ ] P2.17 TEST RLS: User A cannot see User B profile (returns empty, not error)
- [ ] P2.18 TEST RLS: User A cannot see circles they did not create or join
- [ ] P2.19 Save all SQL as files: supabase/migrations/001_*.sql through 004_*.sql
- [ ] P2.20 git commit: "feat: database schema with RLS, triggers, and pg_cron"

## GATE CRITERIA (ALL must be TRUE before Phase 3 starts)
- [ ] GATE-2A All 4 tables exist with correct columns and constraints
- [ ] GATE-2B RLS ENABLED on all 4 tables (lock icon visible in Supabase)
- [ ] GATE-2C All 4 RLS policies active and manually tested
- [ ] GATE-2D handle_new_user trigger fires correctly on new signup
- [ ] GATE-2E pg_cron keep-alive job scheduled (visible in cron.job table)
- [ ] GATE-2F Migration SQL files committed to GitHub

## DEFERRED FROM THIS PHASE
- [~] DEFER-2A (-> Phase 5): Add paystack_plan_code column to circles table
      Reason: Paystack plan code only exists after Paystack integration
- [~] DEFER-2B (-> Post-MVP V2): Add monnify_account_number to circles
      Reason: Monnify DVA requires business verification — V2 only
- [~] DEFER-2C (-> Phase 5): Schedule daily payout check cron
      Reason: Payout logic must exist before scheduling the check
- [~] DEFER-2D (-> Phase 9): Generate TypeScript types from schema
      Reason: Schema must be stable (all phases done) before type gen
