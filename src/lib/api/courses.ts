import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Course = Database['public']['Tables']['courses']['Row']
type CourseInsert = Database['public']['Tables']['courses']['Insert']
type CourseUpdate = Database['public']['Tables']['courses']['Update']
type Lesson = Database['public']['Tables']['lessons']['Row']
type LessonInsert = Database['public']['Tables']['lessons']['Insert']
type LessonUpdate = Database['public']['Tables']['lessons']['Update']

export interface CourseWithLessons extends Course {
  lessons?: Lesson[]
  total_students?: number
  avg_rating?: number
}

// Get current instructor ID from auth
export async function getCurrentInstructorId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id || null
}

// COURSES CRUD
export async function getCourses(): Promise<CourseWithLessons[]> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(id, title, order_index, duration),
      course_analytics(total_students, avg_rating)
    `)
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCourse(courseId: string): Promise<CourseWithLessons | null> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      lessons(*),
      course_analytics(*)
    `)
    .eq('id', courseId)
    .eq('instructor_id', instructorId)
    .single()

  if (error) throw error
  return data
}

export async function createCourse(course: Omit<CourseInsert, 'instructor_id'>): Promise<Course> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('courses')
    .insert([{ ...course, instructor_id: instructorId }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCourse(courseId: string, updates: CourseUpdate): Promise<Course> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .eq('instructor_id', instructorId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCourse(courseId: string): Promise<void> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId)
    .eq('instructor_id', instructorId)

  if (error) throw error
}

// LESSONS CRUD
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createLesson(lesson: LessonInsert): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .insert([lesson])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLesson(lessonId: string, updates: LessonUpdate): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', lessonId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId)

  if (error) throw error
}

// Get published courses for students
export async function getPublishedCourses(instructorId?: string): Promise<CourseWithLessons[]> {
  let query = supabase
    .from('courses')
    .select(`
      *,
      lessons(id, title, order_index, duration),
      course_analytics(total_students, avg_rating)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (instructorId) {
    query = query.eq('instructor_id', instructorId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}