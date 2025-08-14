import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  BookOpen,
  Video,
  FileText,
  Globe,
  Lock,
  Settings,
  Share2,
  ExternalLink,
  Tag,
  Zap,
  Award,
  Target,
  PlayCircle,
  PauseCircle,
  Image,
  Upload,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Building,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  Import,
  Send,
  Percent,
  Gift,
  Activity
} from 'lucide-react';

export default function Sales() {
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'coupon' | 'contact'>('contact');

  // Coupons data
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      description: 'Welcome discount for new customers',
      usageLimit: 1000,
      usedCount: 234,
      expiryDate: '2024-03-31',
      isActive: true,
      revenue: 12450
    },
    {
      id: 2,
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      description: 'Fixed $20 discount',
      usageLimit: 500,
      usedCount: 89,
      expiryDate: '2024-02-29',
      isActive: true,
      revenue: 1780
    }
  ]);

  // Contacts data
  const [contacts, setContacts] = useState([
    {
      id: 1,
      firstName: 'Jack',
      lastName: 'Malik',
      email: 'allanknight2020@hotmail.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Startup Inc.',
      position: 'CEO',
      tags: ['customer', 'vip'],
      emailMarketing: false,
      lifetimeValue: 0.00,
      addedDate: '2025-07-15',
      lastActivity: null,
      source: 'website'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 987-6543',
      company: 'Design Agency',
      position: 'Creative Director',
      tags: ['lead', 'designer'],
      emailMarketing: true,
      lifetimeValue: 2500.00,
      addedDate: '2025-07-10',
      lastActivity: '2025-07-14',
      source: 'referral'
    }
  ]);

  // Payments data
  const [payments, setPayments] = useState([
    {
      id: 1,
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      product: 'Web Development Bootcamp',
      amount: 199,
      status: 'completed',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_1234567890'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      email: 'mike@example.com',
      product: 'React Masterclass',
      amount: 149,
      status: 'completed',
      date: '2024-01-14',
      paymentMethod: 'PayPal',
      transactionId: 'txn_0987654321'
    },
    {
      id: 3,
      customer: 'Emma Davis',
      email: 'emma@example.com',
      product: 'JavaScript Fundamentals',
      amount: 99,
      status: 'pending',
      date: '2024-01-13',
      paymentMethod: 'Credit Card',
      transactionId: 'txn_1122334455'
    }
  ]);

  const tabs = [
    { id: 'payments', label: 'Payments & Contacts', icon: CreditCard },
    { id: 'coupons', label: 'Coupons', icon: Tag },
  ];

  // Calculate stats
  const stats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalContacts: contacts.length,
    activeCoupons: coupons.filter(c => c.isActive && new Date(c.expiryDate) > new Date()).length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    conversionRate: 23.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
      case 'completed':
      case 'active':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
      case 'inactive':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & Revenue</h1>
          <p className="text-gray-600 mt-2">Manage your products, payments, coupons, and customer contacts</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button 
            onClick={() => {
              setCreateType('product');
              setShowCreateModal(true);
            }}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Customer</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Product</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Amount</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Method</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status);
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="font-medium text-gray-900">{payment.customer}</div>
                            <div className="text-sm text-gray-500">{payment.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{payment.product}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">${payment.amount}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {payment.status}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Download Receipt">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Customer Contacts</h2>
                <button 
                  onClick={() => {
                    setCreateType('contact');
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Company</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Lifetime Value</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Email Marketing</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Added</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                            <div className="text-sm text-gray-500">{contact.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{contact.company}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">${contact.lifetimeValue.toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contact.emailMarketing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.emailMarketing ? 'Subscribed' : 'Not subscribed'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {new Date(contact.addedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Code</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Type</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Value</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Usage</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Revenue</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Expires</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-medium">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(coupon.code)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {coupon.type === 'percentage' ? (
                            <Percent className="w-4 h-4 text-blue-600 mr-2" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                          )}
                          <span className="capitalize text-sm font-medium">{coupon.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">
                            <span className="font-medium">{coupon.usedCount}</span>
                            <span className="text-gray-500">/{coupon.usageLimit}</span>
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-green-600">${coupon.revenue.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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

          {/* Contacts Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Customer Contacts</h2>
                <button 
                  onClick={() => {
                    setCreateType('contact');
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Email</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Company</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Lifetime Value</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Email Marketing</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Added</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</div>
                            <div className="text-sm text-gray-500">{contact.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{contact.company}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">${contact.lifetimeValue.toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contact.emailMarketing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.emailMarketing ? 'Subscribed' : 'Not subscribed'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {new Date(contact.addedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Email">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What would you like to create?</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCreateType('coupon');
                    setActiveTab('coupons');
                    setShowCreateModal(false);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Tag className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">New Coupon</h4>
                      <p className="text-sm text-gray-600">Create a discount code</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setCreateType('contact');
                    setActiveTab('contacts');
                    setShowCreateModal(false);
                  }}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">New Contact</h4>
                      <p className="text-sm text-gray-600">Add a customer contact</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}