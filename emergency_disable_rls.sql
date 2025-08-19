-- EMERGENCY: Disable RLS temporarily to fix policy recursion issues
-- Only run this if you're still getting infinite recursion errors

-- Disable RLS on problem tables temporarily
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Grant public access (temporary)
GRANT SELECT ON community_posts TO anon;
GRANT ALL ON community_posts TO authenticated;
GRANT SELECT ON profiles TO anon;
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON enrollments TO anon;
GRANT ALL ON enrollments TO authenticated;
GRANT SELECT ON courses TO anon;
GRANT ALL ON courses TO authenticated;

-- Refresh schema
NOTIFY pgrst, 'reload schema';

-- Note: This makes the tables publicly accessible, so re-enable RLS later
-- To re-enable, run:
-- ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;