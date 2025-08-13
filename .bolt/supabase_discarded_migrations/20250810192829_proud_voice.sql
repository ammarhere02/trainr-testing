/*
  # Create Trainr Database Schema

  1. New Tables
    - `organizations` - Store business/educator information
      - `id` (uuid, primary key)
      - `subdomain` (text, unique) - for custom URLs like "johndoe.trainr.app"
      - `name` (text) - business name
      - `logo_url` (text, optional) - logo image URL
      - `color` (text) - brand color, defaults to purple
      - `created_at` (timestamp)
    
    - `profiles` - Store user profile information
      - `id` (uuid, primary key) - links to auth.users
      - `role` (text) - either 'student' or 'educator'
      - `org_id` (uuid, optional) - links to organizations table
      - `full_name` (text, optional) - user's display name
      - `avatar_url` (text, optional) - profile picture URL
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Organizations are viewable by everyone (for public educator pages)
    - Educators can update their own organization
    - Users can manage their own profile data

  3. Automatic Profile Creation
    - Trigger function to create profile when user signs up
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

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Organizations policies
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

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();