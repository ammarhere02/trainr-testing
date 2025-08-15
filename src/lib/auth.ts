import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  error: Error | null
}

export interface Instructor {
  id: string
  email: string
  full_name: string
  business_name: string
  subdomain: string
  logo_url: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  email: string
  full_name: string
  instructor_id: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  role: 'instructor' | 'student'
  data: Instructor | Student
}

// Create test users in Supabase Auth (development only)
export async function createTestUsers() {
  try {
    console.log('Creating test users...')
    
    // Check if test instructor already exists
    const { data: existingInstructor } = await supabase
      .from('instructors')
      .select('id')
      .eq('email', 'test@instructor.com')
      .single()

    if (!existingInstructor) {
      // Create test instructor auth user
      const { data: instructorAuth, error: instructorError } = await supabase.auth.signUp({
        email: 'test@instructor.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test Instructor',
            role: 'instructor'
          }
        }
      })

      if (instructorAuth.user && !instructorError) {
        // Create instructor profile
        await supabase
          .from('instructors')
          .insert([{
            id: instructorAuth.user.id,
            email: 'test@instructor.com',
            full_name: 'Test Instructor',
            business_name: 'Test Academy',
            subdomain: 'testacademy',
            color: '#7c3aed'
          }])
      }
    }

    // Check if test student already exists
    const { data: existingStudent } = await supabase
      .from('students')
      .select('id')
      .eq('email', 'test@student.com')
      .single()

    if (!existingStudent && existingInstructor) {
      // Create test student auth user
      const { data: studentAuth, error: studentError } = await supabase.auth.signUp({
        email: 'test@student.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test Student',
            role: 'student'
          }
        }
      })

      if (studentAuth.user && !studentError) {
        // Create student profile
        await supabase
          .from('students')
          .insert([{
            id: studentAuth.user.id,
            email: 'test@student.com',
            full_name: 'Test Student',
            instructor_id: existingInstructor.id
          }])
      }
    }

    console.log('Test users setup completed')
  } catch (error) {
    console.error('Error creating test users:', error)
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
      console.error('Sign in error:', error)
      return {
        user: null,
        error: new Error(error.message)
      }
    }
    
    return {
      user: data.user,
      error: null
    }
  } catch (error) {
    console.error('Sign in exception:', error)
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
  businessName: string
): Promise<AuthResult> {
  try {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_project_url_here')) {
      throw new Error('Database not configured. Please set up your Supabase credentials.')
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'instructor'
        }
      }
    })
    
    if (error) {
      console.error('Supabase signup error:', error)
      
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      } else if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.')
      } else if (error.message.includes('Password')) {
        throw new Error('Password must be at least 6 characters long.')
      } else {
        throw new Error(`Account creation failed: ${error.message}`)
      }
    }

    if (data.user) {
      // Create instructor profile in database
      try {
        const { data: instructor, error: instructorError } = await supabase
          .from('instructors')
          .insert([{
            id: data.user.id,
            email: email,
            full_name: fullName,
            business_name: businessName,
            color: '#7c3aed'
          }])
          .select()
          .single()

        if (instructorError) {
          console.error('Error creating instructor profile:', instructorError)
          
          if (instructorError.code === '23505') {
            console.log('Instructor profile already exists')
          } else {
            throw new Error(`Failed to create instructor profile: ${instructorError.message}`)
          }
        }
      } catch (profileError) {
        console.error('Error in instructor profile creation:', profileError)
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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase_project_url_here')) {
      throw new Error('Database not configured. Please set up your Supabase credentials.')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student'
        }
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please sign in instead.')
      } else {
        throw new Error(`Account creation failed: ${error.message}`)
      }
    }

    if (data.user) {
      try {
        const { data: student, error: studentError } = await supabase
          .from('students')
          .insert([{
            id: data.user.id,
            email: email,
            full_name: fullName,
            instructor_id: instructorId
          }])
          .select()
          .single()

        if (studentError) {
          console.error('Error creating student profile:', studentError)
          
          if (studentError.code === '23505') {
            console.log('Student profile already exists')
          } else {
            throw new Error(`Failed to create student profile: ${studentError.message}`)
          }
        }
      } catch (profileError) {
        console.error('Error in student profile creation:', profileError)
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

// Get user profile (instructor or student)
export async function getProfile(userId?: string): Promise<Profile | null> {
  try {
    const id = userId || (await getCurrentUser())?.id
    if (!id) return null
    
    // Check if user is instructor
    const { data: instructorData, error: instructorError } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (instructorData && !instructorError) {
      return {
        id: instructorData.id,
        role: 'instructor',
        data: instructorData
      }
    }
    
    // Check if user is student
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (studentData && !studentError) {
      return {
        id: studentData.id,
        role: 'student',
        data: studentData
      }
    }
    
    console.log('Profile not found for user:', id)
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

// Check if user has specific role
export async function checkUserRole(userId: string): Promise<'instructor' | 'student' | null> {
  try {
    // Check instructor table first
    const { data: instructor } = await supabase
      .from('instructors')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (instructor) return 'instructor'
    
    // Check student table
    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (student) return 'student'
    
    return null
  } catch (error) {
    console.error('Error checking user role:', error)
    return null
  }
}

// Validate subdomain availability
export async function validateSubdomain(subdomain: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('instructors')
      .select('id')
      .eq('subdomain', subdomain)
      .single()
    
    return !data // Available if no data found
  } catch (error) {
    return true // Assume available on error
  }
}