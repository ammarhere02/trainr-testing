import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function PostLogin() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handlePostLogin = async () => {
      const { user, profile, role, isLoading: authLoading, error: authError } = useAuth();

      try {
        if (authLoading) return; // Wait for auth to load

        if (!user || !profile || !role) {
          // No user found, redirect to login
          return
        }

        // Check for redirect_to parameter
        const urlParams = new URLSearchParams(window.location.search)
        const redirectTo = urlParams.get('redirect_to')
        
        if (redirectTo) {
          // Redirect to the specified URL
          window.location.replace(redirectTo)
          return
        }

        // Route by role
        if (role === 'instructor') {
          window.location.replace('/dashboard-instructor')
        } else {
          // Student - redirect to library
          window.location.replace('/dashboard-student')
        }
        
      } catch (error) {
        console.error('Post-login error:', error)
        setError('An error occurred during login. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    handlePostLogin()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Signing you in...</h1>
          <p className="text-gray-600">Please wait while we set up your account</p>
        </div>
      </div>
    </div>
  )
}