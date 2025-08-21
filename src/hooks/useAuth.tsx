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

interface Student {
  id: string;
  email: string;
  full_name: string;
  instructor_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  profile: Profile;
  instructor?: Instructor;
  student?: Student;
}

interface AuthContextType {
  user: any | null;
  userData: UserData | null;
  role: "instructor" | "student" | null;
  isLoading: boolean;
  isSigningOut: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string,
    expectedRole?: "instructor" | "student"
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    role: "instructor" | "student",
    data: {
      email: string;
      password: string;
      fullName: string;
      businessName?: string;
      instructorId?: string; // Required for students
    }
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  createMissingStudentRecord: (
    instructorId: string
  ) => Promise<{ success: boolean; error?: string }>;
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
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Fetch user profile and instructor data if applicable
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      // Add timeout to prevent hanging
      const fetchWithTimeout = (promise: any, timeoutMs: number = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
          ),
        ]);
      };

      const profileQuery = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      const { data: profile, error: profileError } = (await fetchWithTimeout(
        profileQuery,
        8000
      )) as any;

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

      // If user is a student, get student data
      if (profile.role === "student") {
        try {
          const { data: student, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("email", profile.email) // Students table uses email to link, not profile id
            .single();

          if (studentError) {
            // Don't treat "no rows returned" as an error - just means student record doesn't exist yet
            if (studentError.code === "PGRST116") {
            } else {
              // For HTTP 406 errors, also treat as "student record not found"
              if (
                studentError.message?.includes("406") ||
                studentError.message?.includes("Not Acceptable")
              ) {
              }
            }
          } else if (student) {
            result.student = student;
          }
        } catch (httpError: any) {
          console.error(httpError);
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
          setError("Failed to get session");
          return;
        }

        if (session?.user) {
          setUser(session.user);

          try {
            const data = await fetchUserData(session.user.id);
            if (data) {
              setUserData(data);
              setRole(data.profile.role as "instructor" | "student");
            } else {
              console.warn(
                "useAuth: No user data found for authenticated user"
              );
              setError("User profile not found. Please contact support.");
            }
          } catch (fetchError) {
            console.error("useAuth: Error fetching user data:", fetchError);
            setError(
              "Failed to load user profile. Please try refreshing the page."
            );
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

    // Set up auth state listener - simplified to avoid conflicts
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event, "Session exists:", !!session?.user);

      // Only handle SIGNED_OUT events here to avoid conflicts with manual sign-in
      if (event === "SIGNED_OUT") {
        console.log("Processing SIGNED_OUT event");
        setUser(null);
        setUserData(null);
        setRole(null);
        setError(null);
        setIsLoading(false);
      }
      // Don't handle SIGNED_IN here - let the signIn method handle it directly
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = async (
    email: string,
    password: string,
    expectedRole?: "instructor" | "student"
  ) => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("useAuth: Sign in error:", error);
        setError(error.message);
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Fetch and set user data immediately after successful sign in
      if (data.user) {
        console.log("useAuth: Sign in successful, fetching user data...");
        setUser(data.user);

        try {
          const userData = await fetchUserData(data.user.id);
          if (userData) {
            // Role validation
            if (expectedRole && userData.profile.role !== expectedRole) {
              await supabase.auth.signOut();
              const errorMessage = `This account is registered as a ${userData.profile.role}. Please use the ${userData.profile.role} login page.`;
              setError(errorMessage);
              setIsLoading(false);
              return { success: false, error: errorMessage };
            }

            // Set user data and role
            setUserData(userData);
            setRole(userData.profile.role as "instructor" | "student");
            setIsLoading(false);

            console.log("useAuth: User data set successfully, role:", userData.profile.role);
            return { success: true };
          } else {
            setError("User profile not found. Please contact support.");
            setIsLoading(false);
            return { success: false, error: "User profile not found" };
          }
        } catch (fetchError) {
          console.error("useAuth: Error fetching user data after sign in:", fetchError);
          setError("Failed to load user profile. Please try again.");
          setIsLoading(false);
          return { success: false, error: "Failed to load user profile" };
        }
      }

      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error("useAuth: Sign in exception:", error);
      const errorMessage = error.message || "Sign in failed";
      setError(errorMessage);
      setIsLoading(false);
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
      instructorId?: string;
    }
  ) => {
    setError(null);

    // Validate required fields
    if (selectedRole === "student" && !data.instructorId) {
      const errorMsg = "Instructor ID is required for student registration";
      console.error("useAuth:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (selectedRole === "instructor" && !data.businessName) {
      const errorMsg = "Business name is required for instructor registration";
      console.error("useAuth:", errorMsg);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: selectedRole,
            business_name: data.businessName,
            instructor_id: data.instructorId,
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

      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // Wait a moment for auth to settle
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (existingProfile) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            email: data.email,
            full_name: data.fullName,
            role: selectedRole,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.error("useAuth: Profile update failed:", updateError);
          setError(`Failed to update profile: ${updateError.message}`);
          return { success: false, error: updateError.message };
        }
      } else {
        // Create new profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          role: selectedRole,
        });

        if (profileError) {
          console.error("useAuth: Profile creation failed:", profileError);

          // Check if it's an RLS policy violation
          if (profileError.message.includes("row-level security policy")) {
            const rlsError =
              "RLS Policy Error: Please run the SQL script in supabase/rls_policies.sql in your Supabase dashboard to fix authentication permissions.";
            setError(rlsError);
            return { success: false, error: rlsError };
          }

          // Check if it's a duplicate key error (profile created by trigger)
          if (profileError.code === "23505") {
          } else {
            setError(`Failed to create profile: ${profileError.message}`);
            return { success: false, error: profileError.message };
          }
        }
      }

      // Create role-specific records
      if (selectedRole === "instructor") {
        // Check if instructor record already exists
        const { data: existingInstructor } = await supabase
          .from("instructors")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (existingInstructor) {
          // Update existing instructor record
          const { error: updateError } = await supabase
            .from("instructors")
            .update({
              business_name: data.businessName!,
            })
            .eq("id", authData.user.id);

          if (updateError) {
            console.error("useAuth: Instructor update failed:", updateError);
            setError(
              `Failed to update instructor profile: ${updateError.message}`
            );
            return { success: false, error: updateError.message };
          }
        } else {
          const { error: instructorError } = await supabase
            .from("instructors")
            .insert({
              id: authData.user.id,
              business_name: data.businessName!,
            });

          if (instructorError) {
            console.error(
              "useAuth: Instructor creation failed:",
              instructorError
            );

            // Check if it's a duplicate key error (instructor created by trigger)
            if (instructorError.code === "23505") {
            } else {
              setError(
                `Failed to create instructor profile: ${instructorError.message}`
              );
              return { success: false, error: instructorError.message };
            }
          }
        }
      } else if (selectedRole === "student") {
        const { error: studentError } = await supabase.from("students").insert({
          email: data.email,
          full_name: data.fullName,
          instructor_id: data.instructorId!,
        });

        if (studentError) {
          console.error("useAuth: Student creation failed:", studentError);
          setError(`Failed to create student profile: ${studentError.message}`);
          return { success: false, error: studentError.message };
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
    setIsSigningOut(true);
    try {
      // Add a professional delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("useAuth: Sign out error:", error);
        setError(error.message);
      } else {
        // Clear local state
        setUser(null);
        setUserData(null);
        setRole(null);
        setError(null);

        // Add another small delay before redirect for smooth UX
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to home page
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("useAuth: Sign out exception:", error);
      setError(error.message);
    } finally {
      setIsSigningOut(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const data = await fetchUserData(user.id);
      setUserData(data);
      setRole((data?.profile.role as "instructor" | "student") || null);
    }
  };

  // Helper function to create missing student record for existing users
  const createMissingStudentRecord = async (instructorId: string) => {
    if (!user || !userData?.profile) {
      return { success: false, error: "No user or profile data available" };
    }

    try {
      const { error: studentError } = await supabase.from("students").insert({
        email: userData.profile.email,
        full_name: userData.profile.full_name,
        instructor_id: instructorId,
      });

      if (studentError) {
        console.error(
          "useAuth: Failed to create student record:",
          studentError
        );
        return { success: false, error: studentError.message };
      }

      // Refresh user data to include the new student record
      await refreshProfile();
      return { success: true };
    } catch (error: any) {
      console.error("useAuth: Exception creating student record:", error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    role,
    isLoading,
    isSigningOut,
    error,
    signIn,
    signUp,
    signOutUser,
    refreshProfile,
    createMissingStudentRecord,
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
