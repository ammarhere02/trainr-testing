import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Video,
  MessageCircle,
  TrendingUp,
  Star,
  GraduationCap,
  Home,
  LogOut,
  Eye,
  Mail,
  RefreshCw,
  Download,
  Calendar,
  Globe,
  Plus,
  Edit3,
  Play,
  Clock,
  CheckCircle,
  Tag,
  CreditCard,
  Target,
  Activity,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import CommunityManagement from "./CommunityManagement";
import AnalyticsDashboard from "./AnalyticsDashboard";
import InstructorSettings from "./InstructorSettings";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "instructor" | "student";
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface Instructor {
  id: string;
  business_name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  specialization?: string[];
  years_of_experience?: number;
  social_links?: Record<string, string>;
  total_courses?: number;
  total_students?: number;
  average_rating?: number;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface InstructorDashboardProps {
  instructorData?: Profile & {
    instructor?: Instructor | null;
  };
}

function InstructorDashboard({ instructorData }: InstructorDashboardProps) {
  const { signOutUser } = useAuth();
  const [activeView, setActiveView] = useState("courses");
  const [stats] = useState({
    totalStudents: 2847,
    totalCourses: 12,
    monthlyRevenue: 348,
    lastMonthRevenue: 280,
    avgRating: 4.8,
    engagementRate: 87.5,
    videoViews: 24500,
    communityPosts: 1247,
    liveSessions: 18,
    emailSubscribers: 3456,
    websiteVisitors: 12450,
    courseViews: 4567,
    signUps: 1234,
    purchases: 456,
    activeCoupons: 0,
    pendingPayments: 1,
    conversionRate: 23.5
  });

  const handleLogout = async () => {
    await signOutUser();
  };

  // Fallback instructor data if not provided
  const instructor = instructorData || {
    id: "instructor-1",
    email: "instructor@example.com",
    full_name: "pablo escobar",
    role: "instructor" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    instructor: {
      id: "instructor-1",
      business_name: "pharmacy-courses",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "content-calendar", label: "Content Calendar", icon: Calendar },
    { id: "sales", label: "Sales", icon: DollarSign },
    { id: "member-area", label: "Member Area", icon: Users },
    { id: "website", label: "Website", icon: Globe },
  ];

  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Beginner",
      type: "Free",
      progress: 65,
      students: 2847,
      rating: 4.9,
      lessons: 156,
      duration: "40 hours"
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      description: "Master advanced React patterns including hooks, context, HOCs, and performance optimization techniques.",
      image: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Advanced",
      type: "$199",
      progress: 30,
      students: 1234,
      rating: 4.8,
      lessons: 89,
      duration: "25 hours"
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user interface and user experience design with hands-on projects.",
      image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Intermediate",
      type: "Free",
      progress: 0,
      students: 856,
      rating: 4.7,
      lessons: 67,
      duration: "18 hours"
    }
  ];

  const payments = [
    {
      id: 1,
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      product: "Web Development Bootcamp",
      amount: 199,
      status: "completed",
      date: "15/01/2024",
      method: "Credit Card"
    },
    {
      id: 2,
      customer: "Mike Chen",
      email: "mike@example.com",
      product: "React Masterclass",
      amount: 149,
      status: "completed",
      date: "14/01/2024",
      method: "PayPal"
    },
    {
      id: 3,
      customer: "Emma Davis",
      email: "emma@example.com",
      product: "JavaScript Fundamentals",
      amount: 99,
      status: "pending",
      date: "13/01/2024",
      method: "Credit Card"
    }
  ];

  const renderCoursesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Continue your learning journey</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  course.level === 'Intermediate' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {course.level}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
                  <Play className="w-6 h-6 text-purple-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.type === 'Free' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {course.type === 'Free' ? '🆓 Free' : `💰 ${course.type}`}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                  Continue Learning
                </button>
                <div className="flex items-center space-x-2">
                  <button className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center">
                    <Video className="w-3 h-3 mr-1" />
                    Edit Video
                  </button>
                  <button className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors flex items-center">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Storage Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">Video Storage</h3>
              <span className="text-sm text-gray-600">15.2 GB of 100 GB used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15.2%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalesView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales & Revenue</h1>
          <p className="text-gray-600 mt-1">Manage your products, payments, coupons, and customer contacts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button className="flex items-center py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm mr-8">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments & Contacts
            </button>
            <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
              <Tag className="w-4 h-4 mr-2" />
              Coupons
            </button>
          </nav>
        </div>

        {/* Recent Payments Table */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.customer}</div>
                        <div className="text-sm text-gray-500">{payment.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{payment.product}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">${payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status === 'completed' ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            completed
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{payment.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{payment.method}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentCalendarView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Planner</h1>
          <p className="text-gray-600 mt-1">Plan, create, and manage your content strategy</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </button>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-white text-purple-600 shadow-sm">
              <Calendar className="w-4 h-4 mr-2 inline" />
              Calendar
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
              <Target className="w-4 h-4 mr-2 inline" />
              Pipeline
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900">
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Analytics
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search content..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-64"
              />
            </div>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Calendar */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">August 2025</h2>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3; // Start from 27 (previous month)
                const isCurrentMonth = day >= 1 && day <= 31;
                const displayDay = day <= 0 ? 27 + day : day > 31 ? day - 31 : day;
                
                return (
                  <div
                    key={i}
                    className={`p-2 min-h-[80px] border border-gray-100 hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {displayDay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-medium">45.2K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemberAreaView = () => (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button className="flex items-center py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm mr-8">
              Community
            </button>
            <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm mr-8">
              Classroom
            </button>
            <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
              Calendar
            </button>
          </nav>
        </div>

        {/* Community Content */}
        <div className="p-6">
          {/* Post Creation */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60"
                alt="Your avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <button className="w-full px-4 py-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 text-left text-sm">
                  Create a new post
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mb-6">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white">
              All
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              💬 General
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              ❓ Questions
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              🏆 #Wins
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              👋 Introduction
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              🚀 Announcements
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {/* Post 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60"
                    alt="Max Perzon"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Max Perzon</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">#Wins</span>
                    <span>20h</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">📌 Pinned</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                From $200K in Debt to $400K in Sales at 19
              </h3>
              
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-6">
                  <p className="text-gray-700 mb-3">
                    1 year ago, Alessandro was just a teenager in Italy with over $200,000 in debt. He was 
                    desperate to make his first $1 online. When Alessandro found me it was: "It was the
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Read more
                  </button>
                </div>
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Post image"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">👍 93</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">45</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                  </div>
                  <span className="text-sm text-gray-600">New comment</span>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60"
                    alt="Max Perzon"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Max Perzon</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">#Wins</span>
                    <span>4d</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">📌 Pinned</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                How a new entrepreneur just did $22k/month using just Skool
              </h3>
              
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-6">
                  <p className="text-gray-700 mb-3">
                    Here's a story that shows what happens when you stop overcomplicating it. At first, this 
                    guy, @Matthew Mitten was stuck in his online business. He was trying a million
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Read more
                  </button>
                </div>
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Post image"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">👍 122</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">84</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                  </div>
                  <span className="text-sm text-gray-600">New comment</span>
                </div>
              </div>
            </div>

            {/* Post 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60"
                    alt="Sarah Johnson"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Sarah Johnson</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">💬 General</span>
                    <span>1d</span>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Just completed my first course milestone! 🎉
              </h3>
              
              <p className="text-gray-700 mb-3">
                I can't believe I actually finished the React fundamentals section. The way everything clicked together in 
                the final project was amazing. Thank you to everyone who helped me in the Q&A sessions!
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Read more
              </button>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium">👍 45</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">12</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    <img src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                    <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=30" className="w-6 h-6 rounded-full border-2 border-white" alt="" />
                  </div>
                  <span className="text-sm text-gray-600">New comment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourseLearningView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronRight className="w-5 h-5 mr-2 rotate-180" />
            Back to Courses
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Complete Web Development Bootcamp</h1>
            <p className="text-sm text-gray-600">by Dr. Angela Yu</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Lesson 1 of 12</div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
          </div>
          <span className="text-sm font-medium text-gray-900">33%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Course Content Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900 text-sm">Introduction to Web Development</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">15:30</span>
                    <span className="text-xs">📺</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">HTML Fundamentals</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">22:45</span>
                    <span className="text-xs">📺</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">CSS Styling and Layout</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">28:15</span>
                    <span className="text-xs">📺</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">JavaScript Basics</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">35:20</span>
                    <span className="text-xs">🔴</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">Advanced JavaScript</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">42:10</span>
                    <span className="text-xs">📺</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">6</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">React Introduction</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">38:50</span>
                    <span className="text-xs">📺</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Lesson Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Introduction to Web Development</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Lesson 1</span>
                    <span>•</span>
                    <span>15:30</span>
                    <span>•</span>
                    <span>📺 youtube</span>
                  </div>
                </div>
                <button className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors">
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Introduction to Web Development"
              />
            </div>

            {/* Lesson Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Welcome to the complete web development bootcamp! In this lesson, we'll cover what you'll learn 
                throughout the course and set up your development environment.
              </p>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                  Previous Lesson
                </button>
                <button className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Next Lesson
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">trainr</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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

          {/* Bottom Menu */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          <div className="p-8">
            {activeView === "courses" && renderCoursesView()}
            {activeView === "sales" && renderSalesView()}
            {activeView === "content-calendar" && renderContentCalendarView()}
            {activeView === "member-area" && renderMemberAreaView()}
            {activeView === "course-learning" && renderCourseLearningView()}
            {activeView === "community" && <CommunityManagement instructor={instructor} />}
            {activeView === "analytics" && <AnalyticsDashboard instructor={instructor} />}
            {activeView === "settings" && <InstructorSettings instructor={instructor} />}

            {/* Default Dashboard View */}
            {activeView === "dashboard" && (
              <div className="space-y-8">
                {/* Welcome Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+8.3%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+15.2%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+12.5%</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}%</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">+5.1%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <button 
                      onClick={() => setActiveView('courses')}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                    >
                      <Plus className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Create Course</h4>
                      <p className="text-sm text-gray-600">Start building a new course</p>
                    </button>
                    <button 
                      onClick={() => setActiveView('content-calendar')}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                    >
                      <Calendar className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Schedule Content</h4>
                      <p className="text-sm text-gray-600">Plan and schedule content</p>
                    </button>
                    <button 
                      onClick={() => setActiveView('member-area')}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                    >
                      <Users className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">Manage Community</h4>
                      <p className="text-sm text-gray-600">Engage with your students</p>
                    </button>
                    <button 
                      onClick={() => setActiveView('analytics')}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                    >
                      <BarChart3 className="w-8 h-8 text-gray-600 mb-2" />
                      <h4 className="font-medium text-gray-900">View Analytics</h4>
                      <p className="text-sm text-gray-600">Track your performance</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;