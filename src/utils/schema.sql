
-- Database Schema for FateEngine with Supabase

-- Users table extension (uses Supabase Auth under the hood)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro')),
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own data
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);
  
-- Trigger to auto-create user record on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_plan)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Worlds table
CREATE TABLE public.worlds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  synopsis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on worlds table
ALTER TABLE public.worlds ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only their own worlds
CREATE POLICY "Users can read their own worlds" ON public.worlds
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create worlds" ON public.worlds
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worlds" ON public.worlds
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own worlds" ON public.worlds
  FOR DELETE
  USING (auth.uid() = user_id);

-- Realms table
CREATE TABLE public.realms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on realms
ALTER TABLE public.realms ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only realms that belong to their worlds
CREATE POLICY "Users can read realms in their worlds" ON public.realms
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.realms.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create realms in their worlds" ON public.realms
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.realms.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update realms in their worlds" ON public.realms
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.realms.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete realms in their worlds" ON public.realms
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.realms.world_id
    AND user_id = auth.uid()
  ));

-- Locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  realm_id UUID REFERENCES public.realms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only locations that belong to their worlds
CREATE POLICY "Users can read locations in their worlds" ON public.locations
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.locations.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create locations in their worlds" ON public.locations
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.locations.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update locations in their worlds" ON public.locations
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.locations.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete locations in their worlds" ON public.locations
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.locations.world_id
    AND user_id = auth.uid()
  ));

-- Factions table
CREATE TABLE public.factions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on factions
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only factions that belong to their worlds
CREATE POLICY "Users can read factions in their worlds" ON public.factions
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.factions.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create factions in their worlds" ON public.factions
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.factions.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update factions in their worlds" ON public.factions
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.factions.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete factions in their worlds" ON public.factions
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.factions.world_id
    AND user_id = auth.uid()
  ));

-- Characters table
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  faction_id UUID REFERENCES public.factions(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on characters
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only characters that belong to their worlds
CREATE POLICY "Users can read characters in their worlds" ON public.characters
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.characters.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create characters in their worlds" ON public.characters
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.characters.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update characters in their worlds" ON public.characters
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.characters.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete characters in their worlds" ON public.characters
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.characters.world_id
    AND user_id = auth.uid()
  ));

-- Items table
CREATE TABLE public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id UUID REFERENCES public.worlds(id) ON DELETE CASCADE,
  character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (character_id IS NULL AND location_id IS NOT NULL) OR
    (character_id IS NOT NULL AND location_id IS NULL) OR
    (character_id IS NULL AND location_id IS NULL)
  )
);

-- Enable RLS on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Allow users to CRUD only items that belong to their worlds
CREATE POLICY "Users can read items in their worlds" ON public.items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.items.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create items in their worlds" ON public.items
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.items.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update items in their worlds" ON public.items
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.items.world_id
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their worlds" ON public.items
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.worlds
    WHERE id = public.items.world_id
    AND user_id = auth.uid()
  ));
