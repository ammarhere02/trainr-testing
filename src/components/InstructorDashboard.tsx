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
  const [activeView, setActiveView] = useState("overview");
  const [stats] = useState({
    totalStudents: 2847,
    totalCourses: 12,
    monthlyRevenue: 45280,
    lastMonthRevenue: 38950,
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
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "community", label: "Community", icon: MessageCircle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const growthPercentage = (
    ((stats.monthlyRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) *
    100
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex">
        {/* Left Side - Purple Sidebar from First Image */}
        <div className="w-80 flex flex-col p-8 text-white bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 min-h-screen">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Trainr</span>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {instructor.full_name}!{" "}
                <span role="img" aria-label="wave">
                  👋
                </span>
              </h1>
              <p className="text-purple-100">
                {instructor.instructor?.business_name || "pharmacy-courses"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">247</div>
                <div className="text-purple-100 text-sm">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">5</div>
                <div className="text-purple-100 text-sm">Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Star className="w-5 h-5 mr-1 stroke-current" />
                  4.8
                </div>
                <div className="text-purple-100 text-sm">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">$12.4K</div>
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
                className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                  activeView === item.id
                    ? "bg-white/20 backdrop-blur-sm text-white border border-white/30 shadow-lg"
                    : "text-purple-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-6 h-6 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-3 mt-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full flex items-center px-4 py-3 text-base font-medium rounded-xl text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Home className="w-6 h-6 mr-3" />
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-base font-medium rounded-xl text-purple-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="w-6 h-6 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Side - Business Analytics Dashboard from Second Image */}
        <div className="flex-1 bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening with your business.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 90 days</option>
                </select>
                <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {activeView === "overview" && (
              <div className="space-y-8">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          ${stats.monthlyRevenue.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">
                            {growthPercentage}% vs last period
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Total Students
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stats.totalStudents.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-sm text-blue-600 font-medium">
                            32.1% vs last period
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Active Courses
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stats.totalCourses}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm text-purple-600 font-medium">
                            20% vs last period
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Engagement Rate
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stats.engagementRate}%
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-yellow-600 font-medium">
                            6.8% vs last period
                          </span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Overview and Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Overview Chart */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Revenue Overview
                      </h3>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View Details
                      </button>
                    </div>

                    {/* Chart Placeholder */}
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">
                          Revenue chart visualization
                        </p>
                        <p className="text-gray-500 text-sm">
                          Interactive chart would be rendered here
                        </p>
                      </div>
                    </div>

                    {/* Revenue Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${stats.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Last Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${stats.lastMonthRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Growth</p>
                        <p className="text-2xl font-bold text-green-600">
                          +{growthPercentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Eye className="w-5 h-5 text-blue-500 mr-3" />
                          <span className="text-gray-700">Video Views</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {stats.videoViews.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="text-gray-700">Community Posts</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {stats.communityPosts.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Video className="w-5 h-5 text-purple-500 mr-3" />
                          <span className="text-gray-700">Live Sessions</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {stats.liveSessions}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-3" />
                          <span className="text-gray-700">Avg Rating</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {stats.avgRating}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-red-500 mr-3" />
                          <span className="text-gray-700">Email Subscribers</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {stats.emailSubscribers.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Conversion Funnel
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Website Visitors</span>
                        <span className="font-semibold text-gray-900">
                          {stats.websiteVisitors.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Course Views</span>
                        <span className="font-semibold text-gray-900">
                          {stats.courseViews.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-purple-600 h-3 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Sign-ups</span>
                        <span className="font-semibold text-gray-900">
                          {stats.signUps.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">Purchases</span>
                        <span className="font-semibold text-gray-900">
                          {stats.purchases}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-orange-600 h-3 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Community Management */}
            {activeView === "community" && (
              <CommunityManagement instructor={instructor} />
            )}

            {/* Analytics Dashboard */}
            {activeView === "analytics" && (
              <AnalyticsDashboard instructor={instructor} />
            )}

            {/* Settings */}
            {activeView === "settings" && (
              <InstructorSettings instructor={instructor} />
            )}

            {/* Other views placeholder */}
            {activeView !== "overview" &&
              activeView !== "community" &&
              activeView !== "analytics" &&
              activeView !== "settings" && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {React.createElement(
                      menuItems.find((item) => item.id === activeView)?.icon ||
                        Settings,
                      {
                        className: "w-10 h-10 text-purple-600",
                      }
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {menuItems.find((item) => item.id === activeView)?.label}{" "}
                    Section
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This section is under development
                  </p>
                  <button
                    onClick={() => setActiveView("overview")}
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
  );
}

export default InstructorDashboard;
