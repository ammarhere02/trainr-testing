import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Star,
  Play,
  Award,
  MessageSquare,
  Clock,
  Target,
  Eye,
  ArrowUpRight,
  Plus,
  Download,
} from "lucide-react";

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
  social_links?: any;
  total_courses?: number;
  total_students?: number;
  average_rating?: number;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface AnalyticsDashboardProps {
  instructor: Profile & {
    instructor?: Instructor | null;
  };
}

function AnalyticsDashboard({ instructor }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
    console.log(instructor);
  // Mock analytics data
  const analyticsData = {
    overview: {
      totalStudents: 247,
      totalCourses: 5,
      monthlyRevenue: 1245,
      avgRating: 4.8,
      completionRate: 73,
      engagementRate: 86,
      totalViews: 1542,
      watchTime: 2847, // hours
    },
    trends: {
      studentsGrowth: 12.3,
      revenueGrowth: 23.1,
      coursesGrowth: 8.5,
      ratingChange: 0.2,
    },
    monthlyData: [
      { month: "Jan", students: 45, revenue: 2800, courses: 2 },
      { month: "Feb", students: 62, revenue: 3900, courses: 3 },
      { month: "Mar", students: 78, revenue: 4650, courses: 3 },
      { month: "Apr", students: 95, revenue: 5890, courses: 4 },
      { month: "May", students: 134, revenue: 7200, courses: 4 },
      { month: "Jun", students: 167, revenue: 8750, courses: 5 },
      { month: "Jul", students: 198, revenue: 10200, courses: 5 },
      { month: "Aug", students: 247, revenue: 12450, courses: 5 },
    ],
    coursePerformance: [
      {
        id: 1,
        name: "Web Development Fundamentals",
        students: 89,
        completion: 78,
        rating: 4.9,
        revenue: 4450,
        trend: "up",
      },
      {
        id: 2,
        name: "JavaScript Advanced",
        students: 67,
        completion: 71,
        rating: 4.7,
        revenue: 3350,
        trend: "up",
      },
      {
        id: 3,
        name: "React Masterclass",
        students: 54,
        completion: 69,
        rating: 4.8,
        revenue: 2700,
        trend: "down",
      },
      {
        id: 4,
        name: "Node.js Backend",
        students: 37,
        completion: 75,
        rating: 4.6,
        revenue: 1850,
        trend: "up",
      },
    ],
    topCountries: [
      { country: "United States", students: 89, percentage: 36 },
      { country: "United Kingdom", students: 45, percentage: 18 },
      { country: "Canada", students: 32, percentage: 13 },
      { country: "Australia", students: 28, percentage: 11 },
      { country: "Germany", students: 22, percentage: 9 },
      { country: "Others", students: 31, percentage: 13 },
    ],
    engagementData: [
      { metric: "Forum Posts", value: 342, change: 15.2 },
      { metric: "Questions Asked", value: 128, change: 8.7 },
      { metric: "Live Sessions", value: 24, change: 12.5 },
      { metric: "Certificates Earned", value: 156, change: 22.1 },
    ],
  };

  // Simple chart components (CSS-based)
  const BarChart = ({
    data,
    height = "h-32",
  }: {
    data: any[];
    height?: string;
  }) => {
    const maxValue = Math.max(...data.map((d) => d.students));
    return (
      <div className={`flex items-end justify-between space-x-2 ${height}`}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all duration-500 hover:from-purple-600 hover:to-purple-400"
              style={{
                height: `${(item.students / maxValue) * 100}%`,
                minHeight: "8px",
              }}
            />
            <span className="text-xs text-gray-600 mt-2 font-medium">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const LineChart = ({
    data,
    height = "h-32",
  }: {
    data: any[];
    height?: string;
  }) => {
    const maxValue = Math.max(...data.map((d) => d.revenue));
    return (
      <div className={`relative ${height} flex items-end`}>
        <svg className="w-full h-full" viewBox="0 0 400 128">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 ${128 - (data[0].revenue / maxValue) * 100} ${data
              .map(
                (item, index) =>
                  `L ${(index * 400) / (data.length - 1)} ${
                    128 - (item.revenue / maxValue) * 100
                  }`
              )
              .join(" ")}`}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
            className="drop-shadow-sm"
          />
          <path
            d={`M 0 ${128 - (data[0].revenue / maxValue) * 100} ${data
              .map(
                (item, index) =>
                  `L ${(index * 400) / (data.length - 1)} ${
                    128 - (item.revenue / maxValue) * 100
                  }`
              )
              .join(" ")} L 400 128 L 0 128 Z`}
            fill="url(#areaGradient)"
          />
          {data.map((item, index) => (
            <circle
              key={index}
              cx={(index * 400) / (data.length - 1)}
              cy={128 - (item.revenue / maxValue) * 100}
              r="4"
              fill="#8b5cf6"
              className="drop-shadow-sm"
            />
          ))}
        </svg>
      </div>
    );
  };

  const DonutChart = ({ data }: { data: any[] }) => {
    let cumulativePercentage = 0;
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.91549430918953"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {data.map((item, index) => {
            const strokeDasharray = `${item.percentage} ${
              100 - item.percentage
            }`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += item.percentage;
            const colors = [
              "#8b5cf6",
              "#3b82f6",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#6b7280",
            ];
            return (
              <circle
                key={index}
                cx="21"
                cy="21"
                r="15.91549430918953"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {analyticsData.overview.totalStudents}
            </div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Comprehensive insights into your teaching performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Total Students
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {analyticsData.overview.totalStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              +{analyticsData.trends.studentsGrowth}% this month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-green-900">
                ${analyticsData.overview.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              +{analyticsData.trends.revenueGrowth}% this month
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {analyticsData.overview.completionRate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+5.2% this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Watch Time</p>
              <p className="text-3xl font-bold text-yellow-900">
                {(analyticsData.overview.watchTime / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-yellow-600">hours</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+18.4% this month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Growth Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Student Growth</h3>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Growing</span>
            </div>
          </div>
          <BarChart data={analyticsData.monthlyData} height="h-40" />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Monthly student enrollment over the past 8 months
            </p>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center text-purple-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">
                +{analyticsData.trends.revenueGrowth}%
              </span>
            </div>
          </div>
          <LineChart data={analyticsData.monthlyData} height="h-40" />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Monthly revenue progression with trend analysis
            </p>
          </div>
        </div>
      </div>

      {/* Course Performance & Geographic Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Course Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.coursePerformance.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-blue-50 transition-all duration-300"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{course.name}</h4>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-blue-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {course.students} students
                      </span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Target className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {course.completion}% completion
                      </span>
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ${course.revenue.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center ${
                      course.trend === "up" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {course.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {course.trend === "up" ? "Growing" : "Declining"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Student Distribution
          </h3>
          <div className="mb-6">
            <DonutChart data={analyticsData.topCountries} />
          </div>
          <div className="space-y-3">
            {analyticsData.topCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{
                      backgroundColor: [
                        "#8b5cf6",
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#6b7280",
                      ][index % 6],
                    }}
                  />
                  <span className="text-sm text-gray-700">
                    {country.country}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {country.students}
                  </div>
                  <div className="text-xs text-gray-500">
                    {country.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Engagement Metrics
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {analyticsData.engagementData.map((metric, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                {index === 0 && (
                  <MessageSquare className="w-6 h-6 text-white" />
                )}
                {index === 1 && <Users className="w-6 h-6 text-white" />}
                {index === 2 && <Play className="w-6 h-6 text-white" />}
                {index === 3 && <Award className="w-6 h-6 text-white" />}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">{metric.metric}</div>
              <div className="flex items-center justify-center text-green-600">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                <span className="text-xs font-medium">+{metric.change}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Strong Growth Momentum
                </p>
                <p className="text-sm text-gray-600">
                  Your student base has grown by 12.3% this month, significantly
                  above the industry average of 5%.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Excellent Course Quality
                </p>
                <p className="text-sm text-gray-600">
                  Your average rating of 4.8 stars puts you in the top 10% of
                  instructors on the platform.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  High Completion Rates
                </p>
                <p className="text-sm text-gray-600">
                  73% completion rate is exceptional and indicates high student
                  engagement with your content.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Recommendations
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Plus className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Expand Course Catalog
                </p>
                <p className="text-sm text-gray-600">
                  Consider creating advanced courses for your top-performing
                  topics to retain graduated students.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Increase Community Engagement
                </p>
                <p className="text-sm text-gray-600">
                  Your forum activity is good, but increasing weekly live Q&A
                  sessions could boost engagement further.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Eye className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Focus on React Course
                </p>
                <p className="text-sm text-gray-600">
                  Your React Masterclass shows declining enrollment. Consider
                  updating content or adjusting pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
