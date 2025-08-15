/*
  # Update instructor RLS policy

  1. Security Changes
    - Drop existing "Instructors can read own data" policy if it exists
    - Create new policy using user_id column instead of id
    - Ensures instructors can only read their own data using auth.uid() = user_id
*/

-- Drop the existing policy if it exists
DROP POLICY IF EXISTS "Instructors can read own data" ON instructors;

-- Create the new policy with user_id reference
CREATE POLICY "Instructors can read own data"
ON instructors
FOR SELECT
USING (auth.uid() = user_id);