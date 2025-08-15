import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Video, 
  MessageCircle, 
  Calendar,
  Star,
  Clock,
  Play,
  TrendingUp,
  Award,
  Target,
  LogOut,
  Settings
} from 'lucide-react';
import { signOut, getStudentProfile } from '../lib/auth';
import type { Student } from '../lib/auth';

interface StudentDashboardProps {
  studentData: Student;
}

export default function StudentDashboard({ studentData }: StudentDashboardProps) {
  const [activeView, setActiveView] = useState('courses');
  const [progress, setProgress] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    currentStreak: 0
  });

  useEffect(() => {
    // Load student progress
    loadStudentProgress();
  }, []);

  const loadStudentProgress = async () => {
    try {
      // In a real app, these would be API calls to get actual progress
      // For now, using mock data
      setProgress({
        coursesEnrolled: 3,
        coursesCompleted: 1,
        totalHours: 24,
        currentStreak: 7
      });
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'live-calls', label: 'Live Calls', icon: Video },
    { id: 'progress', label: 'Progress', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      instructor: 'Test Instructor',
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      instructor: 'Test Instructor',
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Learning Dashboard</h1>
                <p className="text-sm text-gray-600">Student Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{studentData.full_name}</p>
                <p className="text-xs text-gray-600">{studentData.email}</p>
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
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
          {activeView === 'courses' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
                <p className="text-gray-600 mt-2">Continue your learning journey</p>
              </div>

              {/* Progress Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Courses Enrolled</p>
                      <p className="text-2xl font-bold text-gray-900">{progress.coursesEnrolled}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{progress.coursesCompleted}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Learning Hours</p>
                      <p className="text-2xl font-bold text-gray-900">{progress.totalHours}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Current Streak</p>
                      <p className="text-2xl font-bold text-gray-900">{progress.currentStreak} days</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
                          <Play className="w-6 h-6 text-blue-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>{course.progress}% complete</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other views */}
          {activeView !== 'courses' && (
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