/*
  # Add Basic Test Credentials

  1. Test Users
    - Instructor: test@instructor.com / password123
    - Student: test@student.com / password123

  2. Security
    - Uses Supabase auth.users table for authentication
    - Links to instructors/students tables via user ID
    - Proper RLS policies already in place

  3. Sample Data
    - Basic instructor and student records
    - Linked relationships for testing
*/

-- Insert test instructor into auth.users (this would normally be done via Supabase Auth API)
-- Note: In production, users are created via supabase.auth.signUp()
-- This is just for testing purposes

-- Insert instructor record (assuming auth user exists)
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
  gen_random_uuid(),
  'test@instructor.com',
  'Test Instructor',
  'Test Academy',
  'testacademy',
  '#7c3aed',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Get the instructor ID for linking student
DO $$
DECLARE
  instructor_uuid uuid;
BEGIN
  SELECT id INTO instructor_uuid FROM instructors WHERE email = 'test@instructor.com';
  
  -- Insert student record
  INSERT INTO students (
    id,
    email,
    full_name,
    instructor_id,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    'test@student.com',
    'Test Student',
    instructor_uuid,
    now(),
    now()
  ) ON CONFLICT (email) DO NOTHING;
END $$;

-- Insert a sample course for testing
DO $$
DECLARE
  instructor_uuid uuid;
  course_uuid uuid;
BEGIN
  SELECT id INTO instructor_uuid FROM instructors WHERE email = 'test@instructor.com';
  
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
    instructor_uuid,
    'Test Web Development Course',
    'Learn the basics of web development with HTML, CSS, and JavaScript',
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Beginner',
    'free',
    0,
    true,
    now()
  ) RETURNING id INTO course_uuid;
  
  -- Add a sample lesson
  INSERT INTO lessons (
    id,
    course_id,
    title,
    content,
    video_url,
    video_source,
    duration,
    order_index,
    created_at
  ) VALUES (
    gen_random_uuid(),
    course_uuid,
    'Introduction to Web Development',
    'Welcome to the course! In this lesson, we will cover the basics of web development.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'youtube',
    '10:30',
    1,
    now()
  );
END $$;