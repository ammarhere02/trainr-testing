import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  error: Error | null
}

export interface Instructor {
  id: string
  email: string
  full_name: string | null
  business_name: string
  subdomain: string
  logo_url: string | null
  color: string | null
  created_at: string
}

export interface Student {
  id: string
  email: string
  full_name: string | null
  instructor_id: string
  avatar_url: string | null
  created_at: string
}

export interface Profile {
  id: string
  role: 'instructor' | 'student'
  data: Instructor | Student
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

// Sign up with email and password (unified function)
export async function signUpEmail(
  email: string, 
  password: string, 
  fullName: string,
  role: 'instructor' | 'student',
  additionalData?: { businessName?: string; subdomain?: string; instructorId?: string }
): Promise<AuthResult> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_project_url_here')) {
      throw new Error('Database not configured. Please set up your Supabase credentials in the environment variables.')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
          ...additionalData
        },
        emailRedirectTo: `${window.location.origin}/post-login`
      }
    })
    
    if (error) {
      console.error('Supabase signup error:', error)
      
      // Provide more specific error messages
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      } else if (error.message.includes('Invalid API key') || error.message.includes('Invalid JWT')) {
        throw new Error('Database configuration error. Please check your Supabase setup.')
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        throw new Error('Database tables not found. Please run the SQL migration in your Supabase dashboard.')
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.')
      } else if (error.message.includes('Password')) {
        throw new Error('Password must be at least 6 characters long.')
      } else if (error.message.includes('Database error')) {
        throw new Error('Database connection failed. Please check your Supabase configuration and try again.')
      } else {
        throw new Error(`Account creation failed: ${error.message}`)
      }
    }
    
    return {
      user: data.user,
      error: null
    }
  } catch (error) {
    console.error('SignUp error:', error)
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Sign up instructor with email and password
export async function signUpInstructor(
  email: string, 
  password: string, 
  fullName: string, 
  businessName: string, 
  subdomain: string
): Promise<AuthResult> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_project_url_here')) {
      throw new Error('Database not configured. Please set up your Supabase credentials in the environment variables.')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
          subdomain: subdomain,
          role: 'instructor'
        },
        emailRedirectTo: `${window.location.origin}/post-login`
      }
    })
    
    if (error) {
      console.error('Supabase signup error:', error)
      
      // Provide more specific error messages
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      } else if (error.message.includes('Invalid API key') || error.message.includes('Invalid JWT')) {
        throw new Error('Database configuration error. Please check your Supabase setup.')
      } else if (error.message.includes('relation') && error.message.includes('does not exist')) {
        throw new Error('Database tables not found. Please run the SQL migration in your Supabase dashboard.')
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.')
      } else if (error.message.includes('Password')) {
        throw new Error('Password must be at least 6 characters long.')
      } else if (error.message.includes('Database error')) {
        throw new Error('Database connection failed. Please check your Supabase configuration and try again.')
      } else {
        throw new Error(`Account creation failed: ${error.message}`)
      }
    }
    
    return {
      user: data.user,
      error: null
    }
  } catch (error) {
    console.error('SignUp error:', error)
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Sign up student with email and password
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
        },
        emailRedirectTo: `${window.location.origin}/post-login`
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      throw new Error(`Account creation failed: ${error.message}`)
    }
    
    return {
      user: data.user,
      error: null
    }
  } catch (error) {
    console.error('SignUp error:', error)
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Get user profile (instructor or student)
export async function getProfile(userId?: string): Promise<Profile | null> {
  try {
    const id = userId || (await getCurrentUser())?.id
    if (!id) return null
    
    // Check if user is instructor
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (data) {
      return {
        id: data.id,
        role: 'instructor',
        data: data
      }
    }
    
    // Check if user is student
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (studentData) {
      return {
        id: studentData.id,
        role: 'student',
        data: studentData
      }
    }
    
    console.error('Profile not found for user:', id)
    return null
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

// Get current instructor profile
export async function getInstructorProfile(userId?: string): Promise<Instructor | null> {
  try {
    const id = userId || (await getCurrentUser())?.id
    if (!id) return null
    
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching instructor profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getInstructorProfile:', error)
    return null
  }
}

// Get current student profile
export async function getStudentProfile(userId?: string): Promise<Student | null> {
  try {
    const id = userId || (await getCurrentUser())?.id
    if (!id) return null
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching student profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in getStudentProfile:', error)
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