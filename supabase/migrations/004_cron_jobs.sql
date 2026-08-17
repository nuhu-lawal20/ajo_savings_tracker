-- =============================================================================
-- Migration 004: Extensions & Automated Cron Schedules
-- Alajo — Digital Savings Circle
-- =============================================================================

-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- -----------------------------------------------------------------------------
-- 1. Database Keep-Alive Schedule (Every 6 days at 12:00 PM UTC)
-- Prevents Supabase 7-day inactivity pause with zero external cost
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    -- Unschedule previous job if exists
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

-- -----------------------------------------------------------------------------
-- 2. Nightly Trust Score Batch Recalculation (Every night at 1:00 AM UTC)
-- Updates all user trust scores based on recent payment histories
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'alajo-recalculate-trust-scores') THEN
        PERFORM cron.unschedule('alajo-recalculate-trust-scores');
    END IF;

    PERFORM cron.schedule(
        'alajo-recalculate-trust-scores',
        '0 1 * * *',
        $$
        DO $inner$
        DECLARE
            u RECORD;
        BEGIN
            FOR u IN SELECT id FROM public.profiles LOOP
                PERFORM public.calculate_trust_score(u.id);
            END LOOP;
        END;
        $inner$;
        $$
    );
END;
$$;
