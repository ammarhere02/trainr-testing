-- RLS Policies for Trainr Authentication System (CORRECTED)
-- Run this in your Supabase SQL Editor to fix the RLS policy issues

-- First, ensure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own instructor record" ON instructors;
DROP POLICY IF EXISTS "Users can view their own instructor record" ON instructors;
DROP POLICY IF EXISTS "Users can update their own instructor record" ON instructors;
DROP POLICY IF EXISTS "Users can insert student records" ON students;
DROP POLICY IF EXISTS "Instructors can view their students" ON students;
DROP POLICY IF EXISTS "Students can view their own record" ON students;
DROP POLICY IF EXISTS "Students can update their own record" ON students;

-- PROFILES TABLE POLICIES
-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- INSTRUCTORS TABLE POLICIES
-- Allow users to insert their own instructor record
CREATE POLICY "Users can insert their own instructor record" ON instructors
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own instructor record
CREATE POLICY "Users can view their own instructor record" ON instructors
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own instructor record
CREATE POLICY "Users can update their own instructor record" ON instructors
FOR UPDATE USING (auth.uid() = id);

-- Allow anyone to view instructor public data (needed for student signup)
CREATE POLICY "Anyone can view instructor public data" ON instructors
FOR SELECT USING (true);

-- STUDENTS TABLE POLICIES
-- Allow authenticated users to insert student records
CREATE POLICY "Users can insert student records" ON students
FOR INSERT WITH CHECK (true);

-- Allow instructors to view their students
CREATE POLICY "Instructors can view their students" ON students
FOR SELECT USING (instructor_id = auth.uid());

-- Allow students to view their own record by email
CREATE POLICY "Students can view their own record" ON students
FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Allow students to update their own record
CREATE POLICY "Students can update their own record" ON students
FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- COURSES TABLE POLICIES (if enrollments table exists)
-- These policies assume enrollments table has student_id column
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Students can view enrolled courses" ON courses;
    DROP POLICY IF EXISTS "Instructors can manage course enrollments" ON enrollments;
    DROP POLICY IF EXISTS "Students can view their own enrollments" ON enrollments;
    
    -- Allow students to view courses they're enrolled in
    -- This looks up enrollments by matching student email to students table
    EXECUTE 'CREATE POLICY "Students can view enrolled courses" ON courses
    FOR SELECT USING (
      id IN (
        SELECT course_id FROM enrollments e
        INNER JOIN students s ON e.student_id = s.id
        WHERE s.email = auth.jwt() ->> ''email''
      )
    )';
    
    -- Allow instructors to manage enrollments for their courses
    EXECUTE 'CREATE POLICY "Instructors can manage course enrollments" ON enrollments
    FOR ALL USING (
      course_id IN (
        SELECT id FROM courses WHERE instructor_id = auth.uid()
      )
    )';
    
    -- Allow students to view their own enrollments
    EXECUTE 'CREATE POLICY "Students can view their own enrollments" ON enrollments
    FOR SELECT USING (
      student_id IN (
        SELECT id FROM students WHERE email = auth.jwt() ->> ''email''
      )
    )';
  END IF;
END $$;

-- Ensure all related tables have RLS enabled (only if they exist)
DO $$
BEGIN
  -- Enable RLS on tables that exist
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') THEN
    ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'enrollments') THEN
    ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'lessons') THEN
    ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'community_posts') THEN
    ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meetings') THEN
    ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Success message
SELECT 'RLS policies have been successfully created!' as status;
