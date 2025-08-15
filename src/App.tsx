import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RoleSelection from './components/auth/RoleSelection';
import InstructorAuth from './components/auth/InstructorAuth';
import StudentAuth from './components/auth/StudentAuth';
import AuthDashboard from './components/auth/AuthDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import Hero from './components/Hero';

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<'instructor' | 'student' | null>(null);

  const handleLoginSuccess = (userData: any) => {
    setCurrentUser(userData);
    setUserRole(userData.role);
  };

  const handleRoleSelect = (role: 'instructor' | 'student') => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
  };

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
          <RoleSelection onRoleSelect={(role) => {
            if (role === 'instructor') {
              window.location.href = '/signup-instructor';
            } else {
              window.location.href = '/signup-student';
            }
          }} />
        } />
        
        {/* Authentication Routes */}
        <Route path="/signup-instructor" element={
          <InstructorAuth onLoginSuccess={handleLoginSuccess} />
        } />
        
        <Route path="/signup-student" element={
          <StudentAuth onLoginSuccess={handleLoginSuccess} instructorId="test-instructor-id" />
        } />
        
        <Route path="/login-instructor" element={
          <InstructorAuth onLoginSuccess={handleLoginSuccess} />
        } />
        
        <Route path="/login-student" element={
          <StudentAuth onLoginSuccess={handleLoginSuccess} instructorId="test-instructor-id" />
        } />
        
        <Route path="/login" element={
          <AuthDashboard onRoleSelect={handleRoleSelect} />
        } />

        {/* Dashboard Routes */}
        <Route path="/dashboard-instructor" element={
          currentUser && userRole === 'instructor' ? (
            <InstructorDashboard instructorData={currentUser.profile} />
          ) : (
            <Navigate to="/login-instructor" replace />
          )
        } />
        
        <Route path="/dashboard-student" element={
          currentUser && userRole === 'student' ? (
            <StudentDashboard studentData={currentUser.profile} />
          ) : (
            <Navigate to="/login-student" replace />
          )
        } />

        {/* Legacy routes for backward compatibility */}
        <Route path="/login/instructor" element={<Navigate to="/login-instructor" replace />} />
        <Route path="/login/student" element={<Navigate to="/login-student" replace />} />
        <Route path="/studio/dashboard" element={<Navigate to="/dashboard-instructor" replace />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function AppWrapper() {
  return (
    <div className="min-h-screen bg-gray-50">
      <App />
    </div>
  );
}