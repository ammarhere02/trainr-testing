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
  Star,
  Video,
  MessageCircle,
  Download,
  Share2,
  ExternalLink,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  ThumbsUp,
  Flag,
  Calendar,
  User,
  Mail,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Zap,
  Link2,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Camera,
  Mic,
  FileText,
  Image,
  Upload,
  QrCode,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react';

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState('collect');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRating, setFilterRating] = useState('all');

  const [newForm, setNewForm] = useState({
    name: '',
    title: '',
    description: '',
    questions: ['What specific results did you achieve?', 'How was your experience working with us?'],
    collectVideo: true,
    collectText: true,
    collectRating: true,
    requireApproval: true,
    customBranding: true,
    thankYouMessage: 'Thank you for your testimonial!',
    redirectUrl: '',
    collectEmail: true,
    collectCompany: true,
    collectWebsite: false,
    maxVideoLength: 120,
    theme: 'modern'
  });

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      type: 'video',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      company: 'Tech Startup Inc.',
      position: 'CEO',
      rating: 5,
      content: 'This course completely transformed my business. I went from struggling to make $1K/month to consistently hitting $10K+ months.',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      date: '2024-01-15',
      status: 'approved',
      featured: true,
      tags: ['business', 'growth', 'success'],
      formId: 1,
      location: 'San Francisco, CA',
      website: 'https://techstartup.com',
      socialProof: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: '@sarahjohnson'
      }
    },
    {
      id: 2,
      type: 'text',
      name: 'Mike Chen',
      email: 'mike@example.com',
      company: 'Design Agency',
      position: 'Creative Director',
      rating: 5,
      content: 'The strategies taught in this program are pure gold. My agency revenue increased by 300% in just 6 months.',
      date: '2024-01-12',
      status: 'approved',
      featured: false,
      tags: ['design', 'agency', 'revenue'],
      formId: 1,
      location: 'New York, NY',
      website: 'https://designagency.com'
    },
    {
      id: 3,
      type: 'video',
      name: 'Emma Davis',
      email: 'emma@example.com',
      company: 'Freelancer',
      position: 'Web Developer',
      rating: 4,
      content: 'Great course with practical examples. Helped me land my first $5K client within 2 weeks of completion.',
      videoUrl: 'https://example.com/video3.mp4',
      thumbnail: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      date: '2024-01-10',
      status: 'pending',
      featured: false,
      tags: ['freelancing', 'web-development'],
      formId: 2,
      location: 'Austin, TX'
    }
  ]);

  const [collectionForms, setCollectionForms] = useState([
    {
      id: 1,
      name: 'Web Development Course Feedback',
      title: 'Share Your Success Story',
      description: 'Help others by sharing your experience with our web development course',
      url: 'https://testimonial.trainr.app/web-dev-course',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://testimonial.trainr.app/web-dev-course',
      responses: 156,
      conversionRate: 23.5,
      avgRating: 4.8,
      status: 'active',
      created: '2024-01-01',
      settings: {
        collectVideo: true,
        collectText: true,
        collectRating: true,
        requireApproval: true,
        customBranding: true,
        maxVideoLength: 120,
        theme: 'modern'
      }
    },
    {
      id: 2,
      name: 'Business Coaching Program',
      title: 'Tell Us About Your Results',
      description: 'Share how our coaching program helped transform your business',
      url: 'https://testimonial.trainr.app/business-coaching',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://testimonial.trainr.app/business-coaching',
      responses: 89,
      conversionRate: 31.2,
      avgRating: 4.9,
      status: 'active',
      created: '2024-01-05',
      settings: {
        collectVideo: true,
        collectText: true,
        collectRating: true,
        requireApproval: false,
        customBranding: true,
        maxVideoLength: 180,
        theme: 'minimal'
      }
    }
  ]);

  const tabs = [
    { id: 'collect', label: 'Collect', icon: Plus },
    { id: 'manage', label: 'Manage', icon: Settings },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || testimonial.type === filterType;
    const matchesRating = filterRating === 'all' || testimonial.rating.toString() === filterRating;
    
    return matchesSearch && matchesType && matchesRating;
  });

  const handleCreateForm = () => {
    const newFormData = {
      id: Date.now(),
      name: newForm.name,
      title: newForm.title,
      description: newForm.description,
      url: `https://testimonial.trainr.app/${newForm.name.toLowerCase().replace(/\s+/g, '-')}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://testimonial.trainr.app/${newForm.name.toLowerCase().replace(/\s+/g, '-')}`,
      responses: 0,
      conversionRate: 0,
      avgRating: 0,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      settings: {
        collectVideo: newForm.collectVideo,
        collectText: newForm.collectText,
        collectRating: newForm.collectRating,
        requireApproval: newForm.requireApproval,
        customBranding: newForm.customBranding,
        maxVideoLength: newForm.maxVideoLength,
        theme: newForm.theme
      }
    };

    setCollectionForms(prev => [newFormData, ...prev]);
    setShowCreateForm(false);
    setNewForm({
      name: '',
      title: '',
      description: '',
      questions: ['What specific results did you achieve?', 'How was your experience working with us?'],
      collectVideo: true,
      collectText: true,
      collectRating: true,
      requireApproval: true,
      customBranding: true,
      thankYouMessage: 'Thank you for your testimonial!',
      redirectUrl: '',
      collectEmail: true,
      collectCompany: true,
      collectWebsite: false,
      maxVideoLength: 120,
      theme: 'modern'
    });
  };

  const handleApproveTestimonial = (id: number) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'approved' } : t
    ));
  };

  const handleRejectTestimonial = (id: number) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'rejected' } : t
    ));
  };

  const handleToggleFeatured = (id: number) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, featured: !t.featured } : t
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getEmbedCode = (type: string) => {
    const baseUrl = 'https://testimonial.trainr.app';
    switch (type) {
      case 'widget':
        return `<div id="trainr-testimonials" data-form="web-dev-course"></div>
<script src="${baseUrl}/widget.js"></script>`;
      case 'carousel':
        return `<div id="trainr-carousel" data-form="web-dev-course" data-autoplay="true"></div>
<script src="${baseUrl}/carousel.js"></script>`;
      case 'grid':
        return `<div id="trainr-grid" data-form="web-dev-course" data-columns="3"></div>
<script src="${baseUrl}/grid.js"></script>`;
      case 'single':
        return `<div id="trainr-single" data-testimonial="${selectedTestimonial?.id}"></div>
<script src="${baseUrl}/single.js"></script>`;
      default:
        return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-2">Collect, manage, and display customer testimonials</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Form
          </button>
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

      {/* Collect Tab */}
      {activeTab === 'collect' && (
        <div className="space-y-8">
          {/* Collection Forms */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionForms.map((form) => (
              <div key={form.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{form.name}</h3>
                    <p className="text-sm text-gray-600">{form.title}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {form.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-purple-600">{form.responses}</div>
                    <div className="text-xs text-gray-600">Responses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{form.conversionRate}%</div>
                    <div className="text-xs text-gray-600">Conversion</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-600 flex items-center justify-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {form.avgRating}
                    </div>
                    <div className="text-xs text-gray-600">Avg Rating</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={form.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(form.url)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={form.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                      title="Open form"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center">
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Code
                    </button>
                    <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                    <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center">
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Share Collection Link</h3>
                <p className="text-sm text-gray-600">Send direct links to customers via email or social media</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate QR Code</h3>
                <p className="text-sm text-gray-600">Create QR codes for offline testimonial collection</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Campaign</h3>
                <p className="text-sm text-gray-600">Send automated follow-up emails to collect testimonials</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Tab */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                </select>
                
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredTestimonials.length} of {testimonials.length} testimonials
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        testimonial.status === 'approved' ? 'bg-green-500' :
                        testimonial.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{testimonial.name}</span>
                      {testimonial.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {testimonial.position} at {testimonial.company}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {testimonial.type === 'video' ? (
                    <div className="relative mb-3">
                      <img
                        src={testimonial.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                        <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                          <Play className="w-5 h-5 text-purple-600" />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center w-fit">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Text
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    "{testimonial.content}"
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {testimonial.tags.map((tag) => (
                      <span key={tag} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(testimonial.date).toLocaleDateString()} • {testimonial.location}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4">
                  {testimonial.status === 'pending' ? (
                    <div className="flex space-x-2 mb-3">
                      <button
                        onClick={() => handleApproveTestimonial(testimonial.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectTestimonial(testimonial.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleFeatured(testimonial.id)}
                        className={`text-sm font-medium transition-colors flex items-center ${
                          testimonial.featured ? 'text-yellow-600' : 'text-gray-600 hover:text-yellow-600'
                        }`}
                      >
                        <Star className={`w-4 h-4 mr-1 ${testimonial.featured ? 'fill-current' : ''}`} />
                        {testimonial.featured ? 'Featured' : 'Feature'}
                      </button>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors" title="Share">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display Tab */}
      {activeTab === 'display' && (
        <div className="space-y-8">
          {/* Embed Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Embed Testimonials</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { type: 'widget', title: 'Widget', description: 'Floating testimonial widget', icon: Monitor },
                { type: 'carousel', title: 'Carousel', description: 'Sliding testimonials', icon: Play },
                { type: 'grid', title: 'Grid', description: 'Grid layout display', icon: BarChart3 },
                { type: 'single', title: 'Single', description: 'Individual testimonial', icon: User }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    setSelectedTestimonial(testimonials[0]);
                    setShowEmbedModal(true);
                  }}
                  className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                >
                  <option.icon className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof Wall */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Social Proof Wall</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Customize
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.filter(t => t.status === 'approved').slice(0, 6).map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-600">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Testimonials</p>
                  <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 12% from last month</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 0.2 from last month</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video Testimonials</p>
                  <p className="text-2xl font-bold text-gray-900">{testimonials.filter(t => t.type === 'video').length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 25% from last month</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">27.3%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600">↑ 5.2% from last month</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonials Over Time</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = testimonials.filter(t => t.rating === rating).length;
                  const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create Testimonial Collection Form</h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Name
                    </label>
                    <input
                      type="text"
                      value={newForm.name}
                      onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Web Development Course"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={newForm.title}
                      onChange={(e) => setNewForm({...newForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Share Your Success Story"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newForm.description}
                    onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Help others by sharing your experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Options
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Collect Video Testimonials</span>
                        <input
                          type="checkbox"
                          checked={newForm.collectVideo}
                          onChange={(e) => setNewForm({...newForm, collectVideo: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Collect Text Testimonials</span>
                        <input
                          type="checkbox"
                          checked={newForm.collectText}
                          onChange={(e) => setNewForm({...newForm, collectText: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Collect Star Ratings</span>
                        <input
                          type="checkbox"
                          checked={newForm.collectRating}
                          onChange={(e) => setNewForm({...newForm, collectRating: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Require Approval</span>
                        <input
                          type="checkbox"
                          checked={newForm.requireApproval}
                          onChange={(e) => setNewForm({...newForm, requireApproval: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Custom Branding</span>
                        <input
                          type="checkbox"
                          checked={newForm.customBranding}
                          onChange={(e) => setNewForm({...newForm, customBranding: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Collect Email</span>
                        <input
                          type="checkbox"
                          checked={newForm.collectEmail}
                          onChange={(e) => setNewForm({...newForm, collectEmail: e.target.checked})}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Video Length (seconds)
                    </label>
                    <select
                      value={newForm.maxVideoLength}
                      onChange={(e) => setNewForm({...newForm, maxVideoLength: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value={60}>60 seconds</option>
                      <option value={120}>120 seconds</option>
                      <option value={180}>180 seconds</option>
                      <option value={300}>300 seconds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={newForm.theme}
                      onChange={(e) => setNewForm({...newForm, theme: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                      <option value="classic">Classic</option>
                      <option value="colorful">Colorful</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateForm}
                  disabled={!newForm.name || !newForm.title}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Embed Code</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="widget">Floating Widget</option>
                    <option value="carousel">Carousel</option>
                    <option value="grid">Grid Layout</option>
                    <option value="single">Single Testimonial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embed Code
                  </label>
                  <textarea
                    rows={6}
                    value={getEmbedCode('widget')}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => copyToClipboard(getEmbedCode('widget'))}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    View Documentation
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowEmbedModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}