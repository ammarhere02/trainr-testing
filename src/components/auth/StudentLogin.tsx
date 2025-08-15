import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, BookOpen, Users, Video, Award } from 'lucide-react';

interface StudentLoginProps {
  onLoginSuccess: (userData: any) => void;
  instructorId?: string;
}

export default function StudentLogin({ onLoginSuccess, instructorId }: StudentLoginProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      onLoginSuccess({
        user: { email: formData.email },
        role: 'student'
      });
    }, 1000);
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
              Access world-class courses, connect with fellow learners, and accelerate your personal and professional growth.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Interactive Learning</h3>
                  <p className="text-blue-200 text-sm">Hands-on courses with real-world projects</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Community Support</h3>
                  <p className="text-blue-200 text-sm">Learn alongside motivated peers</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Earn Certificates</h3>
                  <p className="text-blue-200 text-sm">Showcase your achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Trainr for Students</h1>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Continue your learning journey</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                      placeholder="student@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Access My Courses
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">New student?</span>
                  </div>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">
                  Join thousands of learners worldwide
                </p>
                <button
                  type="button"
                  className="w-full border-2 border-blue-200 text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  Create Student Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}