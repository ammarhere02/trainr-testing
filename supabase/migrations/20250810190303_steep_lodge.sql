/*
  # Create Trainr Database Schema

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `subdomain` (text, unique)
      - `name` (text)
      - `logo_url` (text, optional)
      - `color` (text, default purple)
      - `created_at` (timestamp)
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role` (text, student or educator)
      - `org_id` (uuid, references organizations)
      - `full_name` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public organization viewing
    - Add policies for user profile management
    - Add policy for educators to update their organizations

  3. Automation
    - Create function to automatically create profiles for new users
    - Create trigger to call function when users sign up
</sql>

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uid(),
  role text DEFAULT 'student' CHECK (role IN ('student', 'educator')),
  org_id uuid REFERENCES organizations(id),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for organizations
CREATE POLICY "Organizations are viewable by everyone" 
  ON organizations 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

CREATE POLICY "Users can update their own organization" 
  ON organizations 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = uid() 
      AND profiles.org_id = organizations.id 
      AND profiles.role = 'educator'
    )
  );

-- Create policies for profiles
CREATE POLICY "Users can insert own profile" 
  ON profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (uid() = id);

CREATE POLICY "Users can read own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();