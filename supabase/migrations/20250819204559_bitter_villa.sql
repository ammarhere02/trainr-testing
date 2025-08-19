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
DROP POLICY IF EXISTS "Users can view course analytics" ON course_analytics;
DROP POLICY IF EXISTS "Instructors can manage course analytics" ON course_analytics;

-- Create simple, direct policy for course_analytics
CREATE POLICY "instructors_view_course_analytics" ON course_analytics
FOR SELECT 
TO authenticated
USING (
  course_id IN (
    SELECT id FROM courses WHERE instructor_id = auth.uid()
  )
);

-- Allow instructors to insert/update analytics for their courses
CREATE POLICY "instructors_manage_course_analytics" ON course_analytics
FOR ALL
TO authenticated
USING (
  course_id IN (
    SELECT id FROM courses WHERE instructor_id = auth.uid()
  )
);

-- Ensure the foreign key constraint exists
ALTER TABLE course_analytics 
DROP CONSTRAINT IF EXISTS course_analytics_course_id_fkey;

ALTER TABLE course_analytics 
ADD CONSTRAINT course_analytics_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the relationship exists
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='course_analytics';