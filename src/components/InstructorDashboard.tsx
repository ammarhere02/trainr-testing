import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  Video,
  MessageCircle,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Plus,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { signOut } from '../lib/auth';

interface Instructor {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

interface InstructorDashboardProps {
  instructorData: Instructor;
}

export default function InstructorDashboard({ instructorData }: InstructorDashboardProps) {
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    monthlyRevenue: 0,
    avgRating: 0
  });

  useEffect(() => {
    // Load instructor stats
    loadInstructorStats();
  }, []);

  const loadInstructorStats = async () => {
    try {
      // In a real app, these would be API calls to get actual stats
      // For now, using mock data
      setStats({
        totalStudents: 247,
        totalCourses: 5,
        monthlyRevenue: 12450,
        avgRating: 4.8
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'live-calls', label: 'Live Calls', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentActivity = [
    { type: 'enrollment', message: 'New student enrolled in Web Development Course', time: '2 min ago' },
    { type: 'review', message: 'Received 5-star review from Sarah Johnson', time: '15 min ago' },
    { type: 'completion', message: 'Mike Chen completed JavaScript Fundamentals', time: '1 hour ago' },
    { type: 'question', message: 'New question posted in React Course community', time: '2 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{instructorData.business_name}</h1>
                <p className="text-sm text-gray-600">Instructor Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{instructorData.full_name}</p>
                <p className="text-xs text-gray-600">trytrainr.com/{instructorData.subdomain}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeView === 'overview' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-600 mt-2">Welcome back, {instructorData.full_name}!</p>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+12% this month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+2 this month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+23% this month</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">+0.2 this month</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-left">
                    <Plus className="w-8 h-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Create Course</h4>
                    <p className="text-sm text-gray-600">Start building a new course</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
                    <Video className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Schedule Live Call</h4>
                    <p className="text-sm text-gray-600">Set up a live session</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left">
                    <MessageCircle className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-medium text-gray-900">Community Post</h4>
                    <p className="text-sm text-gray-600">Engage with students</p>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all text-left">
                    <BarChart3 className="w-8 h-8 text-yellow-600 mb-2" />
                    <h4 className="font-medium text-gray-900">View Analytics</h4>
                    <p className="text-sm text-gray-600">Check performance</p>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                        activity.type === 'completion' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4" />}
                        {activity.type === 'review' && <Star className="w-4 h-4" />}
                        {activity.type === 'completion' && <BookOpen className="w-4 h-4" />}
                        {activity.type === 'question' && <MessageCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other views would be implemented here */}
          {activeView !== 'overview' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {menuItems.find(item => item.id === activeView)?.label} Section
              </h3>
              <p className="text-gray-600">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}