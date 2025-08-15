/*
  # Add Test User Accounts

  1. Test Accounts Created
    - Test Instructor: test@instructor.com / password123
    - Test Student: test@student.com / password123
    - Demo Instructor: demo@trainr.com / demo123

  2. Sample Data
    - Creates instructor profiles with business info
    - Creates student profiles linked to instructors
    - Adds sample courses and lessons
    - Sets up community posts

  3. Security
    - Uses Supabase auth.users table for authentication
    - Links to instructors/students tables via user ID
    - Maintains RLS policies
*/

-- Insert test users into auth.users (this simulates user registration)
-- Note: In production, users would be created through Supabase Auth signup
-- These are for development/testing purposes only

-- Test Instructor 1: Sarah Johnson
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@instructor.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Sarah Johnson", "role": "instructor"}'
) ON CONFLICT (id) DO NOTHING;

-- Test Student 1: Mike Chen
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'test@student.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Mike Chen", "role": "student"}'
) ON CONFLICT (id) DO NOTHING;

-- Demo Instructor: Demo Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'demo@trainr.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo Instructor", "role": "instructor"}'
) ON CONFLICT (id) DO NOTHING;

-- Create instructor profiles
INSERT INTO instructors (
  id,
  email,
  full_name,
  business_name,
  subdomain,
  logo_url,
  color,
  created_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'test@instructor.com',
  'Sarah Johnson',
  'Web Development Academy',
  'webdevacademy',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  '#7c3aed',
  now()
),
(
  '33333333-3333-3333-3333-333333333333',
  'demo@trainr.com',
  'Demo Instructor',
  'Demo Teaching Business',
  'demo',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  '#2563eb',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create student profiles
INSERT INTO students (
  id,
  email,
  full_name,
  instructor_id,
  avatar_url,
  created_at
) VALUES 
(
  '22222222-2222-2222-2222-222222222222',
  'test@student.com',
  'Mike Chen',
  '11111111-1111-1111-1111-111111111111',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample courses
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
) VALUES 
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'Complete Web Development Bootcamp',
  'Learn full-stack web development from scratch with React, Node.js, and MongoDB. Build real-world projects and get job-ready skills.',
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beginner',
  'free',
  0,
  true,
  now()
),
(
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Advanced React Patterns',
  'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
  'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Advanced',
  'paid',
  199.00,
  true,
  now()
),
(
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  'Demo Course',
  'This is a demo course to showcase the platform features and capabilities.',
  'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beginner',
  'free',
  0,
  true,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample lessons
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
) VALUES 
(
  '77777777-7777-7777-7777-777777777777',
  '44444444-4444-4444-4444-444444444444',
  'Introduction to Web Development',
  'Welcome to the complete web development bootcamp! In this lesson, we will cover the fundamentals of web development and what you can expect to learn throughout this course.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '15:30',
  1,
  now()
),
(
  '88888888-8888-8888-8888-888888888888',
  '44444444-4444-4444-4444-444444444444',
  'HTML Fundamentals',
  'Learn the building blocks of web pages with HTML. We will cover semantic HTML, forms, tables, and best practices.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '22:45',
  2,
  now()
),
(
  '99999999-9999-9999-9999-999999999999',
  '55555555-5555-5555-5555-555555555555',
  'React Hooks Deep Dive',
  'Master React hooks including useState, useEffect, useContext, and custom hooks. Learn when and how to use each hook effectively.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '35:20',
  1,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample community posts
INSERT INTO community_posts (
  id,
  author_id,
  instructor_id,
  category,
  title,
  content,
  image_url,
  is_pinned,
  created_at
) VALUES 
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'announcements',
  'Welcome to Web Development Academy!',
  'Welcome everyone to our learning community! I am excited to have you here. Please introduce yourself and let us know what you hope to learn.',
  null,
  true,
  now()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'introduction',
  'Hello from Mike!',
  'Hi everyone! I am Mike and I am excited to start learning web development. Looking forward to connecting with all of you!',
  null,
  false,
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create sample reviews
INSERT INTO reviews (
  id,
  course_id,
  student_id,
  rating,
  review_text,
  created_at
) VALUES 
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  5,
  'Amazing course! Sarah explains everything so clearly and the projects are really practical. Highly recommended!',
  now()
) ON CONFLICT (id) DO NOTHING;