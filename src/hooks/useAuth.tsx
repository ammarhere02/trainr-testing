import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  signInEmail,
  signUpInstructor,
  signUpStudent,
  signOut,
  getCurrentUser,
  getProfile,
  Profile,
  Instructor,
  Student
} from '../lib/auth.tsx';

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

  const fetchAndSetProfile = useCallback(async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      setRole(null);
      return;
    }

    try {
      const userProfile = await getProfile(authUser.id);
      if (userProfile) {
        // Validate role consistency
        if (authUser.user_metadata.role && authUser.user_metadata.role !== userProfile.role) {
          console.warn(`Role mismatch: Auth metadata says ${authUser.user_metadata.role}, but profile table says ${userProfile.role}. Prioritizing auth metadata.`);
          // Optionally, you could force a logout or update the profile table here.
        }
        setProfile(userProfile);
        setRole(userProfile.role);
      } else {
        // Profile missing, attempt to recreate (e.g., if manually deleted from DB)
        console.warn('User profile missing, attempting to recreate...');
        const newProfileData: Partial<Instructor | Student> = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata.full_name,
        };

        let recreatedProfile: Profile | null = null;
        if (authUser.user_metadata.role === 'instructor') {
          const { data, error } = await supabase.from('instructors').insert([
            {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata.full_name,
              business_name: authUser.user_metadata.business_name || 'My Business',
              subdomain: authUser.user_metadata.subdomain || null,
              color: authUser.user_metadata.color || '#7c3aed'
            }
          ]).select().single();
          if (data) recreatedProfile = { id: data.id, role: 'instructor', data: data as Instructor };
        } else if (authUser.user_metadata.role === 'student') {
          const { data, error } = await supabase.from('students').insert([
            {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata.full_name,
              instructor_id: authUser.user_metadata.instructor_id // Assuming instructor_id is in metadata
            }
          ]).select().single();
          if (data) recreatedProfile = { id: data.id, role: 'student', data: data as Student };
        }

        if (recreatedProfile) {
          setProfile(recreatedProfile);
          setRole(recreatedProfile.role);
          console.log('User profile recreated successfully.');
        } else {
          setError('Profile could not be fetched or recreated. Please contact support.');
          setProfile(null);
          setRole(null);
          await signOut(); // Force logout if profile cannot be established
        }
      }
    } catch (err) {
      console.error('Error fetching or recreating profile:', err);
      setError('Failed to load user profile.');
      setProfile(null);
      setRole(null);
      await signOut(); // Force logout on profile error
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
    getCurrentUser().then(async (currentUser) => {
      setUser(currentUser);
      await fetchAndSetProfile(currentUser);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Initial user fetch error:', err);
      setError('Failed to initialize authentication.');
      setIsLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [fetchAndSetProfile]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    const { user, error: authError } = await signInEmail(email, password);
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return { success: false, error: authError.message };
    }
    setUser(user);
    await fetchAndSetProfile(user); // Fetch profile after successful sign-in
    setIsLoading(false);
    return { success: true };
  };

  const signUp = async (
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
    let authResult;
    if (selectedRole === 'instructor') {
      authResult = await signUpInstructor(
        data.email,
        data.password,
        data.fullName,
        data.businessName || '',
        data.subdomain
      );
    } else {
      authResult = await signUpStudent(
        data.email,
        data.password,
        data.fullName,
        data.instructorId || ''
      );
    }

    if (authResult.error) {
      setError(authResult.error.message);
      setIsLoading(false);
      return { success: false, error: authResult.error.message };
    }
    setUser(authResult.user);
    await fetchAndSetProfile(authResult.user); // Fetch profile after successful sign-up
    setIsLoading(false);
    return { success: true };
  };

  const signOutUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
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
    signUp,
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