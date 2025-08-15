import React, { useState, useEffect } from 'react';
import { User, GraduationCap, ArrowRight, LogOut, Settings, Users, BookOpen, Loader, AlertCircle } from 'lucide-react';
import { getCurrentUser, getProfile, signOut } from '../../lib/auth';
import type { Profile } from '../../lib/auth';

interface AuthDashboardProps {
  onRoleSelect: (role: 'instructor' | 'student') => void;
}

export default function AuthDashboard({ onRoleSelect }: AuthDashboardProps) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('No user found. Please log in again.');
        return;
      }

      const profile = await getProfile(user.id);
      if (!profile) {
        setError('Profile not found. Please contact support.');
        return;
      }

      setCurrentProfile(profile);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleRoleAccess = (role: 'instructor' | 'student') => {
    if (!currentProfile) return;

    // Check if user has permission for this role
    if (role === 'instructor' && currentProfile.role !== 'instructor') {
      setError('You do not have instructor permissions. Please contact support.');
      return;
    }

    if (role === 'student' && currentProfile.role !== 'student') {
      setError('You do not have student permissions. Please contact support.');
      return;
    }

    onRoleSelect(role);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Setting up your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex space-x-3">
              <button
                onClick={loadUserProfile}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">Unable to load your profile. Please contact support.</p>
            <button
              onClick={handleSignOut}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const instructorData = currentProfile.role === 'instructor' ? currentProfile.data : null;
  const studentData = currentProfile.role === 'student' ? currentProfile.data : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">T</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Choose how you want to access the platform</p>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {instructorData?.full_name || studentData?.full_name || 'User'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {instructorData?.email || studentData?.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentProfile.role === 'instructor' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {currentProfile.role === 'instructor' ? '👨‍🏫 Instructor' : '👨‍🎓 Student'}
                  </span>
                  {instructorData && (
                    <span className="text-xs text-gray-500">
                      {instructorData.business_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Instructor Dashboard */}
            <button
              onClick={() => handleRoleAccess('instructor')}
              disabled={currentProfile.role !== 'instructor'}
              className={`p-6 border-2 rounded-xl text-left transition-all ${
                currentProfile.role === 'instructor'
                  ? 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    currentProfile.role === 'instructor' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Instructor Dashboard</h3>
                    <p className="text-gray-600">Manage courses, students, and content</p>
                  </div>
                </div>
                {currentProfile.role === 'instructor' && (
                  <ArrowRight className="w-6 h-6 text-purple-600" />
                )}
              </div>
              
              {instructorData && (
                <div className="space-y-2">
                  <p className="text-sm text-purple-600 font-medium">
                    🏢 {instructorData.business_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    🌐 trytrainr.com/{instructorData.subdomain}
                  </p>
                </div>
              )}
              
              {currentProfile.role === 'instructor' && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Create Courses</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Manage Students</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Settings className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Analytics</p>
                  </div>
                </div>
              )}
            </button>

            {/* Student Dashboard */}
            <button
              onClick={() => handleRoleAccess('student')}
              disabled={currentProfile.role !== 'student'}
              className={`p-6 border-2 rounded-xl text-left transition-all ${
                currentProfile.role === 'student'
                  ? 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    currentProfile.role === 'student' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Student Dashboard</h3>
                    <p className="text-gray-600">Access courses and community</p>
                  </div>
                </div>
                {currentProfile.role === 'student' && (
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                )}
              </div>
              
              {studentData && (
                <div className="space-y-2">
                  <p className="text-sm text-blue-600 font-medium">
                    📚 Learning with instructor
                  </p>
                </div>
              )}
              
              {currentProfile.role === 'student' && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3">
                    <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">My Courses</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Community</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <Settings className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Progress</p>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Account Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => {/* Handle profile settings */}}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </button>
            
            <button
              onClick={handleSignOut}
              className="flex items-center text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>

          {/* Role Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm text-center">
              <strong>Current Role:</strong> {currentProfile.role === 'instructor' ? 'Instructor' : 'Student'}
              {currentProfile.role === 'instructor' && instructorData && (
                <span className="block mt-1 text-xs text-gray-500">
                  Business: {instructorData.business_name} • Subdomain: {instructorData.subdomain}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}