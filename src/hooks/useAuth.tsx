import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  role: 'instructor' | 'student';
  data: Instructor | Student;
}

interface Instructor {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  email: string;
  full_name: string;
  instructor_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: 'instructor' | 'student' | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    role: 'instructor' | 'student',
    data: {
      email: string;
      password: string;
      fullName: string;
      businessName?: string;
      subdomain?: string;
      instructorId?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<'instructor' | 'student' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fetch user profile with proper error handling
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('useAuth: Fetching profile for user:', userId);

      // Try instructor first
      const { data: instructor, error: instructorError } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

      if (instructorError) {
        console.error('useAuth: Error fetching instructor:', instructorError);
      } else if (instructor) {
        console.log('useAuth: Found instructor profile');
        return { id: instructor.id, role: 'instructor', data: instructor as Instructor };
      }

      // Try student if not instructor
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (studentError) {
        console.error('useAuth: Error fetching student:', studentError);
        return null;
      } else if (student) {
        console.log('useAuth: Found student profile');
        return { id: student.id, role: 'student', data: student as Student };
      }

      console.log('useAuth: No profile found for user:', userId);
      return null;
    } catch (error) {
      console.error('useAuth: Exception in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    if (authInitialized) return;

    console.log('useAuth: Initializing auth state');
    setAuthInitialized(true);

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('useAuth: Session error:', sessionError);
          setError('Failed to get session');
          return;
        }

        if (session?.user) {
          console.log('useAuth: Found existing session for user:', session.user.id);
          setUser(session.user);
          
          const userProfile = await fetchProfile(session.user.id);
          if (userProfile) {
            setProfile(userProfile);
            setRole(userProfile.role);
          } else {
            console.warn('useAuth: No profile found for authenticated user');
            setError('User profile not found. Please contact support.');
          }
        } else {
          console.log('useAuth: No existing session found');
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } catch (error) {
        console.error('useAuth: Error initializing auth:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth: Auth state change:', event, 'session:', !!session);

      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoading(true);
        setUser(session.user);
        
        const userProfile = await fetchProfile(session.user.id);
        if (userProfile) {
          setProfile(userProfile);
          setRole(userProfile.role);
        } else {
          setProfile(null);
          setRole(null);
          setError('Profile not found after sign in');
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setRole(null);
        setError(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: Starting sign in for:', email);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useAuth: Sign in error:', error);
        setError(error.message);
        return { success: false, error: error.message };
      }

      console.log('useAuth: Sign in successful');
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Sign in exception:', error);
      const errorMessage = error.message || 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUpUser = async (
    selectedRole: 'instructor' | 'student',
    data: {
      email: string;
      password: string;
      fullName: string;
      businessName?: string;
      subdomain?: string;
      instructorId?: string;
    }
  ) => {
    console.log('useAuth: Starting sign up for role:', selectedRole);
    setError(null);
    
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: selectedRole
          }
        }
      });

      if (authError) {
        console.error('useAuth: Auth signup error:', authError);
        setError(authError.message);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        const errorMsg = 'User creation failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log('useAuth: Auth user created:', authData.user.id);

      // Create profile based on role
      if (selectedRole === 'instructor') {
        const { error: instructorError } = await supabase
          .from('instructors')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            business_name: data.businessName || 'My Business'
          });

        if (instructorError) {
          console.error('useAuth: Instructor creation error:', instructorError);
          setError(`Failed to create instructor profile: ${instructorError.message}`);
          return { success: false, error: instructorError.message };
        }

        // Create organization if subdomain provided
        if (data.subdomain) {
          const { error: orgError } = await supabase
            .from('organizations')
            .insert({
              subdomain: data.subdomain,
              name: data.businessName || 'My Business',
              color: '#7c3aed'
            });

          if (orgError) {
            console.warn('useAuth: Organization creation failed:', orgError);
          }
        }
      } else {
        // For students, find a valid instructor
        let instructorId = data.instructorId;
        
        if (!instructorId) {
          const { data: existingInstructor } = await supabase
            .from('instructors')
            .select('id')
            .limit(1)
            .maybeSingle();
          
          if (existingInstructor) {
            instructorId = existingInstructor.id;
          } else {
            // Create default instructor
            const { data: defaultInstructor, error: defaultError } = await supabase
              .from('instructors')
              .insert({
                id: crypto.randomUUID(),
                email: 'default@trainr.app',
                full_name: 'Default Instructor',
                business_name: 'Trainr Academy'
              })
              .select()
              .single();
            
            if (defaultError) {
              console.error('useAuth: Failed to create default instructor:', defaultError);
              setError('Failed to set up student account');
              return { success: false, error: 'Failed to set up student account' };
            }
            
            instructorId = defaultInstructor.id;
          }
        }

        const { error: studentError } = await supabase
          .from('students')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            instructor_id: instructorId
          });

        if (studentError) {
          console.error('useAuth: Student creation error:', studentError);
          setError(`Failed to create student profile: ${studentError.message}`);
          return { success: false, error: studentError.message };
        }
      }

      console.log('useAuth: Profile created successfully');
      return { success: true };
    } catch (error: any) {
      console.error('useAuth: Sign up exception:', error);
      const errorMessage = error.message || 'Sign up failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Sign out error:', error);
        setError(error.message);
      }
    } catch (error: any) {
      console.error('useAuth: Sign out exception:', error);
      setError(error.message);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await fetchProfile(user.id);
      setProfile(userProfile);
      setRole(userProfile?.role || null);
    }
  };

  const value = {
    user,
    profile,
    role,
    isLoading,
    error,
    signIn,
    signUp: signUpUser,
    signOutUser,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};