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
import { getDashboardAnalytics, getTopCourses } from '../lib/api/analytics';

interface DashboardProps {
  userRole?: 'educator' | 'student' | null;
}

export default function Dashboard({ userRole }: DashboardProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [topCourses, setTopCourses] = useState<any[]>([]);

  // Load analytics on component mount
  React.useEffect(() => {
    if (userRole === 'educator') {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [analyticsData, coursesData] = await Promise.all([
        getDashboardAnalytics(),
        getTopCourses(5)
      ]);
      
      setAnalytics(analyticsData);
      setTopCourses(coursesData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const recentActivity = [
    { type: 'sale', message: 'New course purchase: React Masterclass', amount: '$199', time: '2 min ago', user: 'Sarah Johnson' },
    { type: 'student', message: 'New student enrolled', course: 'Web Development Bootcamp', time: '5 min ago', user: 'Mike Chen' },
    { type: 'review', message: 'New 5-star review received', course: 'JavaScript Fundamentals', time: '12 min ago', user: 'Emma Davis' },
    { type: 'milestone', message: '1000 students milestone reached', course: 'React Masterclass', time: '1 hour ago' },
    { type: 'content', message: 'New lesson published', course: 'Advanced CSS', time: '2 hours ago' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 28500, students: 156, courses: 8 },
    { month: 'Feb', revenue: 32100, students: 189, courses: 9 },
    { month: 'Mar', revenue: 29800, students: 167, courses: 9 },
    { month: 'Apr', revenue: 35600, students: 234, courses: 10 },
    { month: 'May', revenue: 41200, students: 278, courses: 11 },
    { month: 'Jun', revenue: 45280, students: 312, courses: 12 }
  ];

  if (isLoading && !analytics) {
    // Show different loading message based on user role
    if (userRole !== 'educator') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-blue-800 font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-blue-700">Analytics are only available for educators. Please sign in as an educator to view dashboard analytics.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Dashboard</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return DollarSign;
      case 'student': return Users;
      case 'review': return Star;
      case 'milestone': return Award;
      case 'content': return BookOpen;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-100 text-green-600';
      case 'student': return 'bg-blue-100 text-blue-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'milestone': return 'bg-purple-100 text-purple-600';
      case 'content': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
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

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalStudents?.toLocaleString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+8.3%</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalCourses || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+15.2%</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.avgRating || '0'}/5</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">+5.1%</span>
            </div>
            <span className="text-sm text-gray-600 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View Details</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <p className="text-gray-600">Revenue chart visualization</p>
              <p className="text-sm text-gray-500">Interactive chart would be rendered here</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-lg font-bold text-gray-900">${analytics?.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Month</p>
              <p className="text-lg font-bold text-gray-900">${Math.floor((analytics?.totalRevenue || 0) * 0.85).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="text-lg font-bold text-green-600">+17.6%</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
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
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Website Visitors</span>
                  <span className="font-medium">12,450</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Course Views</span>
                  <span className="font-medium">4,567</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '37%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sign-ups</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
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

      {/* Top Courses and Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {topCourses.map((course, index) => {
                return (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                          <span>{course.course_analytics?.total_students || 0} students</span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                            {course.course_analytics?.avg_rating || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">${(course.course_analytics?.revenue || 0).toLocaleString()}</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {Math.floor(Math.random() * 20 + 5)}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    {activity.user && (
                      <p className="text-xs text-gray-600 mt-1">by {activity.user}</p>
                    )}
                    {activity.course && (
                      <p className="text-xs text-gray-600 mt-1">in {activity.course}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Direct</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Social Media</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Search</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Course Completion</span>
                <span className="font-medium">73%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Learners</span>
                <span className="font-medium">{analytics?.totalStudents || 0}</span>
              </div>
              <div className="text-xs text-gray-500">+12% from last week</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Avg. Study Time</span>
                <span className="font-medium">2.4h/day</span>
              </div>
              <div className="text-xs text-gray-500">+0.3h from last week</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Community Health</h3>
            <Heart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Members</span>
              <span className="font-medium">{analytics?.totalStudents || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Daily Posts</span>
              <span className="font-medium">{Math.floor((analytics?.communityPosts || 0) / 30)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="font-medium">89%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Satisfaction</span>
              <span className="font-medium">{analytics?.avgRating || 0}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <Plus className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Create Course</h4>
            <p className="text-sm text-gray-600">Start building a new course</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Schedule Live Session</h4>
            <p className="text-sm text-gray-600">Plan and schedule content</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Students</h4>
            <p className="text-sm text-gray-600">View and manage student progress</p>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <Settings className="w-8 h-8 text-gray-600 mb-2" />
            <h4 className="font-medium text-gray-900">Analytics & Reports</h4>
            <p className="text-sm text-gray-600">View detailed analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
}