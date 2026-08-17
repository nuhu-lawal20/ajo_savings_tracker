# PHASE 2 — DATABASE & SECURITY FOUNDATION
Status: ✅ COMPLETE | Gate: APPROVED | Completed: 2026-08-17
Goal: All tables, RLS policies, and cron jobs live in Supabase.
Depends on: Phase 1 APPROVED | Blocks: Phase 3

## CHECKLIST
- [x] P2.1  Open Supabase via MCP server (`supabase-alajo`)
- [x] P2.2  Run Migration 001: Create profiles table (id, full_name, email, phone, kyc_tier, trust_score, etc.)
- [x] P2.3  Run Migration 001: Create circles table (id, creator_id, name, contribution_amount, frequency, invite_code, status)
- [x] P2.4  Run Migration 001: Create memberships table (user_id, circle_id, payout_position — UNIQUE user+circle)
- [x] P2.5  Run Migration 001: Create transactions table (paystack_reference UNIQUE constraint)
- [x] P2.6  Run Migration 002: Enable RLS on ALL 4 tables
- [x] P2.7  Run Migration 002: RLS policy — profiles (own profile only: auth.uid() = id)
- [x] P2.8  Run Migration 002: RLS policy — circles (member OR creator access)
- [x] P2.9  Run Migration 002: RLS policy — memberships (own memberships only)
- [x] P2.10 Run Migration 002: RLS policy — transactions (circle members only)
- [x] P2.11 Run Migration 003: Create handle_new_user() trigger (auto-creates profile on auth signup)
- [x] P2.12 Run Migration 003: Create calculate_trust_score(user_id) function
- [x] P2.13 Enable pg_cron extension
- [x] P2.14 Enable pg_net extension
- [x] P2.15 Run Migration 004: Schedule keep-alive cron (every 6 days at noon)
- [x] P2.16 Run Migration 004: Schedule trust score recalculation (nightly 1:00 UTC)
- [x] P2.17 TEST RLS: Verified all 4 tables have RLS enabled via MCP `list_tables`
- [x] P2.18 TEST RLS: Policies active and enforced at PostgreSQL engine level
- [x] P2.19 Save all SQL as files: supabase/migrations/001_*.sql through 004_*.sql
- [x] P2.20 git commit: "feat: database schema with RLS, triggers, and pg_cron"

## GATE CRITERIA (ALL must be TRUE before Phase 3 starts)
- [x] GATE-2A All 4 tables exist with correct columns and constraints
- [x] GATE-2B RLS ENABLED on all 4 tables
- [x] GATE-2C All 4 RLS policies active
- [x] GATE-2D handle_new_user trigger active on auth.users
- [x] GATE-2E pg_cron keep-alive job scheduled in cron.job table
- [x] GATE-2F Migration SQL files committed to GitHub

## DEFERRED FROM THIS PHASE
- [x] DEFER-2A: paystack_plan_code column added in circles table
- [~] DEFER-2B (-> Post-MVP V2): Add monnify_account_number to circles
      Reason: Monnify DVA requires business verification — V2 only
- [x] DEFER-2D: Generated TypeScript types from live schema via MCP
