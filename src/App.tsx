import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstructorLogin from './components/auth/InstructorLogin';
import StudentLogin from './components/auth/StudentLogin';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import Hero from './components/Hero';

// Mock data for testing without auth
const mockInstructorData = {
  id: 'mock-instructor-1',
  email: 'test@instructor.com',
  full_name: 'Test Instructor',
  business_name: 'Test Academy',
  logo_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockStudentData = {
  id: 'mock-student-1',
  email: 'test@student.com',
  full_name: 'Test Student',
  instructor_id: 'mock-instructor-1',
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <Hero
            onLogin={() => window.location.href = '/login/instructor'}
            onShowEducatorSignup={() => window.location.href = '/login/instructor'}
          />
        } />
        
        {/* Login Pages */}
        <Route path="/login/instructor" element={
          <InstructorLogin onLoginSuccess={() => {
            window.location.href = '/dashboard-instructor';
          }} />
        } />
        
        <Route path="/login/student" element={
          <StudentLogin onLoginSuccess={() => {
            window.location.href = '/dashboard-student';
          }} />
        } />
        
        {/* Direct Dashboard Access */}
        <Route path="/dashboard-instructor" element={
          <InstructorDashboard instructorData={mockInstructorData} />
        } />
        
        <Route path="/dashboard-student" element={
          <StudentDashboard studentData={mockStudentData} />
        } />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/signup" element={<Navigate to="/login/instructor" replace />} />
        <Route path="/login-instructor" element={<Navigate to="/dashboard-instructor" replace />} />
        <Route path="/login-student" element={<Navigate to="/dashboard-student" replace />} />
        <Route path="/login" element={<Navigate to="/login/instructor" replace />} />
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
    <div className="min-h-screen bg-gray-50">
      <App />
    </div>
  );
}