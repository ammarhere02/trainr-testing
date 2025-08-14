import React, { useState } from 'react';
import { MessageCircle, BookOpen, Calendar } from 'lucide-react';
import Community from './Community';
import Courses from './Courses';
import Events from './Events';

interface MemberAreaProps {
  userRole?: 'educator' | 'student';
  onStartLearning: (courseId: number) => void;
}

export default function MemberArea({ userRole = 'educator', onStartLearning }: MemberAreaProps) {
  const [activeTab, setActiveTab] = useState('community');

  const tabs = [
    { id: 'community', label: 'Community', icon: MessageCircle },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'live-calls', label: 'Live Calls', icon: Calendar }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'community':
        return <Community userRole={userRole} />;
      case 'courses':
        return <Courses onStartLearning={onStartLearning} />;
      case 'live-calls':
        return <Events />;
      default:
        return <Community userRole={userRole} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Member Area</h1>
        <p className="text-gray-600 mt-2">Manage your community, courses, and live sessions</p>
      </div>

      {/* Top Menu Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}