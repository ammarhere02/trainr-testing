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
  Linkedin,
  Play,
  Clock,
  Award,
  Download,
  Shield,
  Target,
  Zap
} from 'lucide-react';

export default function Website() {
  const [activeTab, setActiveTab] = useState('design');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [websiteData, setWebsiteData] = useState({
    // Course Info
    courseTitle: 'Complete Web Development Bootcamp',
    courseSubtitle: 'by Dr. Angela Yu',
    courseDescription: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    coursePrice: 'FREE',
    originalPrice: '$199',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    
    // What You'll Learn
    learningPoints: [
      'Build responsive websites with HTML5 and CSS3',
      'Master JavaScript ES6+ and modern frameworks',
      'Create dynamic web applications with React',
      'Develop backend APIs with Node.js and Express',
      'Work with databases using MongoDB',
      'Deploy applications to production servers'
    ],
    
    // Course Features
    features: [
      { icon: '🎥', title: '40+ hours of content', description: 'Comprehensive video lessons' },
      { icon: '💻', title: '5 real-world projects', description: 'Build portfolio-worthy applications' },
      { icon: '🏆', title: 'Certificate of completion', description: 'Showcase your achievement' },
      { icon: '⚡', title: 'Lifetime access', description: 'Learn at your own pace' },
      { icon: '👥', title: 'Community support', description: 'Connect with fellow learners' },
      { icon: '🚀', title: 'Job placement help', description: 'Career guidance included' }
    ],
    
    // Course Resources
    resources: [
      { name: 'Course Workbook.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Project Templates.zip', size: '15.7 MB', type: 'zip' },
      { name: 'Resource Links.txt', size: '1.2 KB', type: 'txt' },
      { name: 'Cheat Sheets.pdf', size: '3.1 MB', type: 'pdf' }
    ],
    
    // Instructor Info
    instructorName: 'Dr. Angela Yu',
    instructorTitle: 'Lead Developer & Instructor',
    instructorImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    instructorBio: 'Former lead developer at major tech companies. Passionate about teaching and helping students launch successful careers in web development.',
    
    // Stats
    stats: {
      students: '2,847',
      rating: '4.9',
      reviews: '1,234',
      hours: '40+'
    },
    
    // Branding
    primaryColor: '#8b5cf6',
    secondaryColor: '#3b82f6',
    logoUrl: '',
    businessName: 'Web Development Academy',
    
    // Domain
    customDomain: '',
    subdomain: 'webdevacademy'
  });

  const tabs = [
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'domain', label: 'Domain', icon: Link2 }
  ];

  const handleSave = () => {
    localStorage.setItem('instructor-website-data', JSON.stringify(websiteData));
    setIsEditing(false);
    console.log('Website saved:', websiteData);
  };

  const handlePublish = () => {
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

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600 mt-2">Create and customize your course landing page</p>
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

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={websiteData.courseTitle}
                    onChange={(e) => setWebsiteData({...websiteData, courseTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description
                  </label>
                  <textarea
                    value={websiteData.courseDescription}
                    onChange={(e) => setWebsiteData({...websiteData, courseDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={websiteData.videoUrl}
                    onChange={(e) => setWebsiteData({...websiteData, videoUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      value={websiteData.coursePrice}
                      onChange={(e) => setWebsiteData({...websiteData, coursePrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <input
                      type="text"
                      value={websiteData.originalPrice}
                      onChange={(e) => setWebsiteData({...websiteData, originalPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

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
                    value={websiteData.courseTitle}
                    onChange={(e) => setWebsiteData({...websiteData, courseTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={websiteData.courseDescription}
                    onChange={(e) => setWebsiteData({...websiteData, courseDescription: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                  />
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
              <h2 className="text-lg font-semibold text-gray-900">Course Landing Page Preview</h2>
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
                  
                  {/* Course Landing Page */}
                  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
                    
                    {/* Header */}
                    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                          </div>
                          <span className="text-xl font-bold text-gray-900">trainr</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="text-gray-600 hover:text-gray-900">Courses</button>
                          <button className="text-gray-600 hover:text-gray-900">About</button>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium">
                            Sign In
                          </button>
                        </div>
                      </div>
                    </header>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-6 py-12">
                      <div className="grid lg:grid-cols-3 gap-12">
                        
                        {/* Left Column - Course Content */}
                        <div className="lg:col-span-2 space-y-8">
                          
                          {/* Course Header */}
                          <div className="text-center lg:text-left">
                            <div className="inline-flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                              <Award className="w-4 h-4 mr-2" />
                              Premium Course
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                              {websiteData.courseTitle}
                            </h1>
                            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                              {websiteData.courseDescription}
                            </p>
                            
                            {/* Course Stats */}
                            <div className="flex flex-wrap items-center gap-6 mb-8">
                              <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                <span className="font-medium text-gray-900">{websiteData.stats.students} students</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="font-medium text-gray-900">{websiteData.stats.rating} rating</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">{websiteData.stats.hours} hours</span>
                              </div>
                            </div>
                          </div>

                          {/* Video Player */}
                          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="aspect-video bg-black">
                              {getEmbedUrl(websiteData.videoUrl) ? (
                                <iframe
                                  src={getEmbedUrl(websiteData.videoUrl)}
                                  className="w-full h-full"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title="Course Preview"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center text-white">
                                    <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                                    <p className="text-lg">Course Preview Video</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Video Info */}
                            <div className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={websiteData.instructorImage}
                                    alt={websiteData.instructorName}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{websiteData.instructorName}</h4>
                                    <p className="text-sm text-gray-600">{websiteData.instructorTitle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                                    <span className="text-sm">1.2K</span>
                                  </button>
                                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                                    <span className="text-sm">Share</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* What You'll Learn */}
                          <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {websiteData.learningPoints.map((point, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="bg-purple-100 rounded-full p-1 mt-1">
                                    <CheckCircle className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <span className="text-gray-700">{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Course Features */}
                          <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Features</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                              {websiteData.features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                                  <div className="text-2xl">{feature.icon}</div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Course Resources */}
                          <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Resources</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {websiteData.resources.map((resource, index) => (
                                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                                    <p className="text-sm text-gray-600">{resource.size}</p>
                                  </div>
                                  <Download className="w-5 h-5 text-gray-400" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Instructor Bio */}
                          <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Your Instructor</h2>
                            <div className="flex items-start space-x-6">
                              <img
                                src={websiteData.instructorImage}
                                alt={websiteData.instructorName}
                                className="w-24 h-24 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{websiteData.instructorName}</h3>
                                <p className="text-purple-600 font-medium mb-4">{websiteData.instructorTitle}</p>
                                <p className="text-gray-700 leading-relaxed">{websiteData.instructorBio}</p>
                                <div className="flex items-center space-x-4 mt-4">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{websiteData.stats.rating} • {websiteData.stats.reviews} reviews</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{websiteData.stats.students} students</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Guarantee Section */}
                          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8" />
                              </div>
                              <h3 className="text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h3>
                              <p className="text-green-100 leading-relaxed">
                                Not satisfied with the course? Get your money back within 30 days. 
                                No questions asked. Your success is our priority.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Sticky Sidebar */}
                        <div className="lg:col-span-1">
                          <div className="sticky top-8 space-y-6">
                            
                            {/* Course Card */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                              {/* Course Header */}
                              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8" />
                                  </div>
                                  <h3 className="text-xl font-bold mb-2">{websiteData.courseTitle}</h3>
                                  <p className="text-purple-100 text-sm">{websiteData.courseSubtitle}</p>
                                </div>
                              </div>

                              {/* Pricing */}
                              <div className="p-6 text-center border-b border-gray-100">
                                <div className="mb-4">
                                  <div className="text-4xl font-bold text-gray-900 mb-2">
                                    <span className="line-through text-2xl text-gray-400 mr-2">{websiteData.originalPrice}</span>
                                    {websiteData.coursePrice}
                                  </div>
                                  <p className="text-green-600 font-medium">Limited Time Offer</p>
                                </div>
                                
                                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4">
                                  Enroll Now
                                </button>
                                
                                <p className="text-xs text-gray-600">
                                  🔒 Secure enrollment • 30-day money-back guarantee
                                </p>
                              </div>

                              {/* Course Includes */}
                              <div className="p-6 space-y-4">
                                <h4 className="font-semibold text-gray-900 mb-4">This course includes:</h4>
                                {[
                                  { icon: Clock, text: '40+ hours of content', color: 'text-purple-600' },
                                  { icon: BookOpen, text: '5 real-world projects', color: 'text-blue-600' },
                                  { icon: Award, text: 'Certificate of completion', color: 'text-green-600' },
                                  { icon: Zap, text: 'Lifetime access', color: 'text-yellow-600' },
                                  { icon: Users, text: 'Community support', color: 'text-red-600' },
                                  { icon: Target, text: 'Job placement help', color: 'text-indigo-600' }
                                ].map((feature, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <div className="bg-gray-50 rounded-lg p-2">
                                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{feature.text}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Live Stats */}
                              <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-purple-600">{websiteData.stats.students}</div>
                                    <div className="text-sm text-gray-600">Students</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-600">156</div>
                                    <div className="text-sm text-gray-600">Online Now</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Instructor Card */}
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                              <h4 className="font-semibold text-gray-900 mb-4">Your Instructor</h4>
                              <div className="flex items-center space-x-4 mb-4">
                                <img
                                  src={websiteData.instructorImage}
                                  alt={websiteData.instructorName}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className="font-bold text-gray-900">{websiteData.instructorName}</h5>
                                  <p className="text-sm text-gray-600">{websiteData.instructorTitle}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600">{websiteData.stats.rating} • {websiteData.stats.students} students</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {websiteData.instructorBio}
                              </p>
                            </div>

                            {/* Money-Back Guarantee */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Shield className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">30-Day Guarantee</h4>
                                <p className="text-green-100 text-sm leading-relaxed">
                                  Not satisfied? Get your money back within 30 days. 
                                  No questions asked.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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