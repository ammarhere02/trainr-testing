-- Drop any existing recursive policies on courses table
DROP POLICY IF EXISTS "Instructors can view their courses" ON courses;
DROP POLICY IF EXISTS "Users can view published courses" ON courses;
DROP POLICY IF EXISTS "Instructors can manage their courses" ON courses;
DROP POLICY IF EXISTS "Students can view published courses" ON courses;
DROP POLICY IF EXISTS "Public can view published courses" ON courses;
DROP POLICY IF EXISTS "Allow instructors to view own courses" ON courses;
DROP POLICY IF EXISTS "Allow public to view published courses" ON courses;

-- Create simple, non-recursive policies for courses
CREATE POLICY "instructors_own_courses" ON courses
FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "public_view_published_courses" ON courses
FOR SELECT USING (published = true);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';