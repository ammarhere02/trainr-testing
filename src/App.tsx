import React, { useState } from 'react';
import { Users, BookOpen, Video, User, Mail } from 'lucide-react';
import Header from './components/Header';
import Login from './components/Login';
import SideMenu from './components/SideMenu';
import Hero from './components/Hero';
import EducatorSignup from './components/EducatorSignup';
import EducatorWelcome from './components/EducatorWelcome';
import StudentSignup from './components/StudentSignup';
import EducatorPortal from './components/EducatorPortal';
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
import { getSubdomain, isSubdomain, getEducatorBySubdomain } from './utils/subdomain';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'educator' | 'student' | null>(null);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEducatorSignup, setShowEducatorSignup] = useState(false);
  const [showEducatorWelcome, setShowEducatorWelcome] = useState(false);
  const [showStudentSignup, setShowStudentSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [educatorData, setEducatorData] = useState<any>(null);
  const [studentEducatorId, setStudentEducatorId] = useState<string | null>(null);
  const [subdomainEducator, setSubdomainEducator] = useState<any>(null);
  const [isLoadingSubdomain, setIsLoadingSubdomain] = useState(false);

  // Check for educator parameter in URL or subdomain
  React.useEffect(() => {
    const checkSubdomain = async () => {
      const subdomain = getSubdomain();
      if (subdomain && !isLoggedIn) {
        setIsLoadingSubdomain(true);
        try {
          const educator = await getEducatorBySubdomain(subdomain);
          if (educator) {
            setSubdomainEducator(educator);
            setStudentEducatorId(educator.id);
          }
        } catch (error) {
          console.error('Error fetching educator:', error);
        } finally {
          setIsLoadingSubdomain(false);
        }
      }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const educatorId = urlParams.get('educator');
    
    if (educatorId && !isLoggedIn) {
      setStudentEducatorId(educatorId);
      setShowStudentSignup(true);
    } else {
      checkSubdomain();
    }
  }, [isLoggedIn]);
  
  const handleLogin = (role: 'educator' | 'student') => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentView(role === 'educator' ? 'dashboard' : 'member-community');
    setShowLogin(false);
  };

  const handleEducatorSignupComplete = (data: any) => {
    setEducatorData(data);
    setShowEducatorSignup(false);
    setShowEducatorWelcome(true);
  };

  const handleEducatorWelcomeContinue = () => {
    setShowEducatorWelcome(false);
    handleLogin('educator');
  };

  const handleStudentSignupComplete = (data: any) => {
    setShowStudentSignup(false);
    setIsLoggedIn(true);
    setUserRole('student');
    setCurrentView('member-community');
    setSubdomainEducator(null);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentView('home');
    setEducatorData(null);
    setShowLogin(false);
    setStudentEducatorId(null);
    setSubdomainEducator(null);
  };

  const handleStartLearning = (courseId: number) => {
    setCurrentCourseId(courseId);
    setCurrentView('course-learning');
  };

  // Show loading screen while checking subdomain
  if (isLoadingSubdomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show educator portal if we're on a subdomain
  if (subdomainEducator && !isLoggedIn) {
    return (
      <EducatorPortal 
        educator={subdomainEducator}
        onStudentSignup={() => setShowStudentSignup(true)}
      />
    );
  }

  // Show login page
  if (showLogin) {
    return (
      <Login 
        onLogin={handleLogin}
        onShowEducatorSignup={() => {
          setShowLogin(false);
          setShowEducatorSignup(true);
        }}
        onShowStudentSignup={() => {
          setShowLogin(false);
          setShowStudentSignup(true);
        }}
      />
    );
  }

  // Show educator signup
  if (showEducatorSignup) {
    return (
      <EducatorSignup 
        onSignupComplete={handleEducatorSignupComplete}
        onBackToLogin={() => setShowEducatorSignup(false)}
      />
    );
  }

  // Show educator welcome
  if (showEducatorWelcome && educatorData) {
    return (
      <EducatorWelcome 
        educatorData={educatorData}
        onContinue={handleEducatorWelcomeContinue}
      />
    );
  }

  // Show student signup
  if (showStudentSignup && (studentEducatorId || subdomainEducator)) {
    return (
      <StudentSignup 
        educatorId={studentEducatorId || subdomainEducator?.id}
        onSignupComplete={handleStudentSignupComplete}
      />
    );
  }
  
  const renderCurrentView = () => {
    if (!isLoggedIn) {
      return <Hero onLogin={handleLogin} onShowEducatorSignup={() => setShowEducatorSignup(true)} />;
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
          return <Profile onBack={() => setCurrentView('member-community')} />;
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
      {/* Hide header when viewing profile */}
      {currentView !== 'member-profile' && (
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isLoggedIn={isLoggedIn}
          onShowLogin={() => setShowLogin(true)}
          userRole={userRole}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      )}
      
      {/* Side Menu for Educators - Hide when viewing profile */}
      {isLoggedIn && userRole === 'educator' && currentView !== 'course-learning' && currentView !== 'member-profile' && (
        <SideMenu 
          currentView={currentView}
          onViewChange={setCurrentView}
          userRole={userRole}
          onCollapseChange={setSidebarCollapsed}
        />
      )}
      
      <main className="flex-1">
        {/* Sub-menu for member area - positioned below header, above content */}
        {isLoggedIn && currentView.startsWith('member-') && currentView !== 'member-record' && currentView !== 'course-learning' && currentView !== 'member-profile' && (
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
                    { key: 'member-events', label: 'Live Calls', icon: Video }
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
                    { key: 'member-events', label: 'Live Calls', icon: Video }
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
          isLoggedIn && userRole === 'educator' && !currentView.startsWith('member-') && currentView !== 'course-learning' && currentView !== 'member-record' && currentView !== 'member-profile'
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