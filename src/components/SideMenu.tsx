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
  Mail
} from 'lucide-react';

interface SideMenuProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'educator' | 'student' | null;
  onCollapseChange: (collapsed: boolean) => void;
}

function SideMenu({ currentView, onViewChange, userRole, onCollapseChange }: SideMenuProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    courses: false,
    sales: false,
    marketing: false,
    member: false
  });

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    onCollapseChange(newCollapsed);
  };

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
      hasSubmenu: true,
      submenu: [
        { key: 'courses', label: 'Manage Courses', icon: BookOpen },
        { key: 'member-record', label: 'Record', icon: Video },
        { key: 'library', label: 'Library', icon: FileText }
      ]
    },
    {
      key: 'sales',
      label: 'Sales',
      icon: DollarSign,
      hasSubmenu: true,
      submenu: [
        { key: 'sales', label: 'Payments', icon: DollarSign },
        { key: 'sales-coupons', label: 'Coupons', icon: FileText }
      ]
    },
    {
      key: 'marketing',
      label: 'Marketing',
      icon: Megaphone,
      hasSubmenu: true,
      submenu: [
        { key: 'content-planner', label: 'Content Planner', icon: FileText },
        { key: 'testimonials', label: 'Testimonials', icon: Users },
        { key: 'email-automation', label: 'Email Automation', icon: Mail }
      ]
    },
    {
      key: 'member',
      label: 'Member Area',
      icon: Users,
      hasSubmenu: false
    },
    {
      key: 'meet',
      label: 'Meet',
      icon: Video,
      hasSubmenu: false
    },
    {
      key: 'contacts',
      label: 'Contacts',
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
    <div className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
          <div className="space-y-1 px-3 flex-1">
            {menuItems.map((item) => (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (item.hasSubmenu) {
                      toggleMenu(item.key);
                    } else {
                      if (item.key === 'member') {
                        onViewChange('member-community');
                      } else {
                        onViewChange(item.key);
                      }
                    }
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentView === item.key || (item.hasSubmenu && expandedMenus[item.key])
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {item.hasSubmenu && (
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${
                            expandedMenus[item.key] ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && expandedMenus[item.key] && !sidebarCollapsed && (
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
              {!sidebarCollapsed && (
                <span className="ml-3 flex-1 text-left">Settings</span>
              )}
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
              {!sidebarCollapsed && (
                <span className="ml-3 flex-1 text-left">Contact support</span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;