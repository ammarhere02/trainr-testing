import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getSubdomain } from './lib/org';
import CanonicalLogin from './components/auth/CanonicalLogin';
import SubdomainLogin from './components/auth/SubdomainLogin';
import PostLogin from './components/auth/PostLogin';
import AfterLogin from './components/auth/AfterLogin';
import StudioDashboard from './components/StudioDashboard';
import StudentLibrary from './components/StudentLibrary';
import Hero from './components/Hero';
import DatabaseTest from './components/DatabaseTest';

function App() {
  const subdomain = getSubdomain();

  return (
    <Router>
      <Routes>
        {/* Database test route */}
        <Route path="/test-db" element={<DatabaseTest />} />
        
        {/* Canonical login route */}
        <Route path="/login" element={<CanonicalLogin />} />
        
        {/* Post-login handler */}
        <Route path="/post-login" element={<PostLogin />} />
        
        {/* Educator studio */}
        <Route path="/studio/dashboard" element={<StudioDashboard />} />
        
        {/* Admin routes - temporary access */}
        <Route path="/admin/dashboard" element={<StudioDashboard />} />
        
        {/* Student library */}
        <Route path="/library" element={<StudentLibrary />} />
        
        {/* Home route */}
        <Route path="/" element={<Hero onLogin={() => window.location.href = '/login'} onShowEducatorSignup={() => window.location.href = '/login'} />} />
        
        {/* Subdomain routes - must come after specific routes */}
        <Route path="/:subdomain/login" element={<SubdomainLogin />} />
        <Route path="/:subdomain/after-login" element={<AfterLogin />} />
        <Route path="/:subdomain/courses" element={<StudentLibrary />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;