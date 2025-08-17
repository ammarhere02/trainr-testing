-- ==============================================
-- AGGRESSIVE COURSES POLICY FIX
-- Run this ENTIRE script in your Supabase SQL Editor
-- ==============================================

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'courses';

-- Drop ALL existing policies on courses table (more aggressive approach)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'courses' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON courses';
    END LOOP;
END $$;

-- Disable RLS temporarily to reset everything
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create completely new, simple policies
CREATE POLICY "courses_instructor_access" ON courses
FOR ALL 
TO authenticated
USING (instructor_id = auth.uid());

CREATE POLICY "courses_public_read" ON courses
FOR SELECT 
TO anon, authenticated
USING (published = true);

-- Grant necessary permissions
GRANT SELECT ON courses TO anon;
GRANT ALL ON courses TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- ==============================================
-- VERIFICATION - Run these to confirm fix
-- ==============================================

-- 1. Check new policies (should show only 2 policies)
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'courses';

-- 2. Test basic course query
SELECT id, title, instructor_id, published 
FROM courses 
LIMIT 5;

-- 3. Test the specific query that was failing
SELECT 
    cp.course_id,
    c.id,
    c.title
FROM community_posts cp
LEFT JOIN courses c ON c.id = cp.course_id
WHERE cp.instructor_id = '0de7d339-b909-4231-8cd1-158a57df2072'
LIMIT 1;

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================
-- If all verification queries above work without errors,
-- your courses policy recursion issue is FIXED!
-- Refresh your app and test the community management.
-- ==============================================
