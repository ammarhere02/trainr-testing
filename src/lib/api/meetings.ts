import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Meeting = Database['public']['Tables']['meetings']['Row']
type MeetingInsert = Database['public']['Tables']['meetings']['Insert']
type MeetingUpdate = Database['public']['Tables']['meetings']['Update']

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

// MEETINGS CRUD
export async function getMeetings(): Promise<Meeting[]> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('instructor_id', instructorId)
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createMeeting(meeting: Omit<MeetingInsert, 'instructor_id'>): Promise<Meeting> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  const { data, error } = await supabase
    .from('meetings')
    .insert([{
      ...meeting,
      instructor_id: instructorId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMeeting(meetingId: string, updates: MeetingUpdate): Promise<Meeting> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  const { data, error } = await supabase
    .from('meetings')
    .update(updates)
    .eq('id', meetingId)
    .eq('instructor_id', instructorId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const instructorId = await getCurrentInstructorId()
  if (!instructorId) throw new Error('Not authenticated as instructor')

  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', meetingId)
    .eq('instructor_id', instructorId)

  if (error) throw error
}

// Get meetings for students (read-only)
export async function getStudentMeetings(): Promise<Meeting[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get student's instructor
  const { data: student } = await supabase
    .from('students')
    .select('instructor_id')
    .eq('id', user.id)
    .single()

  if (!student) throw new Error('Student profile not found')

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('instructor_id', student.instructor_id)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })

  if (error) throw error
  return data || []
}