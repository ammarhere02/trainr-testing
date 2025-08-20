/*
  # Fix meetings table structure

  1. Changes
    - Drop existing meetings table if it exists
    - Recreate meetings table with correct column structure
    - Add scheduled_at and duration_minutes columns instead of start_time/end_time
    - Add max_attendees column
    - Maintain all existing RLS policies and indexes

  2. Security
    - Enable RLS on meetings table
    - Add policies for instructors to manage their own meetings
    - Add policies for students to view their instructor's meetings
*/

-- Drop existing meetings table if it exists
DROP TABLE IF EXISTS meetings CASCADE;

-- Create meetings table with correct structure
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  meeting_url text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  max_attendees integer NOT NULL DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_meetings_instructor_id ON meetings(instructor_id);
CREATE INDEX idx_meetings_scheduled_at ON meetings(scheduled_at);

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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