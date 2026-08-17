-- =============================================================================
-- ALAJO — COMPLETE DATABASE SCHEMA & SECURITY FOUNDATION (ALL-IN-ONE)
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/teknpdpogjqipurpgofk/sql
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. TABLES & CONSTRAINTS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    kyc_tier INTEGER NOT NULL DEFAULT 1 CHECK (kyc_tier IN (1, 2, 3)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.circles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 50),
    description TEXT,
    contribution_amount NUMERIC(12, 2) NOT NULL CHECK (contribution_amount >= 1000.00),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    max_members INTEGER NOT NULL CHECK (max_members >= 2 AND max_members <= 20),
    invite_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    current_round INTEGER NOT NULL DEFAULT 1,
    paystack_plan_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payout_position INTEGER NOT NULL CHECK (payout_position >= 1),
    has_paid_current_round BOOLEAN NOT NULL DEFAULT FALSE,
    payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'paid', 'failed')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (circle_id, user_id),
    UNIQUE (circle_id, payout_position)
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    membership_id UUID NOT NULL REFERENCES public.memberships(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    round_number INTEGER NOT NULL DEFAULT 1,
    type TEXT NOT NULL CHECK (type IN ('contribution', 'payout', 'penalty')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    paystack_reference TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_circles_creator ON public.circles(creator_id);
CREATE INDEX IF NOT EXISTS idx_circles_invite_code ON public.circles(invite_code);
CREATE INDEX IF NOT EXISTS idx_memberships_circle ON public.memberships(circle_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_circle ON public.transactions(circle_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_ref ON public.transactions(paystack_reference);

-- -----------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile and circle peers" ON public.profiles;
CREATE POLICY "Users can view own profile and circle peers"
ON public.profiles FOR SELECT TO authenticated
USING (
    auth.uid() = id
    OR EXISTS (
        SELECT 1 FROM public.memberships m1
        JOIN public.memberships m2 ON m1.circle_id = m2.circle_id
        WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
    )
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Circles Policies
DROP POLICY IF EXISTS "Users can view joined or public invite circles" ON public.circles;
CREATE POLICY "Users can view joined or public invite circles"
ON public.circles FOR SELECT TO authenticated
USING (
    creator_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.memberships
        WHERE memberships.circle_id = circles.id
        AND memberships.user_id = auth.uid()
    )
    OR status IN ('pending', 'active')
);

DROP POLICY IF EXISTS "Users can create circles" ON public.circles;
CREATE POLICY "Users can create circles"
ON public.circles FOR INSERT TO authenticated
WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Creators can update own circles" ON public.circles;
CREATE POLICY "Creators can update own circles"
ON public.circles FOR UPDATE TO authenticated
USING (creator_id = auth.uid()) WITH CHECK (creator_id = auth.uid());

-- Memberships Policies
DROP POLICY IF EXISTS "Members can view circle memberships" ON public.memberships;
CREATE POLICY "Members can view circle memberships"
ON public.memberships FOR SELECT TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.circles
        WHERE circles.id = memberships.circle_id
        AND circles.creator_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.memberships m
        WHERE m.circle_id = memberships.circle_id
        AND m.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can join circles" ON public.memberships;
CREATE POLICY "Users can join circles"
ON public.memberships FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Transactions Policies (Glass Ledger)
DROP POLICY IF EXISTS "Circle members can view transactions" ON public.transactions;
CREATE POLICY "Circle members can view transactions"
ON public.transactions FOR SELECT TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.memberships
        WHERE memberships.circle_id = transactions.circle_id
        AND memberships.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can create own contributions" ON public.transactions;
CREATE POLICY "Users can create own contributions"
ON public.transactions FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 3. FUNCTIONS & AUTOMATION TRIGGERS
-- -----------------------------------------------------------------------------

-- Auth Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, avatar_url, trust_score, kyc_tier)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'avatar_url',
        50,
        1
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- AI Trust Score Algorithm
CREATE OR REPLACE FUNCTION public.calculate_trust_score(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_score INTEGER := 50;
    v_confirmed_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_completed_circles INTEGER := 0;
BEGIN
    SELECT COUNT(*) INTO v_confirmed_count
    FROM public.transactions
    WHERE user_id = p_user_id AND type = 'contribution' AND status = 'confirmed';

    SELECT COUNT(*) INTO v_failed_count
    FROM public.transactions
    WHERE user_id = p_user_id AND status = 'failed';

    SELECT COUNT(DISTINCT m.circle_id) INTO v_completed_circles
    FROM public.memberships m
    JOIN public.circles c ON c.id = m.circle_id
    WHERE m.user_id = p_user_id AND c.status = 'completed';

    v_score := 50 + LEAST(v_confirmed_count * 5, 30) + LEAST(v_completed_circles * 10, 20) - (v_failed_count * 25);
    v_score := GREATEST(0, LEAST(100, v_score));

    UPDATE public.profiles
    SET trust_score = v_score, updated_at = NOW()
    WHERE id = p_user_id;

    RETURN v_score;
END;
$$;

-- Updated_at Automation
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_circles_updated_at ON public.circles;
CREATE TRIGGER set_circles_updated_at
    BEFORE UPDATE ON public.circles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. CRON EXTENSIONS & AUTOMATION
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'alajo-keep-alive') THEN
        PERFORM cron.unschedule('alajo-keep-alive');
    END IF;

    PERFORM cron.schedule(
        'alajo-keep-alive',
        '0 12 */6 * *',
        $$SELECT 1$$
    );
END;
$$;
