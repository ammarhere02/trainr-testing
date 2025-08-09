import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader, ArrowRight, Chrome } from 'lucide-react'
import { signInEmail, signInGoogle, sendMagicLink } from '../../lib/auth'
import { getOrganizationBySubdomain } from '../../lib/org'
import type { Organization } from '../../lib/org'

export default function CanonicalLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'email' | 'google' | 'magic' | null>(null)
  const [errors, setErrors] = useState<any>({})
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false)

  // Get query params
  const urlParams = new URLSearchParams(window.location.search)
  const orgParam = urlParams.get('org')
  const redirectTo = urlParams.get('redirect_to')

  // Load organization branding if org param is present
  useEffect(() => {
    if (orgParam) {
      getOrganizationBySubdomain(orgParam).then(setOrganization)
    }
  }, [orgParam])

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setLoadingType('email')

    try {
      const { user, error } = await signInEmail(formData.email, formData.password)
      
      if (error) {
        setErrors({ general: error.message })
      } else if (user) {
        // Redirect to post-login handler
        if (redirectTo) {
          window.location.href = '/post-login?redirect_to=' + encodeURIComponent(redirectTo)
        } else {
          window.location.href = '/post-login'
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setLoadingType('google')

    try {
      const redirectUrl = redirectTo || `${window.location.origin}/post-login`
      await signInGoogle(redirectUrl)
    } catch (error) {
      console.error('Google login failed:', error)
      setErrors({ general: 'Google login failed. Please try again.' })
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  const handleMagicLink = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required for magic link' })
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setLoadingType('magic')

    try {
      const redirectUrl = redirectTo || `${window.location.origin}/post-login`
      await sendMagicLink(formData.email, redirectUrl)
      setShowMagicLinkSent(true)
      setErrors({})
    } catch (error) {
      console.error('Magic link failed:', error)
      setErrors({ general: 'Failed to send magic link. Please try again.' })
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
  }

  // Apply organization branding
  const brandColor = organization?.color || '#7c3aed'
  const brandLogo = organization?.logo_url

  if (showMagicLinkSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <strong>{formData.email}</strong>. 
              Click the link in your email to sign in.
            </p>
            <button
              onClick={() => setShowMagicLinkSent(false)}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header with branding */}
          <div className="text-center mb-8">
            {brandLogo ? (
              <img src={brandLogo} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-2xl object-cover" />
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: brandColor }}
              >
                <span className="text-white font-bold text-2xl">
                  {organization?.name?.[0] || 'T'}
                </span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {organization ? `Sign in to ${organization.name}` : 'Sign in to Trainr'}
            </h1>
            <p className="text-gray-600">
              {organization ? 'Access your learning dashboard' : 'Welcome back to your account'}
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                  placeholder="john@example.com"
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
                  className="text-sm hover:underline"
                  style={{ color: brandColor }}
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
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="rounded border-gray-300 focus:ring-2"
                  style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              style={{ backgroundColor: brandColor }}
            >
              {isLoading && loadingType === 'email' ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Alternative Login Methods */}
          <div className="space-y-3">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && loadingType === 'google' ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Chrome className="w-4 h-4 mr-2" />
              )}
              Continue with Google
            </button>

            {/* Magic Link */}
            <button
              onClick={handleMagicLink}
              disabled={isLoading || !formData.email.trim()}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && loadingType === 'magic' ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Send magic link
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // In a real app, this would navigate to signup
                  alert('Signup functionality would be implemented here');
                }}
                className="font-medium hover:underline"
                style={{ color: brandColor }}
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}