/*
  # Fix Community Posts Category Constraint

  1. Problem
    - The community_posts table has a check constraint that's preventing post creation
    - The constraint "community_posts_category_check" is rejecting valid category values

  2. Solution
    - Drop the existing restrictive constraint
    - Add a new constraint that allows the category values used by the application
    - Allow: 'general', 'questions', 'wins', 'introduction', 'announcements', 'discussion', 'announcement'

  3. Changes
    - Remove old constraint
    - Add new flexible constraint for community post categories that matches the UI
*/

-- Drop the existing constraint that's causing issues
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_category_check;

-- Add a new constraint that allows the categories actually used by the application
ALTER TABLE community_posts
ADD CONSTRAINT community_posts_category_check
CHECK (category IN ('general', 'questions', 'wins', 'introduction', 'announcements', 'discussion', 'announcement', 'question', 'resource', 'tutorial', 'news', 'help'));

-- Ensure any existing posts with invalid categories are updated
UPDATE community_posts
SET category = 'general'
WHERE category NOT IN ('general', 'questions', 'wins', 'introduction', 'announcements', 'discussion', 'announcement', 'question', 'resource', 'tutorial', 'news', 'help');
