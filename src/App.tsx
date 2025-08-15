import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Community from './components/Community';
import Events from './components/Events';
import Content from './components/Content';
import Sales from './components/Sales';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Funnel from './components/Funnel';
import CourseLearning from './components/CourseLearning';
import MemberArea from './components/MemberArea';
import CanonicalLogin from './components/auth/CanonicalLogin';
import PostLogin from './components/auth/PostLogin';
import AfterLogin from './components/auth/AfterLogin';
import Hero from './components/Hero';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const handleStartLearning = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-learning');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses onStartLearning={handleStartLearning} />;
      case 'member':
        return <MemberArea userRole="educator" onStartLearning={handleStartLearning} />;
      case 'events':
        return <Events />;
      case 'content-planner':
        return <Content />;
      case 'sales-coupons':
        return <Sales />;
      case 'sales':
        return <Sales />;
      case 'settings':
        return <Settings userRole="educator" />;
      case 'profile':
        return <Profile onBack={() => setCurrentView('dashboard')} />;
      case 'website':
        return <Funnel userRole="educator" />;
      case 'course-learning':
        return <CourseLearning courseId={selectedCourseId} onBack={() => setCurrentView('courses')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<CanonicalLogin />} />
        <Route path="/post-login" element={<PostLogin />} />
        <Route path="/after-login" element={<AfterLogin />} />
        
        {/* Main Landing Page */}
        <Route path="/" element={
          <Hero 
            onLogin={() => window.location.href = '/login'} 
            onShowEducatorSignup={() => window.location.href = '/login'}
          />
        } />
        
        {/* Studio Dashboard Routes */}
        <Route path="/studio/*" element={
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
              currentView={currentView}
              onViewChange={setCurrentView}
              onShowLogin={() => {}}
              isLoggedIn={true}
              userRole="educator"
              onLogout={() => {}}
              showFullNavigation={false}
            />

            <div className="flex">
              {/* Sidebar */}
              <SideMenu
                currentView={currentView}
                onViewChange={setCurrentView}
                userRole="educator"
                onCollapseChange={setSidebarCollapsed}
              />

              {/* Main Content */}
              <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
                {renderCurrentView()}
              </div>
            </div>
          </div>
        } />
        
        {/* Redirect studio to dashboard */}
        <Route path="/studio" element={<Navigate to="/studio/dashboard" replace />} />
        
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