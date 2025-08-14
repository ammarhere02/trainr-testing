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
  const [activeTab, setActiveTab] = useState('Community');

  const tabs = [
    { id: 'Community', label: 'Community', icon: MessageCircle },
    { id: 'Classroom', label: 'Classroom', icon: BookOpen },
    { id: 'Calendar', label: 'Calendar', icon: Calendar }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Community':
        return <Community userRole={userRole} />;
      case 'Classroom':
        return <Courses onStartLearning={onStartLearning} />;
      case 'Calendar':
        return <Events />;
      default:
        return <Community userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Menu Tabs - Full Width */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}