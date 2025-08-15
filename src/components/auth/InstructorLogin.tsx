import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, ArrowRight, User, Building, Globe, CheckCircle, X } from 'lucide-react';
import { signInEmail, signUpInstructor } from '../../lib/auth.tsx';
import { checkSubdomainAvailability } from '../../lib/org';
import { createTestUsers } from '../../lib/auth.tsx';

interface InstructorLoginProps {
  onLoginSuccess: (userData: any) => void;
}

export default function InstructorLogin({ onLoginSuccess }: InstructorLoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '',
    subdomain: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [subdomainStatus, setSubdomainStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null);

  // Create test users on component mount (development only)
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      createTestUsers();
    }
  }, []);

  // Check subdomain availability
  const checkSubdomain = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainStatus('invalid');
      return;
    }

    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      setSubdomainStatus('invalid');
      return;
    }

    setSubdomainStatus('checking');
    
    try {
      const isAvailable = await checkSubdomainAvailability(subdomain);
      setSubdomainStatus(isAvailable ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setSubdomainStatus('available'); // Assume available on error
    }
  };

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, subdomain: cleanValue }));
    
    if (cleanValue) {
      const timeoutId = setTimeout(() => {
        checkSubdomain(cleanValue);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSubdomainStatus(null);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (mode === 'login') {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
    } else {
      // Signup validation
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
      else if (subdomainStatus !== 'available') newErrors.subdomain = 'Please choose an available subdomain';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { user, error } = await signInEmail(formData.email, formData.password);
      
      if (error) {
        setErrors({ general: error.message });
      } else if (user) {
        // Get instructor profile and redirect
        const { getInstructorProfile } = await import('../../lib/auth');
        const instructorProfile = await getInstructorProfile(user.id);
        
        if (instructorProfile) {
          onLoginSuccess({
            user,
            profile: instructorProfile,
            role: 'instructor'
          });
        } else {
          setErrors({ general: 'Instructor profile not found. Please contact support.' });
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { user, error } = await signUpInstructor(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`,
        formData.businessName,
        formData.subdomain
      );
      
      if (error) {
        setErrors({ general: error.message });
      } else if (user) {
        // Get the created instructor profile
        const { getInstructorProfile } = await import('../../lib/auth');
        const instructorProfile = await getInstructorProfile(user.id);
        
        if (instructorProfile) {
          onLoginSuccess({
            user,
            profile: instructorProfile,
            role: 'instructor'
          });
        } else {
          setErrors({ general: 'Account created but profile not found. Please try logging in.' });
        }
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({ general: 'Account creation failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getSubdomainStatusIcon = () => {
    switch (subdomainStatus) {
      case 'checking':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'taken':
      case 'invalid':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSubdomainStatusMessage = () => {
    switch (subdomainStatus) {
      case 'checking':
        return 'Checking availability...';
      case 'available':
        return `trytrainr.com/${formData.subdomain} is available!`;
      case 'taken':
        return 'This subdomain is already taken';
      case 'invalid':
        return 'Invalid subdomain format (3+ chars, letters, numbers, hyphens only)';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Instructor Login' : 'Create Instructor Account'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login' ? 'Sign in to your teaching dashboard' : 'Start your teaching journey with Trainr'}
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="test@instructor.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="password123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In as Instructor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
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
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.businessName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John's Web Development Academy"
                  />
                </div>
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Subdomain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Subdomain
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    trytrainr.com/
                  </span>
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className={`w-full pl-32 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.subdomain ? 'border-red-300' : 
                      subdomainStatus === 'available' ? 'border-green-300' :
                      subdomainStatus === 'taken' || subdomainStatus === 'invalid' ? 'border-red-300' :
                      'border-gray-300'
                    }`}
                    placeholder="johndoe"
                  />
                  {getSubdomainStatusIcon() && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getSubdomainStatusIcon()}
                    </div>
                  )}
                </div>
                {subdomainStatus && (
                  <p className={`text-xs mt-1 ${
                    subdomainStatus === 'available' ? 'text-green-600' : 
                    subdomainStatus === 'checking' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {getSubdomainStatusMessage()}
                  </p>
                )}
                {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (mode === 'signup' && subdomainStatus !== 'available')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Instructor Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErrors({});
                  setSubdomainStatus(null);
                }}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {mode === 'login' ? 'Create instructor account' : 'Sign in instead'}
              </button>
            </p>
          </div>

          {/* Test Credentials Helper */}
          {mode === 'login' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">🧪 Test Credentials:</p>
              <div className="text-blue-700 text-xs space-y-1">
                <p><strong>Email:</strong> test@instructor.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}