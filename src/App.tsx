import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './components/auth/RoleSelection';
import AuthForm from './components/auth/AuthForm'; // Unified auth form
import ForgotPassword from './components/auth/ForgotPassword';
import PasswordReset from './components/auth/PasswordReset';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import Hero from './components/Hero';
import { AuthProvider, useAuth } from './hooks/useAuth'; // Import AuthProvider and useAuth
import { getSubdirectory } from './utils/subdomain'; // To get subdomain for student signup

function App() {
  const { user, profile, role, isLoading, error } = useAuth(); // Use the auth hook
  const currentSubdirectory = getSubdirectory();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Setting up your session</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle authentication errors
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/login'} // Redirect to login to clear state
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine the dashboard to show if authenticated
  const renderDashboard = () => {
    if (user && profile && role) {
      if (role === 'instructor') {
        return <InstructorDashboard instructorData={profile.data as Instructor} />;
      } else if (role === 'student') {
        return <StudentDashboard studentData={profile.data as Student} />;
      }
    }
    return null; // Should not happen if user and profile are set
  };

  // Redirect authenticated users to their dashboard
  if (user && profile && role) {
    // If on a subdomain and logged in as student, stay on subdomain
    if (currentSubdirectory && role === 'student') {
      // Student dashboard on subdomain
    } else if (role === 'instructor') {
      // Instructor dashboard
    } else {
      // Fallback for authenticated users without a clear role/profile match
      // This might indicate a problem or a user who hasn't completed profile setup
      // For now, redirect to a generic login or role selection
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <Hero
            onLogin={() => window.location.href = '/signup'}
            onShowEducatorSignup={() => window.location.href = '/signup'}
          />
        } />
        
        {/* Role Selection */}
        <Route path="/signup" element={
          <RoleSelection onRoleSelect={(selectedRole) => {
            window.location.href = `/signup-${selectedRole}`;
          }} />
        } />
        
        {/* Authentication Routes */}
        <Route path="/signup-instructor" element={<AuthForm mode="signup" initialRole="instructor" />} />
        <Route path="/signup-student" element={<AuthForm mode="signup" initialRole="student" instructorId={currentSubdirectory} />} />
        <Route path="/login-instructor" element={<AuthForm mode="login" initialRole="instructor" />} />
        <Route path="/login-student" element={<AuthForm mode="login" initialRole="student" instructorId={currentSubdirectory} />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        
        {/* Password Reset Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* Dashboard Routes - Protected by useAuth hook */}
        <Route path="/dashboard-instructor" element={
          user && profile && role === 'instructor' ? (
            <InstructorDashboard instructorData={profile.data as Instructor} />
          ) : (
            <Navigate to="/login-instructor" replace />
          )
        } />
        
        <Route path="/dashboard-student" element={
          user && profile && role === 'student' ? (
            <StudentDashboard studentData={profile.data as Student} />
          ) : (
            <Navigate to="/login-student" replace />
          )
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login/instructor" element={<Navigate to="/login-instructor" replace />} />
        <Route path="/login/student" element={<Navigate to="/login-student" replace />} />
        <Route path="/studio/dashboard" element={<Navigate to="/dashboard-instructor" replace />} />
        <Route path="/library" element={<Navigate to="/dashboard-student" replace />} />
        <Route path="/post-login" element={<PostLogin />} /> {/* Handle Supabase auth redirects */}
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider> {/* Wrap the entire App with AuthProvider */}
      <div className="min-h-screen bg-gray-50">
        <App />
      </div>
    </AuthProvider>
  );
}