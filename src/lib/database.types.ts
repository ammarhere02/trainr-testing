export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: string | null
          org_id: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          role?: string | null
          org_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: string | null
          org_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      instructors: {
        Row: {
          id: string
          email: string
          full_name: string
          business_name: string
          subdomain: string
          logo_url: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          business_name: string
          subdomain: string
          logo_url?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          business_name?: string
          subdomain?: string
          logo_url?: string | null
          color?: string | null
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          email: string
          full_name: string
          instructor_id: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          instructor_id: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          instructor_id?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          instructor_id: string
          title: string
          description: string
          image_url: string | null
          level: string
          type: string
          price: number | null
          published: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          instructor_id: string
          title: string
          description: string
          image_url?: string | null
          level: string
          type: string
          price?: number | null
          published?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          instructor_id?: string
          title?: string
          description?: string
          image_url?: string | null
          level?: string
          type?: string
          price?: number | null
          published?: boolean | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          video_source: string | null
          duration: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          video_source?: string | null
          duration?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          video_source?: string | null
          duration?: string | null
          order_index?: number
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          instructor_id: string
          category: string
          title: string
          content: string
          image_url: string | null
          video_url: string | null
          is_pinned: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          instructor_id: string
          category: string
          title: string
          content: string
          image_url?: string | null
          video_url?: string | null
          is_pinned?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          instructor_id?: string
          category?: string
          title?: string
          content?: string
          image_url?: string | null
          video_url?: string | null
          is_pinned?: boolean | null
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          course_id: string
          student_id: string
          rating: number
          review_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          student_id: string
          rating: number
          review_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          student_id?: string
          rating?: number
          review_text?: string | null
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          instructor_id: string
          title: string
          description: string | null
          meeting_url: string
          scheduled_at: string
          duration_minutes: number | null
          max_attendees: number | null
          created_at: string
        }
        Insert: {
          id?: string
          instructor_id: string
          title: string
          description?: string | null
          meeting_url: string
          scheduled_at: string
          duration_minutes?: number | null
          max_attendees?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          instructor_id?: string
          title?: string
          description?: string | null
          meeting_url?: string
          scheduled_at?: string
          duration_minutes?: number | null
          max_attendees?: number | null
          created_at?: string
        }
      }
      course_analytics: {
        Row: {
          id: string
          course_id: string
          total_students: number | null
          avg_rating: number | null
          total_reviews: number | null
          completion_rate: number | null
          revenue: number | null
          last_updated: string
        }
        Insert: {
          id?: string
          course_id: string
          total_students?: number | null
          avg_rating?: number | null
          total_reviews?: number | null
          completion_rate?: number | null
          revenue?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          course_id?: string
          total_students?: number | null
          avg_rating?: number | null
          total_reviews?: number | null
          completion_rate?: number | null
          revenue?: number | null
          last_updated?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}