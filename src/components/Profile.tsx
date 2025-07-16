import React from 'react';
import { Trophy, Star, Calendar, BookOpen, Users, TrendingUp, Award, Target } from 'lucide-react';

export default function Profile() {
  const achievements = [
    { name: 'Course Completer', description: 'Finished 5 courses', icon: BookOpen, earned: true },
    { name: 'Community Helper', description: 'Helped 50+ members', icon: Users, earned: true },
    { name: 'Discussion Starter', description: 'Started 10 discussions', icon: TrendingUp, earned: true },
    { name: 'Call Attendee', description: 'Attended 25 live calls', icon: Calendar, earned: false },
    { name: 'Master Learner', description: 'Earned 1000+ XP', icon: Award, earned: false },
    { name: 'Top Contributor', description: 'Monthly top contributor', icon: Star, earned: false }
  ];

  const stats = [
    { label: 'Current Level', value: '12', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Total XP', value: '2,847', icon: Star, color: 'text-purple-600' },
    { label: 'Courses Completed', value: '8', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Community Points', value: '1,234', icon: Users, color: 'text-green-600' }
  ];

  const recentActivity = [
    { type: 'course', action: 'Completed lesson', title: 'React Hooks Deep Dive', time: '2 hours ago' },
    { type: 'discussion', action: 'Replied to', title: 'Best practices for state management', time: '4 hours ago' },
    { type: 'achievement', action: 'Earned badge', title: 'Discussion Starter', time: '1 day ago' },
    { type: 'call', action: 'Attended', title: 'JavaScript Q&A Session', time: '2 days ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold text-gray-900">Sarah Johnson</h2>
              <p className="text-gray-600 mb-4">Full Stack Developer</p>
              
              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Level 12</span>
                  <span className="text-sm text-gray-600">2,847 / 3,000 XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">153 XP to next level</p>
              </div>

              <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className={`w-5 h-5 mr-3 ${stat.color}`} />
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-purple-600' : 'bg-gray-400'
                    }`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                    </div>
                  </div>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          </div>
        </div>
      </div>
    </div>
  );
}