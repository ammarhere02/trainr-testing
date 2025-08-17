export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: string;
          phone: string | null;
          bio: string | null;
          password_hash: string | null;
          email_verified: boolean | null;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role: string;
          phone?: string | null;
          bio?: string | null;
          password_hash?: string | null;
          email_verified?: boolean | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: string;
          phone?: string | null;
          bio?: string | null;
          password_hash?: string | null;
          email_verified?: boolean | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
      };
      instructors: {
        Row: {
          id: string;
          business_name: string;
          logo_url: string | null;
          website: string | null;
          description: string | null;
          specialization: string[] | null;
          years_of_experience: number | null;
          social_links: Json | null;
          total_courses: number | null;
          total_students: number | null;
          average_rating: number | null;
          is_verified: boolean | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          specialization?: string[] | null;
          years_of_experience?: number | null;
          social_links?: Json | null;
          total_courses?: number | null;
          total_students?: number | null;
          average_rating?: number | null;
          is_verified?: boolean | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          specialization?: string[] | null;
          years_of_experience?: number | null;
          social_links?: Json | null;
          total_courses?: number | null;
          total_students?: number | null;
          average_rating?: number | null;
          is_verified?: boolean | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          instructor_id: string;
          title: string;
          slug: string;
          description: string;
          short_description: string | null;
          image_url: string | null;
          preview_video_url: string | null;
          level: string;
          category: string;
          tags: string[] | null;
          duration_hours: number | null;
          language: string | null;
          type: string;
          price: number | null;
          discount_price: number | null;
          requirements: string[] | null;
          what_you_learn: string[] | null;
          target_audience: string[] | null;
          total_enrollments: number | null;
          total_lessons: number | null;
          average_rating: number | null;
          total_reviews: number | null;
          published: boolean | null;
          featured: boolean | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          instructor_id: string;
          title: string;
          slug: string;
          description: string;
          short_description?: string | null;
          image_url?: string | null;
          preview_video_url?: string | null;
          level: string;
          category: string;
          tags?: string[] | null;
          duration_hours?: number | null;
          language?: string | null;
          type: string;
          price?: number | null;
          discount_price?: number | null;
          requirements?: string[] | null;
          what_you_learn?: string[] | null;
          target_audience?: string[] | null;
          total_enrollments?: number | null;
          total_lessons?: number | null;
          average_rating?: number | null;
          total_reviews?: number | null;
          published?: boolean | null;
          featured?: boolean | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          instructor_id?: string;
          title?: string;
          slug?: string;
          description?: string;
          short_description?: string | null;
          image_url?: string | null;
          preview_video_url?: string | null;
          level?: string;
          category?: string;
          tags?: string[] | null;
          duration_hours?: number | null;
          language?: string | null;
          type?: string;
          price?: number | null;
          discount_price?: number | null;
          requirements?: string[] | null;
          what_you_learn?: string[] | null;
          target_audience?: string[] | null;
          total_enrollments?: number | null;
          total_lessons?: number | null;
          average_rating?: number | null;
          total_reviews?: number | null;
          published?: boolean | null;
          featured?: boolean | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      enrollments: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          instructor_id: string;
          enrollment_date: string;
          completion_date: string | null;
          last_accessed_at: string | null;
          progress_percentage: number | null;
          status: string;
          payment_status: string | null;
          completed_lessons: string[] | null;
          total_time_spent: string | null;
          certificate_issued: boolean | null;
          certificate_issued_at: string | null;
          certificate_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          instructor_id: string;
          enrollment_date?: string;
          completion_date?: string | null;
          last_accessed_at?: string | null;
          progress_percentage?: number | null;
          status?: string;
          payment_status?: string | null;
          completed_lessons?: string[] | null;
          total_time_spent?: string | null;
          certificate_issued?: boolean | null;
          certificate_issued_at?: string | null;
          certificate_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          instructor_id?: string;
          enrollment_date?: string;
          completion_date?: string | null;
          last_accessed_at?: string | null;
          progress_percentage?: number | null;
          status?: string;
          payment_status?: string | null;
          completed_lessons?: string[] | null;
          total_time_spent?: string | null;
          certificate_issued?: boolean | null;
          certificate_issued_at?: string | null;
          certificate_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          section_name: string;
          title: string;
          description: string | null;
          content_type: string;
          content: string | null;
          video_url: string | null;
          video_source: string | null;
          video_duration: string | null;
          attachments: Json | null;
          external_links: Json | null;
          section_order: number;
          lesson_order: number;
          is_preview: boolean | null;
          is_mandatory: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          section_name: string;
          title: string;
          description?: string | null;
          content_type: string;
          content?: string | null;
          video_url?: string | null;
          video_source?: string | null;
          video_duration?: string | null;
          attachments?: Json | null;
          external_links?: Json | null;
          section_order: number;
          lesson_order: number;
          is_preview?: boolean | null;
          is_mandatory?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          section_name?: string;
          title?: string;
          description?: string | null;
          content_type?: string;
          content?: string | null;
          video_url?: string | null;
          video_source?: string | null;
          video_duration?: string | null;
          attachments?: Json | null;
          external_links?: Json | null;
          section_order?: number;
          lesson_order?: number;
          is_preview?: boolean | null;
          is_mandatory?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          course_id: string;
          student_id: string;
          instructor_id: string;
          rating: number;
          title: string | null;
          review_text: string;
          would_recommend: boolean | null;
          instructor_rating: number | null;
          content_rating: number | null;
          is_verified: boolean | null;
          is_featured: boolean | null;
          helpful_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          student_id: string;
          instructor_id: string;
          rating: number;
          title?: string | null;
          review_text: string;
          would_recommend?: boolean | null;
          instructor_rating?: number | null;
          content_rating?: number | null;
          is_verified?: boolean | null;
          is_featured?: boolean | null;
          helpful_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          student_id?: string;
          instructor_id?: string;
          rating?: number;
          title?: string | null;
          review_text?: string;
          would_recommend?: boolean | null;
          instructor_rating?: number | null;
          content_rating?: number | null;
          is_verified?: boolean | null;
          is_featured?: boolean | null;
          helpful_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          instructor_id: string;
          author_id: string;
          course_id: string | null;
          category: string;
          title: string;
          content: string;
          image_urls: string[] | null;
          video_url: string | null;
          attachments: Json | null;
          likes_count: number | null;
          comments_count: number | null;
          views_count: number | null;
          is_pinned: boolean | null;
          is_locked: boolean | null;
          is_archived: boolean | null;
          created_at: string;
          updated_at: string;
          pinned_at: string | null;
        };
        Insert: {
          id?: string;
          instructor_id: string;
          author_id: string;
          course_id?: string | null;
          category: string;
          title: string;
          content: string;
          image_urls?: string[] | null;
          video_url?: string | null;
          attachments?: Json | null;
          likes_count?: number | null;
          comments_count?: number | null;
          views_count?: number | null;
          is_pinned?: boolean | null;
          is_locked?: boolean | null;
          is_archived?: boolean | null;
          created_at?: string;
          updated_at?: string;
          pinned_at?: string | null;
        };
        Update: {
          id?: string;
          instructor_id?: string;
          author_id?: string;
          course_id?: string | null;
          category?: string;
          title?: string;
          content?: string;
          image_urls?: string[] | null;
          video_url?: string | null;
          attachments?: Json | null;
          likes_count?: number | null;
          comments_count?: number | null;
          views_count?: number | null;
          is_pinned?: boolean | null;
          is_locked?: boolean | null;
          is_archived?: boolean | null;
          created_at?: string;
          updated_at?: string;
          pinned_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_comment_id: string | null;
          content: string;
          likes_count: number | null;
          is_edited: boolean | null;
          is_deleted: boolean | null;
          created_at: string;
          updated_at: string;
          edited_at: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_comment_id?: string | null;
          content: string;
          likes_count?: number | null;
          is_edited?: boolean | null;
          is_deleted?: boolean | null;
          created_at?: string;
          updated_at?: string;
          edited_at?: string | null;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          parent_comment_id?: string | null;
          content?: string;
          likes_count?: number | null;
          is_edited?: boolean | null;
          is_deleted?: boolean | null;
          created_at?: string;
          updated_at?: string;
          edited_at?: string | null;
        };
      };
      communities: {
        Row: {
          id: string;
          instructor_id: string;
          course_id: string | null;
          name: string;
          description: string | null;
          member_count: number | null;
          message_count: number | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          instructor_id: string;
          course_id?: string | null;
          name: string;
          description?: string | null;
          member_count?: number | null;
          message_count?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          instructor_id?: string;
          course_id?: string | null;
          name?: string;
          description?: string | null;
          member_count?: number | null;
          message_count?: number | null;
          is_active?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_messages: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          is_pinned?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          is_pinned?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          role: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          role?: string | null;
          joined_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          role?: string | null;
          joined_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_enrolled_with_instructor: {
        Args: {
          p_student_id: string;
          p_instructor_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
