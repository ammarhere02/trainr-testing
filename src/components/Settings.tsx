import React, { useState } from 'react';
import { 
  Globe, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Database, 
  Mail, 
  Smartphone,
  Save,
  Edit3,
  Check,
  X,
  ExternalLink,
  Copy,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  Crown,
  Zap,
  Users,
  ShoppingCart,
  BarChart3,
  DollarSign,
  FileText,
  Link2,
  Palette,
  MessageSquare,
  Smartphone as Mobile,
  Lock,
  Eye,
  UserPlus,
  Trash2,
  RefreshCw,
  Loader
} from 'lucide-react';
import { domainChecker, DomainStatus } from '../utils/domainChecker';

interface SettingsProps {
  userRole?: 'educator' | 'student';
}

export default function Settings({ userRole = 'educator' }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('payment');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<'subdomain' | 'custom'>('subdomain');
  const [domainData, setDomainData] = useState({
    subdomain: 'webdevacademy',
    customDomain: '',
    businessName: 'Web Dev Academy'
  });
  const [currentDomain, setCurrentDomain] = useState('webdevacademy.trainr.app');
  const [domainStatus, setDomainStatus] = useState<'active' | 'pending' | 'none'>('active');
  const [domainConnectionStatus, setDomainConnectionStatus] = useState<DomainStatus | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  const tabs = [
    { id: 'payment', label: 'Payment settings', icon: CreditCard },
    { id: 'site', label: 'Site settings', icon: Globe },
    { id: 'account', label: 'Account settings', icon: User }
  ];

  const [users, setUsers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Admin', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', role: 'Editor', status: 'Active', lastLogin: '1 day ago' },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', role: 'Viewer', status: 'Pending', lastLogin: 'Never' }
  ]);

  const handleDomainSetup = () => {
    // In real app, this would save to backend
    console.log('Setting up domain:', { selectedDomain, domainData });
    
    if (selectedDomain === 'subdomain') {
      setCurrentDomain(`${domainData.subdomain}.trainr.app`);
      setDomainStatus('active');
    } else {
      setCurrentDomain(domainData.customDomain);
      setDomainStatus('pending');
    }
    
    setShowDomainModal(false);
  };

  const isSubdomainValid = domainData.subdomain.length >= 3 && /^[a-zA-Z0-9-]+$/.test(domainData.subdomain);
  const isCustomDomainValid = domainData.customDomain.length > 0 && /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domainData.customDomain);
  const isFormValid = domainData.businessName.length > 0 && 
    ((selectedDomain === 'subdomain' && isSubdomainValid) || 
     (selectedDomain === 'custom' && isCustomDomainValid));

  const checkDomainConnection = async () => {
    if (!currentDomain) return;
    
    setIsCheckingDomain(true);
    try {
      const isCustom = !currentDomain.includes('.trainr.app');
      const status = await domainChecker.simulateDomainCheck(currentDomain, isCustom);
      setDomainConnectionStatus(status);
    } catch (error) {
      console.error('Domain check failed:', error);
      setDomainConnectionStatus({
        isConnected: false,
        hasSSL: false,
        dnsConfigured: false,
        cnameValid: false,
        error: 'Failed to check domain status',
        lastChecked: new Date().toISOString()
      });
    } finally {
      setIsCheckingDomain(false);
    }
  };

  // Check domain status on component mount
  React.useEffect(() => {
    checkDomainConnection();
  }, [currentDomain]);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message (in real app, use toast)
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>
      </div>

      {/* Top Navigation Tabs */}
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

      {/* Main Content */}
      <div>
          {/* Payment Settings Tab */}
          {activeTab === 'payment' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment settings</h2>
                
                {/* Payment Settings Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {/* Payment Setup */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Payment setup</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Enable and set up payment processing for your business</p>
                  </div>

                  {/* Checkout */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <ShoppingCart className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Checkout</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Customize your checkout settings</p>
                  </div>

                  {/* Customer Payments */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Customer payments</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Configure settings for customers payments and subscriptions</p>
                  </div>
                </div>

                {/* Tax Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Tax</h3>
                      <p className="text-sm text-gray-600">Collect and manage sales tax applied on your offers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'site' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Site settings</h2>
                
                {/* Site Settings Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Site Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Site details</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Control the info, homepage and SEO settings of your website</p>
                  </div>

                  {/* Domain */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Link2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Domain</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Control the domain connected to your Trainr site</p>
                  </div>

                  {/* Marketing Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Marketing settings</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Control the address, branding and email settings for your site</p>
                  </div>

                  {/* Email Templates */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <Mail className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email templates</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Control the content of the auto generated system emails</p>
                  </div>

                  {/* Blog Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Blog settings</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Manage the SEO settings of your blog</p>
                  </div>

                  {/* Mobile App Settings */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <Mobile className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Mobile app settings</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Manage your site settings for the Trainr Mobile App</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Account settings</h2>
                
                {/* Account Settings Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  {/* Subscription & Billing */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Subscription & Billing</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">View your plan details, manage your usage and update Credit Card info</p>
                  </div>

                  {/* Manage Users */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Manage Users</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Add or remove the users that have access to your Trainr account</p>
                  </div>

                  {/* Notifications & Privacy */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <Bell className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Notifications & privacy</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Control what notification emails you receive from Trainr</p>
                  </div>

                  {/* Account Tracking */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <BarChart3 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Account tracking</h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Manage your preferences for analytics tracking</p>
                  </div>
                </div>

                {/* Manage Users Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Last Login</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-purple-600 font-medium text-sm">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">{user.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">{user.lastLogin}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="text-gray-400 hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legacy Domain & Branding Tab (keeping for backward compatibility) */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              {/* Current Domain Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Domain</h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={checkDomainConnection}
                      disabled={isCheckingDomain}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
                    >
                      {isCheckingDomain ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Check Status
                    </button>
                    <button
                      onClick={() => setShowDomainModal(true)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Change Domain
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{currentDomain}</h3>
                        <div className="flex items-center space-x-2">
                          {domainConnectionStatus?.isConnected && (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {domainConnectionStatus.hasSSL ? 'Active & Secure' : 'Active (No SSL)'}
                              </span>
                            </>
                          )}
                          {domainConnectionStatus && !domainConnectionStatus.isConnected && (
                            <>
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-red-600">Not Connected</span>
                            </>
                          )}
                          {isCheckingDomain && (
                            <>
                              <Loader className="w-4 h-4 text-blue-500 animate-spin" />
                              <span className="text-sm text-blue-600">Checking...</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(`https://${currentDomain}`)}
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://${currentDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                        title="Visit site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Domain Status Details */}
                  {domainConnectionStatus && (
                    <div className="mt-4">
                      {domainConnectionStatus.isConnected ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-800 mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Domain Connected Successfully
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${domainConnectionStatus.hasSSL ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              <span className="text-green-700">
                                SSL: {domainConnectionStatus.hasSSL ? 'Active' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${domainConnectionStatus.dnsConfigured ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className="text-green-700">
                                DNS: {domainConnectionStatus.dnsConfigured ? 'Configured' : 'Not Configured'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-2">
                            Last checked: {new Date(domainConnectionStatus.lastChecked).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <h4 className="font-medium text-red-800 mb-2 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Domain Connection Issues
                          </h4>
                          {domainConnectionStatus.error && (
                            <p className="text-sm text-red-700 mb-3">{domainConnectionStatus.error}</p>
                          )}
                      <p className="text-sm text-yellow-700 mb-3">
                            Your domain is not properly connected. Please check the following:
                      </p>
                          <div className="text-sm text-red-700">
                        <p className="font-medium mb-1">Next steps:</p>
                        <ol className="list-decimal list-inside space-y-1">
                              <li className={domainConnectionStatus.cnameValid ? 'line-through text-green-600' : ''}>
                                Add a CNAME record pointing to trainr.app
                              </li>
                              <li className={domainConnectionStatus.dnsConfigured ? 'line-through text-green-600' : ''}>
                                Wait for DNS propagation (up to 48 hours)
                              </li>
                              <li className={domainConnectionStatus.hasSSL ? 'line-through text-green-600' : ''}>
                                SSL certificate will be automatically provisioned
                              </li>
                        </ol>
                      </div>
                          <p className="text-xs text-red-600 mt-2">
                            Last checked: {new Date(domainConnectionStatus.lastChecked).toLocaleString()}
                          </p>
                        {currentDomain.includes('.trainr.app') 
                          ? 'Subdomain Active & Secure' 
                          : domainConnectionStatus.hasSSL ? 'Custom Domain Active & Secure' : 'Active (No SSL)'
                        }
                      <span className="text-sm text-red-600">
                        {currentDomain.includes('.trainr.app') ? 'Subdomain Not Set Up' : 'Domain Not Connected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Branding Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Branding</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={domainData.businessName}
                      onChange={(e) => setDomainData({...domainData, businessName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-xl">W</span>
                      </div>
                      <div>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          Upload Logo
                        </button>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Colors
                    </label>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Primary</label>
                        <input type="color" value="#7c3aed" className="w-12 h-8 rounded border border-gray-300" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Secondary</label>
                        <input type="color" value="#2563eb" className="w-12 h-8 rounded border border-gray-300" />
                      </div>
                    </div>
                  </div>

                  <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Save Branding
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!['payment', 'site', 'account', 'domain'].includes(activeTab) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                Settings for {tabs.find(tab => tab.id === activeTab)?.label.toLowerCase()} will be implemented here.
              </p>
            </div>
          )}

      </div>

      {/* Domain Setup Modal */}
      {showDomainModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">🌐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Your Domain</h3>
                <p className="text-gray-600">Choose how your students will access your content</p>
              </div>

              {/* Business Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business/Course Name
                </label>
                <input
                  type="text"
                  value={domainData.businessName}
                  onChange={(e) => setDomainData({...domainData, businessName: e.target.value})}
                  placeholder="e.g., Web Dev Academy, Sarah's Courses"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Domain Options */}
              <div className="space-y-4 mb-8">
                {/* Subdomain Option */}
                <div 
                  onClick={() => setSelectedDomain('subdomain')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedDomain === 'subdomain' 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      selectedDomain === 'subdomain' 
                        ? 'border-purple-600 bg-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {selectedDomain === 'subdomain' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Trainr Subdomain</h4>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Get started instantly with a professional subdomain. Perfect for getting started quickly.
                      </p>
                      
                      {selectedDomain === 'subdomain' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Choose your subdomain
                            </label>
                            <div className="flex items-center">
                              <input
                                type="text"
                                value={domainData.subdomain}
                                onChange={(e) => setDomainData({...domainData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                                placeholder="yourname"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                              <span className="bg-gray-100 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                                .trainr.app
                              </span>
                            </div>
                            {domainData.subdomain && (
                              <p className={`text-xs mt-1 ${isSubdomainValid ? 'text-green-600' : 'text-red-600'}`}>
                                {isSubdomainValid 
                                  ? `✓ Available: ${domainData.subdomain}.trainr.app`
                                  : '✗ Must be 3+ characters, letters, numbers, and hyphens only'
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Instant setup
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          SSL included
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Free forever
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Domain Option */}
                <div 
                  onClick={() => setSelectedDomain('custom')}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedDomain === 'custom' 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      selectedDomain === 'custom' 
                        ? 'border-purple-600 bg-purple-600' 
                        : 'border-gray-300'
                    }`}>
                      {selectedDomain === 'custom' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Custom Domain</h4>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                          Professional
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Use your own domain for maximum branding and professionalism. Perfect for established businesses.
                      </p>
                      
                      {selectedDomain === 'custom' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your domain
                            </label>
                            <input
                              type="text"
                              value={domainData.customDomain}
                              onChange={(e) => setDomainData({...domainData, customDomain: e.target.value.toLowerCase()})}
                              placeholder="academy.yoursite.com or learn.yourdomain.com"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            {domainData.customDomain && (
                              <p className={`text-xs mt-1 ${isCustomDomainValid ? 'text-green-600' : 'text-red-600'}`}>
                                {isCustomDomainValid 
                                  ? '✓ Valid domain format'
                                  : '✗ Please enter a valid domain (e.g., learn.yoursite.com)'
                                }
                              </p>
                            )}
                          </div>
                          
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-2">Setup Instructions:</h5>
                            <ol className="text-sm text-blue-800 space-y-1">
                              <li>1. Add a CNAME record pointing to trainr.app</li>
                              <li>2. We'll verify and set up SSL automatically</li>
                              <li>3. Your domain will be ready in 24-48 hours</li>
                            </ol>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Your branding
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Professional look
                        </div>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          SSL included
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDomainModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDomainSetup}
                  disabled={!isFormValid}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedDomain === 'subdomain' ? 'Update Domain' : 'Setup Custom Domain'}
                </button>
              </div>

              {/* Domain Comparison */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Subdomain Benefits:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Instant setup (0 minutes)</li>
                      <li>• No technical configuration</li>
                      <li>• Free SSL certificate</li>
                      <li>• Can upgrade to custom domain later</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Custom Domain Benefits:</h5>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Your own branding</li>
                      <li>• Professional appearance</li>
                      <li>• Better for SEO</li>
                      <li>• Complete control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}