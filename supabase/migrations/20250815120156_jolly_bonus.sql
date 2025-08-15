/*
  # Update instructors and students tables for authentication sync

  1. Table Updates
    - Add `updated_at` column to both `instructors` and `students` tables
    - Ensure proper timestamp handling with automatic updates
    - Add triggers for automatic `updated_at` timestamp updates

  2. Authentication Sync
    - Both tables already have `id` (uuid) and `email` columns
    - Both tables already have `created_at` columns
    - Adding `updated_at` for complete auth sync compatibility

  3. Triggers
    - Add trigger functions to automatically update `updated_at` timestamps
    - Apply triggers to both tables for consistency
*/

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at column to instructors table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructors' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE instructors ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add updated_at column to students table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE students ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create trigger for instructors table
DROP TRIGGER IF EXISTS update_instructors_updated_at ON instructors;
CREATE TRIGGER update_instructors_updated_at
    BEFORE UPDATE ON instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for students table
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have updated_at = created_at
UPDATE instructors SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE students SET updated_at = created_at WHERE updated_at IS NULL;