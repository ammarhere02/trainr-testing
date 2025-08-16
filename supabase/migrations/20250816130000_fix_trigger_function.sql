/*
  # Fix the handle_new_user trigger function

  1. Issues Fixed
    - Remove subdomain field from instructors insert (table doesn't have this column)
    - Make the function more robust to handle missing metadata
    - Ensure it doesn't fail if business_name is not provided

  2. Changes
    - Update trigger function to match actual table schema
    - Remove subdomain handling from trigger (will be handled in app)
*/

-- Drop the existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the trigger function to match actual schema
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if user metadata indicates they should be an instructor
  IF NEW.raw_user_meta_data->>'role' = 'instructor' THEN
    INSERT INTO instructors (
      id,
      email,
      full_name,
      business_name
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'business_name', 'My Business')
    );
  ELSE
    -- For students, we'll handle this in the application logic
    -- since we need instructor_id which isn't available in metadata
    NULL;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
