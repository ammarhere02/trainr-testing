import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  signInEmail,
  signUp,
  signOut,
  getCurrentUser,
  SignUpData
} from '../lib/auth.tsx';

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

  const getProfile = async (userId: string): Promise<Profile | null> => {
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
  };

  const fetchAndSetProfile = useCallback(async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      setRole(null);
      return;
    }

    try {
      const userProfile = await getProfile(authUser.id);
      if (userProfile) {
        setProfile(userProfile);
        setRole(userProfile.role);
      } else {
        // Profile not found - this could happen if user was created but profile insert failed
        console.warn('User profile not found in database');
        setError('User profile not found. Please contact support.');
        setProfile(null);
        setRole(null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load user profile.');
      setProfile(null);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);
      setError(null);
      const currentUser = session?.user || null;
      setUser(currentUser);
      await fetchAndSetProfile(currentUser);
      setIsLoading(false);
    });

    // Initial load
    getCurrentUser().then(async ({ user: currentUser }) => {
      setUser(currentUser);
      await fetchAndSetProfile(currentUser);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Initial user fetch error:', err);
      setError('Failed to initialize authentication.');
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchAndSetProfile]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const { data, error: authError } = await signInEmail(email, password);
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return { success: false, error: authError.message };
    }
    setUser(data?.user);
    await fetchAndSetProfile(data?.user); // Fetch profile after successful sign-in
    setIsLoading(false);
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
    setIsLoading(true);
    setError(null);
    
    const authResult = await signUp(selectedRole, data);

    if (authResult.error) {
      setError(authResult.error.message);
      setIsLoading(false);
      return { success: false, error: authResult.error.message };
    }
    setUser(authResult.data?.user);
    await fetchAndSetProfile(authResult.data?.user); // Fetch profile after successful sign-up
    setIsLoading(false);
    return { success: true };
  };

  const signOutUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setIsLoading(true);
      setError(null);
      await fetchAndSetProfile(user);
      setIsLoading(false);
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