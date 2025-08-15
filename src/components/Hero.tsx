import React, { useState } from 'react';
import { ArrowRight, Users, BookOpen, Calendar, Trophy, Video, FileText, MessageCircle, Mail, Zap, Target, Star, CheckCircle, X, GraduationCap, Play, Camera, Megaphone, Clock, TrendingUp } from 'lucide-react';
import Pricing from './Pricing';

interface HeroProps {
  onLogin: (role: 'educator') => void;
  onShowEducatorSignup?: () => void;
}

export default function Hero({ onLogin, onShowEducatorSignup }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStarted = () => {
    if (onShowEducatorSignup) {
      onShowEducatorSignup();
    } else {
      onLogin('educator');
    }
  };

  const replacedTools = [
    { name: 'Skool', icon: GraduationCap, color: 'bg-orange-500' },
    { name: 'Kajabi', icon: Play, color: 'bg-green-600' },
    { name: 'Vimeo', icon: Play, color: 'bg-blue-500' },
    { name: 'Loom', icon: Camera, color: 'bg-purple-600' },
    { name: 'Zoom', icon: Video, color: 'bg-blue-600' },
    { name: 'Content Calendar', icon: Calendar, color: 'bg-green-500' },
    { name: 'Testimonial.to', icon: Star, color: 'bg-yellow-500' },
    { name: 'ActiveCampaign', icon: Megaphone, color: 'bg-red-500' },
    { name: 'Calendly', icon: Clock, color: 'bg-blue-400' },
    { name: 'ClickFunnels', icon: TrendingUp, color: 'bg-orange-600' }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">trainr</span>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features-section')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('testimonials-section')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Success Stories
              </button>
              <button
                onClick={() => scrollToSection('pricing-section')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('comparison-section')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Compare
              </button>
              <button
                onClick={() => scrollToSection('help-section')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Help
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/login/instructor'}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Instructor Login
              </button>
              <button
                onClick={() => window.location.href = '/login/student'}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Student Login
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Only Platform Creators & Educators Need
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            One tool to replace them all
          </p>
        </div>

        {/* Visual Replacement Graphic */}
        <div className="relative mb-16">
          {/* Before Section - Multiple Tools */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Before: Tool Chaos</h3>
              <p className="text-gray-600">Managing multiple subscriptions, integrations, and workflows</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {replacedTools.map((tool, index) => (
                <div key={index} className="relative group">
                  <div className={`${tool.color} rounded-xl p-4 text-white shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                    <tool.icon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-medium text-center">{tool.name}</p>
                  </div>
                  {/* Cost indicator */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    $29+
                  </div>
                </div>
              ))}
            </div>

            {/* Problems */}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <X className="w-5 h-5" />
                <span className="text-sm">$300+/month</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <X className="w-5 h-5" />
                <span className="text-sm">Complex integrations</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <X className="w-5 h-5" />
                <span className="text-sm">Data scattered</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-4">
              <ArrowRight className="w-8 h-8 text-white transform rotate-90" />
            </div>
          </div>

          {/* After Section - Trainr */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-xl p-8 text-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">T</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">After: Trainr</h3>
              <p className="text-purple-100">Everything you need in one unified platform</p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Users, title: 'Community Hub', desc: 'Replace Skool with engaging discussions' },
                { icon: BookOpen, title: 'Course Platform', desc: 'Replace Kajabi with structured learning' },
                { icon: Video, title: 'Video Hosting', desc: 'Replace Vimeo & Loom with built-in recording' },
                { icon: Calendar, title: 'Live Calls', desc: 'Replace Zoom & Calendly with scheduling' },
                { icon: FileText, title: 'Content Planner', desc: 'Replace content tools with automation' },
                { icon: Mail, title: 'Email Marketing', desc: 'Replace ActiveCampaign with campaigns' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <feature.icon className="w-8 h-8 mb-3 text-white" />
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-purple-100">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm">Save $250+/month</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm">Zero integrations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="text-sm">Unified analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              Start Your Teaching Business
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="text-purple-600 px-8 py-4 rounded-xl font-semibold border-2 border-purple-200 hover:bg-purple-50 transition-colors">
              See Live Demo
            </button>
          </div>
          
          <p className="text-sm text-gray-600">
            Join 10,000+ educators building successful online teaching businesses
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {[
            { icon: Users, label: 'Tools Replaced', value: '10+', color: 'text-purple-600' },
            { icon: Trophy, label: 'Money Saved', value: '$3K+', color: 'text-green-600' },
            { icon: Zap, label: 'Setup Time', value: '5 min', color: 'text-blue-600' },
            { icon: Star, label: 'Satisfaction', value: '99%', color: 'text-yellow-600' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-lg mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Blend
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect combination of tools for your teaching style
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div id="courses-section" className="text-center p-8 bg-white rounded-2xl shadow-lg scroll-mt-16">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Online Courses</h3>
            <p className="text-gray-600 mb-6">Create structured learning experiences with video lessons, quizzes, and certificates.</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Video hosting & streaming</li>
              <li>• Progress tracking</li>
              <li>• Certificates & badges</li>
              <li>• Student analytics</li>
            </ul>
          </div>
          
          <div id="community-section" className="text-center p-8 bg-white rounded-2xl shadow-lg scroll-mt-16">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
            <p className="text-gray-600 mb-6">Build engaged communities where students connect, share, and learn together.</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• Discussion forums</li>
              <li>• Member profiles</li>
              <li>• Direct messaging</li>
              <li>• Community challenges</li>
            </ul>
          </div>
          
          <div id="live-calls-section" className="text-center p-8 bg-white rounded-2xl shadow-lg scroll-mt-16">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Video className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Calls</h3>
            <p className="text-gray-600 mb-6">Host live sessions, Q&As, and workshops to connect with your students in real-time.</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>• HD video calls</li>
              <li>• Screen sharing</li>
              <li>• Recording & replay</li>
              <li>• Interactive chat</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials-section" className="bg-gray-50 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how educators are building successful businesses with Trainr
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Web Development Instructor",
                revenue: "$50K/month",
                students: "2,500+",
                quote: "Trainr helped me replace 8 different tools and increase my revenue by 300%"
              },
              {
                name: "Mike Chen",
                role: "Digital Marketing Expert",
                revenue: "$35K/month",
                students: "1,800+",
                quote: "The all-in-one platform saved me 20 hours per week and simplified my entire business"
              },
              {
                name: "Emma Davis",
                role: "Design Mentor",
                revenue: "$25K/month",
                students: "1,200+",
                quote: "My students love the seamless experience, and I love the increased engagement"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="font-bold text-green-600">{testimonial.revenue}</div>
                    <div className="text-gray-600">Monthly Revenue</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{testimonial.students}</div>
                    <div className="text-gray-600">Students</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div id="help-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get Help & Support
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you succeed every step of the way
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Knowledge Base",
              description: "Step-by-step guides and tutorials",
              icon: "📚"
            },
            {
              title: "Live Chat",
              description: "Get instant help from our team",
              icon: "💬"
            },
            {
              title: "Video Tutorials",
              description: "Watch and learn at your own pace",
              icon: "🎥"
            },
            {
              title: "Community Forum",
              description: "Connect with other educators",
              icon: "👥"
            }
          ].map((item, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Pricing Section */}
      <div id="pricing-section" className="scroll-mt-16">
        <Pricing />
      </div>

      {/* Detailed Comparison Table */}
      <div id="comparison-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-16">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-white font-bold text-lg">FEATURES</div>
              <div className="text-white font-bold text-lg text-center">REPLACES</div>
              <div className="text-white font-bold text-lg text-center">OTHER TOOLS</div>
              <div className="text-white font-bold text-lg text-center flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                Trainr
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {[
              {
                feature: 'COMMUNITY MANAGEMENT',
                replaces: [{ name: 'Skool', color: 'bg-orange-500' }],
                price: '$89/MONTHLY',
                included: true
              },
              {
                feature: 'COURSE PLATFORM',
                replaces: [{ name: 'Kajabi', color: 'bg-green-600' }],
                price: '$149/MONTHLY',
                included: true
              },
              {
                feature: 'VIDEO HOSTING',
                replaces: [{ name: 'Vimeo', color: 'bg-blue-500' }, { name: 'Loom', color: 'bg-purple-600' }],
                price: '$79/MONTHLY',
                included: true
              },
              {
                feature: 'LIVE CALLS & MEETINGS',
                replaces: [{ name: 'Zoom', color: 'bg-blue-600' }],
                price: '$49/MONTHLY',
                included: true
              },
              {
                feature: 'EMAIL MARKETING',
                replaces: [{ name: 'ActiveCampaign', color: 'bg-red-500' }],
                price: '$99/MONTHLY',
                included: true
              },
              {
                feature: 'CONTENT PLANNING',
                replaces: [{ name: 'Content Calendar', color: 'bg-green-500' }],
                price: '$49/MONTHLY',
                included: true
              },
              {
                feature: 'BOOKING & APPOINTMENTS',
                replaces: [{ name: 'Calendly', color: 'bg-blue-400' }],
                price: '$29/MONTHLY',
                included: true
              },
              {
                feature: 'SALES FUNNELS',
                replaces: [{ name: 'ClickFunnels', color: 'bg-orange-600' }],
                price: '$297/MONTHLY',
                included: true
              },
              {
                feature: 'TESTIMONIAL COLLECTION',
                replaces: [{ name: 'Testimonial.to', color: 'bg-yellow-500' }],
                price: '$49/MONTHLY',
                included: true
              },
              {
                feature: 'ANALYTICS & TRACKING',
                replaces: [{ name: 'Analytics Tools', color: 'bg-indigo-500' }],
                price: '$99/MONTHLY',
                included: true
              },
              {
                feature: 'WORKFLOW AUTOMATION',
                replaces: [{ name: 'Zapier', color: 'bg-orange-400' }],
                price: '$69/MONTHLY',
                included: true
              },
              {
                feature: 'MOBILE APP ACCESS',
                replaces: [],
                price: 'UNIQUE TO TRAINR',
                included: true
              }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 px-8 py-6 hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-gray-800 flex items-center">
                  {row.feature}
                </div>
                <div className="flex justify-center items-center space-x-2">
                  {row.replaces.map((tool, toolIndex) => (
                    <div key={toolIndex} className={`${tool.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                      {tool.name}
                    </div>
                  ))}
                </div>
                <div className="text-center font-semibold text-gray-600">
                  {row.price}
                </div>
                <div className="flex justify-center">
                  {row.included && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Pricing Footer */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-6 border-t-2 border-gray-300">
            <div className="grid grid-cols-4 gap-4">
              <div className="font-bold text-xl text-gray-900">OVERALL PRICE</div>
              <div></div>
              <div className="text-center font-bold text-xl text-red-600">$1,106 PER MONTH</div>
              <div className="text-center font-bold text-xl text-green-600">$97 PER MONTH</div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 inline-block">
            <div className="text-3xl font-bold mb-2">Save $1,009/month</div>
            <div className="text-lg opacity-90">That's $12,108 per year!</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            Start Your Teaching Business - Get Trainr for $97/month
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <p className="text-gray-600 mt-4">
            Everything you need to teach online in one platform
          </p>
        </div>
      </div>
    </div>
  );
}