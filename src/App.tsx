import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import VideoLibrary from './components/VideoLibrary';
import Record from './components/Record';
import Community from './components/Community';
import Meet from './components/Meet';
import Events from './components/Events';
import Content from './components/Content';
import Testimonials from './components/Testimonials';
import Coupons from './components/Coupons';
import Contacts from './components/Contacts';
import Products from './components/Products';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Funnel from './components/Funnel';
import CourseLearning from './components/CourseLearning';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleStartLearning = (courseId: number) => {
    setCurrentView('course-learning');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses onStartLearning={handleStartLearning} />;
      case 'library':
        return <VideoLibrary />;
      case 'member-record':
        return <Record onBack={() => setCurrentView('library')} />;
      case 'member-community':
        return <Community userRole="educator" />;
      case 'meet':
        return <Meet />;
      case 'events':
        return <Events />;
      case 'content-planner':
        return <Content />;
      case 'testimonials':
        return <Testimonials />;
      case 'sales-coupons':
        return <Coupons />;
      case 'contacts':
        return <Contacts />;
      case 'sales':
        return <Products onStartLearning={handleStartLearning} />;
      case 'settings':
        return <Settings userRole="educator" />;
      case 'profile':
        return <Profile onBack={() => setCurrentView('dashboard')} />;
      case 'website':
        return <Funnel userRole="educator" />;
      case 'course-learning':
        return <CourseLearning onBack={() => setCurrentView('courses')} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onShowLogin={() => {}}
        isLoggedIn={true}
        userRole="educator"
        onLogout={() => {}}
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
  );
}

export default App;