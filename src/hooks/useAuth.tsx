import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { signInEmail, signUp, signOut, getCurrentUser } from '../lib/auth.tsx';

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
  const [initialized, setInitialized] = useState(false);

  const getProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      // Check if user is instructor
      const { data: instructor } = await supabase
        .from('instructors')
        .select('*')
        .eq('id', userId)
        .single();

      if (instructor) {
        return { id: instructor.id, role: 'instructor', data: instructor as Instructor };
      }

      // Check if user is student
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .single();

      if (student) {
        return { id: student.id, role: 'student', data: student as Student };
      }

      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  const fetchAndSetProfile = useCallback(async (authUser: any): Promise<void> => {
    if (!authUser) {
      console.log('useAuth: No auth user, clearing profile');
      setProfile(null);
      setRole(null);
      return;
    }

    console.log('useAuth: Fetching profile for user:', authUser.id);
    
    try {
      const userProfile = await getProfile(authUser.id);
      console.log('useAuth: Profile fetched:', userProfile);
      
      if (userProfile) {
        setProfile(userProfile);
        setRole(userProfile.role);
      } else {
        console.warn('useAuth: User profile not found in database for user:', authUser.id);
        setProfile(null);
        setRole(null);
        console.warn('useAuth: User profile not found in database for user:', authUser.id);
        setError('User profile not found. Please try refreshing the page.');
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error('useAuth: Error fetching profile:', err);
      setProfile(null);
      setRole(null);
    }
  }, [getProfile]);

  useEffect(() => {
    if (initialized) return;
    
    console.log('useAuth: Initializing auth state');
    setInitialized(true);
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth: Auth state change event:', event, 'session:', !!session);
      
      setIsLoading(true);
      setError(null);
      
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        await fetchAndSetProfile(currentUser);
      } else {
        setProfile(null);
        setRole(null);
      }
      
      setIsLoading(false);
    });

    // Initial load
    const initializeAuth = async () => {
      try {
        const { user: currentUser } = await getCurrentUser();
        console.log('useAuth: Initial user fetch result:', !!currentUser);
        
        setUser(currentUser);
        if (currentUser) {
          await fetchAndSetProfile(currentUser);
        } else {
          setProfile(null);
          setRole(null);
        }
      } catch (err) {
        console.error('useAuth: Initial auth error:', err);
        setError('Failed to initialize authentication.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [initialized, fetchAndSetProfile]);

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: Starting sign in for:', email);
    setError(null);
    
    const { data: authData, error: authError } = await signInEmail(email, password);
    
    if (authError) {
      console.error('useAuth: Sign in error:', authError);
      setError(authError.message);
      return { success: false, error: authError.message };
    }
    
    // Auth state change listener will handle the rest
    return { success: true };
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
    
    const authResult = await signUp(selectedRole, data);

    if (authResult.error) {
      console.error('useAuth: Sign up error:', authResult.error);
      setError(authResult.error.message);
      return { success: false, error: authResult.error.message };
    }
    
    // Auth state change listener will handle the rest
    return { success: true };
  };

  const signOutUser = async () => {
    setError(null);
    try {
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchAndSetProfile(user);
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