-- Run this script in your Supabase SQL Editor to fix the auth issues
-- This will remove the problematic trigger that's causing signup failures

-- Step 1: Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the trigger function
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 3: Verify tables exist and have correct structure
-- Check instructors table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    RAISE EXCEPTION 'instructors table does not exist!';
  END IF;
END $$;

-- Check students table  
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'students') THEN
    RAISE EXCEPTION 'students table does not exist!';
  END IF;
END $$;

-- Step 4: Check and fix RLS policies for instructors
DROP POLICY IF EXISTS "Instructors can insert own row" ON instructors;
CREATE POLICY "Instructors can insert own row"
  ON instructors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 5: Check and fix RLS policies for students
DROP POLICY IF EXISTS "Students can insert own row" ON students;
CREATE POLICY "Students can insert own row"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 6: Ensure organizations table exists
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on organizations if not already enabled
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Add basic policies for organizations
DROP POLICY IF EXISTS "Organizations are viewable by everyone" ON organizations;
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;
CREATE POLICY "Authenticated users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Step 7: Add success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully! The auth trigger has been removed and policies have been fixed.';
END $$;
