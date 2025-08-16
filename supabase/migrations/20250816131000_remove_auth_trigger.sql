/*
  # Remove problematic auth trigger

  1. Changes
    - Drop the auth trigger that's causing signup failures
    - Let the application handle all profile creation manually
    - This prevents database errors during user signup

  2. Rationale
    - The trigger was trying to insert into instructors table with wrong schema
    - Manual profile creation in the app is more reliable and gives better error handling
*/

-- Drop the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the trigger function as well
DROP FUNCTION IF EXISTS handle_new_user();

-- Add a comment to explain why we're not using triggers
COMMENT ON TABLE instructors IS 'Profiles are created manually in the application after successful auth signup';
COMMENT ON TABLE students IS 'Profiles are created manually in the application after successful auth signup';
