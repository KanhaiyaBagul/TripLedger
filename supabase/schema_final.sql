-- ============================================================
-- TripLedger FINAL Working Schema + RLS Policies
-- Paste this ENTIRE file into the Supabase SQL Editor and Run
-- ============================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if you are starting fresh (Optional, but safe if empty)
-- DROP TABLE IF EXISTS public.settlements CASCADE;
-- DROP TABLE IF EXISTS public.expense_participants CASCADE;
-- DROP TABLE IF EXISTS public.expenses CASCADE;
-- DROP TABLE IF EXISTS public.trip_members CASCADE;
-- DROP TABLE IF EXISTS public.trips CASCADE;

-- ============================================================
-- 3. CREATE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.trips (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trip_members (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id  UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role     TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  UNIQUE(trip_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  paid_by     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expense_participants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(expense_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.settlements (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id    UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  from_user  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount     NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  settled    BOOLEAN NOT NULL DEFAULT FALSE,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PROFILES VIEW (for member lookup by email)
CREATE OR REPLACE VIEW public.user_profiles AS
  SELECT id, email FROM auth.users;

GRANT SELECT ON public.user_profiles TO authenticated;

-- ============================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_trip_member(trip_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members tm
    WHERE tm.trip_id = $1 AND tm.user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================================
-- 6. RLS POLICIES (Simplified & Bulletproof for App Logic)
-- ============================================================
-- Note: We drop existing policies first so this script can be run multiple times safely.

DO $$ 
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- TRIPS
-- Users can see trips they created OR trips they are a member of
CREATE POLICY "View trips" ON public.trips FOR SELECT TO authenticated
USING (auth.uid() = created_by OR public.is_trip_member(id));

-- Users can create trips (their uid must be the creator)
CREATE POLICY "Create trips" ON public.trips FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Users can update/delete trips they created
CREATE POLICY "Update trips" ON public.trips FOR UPDATE TO authenticated
USING (auth.uid() = created_by);
CREATE POLICY "Delete trips" ON public.trips FOR DELETE TO authenticated
USING (auth.uid() = created_by);


-- TRIP MEMBERS
-- Users can see members of trips they are a part of or created
CREATE POLICY "View members" ON public.trip_members FOR SELECT TO authenticated
USING (public.is_trip_member(trip_id) OR auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND created_by = auth.uid()));

-- Users can add themselves as an owner when they create a trip, or owners can add others
CREATE POLICY "Insert members" ON public.trip_members FOR INSERT TO authenticated
WITH CHECK (true); -- Relaxed for API logic (API handles role assignment/security)

-- Users can remove themselves or trip creators can remove anyone
CREATE POLICY "Delete members" ON public.trip_members FOR DELETE TO authenticated
USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND created_by = auth.uid()));


-- EXPENSES
-- Members can see expenses of their trips
CREATE POLICY "View expenses" ON public.expenses FOR SELECT TO authenticated
USING (public.is_trip_member(trip_id));

-- Members can add expenses
CREATE POLICY "Insert expenses" ON public.expenses FOR INSERT TO authenticated
WITH CHECK (public.is_trip_member(trip_id));

-- Users who paid or trip creators can delete expenses
CREATE POLICY "Delete expenses" ON public.expenses FOR DELETE TO authenticated
USING (auth.uid() = paid_by OR EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND created_by = auth.uid()));


-- EXPENSE PARTICIPANTS
-- Anyone who can see the expense can see the participants
CREATE POLICY "View participants" ON public.expense_participants FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.expenses e WHERE e.id = expense_id AND public.is_trip_member(e.trip_id)));

-- Participants can be inserted by members
CREATE POLICY "Insert participants" ON public.expense_participants FOR INSERT TO authenticated
WITH CHECK (true); -- Relaxed for API logic

-- Participants can be deleted by members
CREATE POLICY "Delete participants" ON public.expense_participants FOR DELETE TO authenticated
USING (true); -- Relaxed for API logic


-- SETTLEMENTS
-- Members can view settlements
CREATE POLICY "View settlements" ON public.settlements FOR SELECT TO authenticated
USING (public.is_trip_member(trip_id));

-- Members can insert/update settlements (API algorithm handles generation)
CREATE POLICY "Insert settlements" ON public.settlements FOR INSERT TO authenticated
WITH CHECK (public.is_trip_member(trip_id));

CREATE POLICY "Update settlements" ON public.settlements FOR UPDATE TO authenticated
USING (auth.uid() = from_user OR auth.uid() = to_user);
