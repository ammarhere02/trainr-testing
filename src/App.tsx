import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudioDashboard from './components/StudioDashboard';
import StudentLibrary from './components/StudentLibrary';
import Hero from './components/Hero';

function App() {

  return (
    <Router>
      <Routes>
        {/* Educator studio */}
        <Route path="/studio/dashboard" element={<StudioDashboard />} />
        
        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<StudioDashboard />} />
        
        {/* Student library */}
        <Route path="/library" element={<StudentLibrary />} />
        
        {/* Home route */}
        <Route path="/" element={<Hero onLogin={() => window.location.href = '/studio/dashboard'} onShowEducatorSignup={() => window.location.href = '/studio/dashboard'} />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;