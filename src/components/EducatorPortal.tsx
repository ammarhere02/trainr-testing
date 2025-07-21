import React, { useState } from 'react';
import { Star, Users, BookOpen, ArrowRight, Play, Clock, Award, CheckCircle, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface EducatorPortalProps {
  educator: any;
  onStudentSignup: () => void;
}

export default function EducatorPortal({ educator, onStudentSignup }: EducatorPortalProps) {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{educator.businessName}</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#courses" className="text-gray-600 hover:text-gray-900 font-medium">
                Courses
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </a>
              <button
                onClick={onStudentSignup}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={educator.avatar}
                  alt={`${educator.firstName} ${educator.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Learn with {educator.firstName}
                  </h1>
                  <p className="text-xl text-gray-600">{educator.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{educator.stats.students.toLocaleString()}</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{educator.stats.courses}</div>
                  <div className="text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                    <Star className="w-6 h-6 mr-1 fill-current" />
                    {educator.stats.rating}
                  </div>
                  <div className="text-gray-600">{educator.stats.reviews} Reviews</div>
                </div>
              </div>

              <button
                onClick={onStudentSignup}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Community</h3>
                  <p className="text-gray-600">Get instant access to all courses and community features</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Lifetime access to all courses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Private community access</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Live Q&A sessions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Certificate of completion</span>
                  </div>
                </div>

                <button
                  onClick={onStudentSignup}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Join Now - Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Master new skills with our comprehensive courses</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educator.courses.map((course: any) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
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
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${course.price}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{course.students}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{course.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onStudentSignup}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About {educator.firstName} {educator.lastName}
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                With over 10 years of experience in the industry, {educator.firstName} has helped thousands of students 
                achieve their learning goals. Known for practical, hands-on teaching methods that get real results.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">Industry Expert & Certified Instructor</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{educator.stats.students.toLocaleString()}+ Students Taught</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-gray-700">{educator.stats.rating}/5 Average Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={educator.avatar}
                alt={`${educator.firstName} ${educator.lastName}`}
                className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join {educator.stats.students.toLocaleString()}+ students who are already learning with {educator.firstName}
          </p>
          <button
            onClick={onStudentSignup}
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center mx-auto"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold">{educator.businessName}</span>
              </div>
              <p className="text-gray-400">{educator.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#courses" className="block text-gray-400 hover:text-white transition-colors">Courses</a>
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Community</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@{educator.subdomain}.trainr.app</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{educator.subdomain}.trainr.app</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {educator.businessName}. All rights reserved. Powered by Trainr.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}