import { supabase } from "../supabase";

export interface CommunityWithCourse {
  id: string;
  name: string;
  description: string | null;
  instructor_id: string;
  course_id: string | null;
  course_name: string;
  member_count: number;
  message_count: number;
  is_active: boolean;
  created_at: string;
  courses?: {
    title: string;
  } | null;
}

export interface MessageWithAuthor {
  id: string;
  title?: string;
  content: string;
  author_id: string;
  community_id: string;
  created_at: string;
  message_type: string;
  is_pinned?: boolean;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface CommunityPostWithAuthor {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string | null;
  video_url?: string | null;
  is_pinned: boolean;
  likes: number;
  comments: number;
  commentAvatars: string[];
  created_at: string;
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export const communityApi = {
  // Get all communities for an instructor (using metadata posts)
  async getInstructorCommunities(
    instructorId: string
  ): Promise<CommunityWithCourse[]> {
    try {
      // Get community metadata posts (these store community info using special title prefix)
      const { data: communityPosts, error: postsError } = await supabase
        .from("community_posts")
        .select("*")
        .eq("instructor_id", instructorId)
        .eq("category", "announcement")
        .like("title", "[COMMUNITY_METADATA]%")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching communities:", postsError);
        throw new Error(`Failed to fetch communities: ${postsError.message}`);
      }

      if (!communityPosts || communityPosts.length === 0) {
        return [];
      }

      const communities: CommunityWithCourse[] = [];

      for (const post of communityPosts) {
        // Parse community metadata from the post content (JSON format)
        let communityData;
        try {
          communityData = JSON.parse(post.content);
        } catch (e) {
          console.warn("Invalid community metadata:", post.content);
          continue;
        }

        // Count messages for this community
        const { count: messageCount } = await supabase
          .from("community_posts")
          .select("*", { count: "exact", head: true })
          .eq("instructor_id", instructorId)
          .like("title", `[COMMUNITY:${post.id}]%`);

        const community: CommunityWithCourse = {
          id: post.id,
          name: communityData.name || "Unnamed Community",
          description: communityData.description || null,
          instructor_id: instructorId,
          course_id: communityData.course_id || null,
          course_name: communityData.course_name || "General Discussion",
          member_count: 5,
          message_count: messageCount || 0,
          is_active:
            communityData.is_active !== undefined
              ? communityData.is_active
              : true,
          created_at: post.created_at,
          courses: { title: communityData.course_name || "General Discussion" },
        };

        communities.push(community);
      }
      return communities;
    } catch (error) {
      console.error("Error in getInstructorCommunities:", error);
      throw new Error(`Failed to fetch communities: ${error}`);
    }
  },

  // Get messages for a community
  async getCommunityMessages(
    communityId: string
  ): Promise<MessageWithAuthor[]> {
    try {
      const { data: messages, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          author:profiles!community_posts_author_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `
        )
        .like("title", `[COMMUNITY:${communityId}]%`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }

      const formattedMessages: MessageWithAuthor[] = (messages || []).map(
        (msg) => {
          const cleanTitle = msg.title.replace(/^\[COMMUNITY:[^\]]+\]\s*/, "");
          const author = msg.author as any;

          return {
            id: msg.id,
            title: cleanTitle || "Untitled Message",
            content: msg.content,
            author_id: msg.author_id,
            community_id: communityId,
            created_at: msg.created_at,
            message_type: msg.category,
            is_pinned: msg.is_pinned || false,
            author: {
              id: author?.id || msg.author_id,
              first_name: author?.full_name?.split(" ")[0] || "Unknown",
              last_name:
                author?.full_name?.split(" ").slice(1).join(" ") || "User",
              avatar_url: author?.avatar_url || null,
            },
          };
        }
      );
      return formattedMessages;
    } catch (error) {
      console.error("Error getting community messages:", error);
      throw new Error(`Failed to fetch messages: ${error}`);
    }
  },

  // Create a new community using metadata approach
  async createCommunity(data: {
    name: string;
    description: string;
    instructor_id: string;
    course_id: string;
    course_name?: string;
  }) {
    try {
      // Create metadata post with JSON content storing community info
      const communityMetadata = {
        name: data.name,
        description: data.description,
        course_id: data.course_id,
        course_name: data.course_name || "General Discussion",
        created_by: data.instructor_id,
        is_active: true, // Initialize as active by default
      };

      const { data: metadataPost, error } = await supabase
        .from("community_posts")
        .insert({
          instructor_id: data.instructor_id,
          author_id: data.instructor_id,
          course_id: null, // Always null to avoid foreign key issues
          category: "announcement",
          title: `[COMMUNITY_METADATA] ${data.name} - ${Date.now()}`,
          content: JSON.stringify(communityMetadata),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community metadata:", error);
        throw new Error(`Failed to create community: ${error.message}`);
      }

      // Return the community object
      return {
        id: metadataPost.id,
        name: data.name,
        description: data.description,
        instructor_id: data.instructor_id,
        course_id: data.course_id,
        course_name: data.course_name || "General Discussion",
        member_count: 1,
        message_count: 0,
        is_active: true,
        created_at: metadataPost.created_at,
        courses: { title: data.course_name || "General Discussion" },
      };
    } catch (error) {
      console.error("Error in createCommunity:", error);
      throw new Error(`Failed to create community: ${error}`);
    }
  },

  // Update a community by updating its metadata post
  async updateCommunity(
    id: string,
    data: {
      name: string;
      description?: string;
      course_id?: string;
      course_name?: string;
      is_active?: boolean;
    }
  ): Promise<Partial<CommunityWithCourse>> {
    try {
      console.log("Updating community:", id, data);

      // Get current metadata
      const { data: currentPost, error: fetchError } = await supabase
        .from("community_posts")
        .select("content, title")
        .eq("id", id)
        .eq("category", "announcement")
        .like("title", "[COMMUNITY_METADATA]%")
        .single();

      if (fetchError || !currentPost) {
        throw new Error("Community not found");
      }

      // Parse and update metadata
      let metadata;
      try {
        metadata = JSON.parse(currentPost.content);
      } catch (e) {
        metadata = {};
      }

      const updatedMetadata = {
        ...metadata,
        name: data.name,
        description: data.description || metadata.description,
        course_id: data.course_id || metadata.course_id,
        course_name: data.course_name || metadata.course_name,
        is_active:
          data.is_active !== undefined ? data.is_active : metadata.is_active,
      };

      // Update the metadata post
      const { error: updateError } = await supabase
        .from("community_posts")
        .update({
          title: `[COMMUNITY_METADATA] ${data.name} - ${Date.now()}`,
          content: JSON.stringify(updatedMetadata),
        })
        .eq("id", id);

      if (updateError) {
        throw new Error(`Failed to update community: ${updateError.message}`);
      }

      return {
        name: data.name,
        description: data.description || null,
        course_id: data.course_id,
        course_name: data.course_name,
        is_active: data.is_active,
      };
    } catch (error) {
      console.error("Error in updateCommunity:", error);
      throw new Error(`Failed to update community: ${error}`);
    }
  },

  // Delete a community and all its messages
  async deleteCommunity(id: string) {
    try {
      // First delete all messages associated with this community
      const { error: messagesError } = await supabase
        .from("community_posts")
        .delete()
        .like("title", `[COMMUNITY:${id}]%`);

      if (messagesError) {
        console.warn("Error deleting community messages:", messagesError);
      }

      // Then delete the metadata post
      const { error: metadataError } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", id)
        .eq("category", "announcement")
        .like("title", "[COMMUNITY_METADATA]%");

      if (metadataError) {
        console.error("Error deleting community metadata:", metadataError);
        throw new Error(`Failed to delete community: ${metadataError.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deleteCommunity:", error);
      throw new Error(`Failed to delete community: ${error}`);
    }
  },

  // Create a new message in a community
  async createMessage(data: {
    community_id: string;
    title: string;
    content: string;
    author_id: string;
    is_pinned: boolean;
  }) {
    try {
      // Get the instructor_id from the community metadata
      const { data: communityMetadata, error: metadataError } = await supabase
        .from("community_posts")
        .select("instructor_id")
        .eq("id", data.community_id)
        .eq("category", "announcement")
        .like("title", "[COMMUNITY_METADATA]%")
        .single();

      if (metadataError) {
        console.error("Error fetching community metadata:", metadataError);
      }

      const { data: post, error: insertError } = await supabase
        .from("community_posts")
        .insert({
          course_id: null,
          title: `[COMMUNITY:${data.community_id}] ${data.title}`,
          content: data.content,
          author_id: data.author_id,
          instructor_id: communityMetadata?.instructor_id || data.author_id,
          category: data.is_pinned ? "announcement" : "discussion",
        })
        .select(
          `
          *,
          author:profiles!community_posts_author_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `
        )
        .single();

      if (insertError) {
        console.error("Error creating message:", insertError);
        throw new Error(`Failed to create message: ${insertError.message}`);
      }

      const author = post.author as any;

      const formattedMessage = {
        id: post.id,
        title: data.title,
        content: post.content,
        author_id: post.author_id,
        community_id: data.community_id,
        created_at: post.created_at,
        message_type: post.category,
        author: {
          id: author?.id || post.author_id,
          first_name: author?.full_name?.split(" ")[0] || "Unknown",
          last_name: author?.full_name?.split(" ").slice(1).join(" ") || "User",
          avatar_url: author?.avatar_url || null,
        },
      };

      return formattedMessage;
    } catch (error) {
      console.error("Error in createMessage:", error);
      throw new Error(`Failed to create message: ${error}`);
    }
  },

  // Update a message
  async updateMessage(
    id: string,
    data: { title: string; content: string; is_pinned: boolean }
  ) {
    try {
      const { data: post, error } = await supabase
        .from("community_posts")
        .update({
          content: data.content,
          category: data.is_pinned ? "announcement" : "discussion",
          is_pinned: data.is_pinned,
        })
        .eq("id", id)
        .select(
          `
          *,
          author:profiles!community_posts_author_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `
        )
        .single();

      if (error) {
        console.error("Error updating message:", error);
        throw new Error(`Failed to update message: ${error.message}`);
      }

      const author = post.author as any;

      const formattedMessage = {
        id: post.id,
        title: data.title,
        content: post.content,
        author_id: post.author_id,
        community_id: post.course_id,
        created_at: post.created_at,
        message_type: post.category,
        is_pinned: post.is_pinned || false,
        author: {
          id: author?.id || post.author_id,
          first_name: author?.full_name?.split(" ")[0] || "Unknown",
          last_name: author?.full_name?.split(" ").slice(1).join(" ") || "User",
          avatar_url: author?.avatar_url || null,
        },
      };

      return formattedMessage;
    } catch (error) {
      console.error("Error in updateMessage:", error);
      throw new Error(`Failed to update message: ${error}`);
    }
  },

  // Delete a message
  async deleteMessage(id: string) {
    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting message:", error);
        throw new Error(`Failed to delete message: ${error.message}`);
      }
      return { success: true };
    } catch (error) {
      console.error("Error in deleteMessage:", error);
      throw new Error(`Failed to delete message: ${error}`);
    }
  },

  // Get community members from enrollments
  async getCommunityMembers(_communityId: string) {
    try {
      // For now, return mock data since we don't have proper enrollment setup
      return [];
    } catch (error) {
      console.error("Error in getCommunityMembers:", error);
      throw new Error(`Failed to fetch community members: ${error}`);
    }
  },

  // Get instructor's courses for community creation (predefined list)
  async getInstructorCourses(_instructorId: string) {
    // Return a predefined list of course options
    return [
      { id: "web-dev-fundamentals", title: "Web Development Fundamentals" },
      { id: "javascript-mastery", title: "JavaScript Mastery" },
      { id: "react-complete-guide", title: "React Complete Guide" },
      { id: "nodejs-backend", title: "Node.js Backend Development" },
      { id: "fullstack-project", title: "Full Stack Project" },
      { id: "general-discussion", title: "General Discussion" },
    ];
  },
};

export async function getCommunityPosts(): Promise<CommunityPostWithAuthor[]> {
  try {
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select(
        `
        *,
        author:profiles!community_posts_author_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `
      )
      .not("title", "like", "[COMMUNITY_METADATA]%")
      .not("title", "like", "[COMMUNITY:%")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (posts || []).map((post) => ({
      id: post.id,
      title: post.title || "Community Post",
      content: post.content,
      category: post.category,
      image_url: post.image_urls?.[0] || null,
      video_url: post.video_url,
      is_pinned: post.category === "announcement",
      likes: Math.floor(Math.random() * 50),
      comments: Math.floor(Math.random() * 20),
      commentAvatars: [
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60",
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60",
      ],
      created_at: post.created_at,
      author: {
        full_name: (post.author as any)?.full_name || "Unknown User",
        avatar_url: (post.author as any)?.avatar_url || null,
      },
    }));
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw new Error(`Failed to fetch posts: ${error}`);
  }
}

export async function createCommunityPost(data: {
  title: string;
  content: string;
  category: string;
  image_url?: string | null;
  video_url?: string | null;
}): Promise<CommunityPostWithAuthor> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: post, error } = await supabase
      .from("community_posts")
      .insert({
        title: data.title,
        content: data.content,
        category: data.category,
        image_urls: data.image_url ? [data.image_url] : null,
        video_url: data.video_url,
        author_id: user.id,
        instructor_id: user.id,
        course_id: null,
      })
      .select(
        `
        *,
        author:profiles!community_posts_author_id_fkey(
          id,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (error) throw error;

    return {
      id: post.id,
      title: post.title || "Community Post",
      content: post.content,
      category: post.category,
      image_url: post.image_urls?.[0] || null,
      video_url: post.video_url,
      is_pinned: post.category === "announcement",
      likes: 0,
      comments: 0,
      commentAvatars: [],
      created_at: post.created_at,
      author: {
        full_name: (post.author as any)?.full_name || "Unknown User",
        avatar_url: (post.author as any)?.avatar_url || null,
      },
    };
  } catch (error) {
    console.error("Error creating community post:", error);
    throw new Error(`Failed to create post: ${error}`);
  }
}

export async function togglePinPost(
  postId: string
): Promise<{ is_pinned: boolean }> {
  try {
    // Get current post to check its category
    const { data: currentPost, error: fetchError } = await supabase
      .from("community_posts")
      .select("category")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("Error fetching post:", fetchError);
      throw fetchError;
    }

    // Toggle between announcement (pinned) and discussion (unpinned)
    const newCategory =
      currentPost.category === "announcement" ? "discussion" : "announcement";

    const { error: updateError } = await supabase
      .from("community_posts")
      .update({ category: newCategory })
      .eq("id", postId);

    if (updateError) {
      console.error("Error updating post category:", updateError);
      throw updateError;
    }

    const isPinned = newCategory === "announcement";

    return { is_pinned: isPinned };
  } catch (error) {
    console.error("Error toggling pin:", error);
    throw new Error(`Failed to toggle pin: ${error}`);
  }
}
