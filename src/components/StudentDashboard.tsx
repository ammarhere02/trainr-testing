import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Video,
  MessageCircle,
  Calendar,
  Star,
  Clock,
  Play,
  Award,
  Target,
  Settings,
  User,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Student {
  id: string;
  email: string;
  full_name: string;
  instructor_id: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface StudentDashboardProps {
  studentData?: Student;
}

export default function StudentDashboard({
  studentData,
}: StudentDashboardProps) {
  const { signOutUser } = useAuth();
  const [activeView, setActiveView] = useState("courses");
  const [progress, setProgress] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalHours: 0,
    currentStreak: 0,
  });

  // Fallback student data if not provided
  const student = studentData || {
    id: "student-1",
    email: "student@example.com",
    full_name: "Student",
    instructor_id: "instructor-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

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
        currentStreak: 7,
      });
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const menuItems = [
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "community", label: "Community", icon: MessageCircle },
    { id: "live-calls", label: "Live Calls", icon: Video },
    { id: "progress", label: "Progress", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      instructor: "Test Instructor",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      image:
        "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Test Instructor",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      image:
        "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
      <div className="min-h-screen flex">
        {/* Left Side - Branding & Navigation */}
        <div className="w-80 flex flex-col p-8 text-white">
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">Trainr</span>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {student.full_name}! 👋
              </h1>
              <p className="text-blue-100">Student Learning Portal</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {progress.coursesEnrolled}
                </div>
                <div className="text-blue-100 text-sm">Enrolled</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {progress.coursesCompleted}
                </div>
                <div className="text-blue-100 text-sm">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">{progress.totalHours}</div>
                <div className="text-blue-100 text-sm">Hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">
                  {progress.currentStreak}
                </div>
                <div className="text-blue-100 text-sm">Day Streak</div>
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
                    ? "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
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
              onClick={() => (window.location.href = "/")}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Right Side - Main Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              {activeView === "courses" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      My Courses
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Continue your learning journey
                    </p>
                  </div>

                  {/* Progress Stats */}
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            Courses Enrolled
                          </p>
                          <p className="text-3xl font-bold text-blue-900">
                            {progress.coursesEnrolled}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            Completed
                          </p>
                          <p className="text-3xl font-bold text-green-900">
                            {progress.coursesCompleted}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">
                            Learning Hours
                          </p>
                          <p className="text-3xl font-bold text-purple-900">
                            {progress.totalHours}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">
                            Current Streak
                          </p>
                          <p className="text-3xl font-bold text-yellow-900">
                            {progress.currentStreak} days
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                            <button className="bg-white/95 backdrop-blur-sm p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-300">
                              <Play className="w-8 h-8 text-blue-600" />
                            </button>
                          </div>
                          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {course.progress}% Complete
                          </div>
                        </div>

                        <div className="p-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            by {course.instructor}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                            <span>
                              {course.completedLessons}/{course.totalLessons}{" "}
                              lessons
                            </span>
                            <span className="font-medium">
                              {course.progress}% complete
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Quick Actions
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                          <MessageCircle className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Join Community
                        </h4>
                        <p className="text-sm text-gray-600">
                          Connect with other students
                        </p>
                      </button>

                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-green-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">
                          <Calendar className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Live Sessions
                        </h4>
                        <p className="text-sm text-gray-600">
                          Join upcoming live calls
                        </p>
                      </button>

                      <button className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 hover:border-purple-300 transition-all duration-300 text-left">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-300">
                          <Star className="w-6 h-6 text-purple-600 group-hover:text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Achievements
                        </h4>
                        <p className="text-sm text-gray-600">
                          View your progress
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Other views */}
              {activeView !== "courses" && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {React.createElement(
                      menuItems.find((item) => item.id === activeView)?.icon ||
                        Settings,
                      {
                        className: "w-10 h-10 text-blue-600",
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
                    onClick={() => setActiveView("courses")}
                    className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Back to Courses
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
