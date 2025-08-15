-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing profiles table and related policies/triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP TABLE IF EXISTS public.profiles;

-- Ensure instructors table is correctly defined
CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    full_name text NOT NULL,
    business_name text NOT NULL,
    subdomain text UNIQUE,
    logo_url text,
    color text DEFAULT '#7c3aed'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add updated_at trigger for instructors
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure students table is correctly defined
CREATE TABLE IF NOT EXISTS public.students (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    full_name text NOT NULL,
    instructor_id uuid REFERENCES public.instructors(id) ON DELETE CASCADE,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add updated_at trigger for students
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for instructors table
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructors
DROP POLICY IF EXISTS "Instructors can read own data" ON public.instructors;
CREATE POLICY "Instructors can read own data"
ON public.instructors
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Instructors can insert own data" ON public.instructors;
CREATE POLICY "Instructors can insert own data"
ON public.instructors
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Instructors can update own data" ON public.instructors;
CREATE POLICY "Instructors can update own data"
ON public.instructors
FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Instructors can delete own data" ON public.instructors;
CREATE POLICY "Instructors can delete own data"
ON public.instructors
FOR DELETE
USING (auth.uid() = id);

-- Enable Row Level Security for students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
DROP POLICY IF EXISTS "Students can read own data" ON public.students;
CREATE POLICY "Students can read own data"
ON public.students
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can insert own data" ON public.students;
CREATE POLICY "Students can insert own data"
ON public.students
FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Students can update own data" ON public.students;
CREATE POLICY "Students can update own data"
ON public.students
FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can delete own data" ON public.students;
CREATE POLICY "Students can delete own data"
ON public.students
FOR DELETE
USING (auth.uid() = id);

-- Policy for instructors to read their students' data
DROP POLICY IF EXISTS "Instructors can read their students" ON public.students;
CREATE POLICY "Instructors can read their students"
ON public.students
FOR SELECT
USING (instructor_id = (SELECT id FROM public.instructors WHERE id = auth.uid()));

-- Trigger to create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'instructor' THEN
    INSERT INTO public.instructors (id, email, full_name, business_name, subdomain, color)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'business_name',
      NEW.raw_user_meta_data->>'subdomain',
      COALESCE(NEW.raw_user_meta_data->>'color', '#7c3aed')
    );
  ELSIF NEW.raw_user_meta_data->>'role' = 'student' THEN
    INSERT INTO public.students (id, email, full_name, instructor_id)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      (NEW.raw_user_meta_data->>'instructor_id')::uuid
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();