import { supabase } from '../supabase'
import type { Database } from '../database.types'

type CourseAnalytics = Database['public']['Tables']['course_analytics']['Row']

// Get current instructor ID
async function getCurrentInstructorId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: instructor } = await supabase
    .from('instructors')
    .select('id')
    .eq('id', user.id)
    .single()

  return instructor?.id || null
}

// Get dashboard analytics for instructor
export async function getDashboardAnalytics() {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  // Get total students
  const { count: totalStudents } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)

  // Get total courses
  const { count: totalCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)

  // Get total revenue from course analytics
  const { data: revenueData } = await supabase
    .from('course_analytics')
    .select('revenue, courses!inner(instructor_id)')
    .eq('courses.instructor_id', instructorId)

  const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0

  // Get average rating across all courses
  const { data: ratingsData } = await supabase
    .from('course_analytics')
    .select('avg_rating, total_reviews, courses!inner(instructor_id)')
    .eq('courses.instructor_id', instructorId)

  let avgRating = 0
  let totalReviews = 0
  if (ratingsData && ratingsData.length > 0) {
    const validRatings = ratingsData.filter(item => item.avg_rating && item.total_reviews)
    if (validRatings.length > 0) {
      const weightedSum = validRatings.reduce((sum, item) => 
        sum + (item.avg_rating! * item.total_reviews!), 0)
      totalReviews = validRatings.reduce((sum, item) => sum + item.total_reviews!, 0)
      avgRating = totalReviews > 0 ? weightedSum / totalReviews : 0
    }
  }

  // Get recent community posts count
  const { count: communityPosts } = await supabase
    .from('community_posts')
    .select('*', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  return {
    totalStudents: totalStudents || 0,
    totalCourses: totalCourses || 0,
    totalRevenue,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    communityPosts: communityPosts || 0
  }
}

// Get course-specific analytics
export async function getCourseAnalytics(courseId: string): Promise<CourseAnalytics | null> {
  const { data, error } = await supabase
    .from('course_analytics')
    .select('*')
    .eq('course_id', courseId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Get top performing courses for instructor
export async function getTopCourses(limit: number = 5) {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      course_analytics(total_students, avg_rating, revenue)
    `)
    .eq('instructor_id', instructorId)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}