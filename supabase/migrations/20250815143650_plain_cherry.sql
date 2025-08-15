/*
  # Fix Students Table RLS Policies

  1. Security Changes
    - Drop existing recursive policies on students table
    - Create new non-recursive policies for students table
    - Ensure policies don't reference themselves causing infinite recursion

  2. Policy Updates
    - Students can read their own data
    - Students can update their own data  
    - Students can insert their own row
    - Instructors can read their students (non-recursive)
*/

-- Drop existing policies that may be causing recursion
DROP POLICY IF EXISTS "Students can read own data" ON students;
DROP POLICY IF EXISTS "Students can update own data" ON students;
DROP POLICY IF EXISTS "Students can insert own row" ON students;
DROP POLICY IF EXISTS "Instructors can read their students" ON students;

-- Create new non-recursive policies
CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can update own data"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Students can insert own row"
  ON students
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Instructors can read their students"
  ON students
  FOR SELECT
  TO authenticated
  USING (instructor_id = auth.uid());