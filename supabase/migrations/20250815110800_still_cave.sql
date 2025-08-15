/*
  # Trainr Platform Database Schema

  1. New Tables
    - `instructors`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `business_name` (text)
      - `subdomain` (text, unique)
      - `logo_url` (text, nullable)
      - `color` (text, default purple)
      - `created_at` (timestamp)
    
    - `students`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `instructor_id` (uuid, foreign key)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
    
    - `courses`
      - `id` (uuid, primary key)
      - `instructor_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text, nullable)
      - `level` (text, check constraint)
      - `type` (text, check constraint)
      - `price` (numeric, default 0)
      - `published` (boolean, default false)
      - `created_at` (timestamp)
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text, nullable)
      - `video_url` (text, nullable)
      - `video_source` (text, nullable, check constraint)
      - `duration` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `community_posts`
      - `id` (uuid, primary key)
      - `author_id` (uuid, foreign key to students or instructors)
      - `instructor_id` (uuid, foreign key to instructors)
      - `category` (text)
      - `title` (text)
      - `content` (text)
      - `image_url` (text, nullable)
      - `video_url` (text, nullable)
      - `is_pinned` (boolean, default false)
      - `created_at` (timestamp)
    
    - `comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key to students or instructors)
      - `content` (text)
      - `created_at` (timestamp)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `rating` (integer, 1-5)
      - `review_text` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for instructors to manage their own content
    - Add policies for students to access content from their instructor
    - Add policies for community interaction within instructor's organization

  3. Indexes
    - Add indexes for frequently queried columns
    - Unique constraints for email fields and subdomain
*/

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  business_name text NOT NULL,
  subdomain text UNIQUE NOT NULL,
  logo_url text,
  color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  level text NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  type text NOT NULL CHECK (type IN ('free', 'paid')),
  price numeric DEFAULT 0,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  video_url text,
  video_source text CHECK (video_source IN ('youtube', 'drive', 'cloudflare_stream', 'vimeo', 'loom')),
  duration text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_index)
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL, -- Can reference either students.id or instructors.id
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  video_url text,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL, -- Can reference either students.id or instructors.id
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, student_id) -- One review per student per course
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(published);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_community_posts_instructor_id ON community_posts(instructor_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_student_id ON reviews(student_id);

-- Enable Row Level Security on all tables
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructors table
CREATE POLICY "Instructors can read own data"
  ON instructors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Instructors can update own data"
  ON instructors
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read instructor public data"
  ON instructors
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for students table
CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Students can update own data"
  ON students
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Instructors can read their students"
  ON students
  FOR SELECT
  TO authenticated
  USING (instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id));

-- RLS Policies for courses table
CREATE POLICY "Anyone can read published courses"
  ON courses
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Instructors can manage own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id));

-- RLS Policies for lessons table
CREATE POLICY "Anyone can read lessons of published courses"
  ON lessons
  FOR SELECT
  TO anon, authenticated
  USING (course_id IN (SELECT id FROM courses WHERE published = true));

CREATE POLICY "Instructors can manage lessons of own courses"
  ON lessons
  FOR ALL
  TO authenticated
  USING (course_id IN (SELECT id FROM courses WHERE instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id)));

-- RLS Policies for community_posts table
CREATE POLICY "Users can read posts in their instructor's community"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (
    instructor_id IN (
      SELECT instructor_id FROM students WHERE auth.uid() = id
      UNION
      SELECT id FROM instructors WHERE auth.uid() = id
    )
  );

CREATE POLICY "Authenticated users can create posts in their instructor's community"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    instructor_id IN (
      SELECT instructor_id FROM students WHERE auth.uid() = id
      UNION
      SELECT id FROM instructors WHERE auth.uid() = id
    )
  );

CREATE POLICY "Authors can update own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Instructors can pin/unpin posts in their community"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id));

CREATE POLICY "Authors can delete own posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for comments table
CREATE POLICY "Users can read comments on accessible posts"
  ON comments
  FOR SELECT
  TO authenticated
  USING (
    post_id IN (
      SELECT id FROM community_posts 
      WHERE instructor_id IN (
        SELECT instructor_id FROM students WHERE auth.uid() = id
        UNION
        SELECT id FROM instructors WHERE auth.uid() = id
      )
    )
  );

CREATE POLICY "Authenticated users can create comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    post_id IN (
      SELECT id FROM community_posts 
      WHERE instructor_id IN (
        SELECT instructor_id FROM students WHERE auth.uid() = id
        UNION
        SELECT id FROM instructors WHERE auth.uid() = id
      )
    )
  );

CREATE POLICY "Authors can update own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Students can create reviews for courses"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Create trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if user metadata indicates they should be an instructor
  IF NEW.raw_user_meta_data->>'role' = 'instructor' THEN
    INSERT INTO instructors (
      id,
      email,
      full_name,
      business_name,
      subdomain
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'subdomain', '')
    );
  ELSE
    -- Default to student, but we need instructor_id
    -- This will be handled in the application logic
    NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();



CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  meeting_url text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meetings_instructor_id ON meetings(instructor_id);
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can manage own meetings"
  ON meetings
  FOR ALL
  TO authenticated
  USING (instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id));

CREATE POLICY "Students can view meetings of their instructor"
  ON meetings
  FOR SELECT
  TO authenticated
  USING (instructor_id IN (SELECT instructor_id FROM students WHERE auth.uid() = id));


CREATE TABLE IF NOT EXISTS course_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  total_students integer DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_course_analytics_course_id ON course_analytics(course_id);
ALTER TABLE course_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can view own course analytics"
  ON course_analytics
  FOR SELECT
  TO authenticated
  USING (course_id IN (
    SELECT id FROM courses WHERE instructor_id IN (SELECT id FROM instructors WHERE auth.uid() = id)
  ));


CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    role text NOT NULL CHECK (role IN ('instructor', 'student')),
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    full_name text NOT NULL,
    avatar_url text
);