import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader, ArrowRight, Chrome, Building, Globe, User, CheckCircle, X } from 'lucide-react'
import { signInEmail, signInGoogle, sendMagicLink } from '../../lib/auth'
import { getOrganizationBySubdomain } from '../../lib/org'
import type { Organization } from '../../lib/org'

export default function CanonicalLogin() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    businessName: '',
    subdomain: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<'email' | 'google' | 'magic' | null>(null)
  const [errors, setErrors] = useState<any>({})
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [showMagicLinkSent, setShowMagicLinkSent] = useState(false)
  const [subdomainStatus, setSubdomainStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)

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

  // Check subdomain availability
  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainStatus('invalid')
      return
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9-]+$/
    if (!subdomainRegex.test(subdomain)) {
      setSubdomainStatus('invalid')
      return
    }

    setSubdomainStatus('checking')
    
    try {
      // Check if subdomain already exists
      const existingOrg = await getOrganizationBySubdomain(subdomain)
      if (existingOrg) {
        setSubdomainStatus('taken')
      } else {
        setSubdomainStatus('available')
      }
    } catch (error) {
      console.error('Error checking subdomain:', error)
      setSubdomainStatus('available') // Assume available on error
    }
  }

  const handleSubdomainChange = (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({ ...prev, subdomain: cleanValue }))
    
    if (cleanValue) {
      const timeoutId = setTimeout(() => {
        checkSubdomainAvailability(cleanValue)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    } else {
      setSubdomainStatus(null)
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (mode === 'login') {
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      
      if (!formData.password) newErrors.password = 'Password is required'
    } else {
      // Signup validation
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
      if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required'
      else if (subdomainStatus !== 'available') newErrors.subdomain = 'Please choose an available subdomain'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setLoadingType('email')

    try {
      // Check if Supabase is configured

      // Import signup functions
      const { signUpEmail } = await import('../../lib/auth')
      const { createOrganization } = await import('../../lib/org')
      
      // Create user account
      const { user, error } = await signUpEmail(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`,
        'educator'
      )
      
      if (error) {
        setErrors({ general: error.message })
        return
      }

      if (user) {
        // Create organization
        try {
          const org = await createOrganization({
            subdomain: formData.subdomain,
            name: formData.businessName,
            color: '#7c3aed'
          })

          if (org) {
            // Update user profile with org_id
            const { supabase } = await import('../../lib/supabase')
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ org_id: org.id, role: 'educator' })
              .eq('id', user.id)
            
            if (updateError) {
              console.error('Error updating profile:', updateError)
            }
          }
        } catch (orgError) {
          console.error('Error creating organization:', orgError)
        }
        
        // Redirect to post-login
        window.location.href = '/post-login'
      }
    } catch (error) {
      console.error('Signup failed:', error)
      
      if (error instanceof Error) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'Account creation failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
      setLoadingType(null)
    }
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
        // Show success message
        setErrors({ general: '' })
        // Redirect to post-login handler
        if (redirectTo) {
          window.location.href = '/post-login?redirect_to=' + encodeURIComponent(redirectTo)
        } else {
          window.location.href = '/post-login'
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
      if (error instanceof Error) {
        setErrors({ general: error.message })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
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

  const getSubdomainStatusIcon = () => {
    switch (subdomainStatus) {
      case 'checking':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'taken':
      case 'invalid':
        return <X className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getSubdomainStatusMessage = () => {
    switch (subdomainStatus) {
      case 'checking':
        return 'Checking availability...'
      case 'available':
        return `${formData.subdomain}.trainr.app is available!`
      case 'taken':
        return 'This subdomain is already taken'
      case 'invalid':
        return 'Invalid subdomain format (3+ chars, letters, numbers, hyphens only)'
      default:
        return ''
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
              {mode === 'signup' 
                ? 'Create your teaching account' 
                : organization 
                  ? 'Access your learning dashboard' 
                  : 'Welcome back to your account'
              }
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Database Setup Notice */}
          {!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('your_supabase_project_url_here') ? (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Database Setup Required</p>
                  <p className="text-xs">
                    Please configure your Supabase credentials and run the SQL migration to enable account creation.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {mode === 'login' ? (
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
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.businessName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className={`w-full pl-10 pr-32 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.subdomain ? 'border-red-300' : 
                      subdomainStatus === 'available' ? 'border-green-300' :
                      subdomainStatus === 'taken' || subdomainStatus === 'invalid' ? 'border-red-300' :
                      'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
                    placeholder="johndoe"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    {getSubdomainStatusIcon()}
                    <span className="text-gray-500 text-sm">.trytrainr.com</span>
                  </div>
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
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
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': brandColor } as React.CSSProperties}
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
                disabled={isLoading || subdomainStatus !== 'available'}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                style={{ backgroundColor: brandColor }}
              >
                {isLoading && loadingType === 'email' ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Teaching Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <>
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
            </>
          )}

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <a
                href="#"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setErrors({})
                  setSubdomainStatus(null)
                }}
                className="font-medium hover:underline"
                style={{ color: brandColor }}
              >
                {mode === 'login' ? 'Create educator account' : 'Sign in instead'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}