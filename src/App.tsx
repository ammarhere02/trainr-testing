import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import InstructorAuth from './components/auth/InstructorAuth';
import StudentAuth from './components/auth/StudentAuth';

function App() {
  // Mock instructor data
  const mockInstructorData = {
    id: 'instructor-1',
    email: 'instructor@example.com',
    full_name: 'Sarah Johnson',
    business_name: 'Web Development Academy',
    logo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Mock student data
  const mockStudentData = {
    id: 'student-1',
    email: 'student@example.com',
    full_name: 'John Doe',
    instructor_id: 'instructor-1',
    avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={
            <Hero
              onLogin={() => {}}
              onShowEducatorSignup={() => {}}
            />
          } />
          
          {/* Direct Dashboard Access - No Auth Required */}
          <Route path="/dashboard-instructor" element={
            <InstructorDashboard instructorData={mockInstructorData} />
          } />
          
          <Route path="/dashboard-student" element={
            <StudentDashboard studentData={mockStudentData} />
          } />
          
          {/* Auth Pages */}
          <Route path="/login/instructor" element={
            <InstructorAuth onSuccess={() => window.location.href = '/dashboard-instructor'} />
          } />
          
          <Route path="/login/student" element={
            <StudentAuth onSuccess={() => window.location.href = '/dashboard-student'} />
          } />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="/login" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Dashboard</h2>
                <div className="space-y-4">
                  <a
                    href="/dashboard-instructor"
                    className="block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Go to Instructor Dashboard
                  </a>
                  <a
                    href="/dashboard-student"
                    className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Go to Student Dashboard
                  </a>
                </div>
              </div>
            </div>
          } />
          
          <Route path="/login/instructor" element={
            <InstructorAuth onSuccess={() => window.location.href = '/dashboard-instructor'} />
          } />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <a
                  href="/"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Go to Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;