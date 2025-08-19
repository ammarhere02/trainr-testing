import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Calendar, 
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  Play,
  Download,
  Mail,
  Target,
  Award,
  Clock,
  Globe,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Heart,
  Share2,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Plus,
  Settings
} from 'lucide-react';
import Dashboard from './Dashboard';
import Courses from './Courses';
import Content from './Content';
import Sales from './Sales';
import MemberArea from './MemberArea';
import Website from './Website';
import SettingsComponent from './Settings';
import SideMenu from './SideMenu';
import Header from './Header';
import CourseLearning from './CourseLearning';

interface InstructorDashboardProps {
  instructorData?: any;
}

export default function InstructorDashboard({ instructorData }: InstructorDashboardProps) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleStartLearning = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-learning');
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentView('courses');
  };

  const renderCurrentView = () => {
    if (currentView === 'course-learning' && selectedCourseId) {
      return <CourseLearning courseId={selectedCourseId} onBack={handleBackToCourses} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="30d">Last 30 days</option>
                  <option value="7d">Last 7 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$45,280</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">16.3%</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">32.1%</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold text-gray-900">87.5%</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">6.8%</span>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">vs last period</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Revenue Overview */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View Details
                  </button>
                </div>
                
                {/* Chart Area */}
                <div className="h-64 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-gray-600">Revenue chart visualization</p>
                    <p className="text-sm text-gray-500">Interactive chart would be rendered here</p>
                  </div>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">$45,280</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Month</p>
                    <p className="text-2xl font-bold text-gray-900">$38,950</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-2xl font-bold text-green-600">+16.3%</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-sm text-gray-600">Video Views</span>
                      </div>
                      <span className="font-medium text-gray-900">24.5K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-sm text-gray-600">Community Posts</span>
                      </div>
                      <span className="font-medium text-gray-900">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-sm text-gray-600">Live Sessions</span>
                      </div>
                      <span className="font-medium text-gray-900">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-600 mr-3" />
                        <span className="text-sm text-gray-600">Avg Rating</span>
                      </div>
                      <span className="font-medium text-gray-900">4.8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-red-600 mr-3" />
                        <span className="text-sm text-gray-600">Email Subscribers</span>
                      </div>
                      <span className="font-medium text-gray-900">3,456</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Website Visitors</span>
                        <span className="font-medium">12,450</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Course Views</span>
                        <span className="font-medium">4,567</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '37%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Sign-ups</span>
                        <span className="font-medium">1,234</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '27%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Purchases</span>
                        <span className="font-medium">456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '37%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return <Courses onStartLearning={handleStartLearning} />;
      case 'content-planner':
        return <Content />;
      case 'sales':
        return <Sales />;
      case 'member':
        return <MemberArea userRole="educator" onStartLearning={handleStartLearning} />;
      case 'website':
        return <Website />;
      case 'settings':
        return <SettingsComponent userRole="educator" />;
      default:
        return <Dashboard userRole="educator" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <SideMenu 
          currentView={currentView}
          onViewChange={setCurrentView}
          userRole="educator"
          onCollapseChange={setSidebarCollapsed}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}