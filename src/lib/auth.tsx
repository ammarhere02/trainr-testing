import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  subdomain: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const signUp = async (
  role: 'instructor' | 'student',
  data: {
    email: string;
    password: string;
    fullName: string;
    businessName?: string;
    subdomain?: string;
    instructorId?: string;
  }
) => {
  const { email, password, fullName, businessName, subdomain, instructorId } = data;
  
  try {
    // Prepare user metadata based on role
    const userMetadata: any = {
      full_name: fullName,
      role
    };

    if (role === 'instructor') {
      userMetadata.business_name = businessName;
      userMetadata.subdomain = subdomain;
    } else if (role === 'student' && instructorId) {
      userMetadata.instructor_id = instructorId;
    }

    // Sign up the user with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      if (role === 'instructor') {
        // Create instructor record
        const { error: instructorError } = await supabase
          .from('instructors')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            business_name: businessName || 'My Business',
          });

        if (instructorError) throw instructorError;

        // Create organization record if subdomain provided
        if (subdomain) {
          const { error: orgError } = await supabase
            .from('organizations')
            .insert({
              subdomain,
              name: businessName || 'My Business',
              color: '#7c3aed'
            });

          if (orgError) throw orgError;
        }
      } else if (role === 'student') {
        // Create student record with null instructor_id (assigned later during enrollment)
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: authData.user.id,
            email,
            full_name: fullName,
            instructor_id: instructorId || authData.user.id, // Temporary fallback
          });

        if (studentError) throw studentError;
      }
    }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signInEmail = async (email: string, password: string) => {
  
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data: authData, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};