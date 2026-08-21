-- =============================================================================
-- Migration 002: Row Level Security (RLS) Policies
-- Kadashe — Smart Rotating Savings (Adashe)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. Profiles Policies
-- -----------------------------------------------------------------------------
-- Authenticated users can view member profiles (for trust scores & peer lists)
CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

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
-- Authenticated users can view circles (Direct condition - NO subqueries to memberships)
CREATE POLICY "Users can view circles"
ON public.circles
FOR SELECT
TO authenticated
USING (
    creator_id = auth.uid()
    OR status IN ('pending', 'active', 'completed')
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
-- Circle members and creators can view circle memberships (One-way check)
CREATE POLICY "Users can view memberships"
ON public.memberships
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR circle_id IN (
        SELECT id FROM public.circles
        WHERE creator_id = auth.uid() OR status IN ('pending', 'active', 'completed')
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
-- Circle members can view all transactions in their circles (One-way check)
CREATE POLICY "Users can view transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR circle_id IN (
        SELECT id FROM public.circles
        WHERE creator_id = auth.uid() OR status IN ('pending', 'active', 'completed')
    )
);

-- Users can create pending contribution records for themselves
CREATE POLICY "Users can create own contributions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
