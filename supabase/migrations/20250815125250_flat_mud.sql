/*
  # Complete Authentication System with Role-Based Access

  1. Database Functions
    - `handle_new_user()` - Automatically creates instructor/student profiles
    - `update_updated_at_column()` - Auto-updates timestamps

  2. Tables
    - `instructors` - Instructor profiles with business info
    - `students` - Student profiles linked to instructors
    - Both tables have RLS enabled with proper policies

  3. Security
    - Row Level Security (RLS) enabled on all tables
    - Users can only access their own data
    - Instructors can read their students' data
    - Auto-updated timestamps on all changes

  4. Triggers
    - Auto-create profiles when auth users are created
    - Auto-update timestamps on record changes
*/

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create instructors table if not exists
CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  business_name text NOT NULL,
  subdomain text UNIQUE,
  logo_url text,
  color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table if not exists
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  instructor_id uuid REFERENCES instructors(id) ON DELETE CASCADE,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on instructors table
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for instructors
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

-- Enable RLS on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
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
  USING (instructor_id IN (
    SELECT id FROM instructors WHERE id = auth.uid()
  ));

-- Create updated_at triggers
DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
CREATE TRIGGER update_instructors_updated_at
  BEFORE UPDATE ON instructors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role text;
  instructor_id_param uuid;
BEGIN
  -- Get role from user metadata
  user_role := NEW.raw_user_meta_data->>'role';
  
  IF user_role = 'instructor' THEN
    -- Create instructor profile
    INSERT INTO instructors (
      id,
      email,
      full_name,
      business_name,
      subdomain,
      color
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'subdomain', ''),
      COALESCE(NEW.raw_user_meta_data->>'color', '#7c3aed')
    );
    
  ELSIF user_role = 'student' THEN
    -- Get instructor_id from metadata
    instructor_id_param := (NEW.raw_user_meta_data->>'instructor_id')::uuid;
    
    -- Create student profile
    INSERT INTO students (
      id,
      email,
      full_name,
      instructor_id
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      instructor_id_param
    );
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();