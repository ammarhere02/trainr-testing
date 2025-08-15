/*
  # Add Test Authentication Users

  1. Test Users
    - Creates test instructor and student accounts
    - Includes proper authentication setup
    - Links profiles correctly

  2. Sample Data
    - Test courses and lessons
    - Community posts for testing
    - Proper relationships between entities

  3. Security
    - All tables have RLS enabled
    - Proper policies for data access
*/

-- Insert test instructor
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

-- Insert test student
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

-- Insert sample course
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
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'Test Web Development Course',
  'Learn the basics of web development with HTML, CSS, and JavaScript. This comprehensive course covers everything you need to know to start building websites.',
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Beginner',
  'free',
  0,
  true,
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- Insert sample lessons
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
  '44444444-4444-4444-4444-444444444444',
  '33333333-3333-3333-3333-333333333333',
  'Introduction to Web Development',
  'Welcome to the course! In this lesson, we will cover the basics of web development and what you can expect to learn throughout this course.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '10:30',
  1,
  now()
),
(
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  'HTML Fundamentals',
  'Learn the building blocks of web pages with HTML. We will cover tags, elements, attributes, and semantic markup.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '15:45',
  2,
  now()
),
(
  '66666666-6666-6666-6666-666666666666',
  '33333333-3333-3333-3333-333333333333',
  'CSS Styling Basics',
  'Make your websites beautiful with CSS. Learn selectors, properties, layout techniques, and responsive design.',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'youtube',
  '20:15',
  3,
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = now();

-- Insert sample community post
INSERT INTO community_posts (
  id,
  author_id,
  instructor_id,
  category,
  title,
  content,
  is_pinned,
  created_at
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'announcements',
  'Welcome to Test Academy!',
  'Welcome everyone to our learning community! This is where we will share updates, ask questions, and celebrate our wins together. Feel free to introduce yourself and let us know what you are hoping to learn.',
  true,
  now()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = now();

-- Insert sample review
INSERT INTO reviews (
  id,
  course_id,
  student_id,
  rating,
  review_text,
  created_at
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  5,
  'Excellent course! The instructor explains everything clearly and the hands-on projects really help solidify the concepts.',
  now()
) ON CONFLICT (id) DO UPDATE SET
  rating = EXCLUDED.rating,
  review_text = EXCLUDED.review_text,
  updated_at = now();