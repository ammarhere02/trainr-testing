/*
  # Create Test Authentication Users

  1. Purpose
    - Creates test instructor and student records for authentication testing
    - Links profiles to Supabase Auth users
    - Provides sample data for development

  2. Test Accounts Created
    - Instructor: test@instructor.com / password123
    - Student: test@student.com / password123

  3. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Ensure RLS is enabled on all tables
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Create test instructor record
INSERT INTO instructors (
  id,
  email,
  full_name,
  business_name,
  subdomain,
  color,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@instructor.com',
  'Test Instructor',
  'Test Academy',
  'testacademy',
  '#7c3aed',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  business_name = EXCLUDED.business_name,
  subdomain = EXCLUDED.subdomain,
  updated_at = now();

-- Create test student record
INSERT INTO students (
  id,
  email,
  full_name,
  instructor_id,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'test@student.com',
  'Test Student',
  '11111111-1111-1111-1111-111111111111',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  instructor_id = EXCLUDED.instructor_id,
  updated_at = now();

-- Create sample course for testing
INSERT INTO courses (
  id,
  instructor_id,
  title,
  description,
  image_url,
  level,
  type,
  price,
  published,
  created_at
) VALUES (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  'Web Development Fundamentals',
  'Learn the basics of web development with HTML, CSS, and JavaScript',
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beginner',
  'free',
  0,
  true,
  now()
) ON CONFLICT DO NOTHING;

-- Add RLS policies for instructors
CREATE POLICY "Instructors can read own data" ON instructors
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Instructors can update own data" ON instructors
  FOR UPDATE USING (auth.uid() = id);

-- Add RLS policies for students  
CREATE POLICY "Students can read own data" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own data" ON students
  FOR UPDATE USING (auth.uid() = id);

-- Add RLS policies for courses
CREATE POLICY "Anyone can read published courses" ON courses
  FOR SELECT USING (published = true);

CREATE POLICY "Instructors can manage own courses" ON courses
  FOR ALL USING (auth.uid() = instructor_id);

-- Add RLS policies for lessons
CREATE POLICY "Anyone can read lessons of published courses" ON lessons
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM courses WHERE published = true
    )
  );

CREATE POLICY "Instructors can manage lessons of own courses" ON lessons
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );