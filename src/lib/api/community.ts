import { supabase } from '../supabase'
import type { Database } from '../database.types'

type CommunityPost = Database['public']['Tables']['community_posts']['Row']
type CommunityPostInsert = Database['public']['Tables']['community_posts']['Insert']
type CommunityPostUpdate = Database['public']['Tables']['community_posts']['Update']
type Comment = Database['public']['Tables']['comments']['Row']
type CommentInsert = Database['public']['Tables']['comments']['Insert']

export interface CommunityPostWithAuthor extends CommunityPost {
  author?: {
    id: string
    full_name: string
    avatar_url?: string
    role: 'instructor' | 'student'
  }
  comments_count?: number
  latest_comments?: Comment[]
}

export interface CommentWithAuthor extends Comment {
  author?: {
    id: string
    full_name: string
    avatar_url?: string
    role: 'instructor' | 'student'
  }
}

// Get current user info
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if user is instructor
  const { data: instructor } = await supabase
    .from('instructors')
    .select('id, full_name')
    .eq('id', user.id)
    .single()

  if (instructor) {
    return { id: user.id, role: 'instructor' as const, data: instructor }
  }

  // Check if user is student
  const { data: student } = await supabase
    .from('students')
    .select('id, full_name, instructor_id')
    .eq('id', user.id)
    .single()

  if (student) {
    return { id: user.id, role: 'student' as const, data: student }
  }

  throw new Error('User profile not found')
}

// COMMUNITY POSTS CRUD
export async function getCommunityPosts(instructorId?: string): Promise<CommunityPostWithAuthor[]> {
  const currentUser = await getCurrentUser()
  
  // Determine which instructor's community to show
  let targetInstructorId = instructorId
  if (!targetInstructorId) {
    if (currentUser.role === 'instructor') {
      targetInstructorId = currentUser.id
    } else {
      targetInstructorId = currentUser.data.instructor_id
    }
  }

  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      comments(count)
    `)
    .eq('instructor_id', targetInstructorId)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error

  // Enrich with author data
  const enrichedPosts = await Promise.all(
    (data || []).map(async (post) => {
      // Get author info (could be instructor or student)
      let author = null
      
      const { data: instructorAuthor } = await supabase
        .from('instructors')
        .select('id, full_name, logo_url')
        .eq('id', post.author_id)
        .single()

      if (instructorAuthor) {
        author = {
          id: instructorAuthor.id,
          full_name: instructorAuthor.full_name,
          avatar_url: instructorAuthor.logo_url,
          role: 'instructor' as const
        }
      } else {
        const { data: studentAuthor } = await supabase
          .from('students')
          .select('id, full_name, avatar_url')
          .eq('id', post.author_id)
          .single()

        if (studentAuthor) {
          author = {
            id: studentAuthor.id,
            full_name: studentAuthor.full_name,
            avatar_url: studentAuthor.avatar_url,
            role: 'student' as const
          }
        }
      }

      return {
        ...post,
        author,
        comments_count: post.comments?.[0]?.count || 0
      }
    })
  )

  return enrichedPosts
}

export async function createCommunityPost(post: Omit<CommunityPostInsert, 'author_id' | 'instructor_id'>): Promise<CommunityPost> {
  const currentUser = await getCurrentUser()
  
  let instructorId: string
  if (currentUser.role === 'instructor') {
    instructorId = currentUser.id
  } else {
    instructorId = currentUser.data.instructor_id
  }

  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      ...post,
      author_id: currentUser.id,
      instructor_id: instructorId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCommunityPost(postId: string, updates: CommunityPostUpdate): Promise<CommunityPost> {
  const currentUser = await getCurrentUser()

  const { data, error } = await supabase
    .from('community_posts')
    .update(updates)
    .eq('id', postId)
    .eq('author_id', currentUser.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCommunityPost(postId: string): Promise<void> {
  const currentUser = await getCurrentUser()

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', currentUser.id)

  if (error) throw error
}

export async function togglePinPost(postId: string): Promise<CommunityPost> {
  const currentUser = await getCurrentUser()
  if (currentUser.role !== 'instructor') {
    throw new Error('Only instructors can pin posts')
  }

  // Get current pin status
  const { data: post } = await supabase
    .from('community_posts')
    .select('is_pinned')
    .eq('id', postId)
    .eq('instructor_id', currentUser.id)
    .single()

  if (!post) throw new Error('Post not found')

  const { data, error } = await supabase
    .from('community_posts')
    .update({ is_pinned: !post.is_pinned })
    .eq('id', postId)
    .eq('instructor_id', currentUser.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// COMMENTS CRUD
export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error

  // Enrich with author data
  const enrichedComments = await Promise.all(
    (data || []).map(async (comment) => {
      let author = null
      
      const { data: instructorAuthor } = await supabase
        .from('instructors')
        .select('id, full_name, logo_url')
        .eq('id', comment.author_id)
        .single()

      if (instructorAuthor) {
        author = {
          id: instructorAuthor.id,
          full_name: instructorAuthor.full_name,
          avatar_url: instructorAuthor.logo_url,
          role: 'instructor' as const
        }
      } else {
        const { data: studentAuthor } = await supabase
          .from('students')
          .select('id, full_name, avatar_url')
          .eq('id', comment.author_id)
          .single()

        if (studentAuthor) {
          author = {
            id: studentAuthor.id,
            full_name: studentAuthor.full_name,
            avatar_url: studentAuthor.avatar_url,
            role: 'student' as const
          }
        }
      }

      return { ...comment, author }
    })
  )

  return enrichedComments
}

export async function createComment(comment: Omit<CommentInsert, 'author_id'>): Promise<Comment> {
  const currentUser = await getCurrentUser()

  const { data, error } = await supabase
    .from('comments')
    .insert([{
      ...comment,
      author_id: currentUser.id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateComment(commentId: string, content: string): Promise<Comment> {
  const currentUser = await getCurrentUser()

  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('author_id', currentUser.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteComment(commentId: string): Promise<void> {
  const currentUser = await getCurrentUser()

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('author_id', currentUser.id)

  if (error) throw error
}