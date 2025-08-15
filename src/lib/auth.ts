import { supabase } from './supabase'
import type { Database } from './database.types'

// Type definitions
export type Instructor = Database['public']['Tables']['instructors']['Row']
export type Student = Database['public']['Tables']['students']['Row']

export interface Profile {
  id: string
  role: 'instructor' | 'student'
  data: Instructor | Student
}

export interface AuthResult {
  user: any | null
  error: any | null
}

// Get current authenticated user
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Sign in with email and password
export async function signInEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, error }
    }

    // Check if email is verified
    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut()
      return { 
        user: null, 
        error: { message: 'Please verify your email before signing in. Check your inbox for a verification link.' }
      }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { user: null, error }
  }
}

// Sign up instructor
export async function signUpInstructor(
  email: string, 
  password: string, 
  fullName: string, 
  businessName: string, 
  subdomain?: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
          subdomain: subdomain || '',
          role: 'instructor'
        }
      }
    })

    if (error) {
      return { user: null, error }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Instructor signup error:', error)
    return { user: null, error }
  }
}

// Sign up student
export async function signUpStudent(
  email: string, 
  password: string, 
  fullName: string, 
  instructorId: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          instructor_id: instructorId,
          role: 'student'
        }
      }
    })

    if (error) {
      return { user: null, error }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Student signup error:', error)
    return { user: null, error }
  }
}

// Get user profile from appropriate table
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) {
      throw new Error('User not authenticated')
    }

    const role = user.user_metadata?.role

    if (role === 'instructor') {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { id: userId, role: 'instructor', data }
    } else if (role === 'student') {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return { id: userId, role: 'student', data }
    }

    return null
  } catch (error) {
    console.error('Error getting profile:', error)
    return null
  }
}

// Get instructor profile
export async function getInstructorProfile(userId: string): Promise<Instructor | null> {
  try {
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting instructor profile:', error)
    return null
  }
}

// Get student profile
export async function getStudentProfile(userId: string): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting student profile:', error)
    return null
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  } catch (error) {
    console.error('Password reset error:', error)
    throw error
  }
}

// Update password
export async function updatePassword(accessToken: string, refreshToken: string, newPassword: string) {
  try {
    // Set the session with the tokens from the reset link
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError) throw sessionError

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
  } catch (error) {
    console.error('Password update error:', error)
    throw error
  }
}

// Create test users for development
export async function createTestUsers() {
  try {
    // This would typically be done through your admin interface
    // For development purposes only
    console.log('Test users should be created through Supabase dashboard')
  } catch (error) {
    console.error('Error creating test users:', error)
  }
}