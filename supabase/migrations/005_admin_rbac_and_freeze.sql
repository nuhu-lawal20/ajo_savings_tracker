-- =============================================================================
-- Migration 005: Admin RBAC (Super Admin vs Helper Admin), Suspension, and Frozen Circles
-- Kadashe — Smart Rotating Savings (Adashe)
-- =============================================================================

-- 1. Add admin_role to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_role TEXT NOT NULL DEFAULT 'none' 
CHECK (admin_role IN ('super_admin', 'helper_admin', 'none'));

-- Sync existing admin accounts
UPDATE public.profiles 
SET admin_role = 'super_admin' 
WHERE is_admin = true;

-- 2. Add is_suspended to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT false;

-- 3. Add 'frozen' to circles status
ALTER TABLE public.circles 
DROP CONSTRAINT IF EXISTS circles_status_check;

ALTER TABLE public.circles 
ADD CONSTRAINT circles_status_check 
CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'frozen'));
