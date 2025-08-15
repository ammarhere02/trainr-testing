import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import StudentAuth from './components/auth/StudentAuth';
import AfterLogin from './components/auth/AfterLogin';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import Hero from './components/Hero';
import { AuthProvider, useAuth } from './hooks/useAuth';

function App() {
  const { user, profile, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          user ? (
            role === 'instructor' ? <Navigate to="/dashboard-instructor" replace /> :
            role === 'student' ? <Navigate to="/dashboard-student" replace /> :
            <Navigate to="/login" replace />
          ) : (
            <Hero
              onLogin={() => window.location.href = '/login/instructor'}
              onShowEducatorSignup={() => window.location.href = '/login/instructor'}
            />
          )
        } />
        
        {/* Login Pages */}
        <Route path="/login/instructor" element={
          user ? <Navigate to="/dashboard-instructor" replace /> : (
            <AuthForm 
              onSuccess={() => window.location.href = '/after-login'}
              mode="login"
              setMode={() => {}}
            />
          )
        } />
        
        <Route path="/login/student" element={
          user ? <Navigate to="/dashboard-student" replace /> : (
            <StudentAuth onSuccess={() => {
              console.log('App: Student auth success, redirecting to after-login');
              window.location.href = '/after-login';
            }} />
          )
        } />
        
        <Route path="/login/student/:instructorId" element={
          user ? <Navigate to="/dashboard-student" replace /> : (
            <StudentAuth onSuccess={() => {
              console.log('App: Student auth success (with instructorId), redirecting to after-login');
              window.location.href = '/after-login';
            }} />
          )
        } />
        
        {/* After Login Handler */}
        <Route path="/after-login" element={
          user ? <AfterLogin /> : <Navigate to="/login/instructor" replace />
        } />
        
        {/* Direct Dashboard Access */}
        <Route path="/dashboard-instructor" element={
          user && role === 'instructor' && profile ? (
            <InstructorDashboard instructorData={profile.data as any} />
          ) : (
            <Navigate to="/login/instructor" replace />
          )
        } />
        
        <Route path="/dashboard-student" element={
          user && role === 'student' && profile ? (
            <StudentDashboard studentData={profile.data as any} />
          ) : (
            <Navigate to="/login/student" replace />
          )
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login" element={<Navigate to="/login/instructor" replace />} />
        <Route path="/signup" element={<Navigate to="/login/instructor" replace />} />
        <Route path="/signup/instructor" element={<Navigate to="/login/instructor" replace />} />
        <Route path="/signup/student" element={<Navigate to="/login/student" replace />} />
        <Route path="/studio/dashboard" element={<Navigate to="/dashboard-instructor" replace />} />
        <Route path="/library" element={<Navigate to="/dashboard-student" replace />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <App />
      </div>
    </AuthProvider>
  );
}