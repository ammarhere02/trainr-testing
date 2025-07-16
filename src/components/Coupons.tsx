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
  Percent,
  Tag,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  Gift,
  Target,
  Zap
} from 'lucide-react';

export default function Coupons() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState<number[]>([]);
  
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    minOrderValue: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true,
    isPublic: true,
    applicableProducts: 'all'
  });

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME50',
      type: 'percentage',
      value: 50,
      description: 'Welcome discount for new customers',
      minOrderValue: 100,
      maxDiscount: 50,
      usageLimit: 1000,
      usedCount: 234,
      expiryDate: '2024-03-31',
      isActive: true,
      isPublic: true,
      createdDate: '2024-01-15',
      revenue: 12450,
      applicableProducts: 'all'
    },
    {
      id: 2,
      code: 'SAVE20',
      type: 'fixed',
      value: 20,
      description: 'Fixed $20 discount',
      minOrderValue: 50,
      maxDiscount: null,
      usageLimit: 500,
      usedCount: 89,
      expiryDate: '2024-02-29',
      isActive: true,
      isPublic: false,
      createdDate: '2024-01-10',
      revenue: 1780,
      applicableProducts: 'courses'
    },
    {
      id: 3,
      code: 'EXPIRED10',
      type: 'percentage',
      value: 10,
      description: 'Expired promotional code',
      minOrderValue: 0,
      maxDiscount: 25,
      usageLimit: 200,
      usedCount: 156,
      expiryDate: '2024-01-20',
      isActive: false,
      isPublic: true,
      createdDate: '2023-12-01',
      revenue: 890,
      applicableProducts: 'all'
    },
    {
      id: 4,
      code: 'BLACKFRIDAY',
      type: 'percentage',
      value: 75,
      description: 'Black Friday mega sale',
      minOrderValue: 200,
      maxDiscount: 150,
      usageLimit: 2000,
      usedCount: 1847,
      expiryDate: '2024-11-30',
      isActive: true,
      isPublic: true,
      createdDate: '2024-01-01',
      revenue: 45670,
      applicableProducts: 'all'
    }
  ]);

  // Filter coupons based on search and filters
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && coupon.isActive && new Date(coupon.expiryDate) > new Date()) ||
                         (filterStatus === 'expired' && new Date(coupon.expiryDate) <= new Date()) ||
                         (filterStatus === 'inactive' && !coupon.isActive);
    
    const matchesType = filterType === 'all' || coupon.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get coupon status
  const getCouponStatus = (coupon: any) => {
    if (!coupon.isActive) return 'inactive';
    if (new Date(coupon.expiryDate) <= new Date()) return 'expired';
    if (coupon.usedCount >= coupon.usageLimit) return 'limit_reached';
    return 'active';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'expired':
        return 'bg-red-100 text-red-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      case 'limit_reached':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle;
      case 'expired':
        return XCircle;
      case 'inactive':
        return EyeOff;
      case 'limit_reached':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  // Handle create coupon
  const handleCreateCoupon = () => {
    const couponData = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type,
      value: parseFloat(newCoupon.value),
      description: newCoupon.description,
      minOrderValue: parseFloat(newCoupon.minOrderValue) || 0,
      maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : null,
      usageLimit: parseInt(newCoupon.usageLimit) || 1000,
      usedCount: 0,
      expiryDate: newCoupon.expiryDate,
      isActive: newCoupon.isActive,
      isPublic: newCoupon.isPublic,
      createdDate: new Date().toISOString().split('T')[0],
      revenue: 0,
      applicableProducts: newCoupon.applicableProducts
    };

    setCoupons(prev => [couponData, ...prev]);
    setShowCreateModal(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      minOrderValue: '',
      maxDiscount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true,
      isPublic: true,
      applicableProducts: 'all'
    });
  };

  // Toggle coupon active status
  const toggleCouponStatus = (couponId: number) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
    ));
  };

  // Delete coupon
  const deleteCoupon = (couponId: number) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
    }
  };

  // Copy coupon code
  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied to clipboard!');
  };

  // Generate random coupon code
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: result }));
  };

  // Calculate stats
  const stats = {
    total: coupons.length,
    active: coupons.filter(c => getCouponStatus(c) === 'active').length,
    totalRevenue: coupons.reduce((sum, c) => sum + c.revenue, 0),
    totalUsage: coupons.reduce((sum, c) => sum + c.usedCount, 0)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons & Discounts</h1>
          <p className="text-gray-600 mt-2">Create and manage discount codes for your courses</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredCoupons.length} of {coupons.length} coupons
            </span>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
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
                <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCoupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                const StatusIcon = getStatusIcon(status);
                
                return (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-medium">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => copyCouponCode(coupon.code)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        {!coupon.isPublic && (
                          <EyeOff className="w-4 h-4 text-gray-400" title="Private coupon" />
                        )}
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
                        <span className="capitalize text-sm font-medium">
                          {coupon.type}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-medium">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </div>
                      {coupon.minOrderValue > 0 && (
                        <div className="text-xs text-gray-500">
                          Min: ${coupon.minOrderValue}
                        </div>
                      )}
                      {coupon.maxDiscount && (
                        <div className="text-xs text-gray-500">
                          Max: ${coupon.maxDiscount}
                        </div>
                      )}
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
                      <div className="font-medium text-green-600">
                        ${coupon.revenue.toLocaleString()}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(coupon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.replace('_', ' ')}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`p-1 rounded transition-colors ${
                            coupon.isActive 
                              ? 'text-gray-400 hover:text-red-600' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteCoupon(coupon.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Coupon</h3>
              
              <div className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      placeholder="SAVE20"
                    />
                    <button
                      onClick={generateCouponCode}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({...newCoupon, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of the coupon"
                  />
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({...newCoupon, value: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={newCoupon.type === 'percentage' ? '20' : '10'}
                    />
                  </div>
                </div>

                {/* Conditions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Order Value ($)
                    </label>
                    <input
                      type="number"
                      value={newCoupon.minOrderValue}
                      onChange={(e) => setNewCoupon({...newCoupon, minOrderValue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  {newCoupon.type === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Discount ($)
                      </label>
                      <input
                        type="number"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="No limit"
                      />
                    </div>
                  )}
                </div>

                {/* Usage and Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Applicable Products */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable To
                  </label>
                  <select
                    value={newCoupon.applicableProducts}
                    onChange={(e) => setNewCoupon({...newCoupon, applicableProducts: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Products</option>
                    <option value="courses">Courses Only</option>
                    <option value="memberships">Memberships Only</option>
                    <option value="specific">Specific Products</option>
                  </select>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Active</span>
                      <p className="text-xs text-gray-500">Coupon can be used immediately</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newCoupon.isActive}
                      onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Public</span>
                      <p className="text-xs text-gray-500">Visible in public coupon lists</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newCoupon.isPublic}
                      onChange={(e) => setNewCoupon({...newCoupon, isPublic: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCoupon}
                  disabled={!newCoupon.code || !newCoupon.value || !newCoupon.expiryDate}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}