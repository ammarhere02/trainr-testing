import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  Database,
  AlertCircle,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function DatabaseTest() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTestResult = (
    test: string,
    success: boolean,
    message: string,
    details?: any
  ) => {
    setTests((prev) => [
      ...prev,
      { test, success, message, details, timestamp: new Date() },
    ]);
  };

  const clearTests = () => {
    setTests([]);
    setError(null);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    clearTests();

    try {
      // Test 1: Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      addTestResult(
        "Environment Variables",
        !!(supabaseUrl && supabaseKey),
        supabaseUrl && supabaseKey
          ? `URL: ${supabaseUrl.substring(0, 30)}...`
          : "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY",
        { url: supabaseUrl, hasKey: !!supabaseKey }
      );

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing environment variables");
      }

      // Test 2: Basic connection test
      try {
        const { data, error } = await supabase
          .from("instructors")
          .select("count")
          .limit(1);
        addTestResult(
          "Database Connection",
          !error,
          error ? error.message : "Connection successful",
          { data, error }
        );
      } catch (connError: any) {
        addTestResult(
          "Database Connection",
          false,
          `Connection failed: ${connError.message}`,
          connError
        );
      }

      // Test 3: Test auth connection
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        addTestResult(
          "Auth Session Check",
          !sessionError,
          sessionError
            ? sessionError.message
            : session
            ? "Active session found"
            : "No active session",
          { session, error: sessionError }
        );
      } catch (authError: any) {
        addTestResult(
          "Auth Session Check",
          false,
          `Auth check failed: ${authError.message}`,
          authError
        );
      }

      // Test 4: Test signup endpoint (without actually creating user)
      try {
        // This should fail with "Signup requires a valid password" which means the endpoint is reachable
        const { error: signupError } = await supabase.auth.signUp({
          email: "test@example.com",
          password: "", // Empty password to trigger validation error
        });

        addTestResult(
          "Signup Endpoint Test",
          !!(
            signupError?.message.includes("password") ||
            signupError?.message.includes("Password")
          ),
          signupError
            ? signupError.message.includes("password")
              ? "Endpoint reachable (password validation works)"
              : signupError.message
            : "Unexpected success with empty password",
          { error: signupError }
        );
      } catch (signupError: any) {
        addTestResult(
          "Signup Endpoint Test",
          false,
          `Signup endpoint failed: ${signupError.message}`,
          signupError
        );
      }
    } catch (err: any) {
      setError(err.message);
      addTestResult(
        "Test Execution",
        false,
        `Test failed: ${err.message}`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const testFullSignup = async () => {
    setLoading(true);
    clearTests();

    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const testPassword = "TestPassword123!";

      addTestResult(
        "Starting Full Signup Test",
        true,
        `Using email: ${testEmail}`,
        { email: testEmail }
      );

      // Test full signup flow
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: "Test User",
            role: "instructor",
          },
        },
      });

      addTestResult(
        "Auth Signup",
        !authError,
        authError ? authError.message : "Auth user created successfully",
        { authData, authError }
      );

      if (authData.user && !authError) {
        // Test profile creation
        const { error: profileError } = await supabase
          .from("instructors")
          .insert({
            id: authData.user.id,
            email: testEmail,
            full_name: "Test User",
            business_name: "Test Business",
          });

        addTestResult(
          "Profile Creation",
          !profileError,
          profileError
            ? profileError.message
            : "Instructor profile created successfully",
          { profileError }
        );

        // Clean up - sign out
        await supabase.auth.signOut();
        addTestResult("Cleanup", true, "Signed out successfully", {});
      }
    } catch (err: any) {
      setError(err.message);
      addTestResult(
        "Full Signup Test",
        false,
        `Test failed: ${err.message}`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  const fixRLSPolicies = async () => {
    setLoading(true);
    clearTests();

    addTestResult(
      "RLS Policy Instructions",
      true,
      "Follow these steps to fix RLS policies",
      {}
    );

    addTestResult(
      "Step 1: Open Supabase Dashboard",
      true,
      "Go to your Supabase project → SQL Editor",
      { url: "https://supabase.com/dashboard" }
    );

    addTestResult(
      "Step 2: Run RLS Policy Script",
      true,
      "Copy and run the SQL script from: supabase/rls_policies.sql",
      { file: "supabase/rls_policies.sql" }
    );

    addTestResult(
      "Step 3: Test Student Creation",
      true,
      "After running the script, use the 'Create Student Record' button",
      {}
    );

    setLoading(false);
  };

  const createStudentRecord = async () => {
    setLoading(true);
    clearTests();

    try {
      // Check if user is logged in
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      addTestResult(
        "User Check",
        !!user && !userError,
        user ? `Logged in as: ${user.email}` : "Not logged in",
        { user: !!user, userError }
      );

      if (!user) {
        addTestResult(
          "Create Student Record",
          false,
          "Please log in first",
          {}
        );
        return;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      addTestResult(
        "Profile Check",
        !!profile && !profileError,
        profile
          ? `Found profile for: ${profile.full_name}`
          : "No profile found",
        { profile, profileError }
      );

      if (!profile || profile.role !== "student") {
        addTestResult(
          "Role Check",
          false,
          `User role is "${profile?.role || "unknown"}" - must be student`,
          { role: profile?.role }
        );
        return;
      }

      // Check if student record already exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .eq("email", profile.email)
        .single();

      if (existingStudent) {
        addTestResult(
          "Student Record Check",
          true,
          "Student record already exists!",
          { student: existingStudent }
        );
        return;
      }

      // Get available instructors
      const { data: instructors, error: instructorError } = await supabase
        .from("instructors")
        .select("id, business_name")
        .limit(5);

      addTestResult(
        "Instructors Check",
        !!instructors && !instructorError,
        instructors
          ? `Found ${instructors.length} instructors`
          : "No instructors found",
        { instructors, instructorError }
      );

      if (!instructors || instructors.length === 0) {
        addTestResult(
          "Create Student Record",
          false,
          "No instructors available - create an instructor first",
          {}
        );
        return;
      }

      // Use first instructor
      const instructor = instructors[0];

      // Create student record
      const { error: studentError } = await supabase.from("students").insert({
        email: profile.email,
        full_name: profile.full_name,
        instructor_id: instructor.id,
      });

      addTestResult(
        "Student Record Creation",
        !studentError,
        studentError
          ? `Failed: ${studentError.message}`
          : `Student record created with instructor: ${instructor.business_name}`,
        { studentError, instructor }
      );

      if (!studentError) {
        addTestResult(
          "Success",
          true,
          "Student record created! Refresh the page to see changes.",
          {}
        );
      }
    } catch (err: any) {
      setError(err.message);
      addTestResult(
        "Create Student Record",
        false,
        `Failed: ${err.message}`,
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Database & Auth Test
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={testBasicConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            {loading ? "Testing..." : "Basic Connection"}
          </button>

          <button
            onClick={testFullSignup}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? "Testing..." : "Full Signup"}
          </button>

          <button
            onClick={fixRLSPolicies}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {loading ? "Fixing..." : "Fix RLS Policies"}
          </button>

          <button
            onClick={createStudentRecord}
            disabled={loading}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {loading ? "Creating..." : "Create Student Record"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <strong className="text-red-800">Error:</strong>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {tests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Results
              </h2>
              <button
                onClick={clearTests}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 text-sm"
              >
                Clear Results
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {result.test}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          result.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {result.message}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Common Issues & Solutions:
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • <strong>Connection Closed:</strong> Check if your Supabase
              project is active and not paused
            </li>
            <li>
              • <strong>Invalid Credentials:</strong> Ensure the user exists in
              auth.users table
            </li>
            <li>
              • <strong>RLS Errors:</strong> Check Row Level Security policies
              in Supabase dashboard
            </li>
            <li>
              • <strong>Network Issues:</strong> Verify internet connection and
              firewall settings
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
