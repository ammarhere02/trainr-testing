/*
  # Authentication Schema for Trainr

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `role` (text, default 'student')
      - `org_id` (uuid, references organizations)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamptz, default now())
    
    - `organizations`
      - `id` (uuid, primary key)
      - `subdomain` (text, unique)
      - `name` (text)
      - `logo_url` (text)
      - `color` (text)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read/update their own profiles
    - Add policies for organization access

  3. Functions
    - Auto-create profile on user signup
*/

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
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  role text DEFAULT 'student' CHECK (role IN ('student', 'educator')),
  org_id uuid REFERENCES organizations(id),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.org_id = organizations.id 
      AND profiles.role = 'educator'
    )
  );

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample organizations for testing
INSERT INTO organizations (subdomain, name, logo_url, color) VALUES
  ('coachjane', 'Coach Jane Academy', null, '#7c3aed'),
  ('webdevacademy', 'Web Development Academy', null, '#2563eb'),
  ('designschool', 'Design School Pro', null, '#059669')
ON CONFLICT (subdomain) DO NOTHING;