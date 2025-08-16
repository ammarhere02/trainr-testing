import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Users,
  BarChart3,
  User,
  Building,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface InstructorAuthProps {
  onSuccess: (user: any) => void;
}

export default function InstructorAuth({ onSuccess }: InstructorAuthProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === "signup") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "You must agree to the terms";
    }

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (mode === "signup" && formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === "login") {
        const result = await signIn(
          formData.email,
          formData.password,
          "instructor"
        );
        if (result.success) {
          onSuccess({});
        } else {
          setErrors({ submit: result.error || "Sign in failed" });
        }
      } else {
        const result = await signUp("instructor", {
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`,
          businessName: formData.businessName,
        });
        if (result.success) {
          onSuccess({});
        } else {
          setErrors({ submit: result.error || "Sign up failed" });
        }
      }
    } catch (error: any) {
      setErrors({
        submit: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Trainr</span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Teach. Inspire.
              <br />
              <span className="text-purple-200">Transform Lives.</span>
            </h1>

            <p className="text-xl text-purple-100 mb-12 leading-relaxed">
              Join thousands of educators building successful online teaching
              businesses with our all-in-one platform.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Engaging Courses</h3>
                  <p className="text-purple-200 text-sm">
                    Build interactive learning experiences
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Build Community</h3>
                  <p className="text-purple-200 text-sm">
                    Connect students and foster engagement
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Track Success</h3>
                  <p className="text-purple-200 text-sm">
                    Monitor progress and optimize performance
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
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Trainr for Educators
                </h1>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {mode === "login" ? "Welcome Back" : "Create Your Academy"}
                </h2>
                <p className="text-gray-600">
                  {mode === "login"
                    ? "Sign in to your instructor dashboard"
                    : "Start building your online course platform"}
                </p>
              </div>

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "signup" && (
                  <>
                    {/* Name Fields */}
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.lastName
                              ? "border-red-300"
                              : "border-gray-300"
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

                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business/Course Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              businessName: e.target.value,
                            }))
                          }
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            errors.businessName
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          placeholder="John's Web Development Academy"
                        />
                      </div>
                      {errors.businessName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessName}
                        </p>
                      )}
                    </div>
                  </>
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
                      className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
                        errors.email ? "border-red-300" : ""
                      }`}
                      placeholder="instructor@example.com"
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
                      className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
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
                        className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors ${
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
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeToTerms: e.target.checked,
                        }))
                      }
                      className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-700 underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-purple-600 hover:text-purple-700 underline"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                )}

                {errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.agreeToTerms}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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
                        ? "Sign In to Dashboard"
                        : "Create Instructor Account"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle between login and signup */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {mode === "login"
                        ? "New to Trainr?"
                        : "Already have an account?"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm mb-4">
                  {mode === "login"
                    ? "Start your teaching journey today"
                    : "Welcome back to your teaching dashboard"}
                </p>
                <button
                  onClick={() => {
                    setMode(mode === "login" ? "signup" : "login");
                    setErrors({});
                  }}
                  className="w-full border-2 border-purple-200 text-purple-600 py-3 px-6 rounded-xl font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                >
                  {mode === "login"
                    ? "Create Instructor Account"
                    : "Sign In Instead"}
                </button>
              </div>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
