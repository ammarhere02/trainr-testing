import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: string
          org_id: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          role?: string
          org_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          org_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          subdomain: string
          name: string
          logo_url: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          subdomain: string
          name: string
          logo_url?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          subdomain?: string
          name?: string
          logo_url?: string | null
          color?: string | null
          created_at?: string
        }
      }
    }
  }
}