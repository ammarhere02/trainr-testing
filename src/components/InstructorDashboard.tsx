import React, { useState } from 'react';
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
  LogOut,
  Award,
  Target,
  Activity,
  GraduationCap,
  Home
} from 'lucide-react';

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
    totalStudents: 247,
    totalCourses: 5,
    monthlyRevenue: 12450,
    avgRating: 4.8
  });

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className="min-h-screen flex">
        {/* Left Side - Branding & Navigation */}
        <div className="w-80 flex flex-col p-8 text-white">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Trainr</span>
            </div>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {instructorData.full_name}! 👋
              </h1>
              <p className="text-purple-100">
                {instructorData.business_name}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <div className="text-purple-100 text-sm">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
                <div className="text-purple-100 text-sm">Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Star className="w-5 h-5 mr-1 fill-current" />
                  {stats.avgRating}
                </div>
                <div className="text-purple-100 text-sm">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(1)}K</div>
                <div className="text-purple-100 text-sm">Revenue</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30'
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-3 mt-8">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Back to Home
            </button>
            <button
              onClick={() => window.location.href = '/dashboard-student'}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-3" />
              Switch to Student
            </button>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {activeView === 'overview' && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Here's what's happening with your teaching business</p>
                  </div>

                  {/* Enhanced Stats Cards */}
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Total Students</p>
                          <p className="text-3xl font-bold text-blue-900">{stats.totalStudents}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-blue-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+12% this month</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Active Courses</p>
                          <p className="text-3xl font-bold text-purple-900">{stats.totalCourses}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-purple-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+2 this month</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Monthly Revenue</p>
                          <p className="text-3xl font-bold text-green-900">${stats.monthlyRevenue.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+23% this month</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Average Rating</p>
                          <p className="text-3xl font-bold text-yellow-900">{stats.avgRating}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-yellow-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">+0.2 this month</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-purple-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                          <Plus className="w-6 h-6 text-purple-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Create Course</h4>
                        <p className="text-sm text-gray-600">Start building a new course</p>
                      </button>
                      
                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                          <Video className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Schedule Live Call</h4>
                        <p className="text-sm text-gray-600">Set up a live session</p>
                      </button>
                      
                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                          <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Community Post</h4>
                        <p className="text-sm text-gray-600">Engage with students</p>
                      </button>
                      
                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-yellow-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-300">
                          <BarChart3 className="w-6 h-6 text-yellow-600 group-hover:text-white" />
                        </div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">View Analytics</h4>
                        <p className="text-sm text-gray-600">Check performance</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                      <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
                        View All
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            activity.type === 'enrollment' ? 'bg-blue-500 text-white' :
                            activity.type === 'review' ? 'bg-yellow-500 text-white' :
                            activity.type === 'completion' ? 'bg-green-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {activity.type === 'enrollment' && <Users className="w-5 h-5" />}
                            {activity.type === 'review' && <Star className="w-5 h-5" />}
                            {activity.type === 'completion' && <Award className="w-5 h-5" />}
                            {activity.type === 'question' && <MessageCircle className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Other views placeholder */}
              {activeView !== 'overview' && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {React.createElement(menuItems.find(item => item.id === activeView)?.icon || Settings, {
                      className: "w-10 h-10 text-purple-600"
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {menuItems.find(item => item.id === activeView)?.label} Section
                  </h3>
                  <p className="text-gray-600 mb-6">This section is under development</p>
                  <button
                    onClick={() => setActiveView('overview')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Back to Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}