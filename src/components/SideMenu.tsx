import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  DollarSign, 
  Megaphone, 
  Users, 
  Globe, 
  Video, 
  Settings, 
  ChevronDown, 
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface SideMenuProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'educator' | 'student' | null;
  onCollapseChange: (collapsed: boolean) => void;
}

export default function SideMenu({ currentView, onViewChange, userRole, onCollapseChange }: SideMenuProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    courses: false,
    sales: false,
    marketing: false,
    member: false
  });

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hasSubmenu: false
    },
    {
      key: 'courses',
      label: 'Courses',
      icon: BookOpen,
      hasSubmenu: false
    },
    {
      key: 'content-planner',
      label: 'Content Calendar',
      icon: FileText,
      hasSubmenu: false
    },
    {
      key: 'sales',
      label: 'Sales',
      icon: DollarSign,
      hasSubmenu: false
    },
    {
      key: 'member',
      label: 'Member Area',
      icon: Users,
      hasSubmenu: false
    },
    {
      key: 'website',
      label: 'Website',
      icon: Globe,
      hasSubmenu: false
    }
  ];

  if (userRole !== 'educator') {
    return null;
  }

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-20">
      <div className="flex flex-col h-full">
        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col pt-6">
          <div className="space-y-1 px-3 flex-1">
            {menuItems.map((item) => (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.key);
                    } else {
                      onViewChange(item.key);
                    }
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === item.key || (item.hasSubmenu && expandedMenus[item.key])
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && (
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${
                        expandedMenus[item.key] ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && expandedMenus[item.key] && (
                  <div className="mt-1 space-y-1">
                    {item.submenu?.map((subItem) => (
                      <button
                        key={subItem.key}
                        onClick={() => onViewChange(subItem.key)}
                        className={`w-full flex items-center pl-10 pr-3 py-2 text-sm rounded-lg transition-colors ${
                          currentView === subItem.key
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <subItem.icon size={16} className="flex-shrink-0" />
                        <span className="ml-2">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Bottom Menu Items */}
          <div className="space-y-1 px-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onViewChange('settings')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'settings'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} className="flex-shrink-0" />
              <span className="ml-3 flex-1 text-left">Settings</span>
            </button>
            
            <button
              onClick={() => onViewChange('contact-support')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'contact-support'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <HelpCircle size={20} className="flex-shrink-0" />
              <span className="ml-3 flex-1 text-left">Contact support</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}