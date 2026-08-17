-- =============================================================================
-- Migration 003: Database Functions & Automation Triggers
-- Alajo — Digital Savings Circle
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Auto-create Profile on Auth Signup Trigger
-- -----------------------------------------------------------------------------
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
        50, -- Base starting Trust Score
        1   -- Default Tier 1 KYC
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. AI Trust Score Calculation Function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_trust_score(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_score INTEGER := 50; -- Base trust score
    v_confirmed_count INTEGER := 0;
    v_failed_count INTEGER := 0;
    v_completed_circles INTEGER := 0;
BEGIN
    -- Count on-time confirmed contributions
    SELECT COUNT(*) INTO v_confirmed_count
    FROM public.transactions
    WHERE user_id = p_user_id
      AND type = 'contribution'
      AND status = 'confirmed';

    -- Count defaulted/failed transactions
    SELECT COUNT(*) INTO v_failed_count
    FROM public.transactions
    WHERE user_id = p_user_id
      AND status = 'failed';

    -- Count completed circle cycles
    SELECT COUNT(DISTINCT m.circle_id) INTO v_completed_circles
    FROM public.memberships m
    JOIN public.circles c ON c.id = m.circle_id
    WHERE m.user_id = p_user_id
      AND c.status = 'completed';

    -- Score calculation logic:
    -- +5 points for each confirmed payment (max +30)
    -- +10 points for each completed circle (max +20)
    -- -25 points for each defaulted payment
    v_score := 50 + LEAST(v_confirmed_count * 5, 30) + LEAST(v_completed_circles * 10, 20) - (v_failed_count * 25);

    -- Clamp between 0 and 100
    v_score := GREATEST(0, LEAST(100, v_score));

    -- Update the user's profile with the new score
    UPDATE public.profiles
    SET trust_score = v_score,
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN v_score;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. Automatic updated_at Timestamp Trigger
-- -----------------------------------------------------------------------------
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
