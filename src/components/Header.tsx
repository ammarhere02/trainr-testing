import React, { useState } from 'react';
import { Search, Bell, User, Menu, LogOut, Video, FileText, UserPlus, ArrowRight, ChevronDown, Settings, CreditCard, HelpCircle } from 'lucide-react';
import { signOut } from '../lib/auth.tsx';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onShowLogin: () => void;
  isLoggedIn: boolean;
  userRole: 'educator' | 'student' | null;
  onLogout: () => void;
  onLogin?: (role: 'educator' | 'student', educatorId?: string) => void;
  showFullNavigation?: boolean;
}

export default function Header({ currentView, onViewChange, onShowLogin, isLoggedIn, userRole, onLogout, onLogin, showFullNavigation = false }: HeaderProps) {
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleJoinClick = () => {
    if (onLogin) {
      onLogin('educator');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row */}
          <div className="flex justify-start items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => isLoggedIn ? onViewChange('dashboard') : onViewChange('home')}
                className={`flex items-center space-x-2 ${isLoggedIn ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}`}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold text-white">trainr</span>
              </button>
              {isLoggedIn && userRole && (
                <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                  userRole === 'educator' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {userRole === 'educator' ? '👨‍🏫 Educator' : '👨‍🎓 Student'}
                </span>
              )}
            </div>

            {/* Navigation and Actions */}
            <div className="flex-1 flex justify-end items-center">
             {/* Sign Out Button - Show when logged in */}
             {isLoggedIn && (
               <button
                 onClick={handleSignOut}
                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors mr-4 text-sm font-medium flex items-center"
                 title="Sign Out"
               >
                 <LogOut className="w-4 h-4 mr-2" />
                 Sign Out
               </button>
             )}

             {/* Admin Button - Always Visible */}
             <button
               onClick={() => window.location.href = '/studio/dashboard'}
               className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors mr-4 text-sm font-medium"
               title="Admin Access"
             >
               ADMIN
             </button>

              {/* Center Navigation - Only show when showFullNavigation is true */}
              {showFullNavigation && (
               <>
                <div className="flex items-center space-x-6 mr-6">
                  <button
                    onClick={() => scrollToSection('features-section')}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Features
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('testimonials-section')}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Success Stories
                  </button>
                  
                  <button
                    onClick={() => {
                      const pricingSection = document.getElementById('pricing-section');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Pricing
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/studio/dashboard'}
                    className="text-gray-300 hover:text-white font-medium transition-colors"
                  >
                    Login
                  </button>
                  
                  <button
                    onClick={handleJoinClick}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center"
                  >
                    GET STARTED FOR FREE
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4 relative">
                <button className="md:hidden p-2 text-gray-300 hover:text-white transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </div>
               </>
              )}
            </div>
          </div>
        </div>
        
        {/* Click outside to close dropdowns */}
        {showProductsDropdown && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowProductsDropdown(false);
            }}
          />
        )}
      </header>
    </>
  );
}