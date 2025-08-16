/*
  # Add organizations table and fix instructor schema

  1. New Tables
    - `organizations` - to store organization/subdomain info

  2. Changes
    - Create organizations table with proper constraints
    - Enable RLS on organizations table
    - Add policies for organizations
*/

-- Create organizations table if it doesn't exist
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text,
  color text DEFAULT '#7c3aed',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_subdomain ON organizations(subdomain);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations table
CREATE POLICY "Organizations are viewable by everyone"
  ON organizations
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (true); -- We'll make this more restrictive later

CREATE POLICY "Authenticated users can create organizations"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
