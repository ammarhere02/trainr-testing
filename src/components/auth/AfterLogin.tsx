import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AfterLogin() {
  const [error, setError] = useState<string | null>(null)
  const { user, profile, role, isLoading: authLoading } = useAuth()

  useEffect(() => {
    const handleAfterLogin = async () => {
      try {
        console.log('AfterLogin: handleAfterLogin triggered. authLoading:', authLoading, 'user:', user, 'profile:', profile, 'role:', role);

        // Wait until authentication state is fully loaded
        if (authLoading) {
          console.log('AfterLogin: Still loading auth state, returning.');
          return;
        }
      console.log('AfterLogin: handleAfterLogin triggered. authLoading:', authLoading, 'user:', user, 'profile:', profile, 'role:', role);

      // Wait until authentication state is fully loaded
      if (authLoading) {
        console.log('AfterLogin: Still loading auth state, returning.');
        return;
      }

        if (!user) {
          console.log('AfterLogin: No user found, redirecting to login.');
          console.log('AfterLogin: No user found, redirecting to login.');
          window.location.href = '/login/instructor';
          return;
        }

        if (!profile || !role) {
          console.log('AfterLogin: User present but profile/role not determined. Profile:', profile, 'Role:', role);
          console.log('AfterLogin: User present but profile/role not determined. Profile:', profile, 'Role:', role);
          setError('User profile or role could not be determined. Please try logging in again.');
          return;
        }

        console.log('AfterLogin: All data loaded, redirecting to dashboard:', role);
        console.log('AfterLogin: All data loaded, redirecting to dashboard:', role);
        // Route based on user role
        if (role === 'instructor') {
          window.location.href = '/dashboard-instructor'
        } else {
          window.location.href = '/dashboard-student'
        }
        
      } catch (error) {
        console.error('After-login error:', error)
        setError('An error occurred. Please try again.')
      } finally {
        // No need to set loading state as we use authLoading from useAuth
      }
    }

    handleAfterLogin()
  }, [user, profile, role, authLoading])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login/instructor"
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
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold text-2xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/login/instructor"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
          <p className="text-gray-600">Taking you to your dashboard</p>
        </div>
      </div>
    </div>
  )
}