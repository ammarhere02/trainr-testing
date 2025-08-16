import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  Award,
  Building,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

interface Instructor {
  id: string;
  business_name: string;
}

interface StudentAuthProps {
  onSuccess: (user: any) => void;
  instructorId?: string;
}

export default function StudentAuth({
  onSuccess,
  instructorId,
}: StudentAuthProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [availableInstructors, setAvailableInstructors] = useState<
    Instructor[]
  >([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState(
    instructorId || ""
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch available instructors for signup
  useEffect(() => {
    const fetchInstructors = async () => {
      if (mode === "signup" && !instructorId) {
        try {
          const { data: instructors, error } = await supabase
            .from("instructors")
            .select("id, business_name")
            .eq("is_active", true)
            .order("business_name");

          if (error) {
            console.error("Error fetching instructors:", error);
          } else {
            setAvailableInstructors(instructors || []);
          }
        } catch (error) {
          console.error("Exception fetching instructors:", error);
        }
      }
    };

    fetchInstructors();
  }, [mode, instructorId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup") {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!instructorId && !selectedInstructorId) {
        newErrors.instructor = "Please select an instructor";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (mode === "signup" && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log("StudentAuth: Starting form submission, mode:", mode);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const result = await signIn(
          formData.email,
          formData.password,
          "student"
        );
        if (result.success) {
          onSuccess({});
        } else {
          setErrors({ submit: result.error || "Sign in failed" });
        }
      } else {
        const result = await signUp("student", {
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`,
          instructorId: instructorId || selectedInstructorId,
        });
        if (result.success) {
          onSuccess({});
        } else {
          setErrors({ submit: result.error || "Sign up failed" });
        }
      }
    } catch (error: any) {
      console.error("StudentAuth: Unexpected error:", error);
      setErrors({
        submit:
          error.message ||
          `Failed to ${mode === "login" ? "sign in" : "create account"}`,
      });
    } finally {
      console.log("StudentAuth: Form submission complete");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Trainr</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Learn. Grow.
              <br />
              <span className="text-blue-200">Achieve More.</span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Access world-class courses, connect with fellow learners, and
              accelerate your personal and professional growth.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Interactive Learning</h3>
                  <p className="text-blue-200 text-sm">
                    Hands-on courses with real-world projects
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Community Support</h3>
                  <p className="text-blue-200 text-sm">
                    Learn alongside motivated peers
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Earn Certificates</h3>
                  <p className="text-blue-200 text-sm">
                    Showcase your achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Trainr for Students
                </h1>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {mode === "login" ? "Welcome Back" : "Join as Student"}
                </h2>
                <p className="text-gray-600">
                  {mode === "login"
                    ? "Continue your learning journey"
                    : "Start your learning adventure"}
                </p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.firstName
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="John"
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Instructor Selection for Signup */}
                {mode === "signup" && !instructorId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Instructor
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <select
                        value={selectedInstructorId}
                        onChange={(e) =>
                          setSelectedInstructorId(e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                          errors.instructor
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Choose an instructor...</option>
                        {availableInstructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.business_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.instructor && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.instructor}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
                        errors.email ? "border-red-300" : ""
                      }`}
                      placeholder="student@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
                        errors.password ? "border-red-300" : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
                          errors.confirmPassword ? "border-red-300" : ""
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember-me"
                        checked={formData.rememberMe}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rememberMe: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 text-sm text-gray-600"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      {mode === "login"
                        ? "Signing in..."
                        : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {mode === "login"
                        ? "Access My Courses"
                        : "Create Student Account"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle between login and signup */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setMode(mode === "login" ? "signup" : "login");
                      setErrors({});
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {mode === "login"
                      ? "Create student account"
                      : "Sign in instead"}
                  </button>
                </p>

                {/* Back to Home */}
                <div className="mt-4">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>

              {/* Test Credentials Helper */}
              {mode === "login" && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm font-medium mb-2">
                    🧪 Test Credentials:
                  </p>
                  <div className="text-blue-700 text-xs space-y-1">
                    <p>
                      <strong>Note:</strong> You need to create a student
                      account first
                    </p>
                    <p>Click "Create student account" below to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
