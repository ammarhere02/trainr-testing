import React from 'react';
import { GraduationCap, User, ArrowRight, BookOpen, Users, Video, MessageCircle } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelect: (role: 'instructor' | 'student') => void;
}

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl">T</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Trainr</h1>
            <p className="text-xl text-gray-600">Choose how you want to get started</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Instructor Card */}
            <button
              onClick={() => onRoleSelect('instructor')}
              className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enroll as Instructor</h3>
              <p className="text-gray-600 mb-6">Create and manage courses, build your community, and grow your teaching business.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Create Courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Manage Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Host Live Calls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Build Community</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-purple-100 rounded-lg p-4">
                  <p className="text-purple-800 text-sm font-medium">Perfect for:</p>
                  <p className="text-purple-700 text-sm">Educators, coaches, consultants, and subject matter experts</p>
                </div>
              </div>
            </button>

            {/* Student Card */}
            <button
              onClick={() => onRoleSelect('student')}
              className="group p-8 border-2 border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Enroll as Student</h3>
              <p className="text-gray-600 mb-6">Access courses, join communities, and accelerate your learning journey.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Access Courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Join Community</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Attend Live Calls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Network & Learn</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-medium">Perfect for:</p>
                  <p className="text-blue-700 text-sm">Learners, professionals, and anyone looking to gain new skills</p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/login/instructor" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in as Instructor
              </a>
              {' '}or{' '}
              <a href="/login/student" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in as Student
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}