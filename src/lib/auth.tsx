import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  businessName?: string;
  subdomain?: string;
  instructorId?: string;
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
    console.log('Starting signup process for role:', role);
    
    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User creation failed - no user returned');
    }

    console.log('Auth user created successfully:', authData.user.id);

    // Now create the role-specific profile
    if (role === 'instructor') {
      console.log('Creating instructor profile...');
      
      // Create instructor record
      const { error: instructorError } = await supabase
        .from('instructors')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          business_name: businessName || 'My Business'
        });

      if (instructorError) {
        console.error('Instructor creation error:', instructorError);
        throw new Error(`Failed to create instructor profile: ${instructorError.message}`);
      }

      console.log('Instructor profile created successfully');

      // Create organization record if subdomain provided
      if (subdomain) {
        console.log('Creating organization with subdomain:', subdomain);
        
        const { error: orgError } = await supabase
          .from('organizations')
          .insert({
            subdomain,
            name: businessName || 'My Business',
            color: '#7c3aed'
          });

        if (orgError) {
          console.error('Organization creation error:', orgError);
          // Don't throw here - organization is optional
          console.warn('Organization creation failed but continuing...');
        } else {
          console.log('Organization created successfully');
        }
      }
    } else if (role === 'student') {
      console.log('Creating student profile...');
      
      // Create student record with null instructor_id (assigned later during enrollment)
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          instructor_id: instructorId || authData.user.id // Use provided instructorId or fallback
        });

      if (studentError) {
        console.error('Student creation error:', studentError);
        throw new Error(`Failed to create student profile: ${studentError.message}`);
      }

      console.log('Student profile created successfully');
    }

    console.log('Signup completed successfully for role:', role);
    return { data: authData, error: null };
    
  } catch (error) {
    console.error('Signup process failed:', error);
    return { data: null, error };
  }
};

export const signInEmail = async (email: string, password: string) => {
  try {
    console.log('Starting sign in process for email:', email);
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful for user:', authData.user?.id);
    return { data: authData, error: null };
    
  } catch (error) {
    console.error('Sign in process failed:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    console.log('Starting sign out process');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
    } else {
      console.log('Sign out successful');
    }
    
    return { error };
  } catch (error) {
    console.error('Sign out process failed:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      // Don't log "Auth session missing!" as an error since it's expected for unauthenticated users
      if (error.message !== 'Auth session missing!') {
        console.error('Get current user error:', error);
      }
    }
    
    return { user, error };
  } catch (error) {
    console.error('Get current user process failed:', error);
    return { user: null, error };
  }
};