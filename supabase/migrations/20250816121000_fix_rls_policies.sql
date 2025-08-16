/*
  # Fix RLS policies and auth issues

  1. Security Changes
    - Update instructor policies to allow self-insertion
    - Fix student policies to work properly with auth
    - Add INSERT policies that were missing

  2. Policy Updates
    - Instructors can insert their own row
    - Students can insert their own row
    - Proper authentication checks
*/

-- Fix instructor policies
DROP POLICY IF EXISTS "Instructors can insert own row" ON instructors;
CREATE POLICY "Instructors can insert own row"
  ON instructors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Make sure students can properly insert
DROP POLICY IF EXISTS "Students can insert own row" ON students;
CREATE POLICY "Students can insert own row"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update instructor read policy to be more permissive for public data
DROP POLICY IF EXISTS "Anyone can read instructor public data" ON instructors;
CREATE POLICY "Public can read instructors with published courses"
  ON instructors
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.instructor_id = instructors.id 
      AND courses.published = true
    )
    OR auth.uid() = instructors.id
  );
