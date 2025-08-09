import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  role: string
  org_id: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface AuthResult {
  user: User | null
  error: Error | null
}

// Sign in with email and password
export async function signInEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    return {
      user: data.user,
      error: error ? new Error(error.message) : null
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Sign in with Google OAuth
export async function signInGoogle(redirectTo?: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || `${window.location.origin}/post-login`
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

// Send magic link
export async function sendMagicLink(email: string, redirectTo?: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo || `${window.location.origin}/post-login`
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }
}

// Sign up with email and password
export async function signUpEmail(email: string, password: string, fullName: string, role: string = 'student', orgId?: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          org_id: orgId
        }
      }
    })
    
    return {
      user: data.user,
      error: error ? new Error(error.message) : null
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Get current user profile
export async function getProfile(userId?: string): Promise<Profile | null> {
  try {
    const id = userId || (await supabase.auth.getUser()).data.user?.id
    
    if (!id) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

// Sign out
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })
  
  if (error) {
    throw new Error(error.message)
  }
}