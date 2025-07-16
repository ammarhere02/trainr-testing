import React, { useState } from 'react';
import { Users, BookOpen, Video, User, Mail } from 'lucide-react';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Hero from './components/Hero';
import Community from './components/Community';
import Courses from './components/Courses';
import Events from './components/Events';
import Profile from './components/Profile';
import CourseLearning from './components/CourseLearning';
import Content from './components/Content';
import Record from './components/Record';
import Funnel from './components/Funnel';
import Settings from './components/Settings';
import Coupons from './components/Coupons';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Meet from './components/Meet';
import Contacts from './components/Contacts';
import Dashboard from './components/Dashboard';
import Products from './components/Products';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'educator' | 'student' | null>(null);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (role: 'educator') => {
    setIsLoggedIn(true);
    setUserRole('educator');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentView('home');
  };

  const handleStartLearning = (courseId: number) => {
    setCurrentCourseId(courseId);
    setCurrentView('course-learning');
  };

  const renderCurrentView = () => {
    if (!isLoggedIn) {
      return <Hero onLogin={handleLogin} />;
    }

    // Handle side menu views for educators
    if (userRole === 'educator') {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard />;
        case 'courses':
          return <Courses onStartLearning={handleStartLearning} />;
        case 'products':
          return <Products onStartLearning={handleStartLearning} />;
        case 'payments':
          return <div className="p-8"><h1 className="text-3xl font-bold text-gray-900">Payments</h1><p className="text-gray-600 mt-2">Manage payment processing and transactions</p></div>;
        case 'content-planner':
          return <Content />;
        case 'testimonials':
          return <Testimonials />;
        case 'email-automation':
          return (
            <div className="p-8">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Automation</h1>
                <p className="text-xl text-gray-600 mb-6">Coming Soon</p>
                <p className="text-gray-500 leading-relaxed">
                  We're working on powerful email automation features to help you nurture leads, 
                  onboard students, and keep your community engaged with automated email sequences.
                </p>
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 text-left">
                    <li>• Automated welcome sequences for new students</li>
                    <li>• Course completion follow-ups</li>
                    <li>• Drip campaigns for course promotion</li>
                    <li>• Behavioral triggers and segmentation</li>
                    <li>• Email templates and drag-and-drop editor</li>
                  </ul>
                </div>
              </div>
            </div>
          );
        case 'sales-coupons':
          return <Coupons />;
        case 'contacts':
          return <Contacts />;
        case 'website':
          return <Funnel userRole={userRole} />;
        case 'member-area':
          return <Community />;
        case 'member-record':
          return <Record />;
        case 'library':
          return <div className="p-8"><h1 className="text-3xl font-bold text-gray-900">Video Library</h1><p className="text-gray-600 mt-2">All your recorded videos are stored here</p></div>;
        case 'meet':
          return <Meet />;
        case 'settings':
          return <Settings userRole={userRole} />;
        case 'contact-support':
          return <div className="p-8"><h1 className="text-3xl font-bold text-gray-900">Contact Support</h1><p className="text-gray-600 mt-2">Get help from our support team</p></div>;
      }
    }


    if (currentView === 'course-learning' && currentCourseId) {
      return (
        <CourseLearning 
          courseId={currentCourseId} 
          onBack={() => setCurrentView('courses')}
          userRole={userRole}
        />
      );
    }

    // Handle member area navigation for both educators and students
    if (currentView.startsWith('member-')) {
      const memberView = currentView.replace('member-', '');
      switch (memberView) {
        case 'community':
          return <Community userRole={userRole} />;
        case 'courses':
          return <Courses onStartLearning={handleStartLearning} />;
        case 'events':
          return <Events />;
        case 'profile':
          return <Profile />;
        default:
          return <Community />;
      }
    }

    switch (currentView) {
      default:
        return userRole === 'educator' ? 
          <Dashboard /> :
          <Community userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {/* Side Menu for Educators */}
      {isLoggedIn && userRole === 'educator' && currentView !== 'course-learning' && (
        <SideMenu 
          currentView={currentView}
          onViewChange={setCurrentView}
          userRole={userRole}
          onCollapseChange={setSidebarCollapsed}
        />
      )}
      
      <main className="flex-1">
        {/* Sub-menu for member area - positioned below header, above content */}
        {isLoggedIn && currentView.startsWith('member-') && currentView !== 'member-record' && currentView !== 'course-learning' && (
          <div className={`transition-all duration-300 ${
            userRole === 'educator' && !currentView.startsWith('member-') && currentView !== 'course-learning' && currentView !== 'member-record'
              ? (sidebarCollapsed ? 'ml-16' : 'ml-64') 
              : ''
          }`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 mx-4 sm:mx-6 lg:mx-8 mt-6">
              <div className="border-b border-gray-200">
                <nav className="flex justify-center space-x-8 px-6">
                  {/* Student Navigation */}
                  {userRole === 'student' && [
                    { key: 'member-community', label: 'Community', icon: Users },
                    { key: 'member-courses', label: 'My Courses', icon: BookOpen },
                    { key: 'member-events', label: 'Live Calls', icon: Video },
                    { key: 'member-profile', label: 'Profile', icon: User }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setCurrentView(item.key)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        currentView === item.key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </button>
                  ))}

                  {/* Educator Navigation */}
                  {userRole === 'educator' && currentView.startsWith('member-') && [
                    { key: 'member-community', label: 'Community', icon: Users },
                    { key: 'member-courses', label: 'Courses', icon: BookOpen },
                    { key: 'member-events', label: 'Live Calls', icon: Video },
                    { key: 'member-profile', label: 'Profile', icon: User }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setCurrentView(item.key)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        currentView === item.key
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        <div className={`transition-all duration-300 ${
          isLoggedIn && userRole === 'educator' && !currentView.startsWith('member-') && currentView !== 'course-learning' && currentView !== 'member-record'
            ? (sidebarCollapsed ? 'ml-16' : 'ml-64') 
            : ''
        }`}>
          {renderCurrentView()}
        </div>
      </main>
      {!isLoggedIn && <Footer />}
    </div>
  );
}

export default App;