/*
  # Fix Course Analytics Relationship

  1. Issues Fixed
    - Drop existing complex RLS policies on course_analytics table
    - Create simpler, direct policies that don't cause schema cache issues
    - Ensure proper foreign key relationship is recognized by PostgREST

  2. Changes
    - Replace complex RLS policy with direct instructor_id check
    - Refresh schema cache to recognize relationships
    - Allow authenticated users to view course analytics properly
*/

-- Drop existing policies that may be causing relationship issues
DROP POLICY IF EXISTS "Instructors can view own course analytics" ON course_analytics;
DROP POLICY IF EXISTS "Instructors can manage course analytics" ON course_analytics;
DROP POLICY IF EXISTS "Users can view course analytics" ON course_analytics;

-- Disable RLS temporarily to reset
ALTER TABLE course_analytics DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE course_analytics ENABLE ROW LEVEL SECURITY;

-- Create simple, direct policy for course analytics
CREATE POLICY "course_analytics_instructor_access" ON course_analytics
FOR ALL 
TO authenticated
USING (
  course_id IN (
    SELECT id FROM courses WHERE instructor_id = auth.uid()
  )
);

-- Grant necessary permissions
GRANT SELECT ON course_analytics TO anon;
GRANT ALL ON course_analytics TO authenticated;

-- Refresh schema cache to ensure relationships are recognized
NOTIFY pgrst, 'reload schema';

-- Verify the foreign key constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'course_analytics_course_id_fkey'
    AND table_name = 'course_analytics'
  ) THEN
    ALTER TABLE course_analytics 
    ADD CONSTRAINT course_analytics_course_id_fkey 
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Final schema refresh
NOTIFY pgrst, 'reload schema';