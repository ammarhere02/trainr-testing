import React, { useState } from 'react';
import { 
  Globe, 
  Eye, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Link2, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  Video, 
  Star, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  Copy,
  ExternalLink,
  CheckCircle,
  Camera,
  FileText,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin
} from 'lucide-react';

export default function Website() {
  const [activeTab, setActiveTab] = useState('design');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [websiteData, setWebsiteData] = useState({
    // Hero Section
    heroTitle: 'Transform Your Career with Expert-Led Courses',
    heroSubtitle: 'Join thousands of students learning cutting-edge skills from industry professionals',
    heroImage: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    ctaText: 'Start Learning Today',
    
    // About Section
    aboutTitle: 'About Dr. Angela Yu',
    aboutDescription: 'With over 10 years of experience in web development and education, I\'ve helped thousands of students launch successful careers in tech.',
    instructorImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    
    // Stats
    stats: {
      students: '50,000+',
      courses: '12',
      rating: '4.9',
      reviews: '15,000+'
    },
    
    // Branding
    primaryColor: '#7c3aed',
    secondaryColor: '#3b82f6',
    logoUrl: '',
    businessName: 'Web Development Academy',
    
    // Contact
    email: 'hello@webdevacademy.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    
    // Social Links
    socialLinks: {
      facebook: 'https://facebook.com/webdevacademy',
      twitter: 'https://twitter.com/webdevacademy',
      instagram: 'https://instagram.com/webdevacademy',
      youtube: 'https://youtube.com/@webdevacademy',
      linkedin: 'https://linkedin.com/company/webdevacademy'
    },
    
    // SEO
    metaTitle: 'Web Development Academy - Learn to Code',
    metaDescription: 'Master web development with expert-led courses. Join 50,000+ students learning HTML, CSS, JavaScript, React, and more.',
    
    // Custom CSS
    customCSS: '',
    
    // Domain
    customDomain: '',
    subdomain: 'webdevacademy'
  });

  const [courses] = useState([
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 199,
      students: 12547,
      rating: 4.8,
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and testing.',
      image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 149,
      students: 8934,
      rating: 4.9,
      level: 'Advanced'
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals',
      description: 'Build a solid foundation in JavaScript with practical projects and real-world examples.',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 99,
      students: 15623,
      rating: 4.7,
      level: 'Beginner'
    }
  ]);

  const tabs = [
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'domain', label: 'Domain', icon: Link2 }
  ];

  const handleSave = () => {
    // Save website data
    localStorage.setItem('instructor-website-data', JSON.stringify(websiteData));
    setIsEditing(false);
    console.log('Website saved:', websiteData);
  };

  const handlePublish = () => {
    // Publish website
    console.log('Publishing website...');
    alert('Website published successfully!');
  };

  const copyWebsiteUrl = () => {
    const url = websiteData.customDomain || `https://trainr.app/${websiteData.subdomain}`;
    navigator.clipboard.writeText(url);
    alert('Website URL copied to clipboard!');
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600 mt-2">Create and customize your public-facing website</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={copyWebsiteUrl}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy URL
          </button>
          <a
            href={websiteData.customDomain || `https://trainr.app/${websiteData.subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </a>
          <button
            onClick={handlePublish}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Website Settings</h2>
            
            {/* Tabs */}
            <div className="space-y-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={websiteData.primaryColor}
                      onChange={(e) => setWebsiteData({...websiteData, primaryColor: e.target.value})}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={websiteData.primaryColor}
                      onChange={(e) => setWebsiteData({...websiteData, primaryColor: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={websiteData.secondaryColor}
                      onChange={(e) => setWebsiteData({...websiteData, secondaryColor: e.target.value})}
                      className="w-12 h-8 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={websiteData.secondaryColor}
                      onChange={(e) => setWebsiteData({...websiteData, secondaryColor: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={websiteData.heroTitle}
                    onChange={(e) => setWebsiteData({...websiteData, heroTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    value={websiteData.heroSubtitle}
                    onChange={(e) => setWebsiteData({...websiteData, heroSubtitle: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Description
                  </label>
                  <textarea
                    value={websiteData.aboutDescription}
                    onChange={(e) => setWebsiteData({...websiteData, aboutDescription: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={websiteData.metaTitle}
                    onChange={(e) => setWebsiteData({...websiteData, metaTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={websiteData.metaDescription}
                    onChange={(e) => setWebsiteData({...websiteData, metaDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{websiteData.metaDescription.length}/160 characters</p>
                </div>
              </div>
            )}

            {/* Domain Tab */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subdomain
                  </label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                      trainr.app/
                    </span>
                    <input
                      type="text"
                      value={websiteData.subdomain}
                      onChange={(e) => setWebsiteData({...websiteData, subdomain: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain
                  </label>
                  <input
                    type="text"
                    value={websiteData.customDomain}
                    onChange={(e) => setWebsiteData({...websiteData, customDomain: e.target.value})}
                    placeholder="www.yoursite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Connect your own domain</p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Website Preview */}
        <div className="lg:col-span-3">
          <div className="bg-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Website Preview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {websiteData.customDomain || `trainr.app/${websiteData.subdomain}`}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex justify-center">
              <div className={`${getPreviewWidth()} transition-all duration-300`}>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  {/* Website Header */}
                  <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: websiteData.primaryColor }}
                        >
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">{websiteData.businessName}</span>
                      </div>
                      <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-gray-900">Courses</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                        <button 
                          className="text-white px-4 py-2 rounded-lg font-medium"
                          style={{ backgroundColor: websiteData.primaryColor }}
                        >
                          Enroll Now
                        </button>
                      </nav>
                    </div>
                  </header>

                  {/* Hero Section */}
                  <section className="relative py-20 px-6" style={{ 
                    background: `linear-gradient(135deg, ${websiteData.primaryColor}15, ${websiteData.secondaryColor}15)` 
                  }}>
                    <div className="max-w-4xl mx-auto text-center">
                      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        {websiteData.heroTitle}
                      </h1>
                      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {websiteData.heroSubtitle}
                      </p>
                      <button 
                        className="text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                        style={{ backgroundColor: websiteData.primaryColor }}
                      >
                        {websiteData.ctaText}
                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                      </button>
                    </div>
                  </section>

                  {/* Stats Section */}
                  <section className="py-16 px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                          <div className="text-3xl font-bold" style={{ color: websiteData.primaryColor }}>
                            {websiteData.stats.students}
                          </div>
                          <div className="text-gray-600">Students</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold" style={{ color: websiteData.primaryColor }}>
                            {websiteData.stats.courses}
                          </div>
                          <div className="text-gray-600">Courses</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold flex items-center justify-center" style={{ color: websiteData.primaryColor }}>
                            <Star className="w-6 h-6 mr-1 fill-current" />
                            {websiteData.stats.rating}
                          </div>
                          <div className="text-gray-600">Rating</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold" style={{ color: websiteData.primaryColor }}>
                            {websiteData.stats.reviews}
                          </div>
                          <div className="text-gray-600">Reviews</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* About Section */}
                  <section className="py-16 px-6 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                      <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            {websiteData.aboutTitle}
                          </h2>
                          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            {websiteData.aboutDescription}
                          </p>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-700">Industry Expert</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-700">Certified Instructor</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <img
                            src={websiteData.instructorImage}
                            alt="Instructor"
                            className="w-64 h-64 rounded-2xl mx-auto object-cover shadow-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Courses Section */}
                  <section className="py-16 px-6 bg-white">
                    <div className="max-w-6xl mx-auto">
                      <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                        <p className="text-xl text-gray-600">Master new skills with our comprehensive courses</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                          <div key={course.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                  course.level === 'Advanced' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {course.level}
                                </span>
                                <span className="text-2xl font-bold" style={{ color: websiteData.primaryColor }}>
                                  ${course.price}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                              <p className="text-gray-600 mb-4">{course.description}</p>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{course.students.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{course.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                className="w-full text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                                style={{ backgroundColor: websiteData.primaryColor }}
                              >
                                Enroll Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Contact Section */}
                  <section className="py-16 px-6" style={{ 
                    background: `linear-gradient(135deg, ${websiteData.primaryColor}10, ${websiteData.secondaryColor}10)` 
                  }}>
                    <div className="max-w-4xl mx-auto text-center">
                      <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
                      <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: websiteData.primaryColor }}
                          >
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                          <p className="text-gray-600">{websiteData.email}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: websiteData.primaryColor }}
                          >
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                          <p className="text-gray-600">{websiteData.phone}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: websiteData.primaryColor }}
                          >
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                          <p className="text-gray-600">{websiteData.location}</p>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4 mt-8">
                        {websiteData.socialLinks.facebook && (
                          <a href={websiteData.socialLinks.facebook} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Facebook className="w-5 h-5" style={{ color: websiteData.primaryColor }} />
                          </a>
                        )}
                        {websiteData.socialLinks.twitter && (
                          <a href={websiteData.socialLinks.twitter} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Twitter className="w-5 h-5" style={{ color: websiteData.primaryColor }} />
                          </a>
                        )}
                        {websiteData.socialLinks.instagram && (
                          <a href={websiteData.socialLinks.instagram} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Instagram className="w-5 h-5" style={{ color: websiteData.primaryColor }} />
                          </a>
                        )}
                        {websiteData.socialLinks.youtube && (
                          <a href={websiteData.socialLinks.youtube} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Youtube className="w-5 h-5" style={{ color: websiteData.primaryColor }} />
                          </a>
                        )}
                        {websiteData.socialLinks.linkedin && (
                          <a href={websiteData.socialLinks.linkedin} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <Linkedin className="w-5 h-5" style={{ color: websiteData.primaryColor }} />
                          </a>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <footer className="bg-gray-900 text-white py-12 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: websiteData.primaryColor }}
                        >
                          <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="text-xl font-bold">{websiteData.businessName}</span>
                      </div>
                      <p className="text-gray-400 mb-6">{websiteData.aboutDescription}</p>
                      <div className="flex justify-center space-x-6 text-sm">
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white">Support</a>
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <p className="text-gray-400">© 2024 {websiteData.businessName}. All rights reserved. Powered by Trainr.</p>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Website Status</h3>
                  <p className="text-sm text-green-600">Published & Live</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Monthly Visitors</h3>
                  <p className="text-sm text-gray-600">12,547 visitors</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Course Enrollments</h3>
                  <p className="text-sm text-gray-600">234 this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}