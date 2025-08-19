-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create community_messages table
CREATE TABLE IF NOT EXISTS community_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create community_members table for tracking membership
CREATE TABLE IF NOT EXISTS community_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(community_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communities_instructor_id ON communities(instructor_id);
CREATE INDEX IF NOT EXISTS idx_communities_course_id ON communities(course_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_community_id ON community_messages(community_id);
CREATE INDEX IF NOT EXISTS idx_community_messages_author_id ON community_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);

-- Enable RLS
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communities
CREATE POLICY "Instructors can manage their own communities"
ON communities FOR ALL
USING (instructor_id = auth.uid());

CREATE POLICY "Students can view communities they're enrolled in"
ON communities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.community_id = communities.id
    AND cm.user_id = auth.uid()
  )
);

-- RLS Policies for community_messages
CREATE POLICY "Community members can view messages"
ON community_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.community_id = community_messages.community_id
    AND cm.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM communities c
    WHERE c.id = community_messages.community_id
    AND c.instructor_id = auth.uid()
  )
);

CREATE POLICY "Instructors can manage messages in their communities"
ON community_messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM communities c
    WHERE c.id = community_messages.community_id
    AND c.instructor_id = auth.uid()
  )
);

-- RLS Policies for community_members
CREATE POLICY "Community members can view membership"
ON community_members FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM communities c
    WHERE c.id = community_members.community_id
    AND c.instructor_id = auth.uid()
  )
);

CREATE POLICY "Instructors can manage membership in their communities"
ON community_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM communities c
    WHERE c.id = community_members.community_id
    AND c.instructor_id = auth.uid()
  )
);

-- Function to update member count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities 
    SET member_count = member_count + 1,
        updated_at = now()
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities 
    SET member_count = member_count - 1,
        updated_at = now()
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update message count
CREATE OR REPLACE FUNCTION update_community_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities 
    SET message_count = message_count + 1,
        updated_at = now()
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities 
    SET message_count = message_count - 1,
        updated_at = now()
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER trigger_update_member_count
AFTER INSERT OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

CREATE TRIGGER trigger_update_message_count
AFTER INSERT OR DELETE ON community_messages
FOR EACH ROW EXECUTE FUNCTION update_community_message_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_communities_updated_at
    BEFORE UPDATE ON communities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_messages_updated_at
    BEFORE UPDATE ON community_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
