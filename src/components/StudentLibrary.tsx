import React from 'react'
import { BookOpen, Play, Clock, Users, Star, Calendar, Video, MessageCircle } from 'lucide-react'

export default function StudentLibrary() {
  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 65,
      instructor: 'Sarah Johnson',
      duration: '40 hours',
      lessons: 156
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 30,
      instructor: 'Mike Chen',
      duration: '25 hours',
      lessons: 89
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">My Library</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Community</button>
              <button className="text-gray-600 hover:text-gray-900">Profile</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="flex items-center py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm">
                <BookOpen className="w-5 h-5 mr-2" />
                My Courses
              </button>
              <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                <MessageCircle className="w-5 h-5 mr-2" />
                Community
              </button>
              <button className="flex items-center py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                <Video className="w-5 h-5 mr-2" />
                Live Calls
              </button>
            </nav>
          </div>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
                    <Play className="w-6 h-6 text-purple-600" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>by {course.instructor}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} lessons
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
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

                <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
              <MessageCircle className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Join Community</h3>
              <p className="text-sm text-gray-600">Connect with other students</p>
            </button>
            <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
              <Calendar className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Live Sessions</h3>
              <p className="text-sm text-gray-600">Join upcoming live calls</p>
            </button>
            <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
              <Star className="w-8 h-8 text-yellow-600 mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-600">View your progress</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}