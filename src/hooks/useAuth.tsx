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

  // Fetch user profile and instructor data if applicable
  const fetchUserData = async (userId: string): Promise<UserData | null> => {
    try {
      console.log("useAuth: Fetching user data for:", userId);

      // Add timeout to prevent hanging
      const fetchWithTimeout = (promise: any, timeoutMs: number = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
          ),
        ]);
      };

      // Get profile from profiles table with timeout
      console.log("useAuth: Querying profiles table...");
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
        console.log("useAuth: No profile found for user:", userId);
        return null;
      }

      console.log("useAuth: Found profile:", profile);

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
          console.log("useAuth: Found instructor data");
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
              console.log(
                "useAuth: No student record found - this is OK for existing users"
              );
              console.log(
                "useAuth: To create a student record, the student should sign up properly or ask an instructor to add them"
              );
            } else {
              console.warn(
                "useAuth: Error fetching student data:",
                studentError
              );
              // For HTTP 406 errors, also treat as "student record not found"
              if (
                studentError.message?.includes("406") ||
                studentError.message?.includes("Not Acceptable")
              ) {
                console.log(
                  "useAuth: HTTP 406 error - treating as missing student record"
                );
              }
            }
          } else if (student) {
            result.student = student;
            console.log("useAuth: Found student data");
          }
        } catch (httpError: any) {
          // Catch any network/HTTP errors and treat as missing student record
          console.log(
            "useAuth: HTTP error fetching student data - treating as missing record:",
            httpError
          );
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

    console.log("useAuth: Initializing auth state");
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
          console.log(
            "useAuth: Found existing session for user:",
            session.user.id
          );
          setUser(session.user);

          try {
            const data = await fetchUserData(session.user.id);
            if (data) {
              console.log(
                "useAuth: Setting user data and role:",
                data.profile.role
              );
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
          console.log("useAuth: No existing session found");
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
      console.log("useAuth: Auth state change:", event, "session:", !!session);

      if (event === "SIGNED_IN" && session?.user) {
        setIsLoading(true);
        setUser(session.user);

        try {
          const data = await fetchUserData(session.user.id);
          if (data) {
            console.log(
              "useAuth: Auth listener - Setting user data and role:",
              data.profile.role
            );
            setUserData(data);
            setRole(data.profile.role as "instructor" | "student");
          } else {
            console.warn("useAuth: Auth listener - No user data found");
            setUserData(null);
            setRole(null);
            setError("Profile not found after sign in");
          }
        } catch (fetchError) {
          console.error(
            "useAuth: Auth listener - Error fetching user data:",
            fetchError
          );
          setError("Failed to load user profile after sign in");
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
      console.log("useAuth: Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = async (
    email: string,
    password: string,
    expectedRole?: "instructor" | "student"
  ) => {
    console.log(
      "useAuth: Starting sign in for:",
      email,
      "expected role:",
      expectedRole
    );
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

      // If role validation is required, check user's role
      if (expectedRole && data.user) {
        const userData = await fetchUserData(data.user.id);
        if (userData && userData.profile.role !== expectedRole) {
          // Sign out the user since they're using wrong login page
          await supabase.auth.signOut();
          const errorMessage = `This account is registered as a ${userData.profile.role}. Please use the ${userData.profile.role} login page.`;
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }
      }

      console.log("useAuth: Sign in successful");
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
      instructorId?: string;
    }
  ) => {
    console.log("useAuth: Starting sign up for role:", selectedRole);
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
      // Create auth user with metadata that the trigger will use
      console.log("useAuth: Creating auth user...");
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

      console.log(
        "useAuth: Auth user created successfully. Creating profile..."
      );

      // Sign in the user first so they have permissions
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // Wait a moment for auth to settle
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if profile already exists
      console.log("useAuth: Checking if profile already exists...");
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (existingProfile) {
        console.log("useAuth: Profile already exists, updating it...");
        // Update existing profile
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
        console.log("useAuth: Creating new profile...");
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
            console.log(
              "useAuth: Profile was created by database trigger - continuing..."
            );
          } else {
            setError(`Failed to create profile: ${profileError.message}`);
            return { success: false, error: profileError.message };
          }
        }
      }

      // Create role-specific records
      if (selectedRole === "instructor") {
        // Check if instructor record already exists
        console.log("useAuth: Checking if instructor record already exists...");
        const { data: existingInstructor } = await supabase
          .from("instructors")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (existingInstructor) {
          console.log(
            "useAuth: Instructor record already exists, updating it..."
          );
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
          // Create new instructor record
          console.log("useAuth: Creating new instructor record...");
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
              console.log(
                "useAuth: Instructor was created by database trigger - continuing..."
              );
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

      console.log("useAuth: Profile creation completed successfully");
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
      } else {
        // Clear local state
        setUser(null);
        setUserData(null);
        setRole(null);
        setError(null);

        // Redirect to home page
        window.location.href = "/";
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

      console.log("useAuth: Student record created successfully");
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
