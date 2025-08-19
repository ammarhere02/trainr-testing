import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "instructor" | "student";
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface Instructor {
  id: string;
  business_name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  specialization?: string[];
  years_of_experience?: number;
  social_links?: any;
  total_courses?: number;
  total_students?: number;
  average_rating?: number;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface UserData {
  profile: Profile;
  instructor?: Instructor;
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  role: "instructor" | "student" | null;
  isLoading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    role: "instructor" | "student",
    data: {
      email: string;
      password: string;
      fullName: string;
      businessName?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<"instructor" | "student" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Fetch user profile and instructor data if applicable
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {

      // Get profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("useAuth: Error fetching profile:", profileError);
        return null;
      }

      if (!profile) {
        return null;
      }


      const result: UserData = { profile };

      // If user is an instructor, get instructor data
      if (profile.role === "instructor") {
        const { data: instructor, error: instructorError } = await supabase
          .from("instructors")
          .select("*")
          .eq("id", userId)
          .single();

        if (instructorError) {
          console.warn(
            "useAuth: Error fetching instructor data:",
            instructorError
          );
        } else if (instructor) {
          result.instructor = instructor;
        }
      }

      return result;
    } catch (error) {
      console.error("useAuth: Exception in fetchUserData:", error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    if (authInitialized) return;

    setAuthInitialized(true);

    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("useAuth: Session error:", sessionError);
          setError("Failed to get session");
          return;
        }

        if (session?.user) {
          setUser(session.user);

          const data = await fetchUserData(session.user.id);
          if (data) {
            setUserData(data);
            setRole(data.profile.role as "instructor" | "student");
          } else {
            console.warn("useAuth: No user data found for authenticated user");
            setError("User profile not found. Please contact support.");
          }
        } else {
          setUser(null);
          setUserData(null);
          setRole(null);
        }
      } catch (error) {
        console.error("useAuth: Error initializing auth:", error);
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (event === "SIGNED_IN" && session?.user) {
        setIsLoading(true);
        setUser(session.user);

        const data = await fetchUserData(session.user.id);
        if (data) {
          setUserData(data);
          setRole(data.profile.role as "instructor" | "student");
        } else {
          setUserData(null);
          setRole(null);
          setError("Profile not found after sign in");
        }
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setUserData(null);
        setRole(null);
        setError(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = async (email: string, password: string) => {
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("useAuth: Sign in error:", error);
        setError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error("useAuth: Sign in exception:", error);
      const errorMessage = error.message || "Sign in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (
    selectedRole: "instructor" | "student",
    data: {
      email: string;
      password: string;
      fullName: string;
      businessName?: string;
    }
  ) => {
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: selectedRole,
            business_name: data.businessName,
          },
        },
      });

      if (authError) {
        console.error("useAuth: Auth signup error:", authError);
        setError(authError.message);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        const errorMsg = "User creation failed - no user returned";
        console.error("useAuth:", errorMsg);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify the profile was created
      const userData = await fetchUserData(authData.user.id);
      if (!userData) {
        console.warn(
          "useAuth: Profile not created by trigger, creating manually..."
        );

        // Fallback: Create profile manually
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: selectedRole,
        });

        if (profileError) {
          console.error(
            "useAuth: Manual profile creation failed:",
            profileError
          );
          setError(`Failed to create profile: ${profileError.message}`);
          return { success: false, error: profileError.message };
        }

        // If instructor, create instructor record
        if (selectedRole === "instructor") {
          const { error: instructorError } = await supabase
            .from("instructors")
            .insert({
              id: authData.user.id,
              business_name: data.businessName || "My Business",
            });

          if (instructorError) {
            console.error(
              "useAuth: Manual instructor creation failed:",
              instructorError
            );
            setError(
              `Failed to create instructor profile: ${instructorError.message}`
            );
            return { success: false, error: instructorError.message };
          }
        }
      }
      return { success: true };
    } catch (error: any) {
      console.error("useAuth: Sign up exception:", error);
      const errorMessage = error.message || "Sign up failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("useAuth: Sign out error:", error);
        setError(error.message);
      }
    } catch (error: any) {
      console.error("useAuth: Sign out exception:", error);
      setError(error.message);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const data = await fetchUserData(user.id);
      setUserData(data);
      setRole((data?.profile.role as "instructor" | "student") || null);
    }
  };

  const value = {
    user,
    userData,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
