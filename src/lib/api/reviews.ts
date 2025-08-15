import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Review = Database['public']['Tables']['reviews']['Row']
type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
type ReviewUpdate = Database['public']['Tables']['reviews']['Update']

export interface ReviewWithStudent extends Review {
  student?: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

// Get current student ID
async function getCurrentStudentId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', user.id)
    .single()

  return student?.id || null
}

// REVIEWS CRUD
export async function getReviews(courseId: string): Promise<ReviewWithStudent[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      students(id, full_name, avatar_url)
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map(review => ({
    ...review,
    student: review.students ? {
      id: review.students.id,
      full_name: review.students.full_name,
      avatar_url: review.students.avatar_url
    } : undefined
  }))
}

export async function createReview(review: Omit<ReviewInsert, 'student_id'>): Promise<Review> {
  const studentId = await getCurrentStudentId()
  if (!studentId) throw new Error('Only students can create reviews')

  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      ...review,
      student_id: studentId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReview(reviewId: string, updates: ReviewUpdate): Promise<Review> {
  const studentId = await getCurrentStudentId()
  if (!studentId) throw new Error('Not authenticated as student')

  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .eq('student_id', studentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReview(reviewId: string): Promise<void> {
  const studentId = await getCurrentStudentId()
  if (!studentId) throw new Error('Not authenticated as student')

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('student_id', studentId)

  if (error) throw error
}

// Get course analytics
export async function getCourseAnalytics(courseId: string) {
  const { data, error } = await supabase
    .from('course_analytics')
    .select('*')
    .eq('course_id', courseId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}