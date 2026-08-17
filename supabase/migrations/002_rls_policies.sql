-- =============================================================================
-- Migration 002: Row Level Security (RLS) Policies
-- Alajo — Digital Savings Circle
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. Profiles Policies
-- -----------------------------------------------------------------------------
-- Users can view their own profile and profiles of peers in their circles
CREATE POLICY "Users can view own profile and circle peers"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    auth.uid() = id
    OR EXISTS (
        SELECT 1 FROM public.memberships m1
        JOIN public.memberships m2 ON m1.circle_id = m2.circle_id
        WHERE m1.user_id = auth.uid() AND m2.user_id = profiles.id
    )
);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 2. Circles Policies
-- -----------------------------------------------------------------------------
-- Authenticated users can view circles they created, belong to, or are active/pending (to view by invite)
CREATE POLICY "Users can view joined or public invite circles"
ON public.circles
FOR SELECT
TO authenticated
USING (
    creator_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.memberships
        WHERE memberships.circle_id = circles.id
        AND memberships.user_id = auth.uid()
    )
    OR status IN ('pending', 'active')
);

-- Authenticated users can create circles
CREATE POLICY "Users can create circles"
ON public.circles
FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

-- Circle creators can update their own circles
CREATE POLICY "Creators can update own circles"
ON public.circles
FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 3. Memberships Policies
-- -----------------------------------------------------------------------------
-- Circle members and creators can view circle memberships
CREATE POLICY "Members can view circle memberships"
ON public.memberships
FOR SELECT
TO authenticated
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

-- Users can join circles as themselves
CREATE POLICY "Users can join circles"
ON public.memberships
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- 4. Transactions Policies (Real-Time Glass Ledger)
-- -----------------------------------------------------------------------------
-- Circle members can view all transactions in their circles (Glass Ledger)
CREATE POLICY "Circle members can view transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.memberships
        WHERE memberships.circle_id = transactions.circle_id
        AND memberships.user_id = auth.uid()
    )
);

-- Users can create pending contribution records for themselves
CREATE POLICY "Users can create own contributions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
