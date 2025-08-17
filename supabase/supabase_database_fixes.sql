-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Instructors can view their courses" ON courses;
DROP POLICY IF EXISTS "Users can view published courses" ON courses;
DROP POLICY IF EXISTS "Instructors can manage their courses" ON courses;
DROP POLICY IF EXISTS "Students can view published courses" ON courses;
DROP POLICY IF EXISTS "Public can view published courses" ON courses;

-- Create simple, non-recursive policies
CREATE POLICY "instructors_own_courses" ON courses
FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "public_view_published_courses" ON courses
FOR SELECT USING (published = true);

-- Step 2: Ensure proper foreign key relationship
-- This resolves the "Could not find relationship" error

-- Check current constraints and drop if needed
ALTER TABLE communities 
DROP CONSTRAINT IF EXISTS communities_course_id_fkey;

-- Add proper foreign key constraint with correct naming
ALTER TABLE communities 
ADD CONSTRAINT communities_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL;

-- Step 3: Refresh schema cache (optional but recommended)
-- This helps Supabase recognize the new relationships
NOTIFY pgrst, 'reload schema';

-- Step 4: Verify the fixes
-- Run these queries to check if everything is working:

-- Check policies on courses
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'courses';

-- Check foreign key constraints on communities
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'communities'::regclass AND contype = 'f';