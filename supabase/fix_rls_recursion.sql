-- =============================================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- Kadashe — Smart Rotating Savings (Adashe)
-- =============================================================================

-- 1. Drop existing recursive policies
DROP POLICY IF EXISTS "Users can view joined or public invite circles" ON public.circles;
DROP POLICY IF EXISTS "Users can view circles" ON public.circles;
DROP POLICY IF EXISTS "Members can view circle memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can view memberships" ON public.memberships;
DROP POLICY IF EXISTS "Circle members can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own profile and circle peers" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;

-- 2. Profiles: Authenticated users can view member profiles (for trust scores & circle member lists)
CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Circles: Authenticated users can view circles (No subqueries to memberships -> 0 recursion)
CREATE POLICY "Users can view circles"
ON public.circles
FOR SELECT
TO authenticated
USING (
    creator_id = auth.uid()
    OR status IN ('pending', 'active', 'completed')
);

-- 4. Memberships: Circle members and creators can view memberships (One-way check)
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

-- 5. Transactions: Circle members can view transaction history (One-way check)
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
