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
  ArrowLeft,
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
  Zap,
  Heart,
  Share2
} from 'lucide-react';

export default function Website() {
  const [activeTab, setActiveTab] = useState('design');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStudentView, setShowStudentView] = useState(false);

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

          {/* View as Student Button */}
          <button
            onClick={() => setShowStudentView(!showStudentView)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              showStudentView 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            {showStudentView ? 'Exit Student View' : 'View as Student'}
          </button>

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
        {/* Settings Sidebar - only show when not in student view */}
        {!showStudentView && (
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
        )}

        {/* Website Preview */}
        <div className={showStudentView ? "lg:col-span-4" : "lg:col-span-3"}>
          <div className="bg-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {showStudentView ? 'Student Course View' : 'Course Landing Page Preview'}
              </h2>
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
                  
                  {showStudentView ? (
                    /* Student Course View - Based on your provided design */
                    <div className="bg-gray-50 min-h-screen">
                      {/* Top Navigation Header */}
                      <div className="bg-white border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">T</span>
                              </div>
                              <span className="font-semibold text-gray-900">trainr</span>
                            </div>
                            <nav className="hidden md:flex items-center space-x-6">
                              <a href="#" className="text-purple-600 font-medium">Dashboard</a>
                              <a href="#" className="text-gray-600 hover:text-gray-900">Courses</a>
                              <a href="#" className="text-gray-600 hover:text-gray-900">Content Creator</a>
                              <a href="#" className="text-gray-600 hover:text-gray-900">Sales</a>
                              <a href="#" className="text-gray-600 hover:text-gray-900">Member Area</a>
                              <a href="#" className="text-gray-600 hover:text-gray-900">Website</a>
                            </nav>
                          </div>
                          <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium">
                            ADMIN
                          </button>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="max-w-6xl mx-auto px-6 py-8">
                        {/* Premium Course Badge */}
                        <div className="flex justify-center mb-6">
                          <div className="bg-purple-600 text-white px-6 py-2 rounded-full flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span className="font-medium">Premium Course</span>
                            <span className="bg-white/20 px-2 py-1 rounded text-xs">NEW</span>
                          </div>
                        </div>

                        {/* Course Title */}
                        <div className="text-center mb-8">
                          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {websiteData.courseTitle}
                          </h1>
                          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {websiteData.courseDescription}
                          </p>
                        </div>

                        {/* Course Stats */}
                        <div className="flex justify-center items-center space-x-8 mb-8">
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{websiteData.stats.students} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-700">{websiteData.stats.rating} rating</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{websiteData.stats.hours} hours</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-green-500" />
                            <span className="text-green-600 font-medium">FREE</span>
                          </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                          {/* Left Column - Video & Content */}
                          <div className="lg:col-span-2 space-y-8">
                            {/* Video Player */}
                            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                              <div className="aspect-video relative">
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
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                                    <div className="text-center text-white">
                                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-12 mb-6 mx-auto w-fit">
                                        <Play className="w-20 h-20 text-white ml-2" />
                                      </div>
                                      <h3 className="text-2xl font-bold mb-2">Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)</h3>
                                      <p className="text-white/80">▶ Edit Video</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="p-4 bg-gray-900">
                                <div className="flex items-center space-x-4">
                                  <img
                                    src={websiteData.instructorImage}
                                    alt={websiteData.instructorName}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <h4 className="text-white font-medium">{websiteData.instructorName}</h4>
                                    <p className="text-gray-400 text-sm">{websiteData.instructorTitle}</p>
                                  </div>
                                  <div className="flex-1"></div>
                                  <div className="flex items-center space-x-4 text-white">
                                    <button className="flex items-center space-x-1">
                                      <Heart className="w-5 h-5" />
                                      <span>Like</span>
                                    </button>
                                    <button className="flex items-center space-x-1">
                                      <Share2 className="w-5 h-5" />
                                      <span>Share</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* What You'll Learn */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Target className="w-6 h-6 mr-3 text-purple-600" />
                                What You'll Learn
                              </h2>
                              <div className="grid md:grid-cols-2 gap-4">
                                {websiteData.learningPoints.map((point, index) => (
                                  <div key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Exclusive Bonus */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                              <div className="flex items-center mb-4">
                                <Zap className="w-6 h-6 mr-3" />
                                <h3 className="text-xl font-bold">🎁 Exclusive Bonus Worth $497</h3>
                              </div>
                              <p className="mb-4">
                                Get a personalized one-on-one onboarding call with our expert instructors. We'll
                                create a custom learning roadmap just for you and answer all your questions.
                              </p>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Limited time offer</span>
                              </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <ArrowRight className="w-6 h-6 mr-3 text-blue-600" />
                                Next Steps
                              </h2>
                              <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Follow for exclusive content</h4>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                                        <Youtube className="w-4 h-4 mr-1" />
                                        YouTube
                                      </a>
                                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                                        <Instagram className="w-4 h-4 mr-1" />
                                        Instagram
                                      </a>
                                      <a href="#" className="text-blue-600 hover:underline flex items-center">
                                        <Twitter className="w-4 h-4 mr-1" />
                                        TikTok
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Newsletter for important updates</h4>
                                    <a href="#" className="text-green-600 hover:underline text-sm">trainr.com/newsletter</a>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Leave a testimonial. Win special prizes.</h4>
                                    <a href="#" className="text-purple-600 hover:underline text-sm">testimonial.trainr.com</a>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Course Resources */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Download className="w-6 h-6 mr-3 text-green-600" />
                                Course Resources
                              </h2>
                              <div className="grid md:grid-cols-2 gap-4">
                                {websiteData.resources.map((resource, index) => (
                                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-blue-600" />
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
                          </div>

                          {/* Right Column - Course Info & CTA */}
                          <div className="lg:col-span-1">
                            <div className="sticky top-8 space-y-6">
                              {/* Course Card */}
                              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                                <div className="text-center mb-6">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 mx-auto w-fit">
                                    <Zap className="w-12 h-12 text-white" />
                                  </div>
                                  <h3 className="text-xl font-bold mb-2">Web Development Bootcamp</h3>
                                  <p className="text-purple-100 text-sm">VERY DYNAMIC dev bootcamp</p>
                                </div>
                                <div className="text-center mb-6">
                                  <div className="text-3xl font-bold mb-1">
                                    <span className="line-through text-purple-200 text-lg mr-2">{websiteData.originalPrice}</span>
                                    {websiteData.coursePrice}
                                  </div>
                                  <p className="text-purple-100 text-sm">Limited Time Offer</p>
                                </div>
                                <button className="w-full bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                                  Join Course FREE
                                </button>
                                <p className="text-center text-xs text-purple-100 mt-2">⚡ Secure enrollment • No credit card required</p>
                              </div>

                              {/* What's Included */}
                              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4">What's Included:</h3>
                                <div className="space-y-3">
                                  {websiteData.features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                      <span className="text-lg">{feature.icon}</span>
                                      <div>
                                        <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                                        <p className="text-gray-600 text-xs">{feature.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Students & Reviews */}
                              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{websiteData.stats.students}</div>
                                    <div className="text-xs text-gray-600">Students</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{websiteData.stats.reviews.split(',')[0]}</div>
                                    <div className="text-xs text-gray-600">Online Now</div>
                                  </div>
                                </div>
                              </div>

                              {/* Instructor */}
                              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Your Instructor</h3>
                                <div className="flex items-start space-x-3 mb-4">
                                  <img
                                    src={websiteData.instructorImage}
                                    alt={websiteData.instructorName}
                                    className="w-12 h-12 rounded-full"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{websiteData.instructorName}</h4>
                                    <p className="text-sm text-gray-600">{websiteData.instructorTitle}</p>
                                    <div className="flex items-center mt-1">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      <span className="text-sm ml-1">{websiteData.stats.rating} • {websiteData.stats.reviews} students</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700">{websiteData.instructorBio}</p>
                              </div>

                              {/* 30-Day Guarantee */}
                              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <div className="text-center">
                                  <div className="bg-green-100 rounded-full p-4 mb-4 mx-auto w-fit">
                                    <Shield className="w-8 h-8 text-green-600" />
                                  </div>
                                  <h3 className="font-bold text-green-800 mb-2">30-Day Guarantee</h3>
                                  <p className="text-sm text-green-700">
                                    Not satisfied? Get your money back within 30 days. No questions asked.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-12 p-6 bg-gray-100 rounded-xl">
                          <h3 className="font-bold text-gray-900 mb-2">Important Disclaimer</h3>
                          <p className="text-sm text-gray-700">
                            Our courses are created for educational purposes only and does not guarantee any
                            financial success. Results vary and are dependent on individual effort and circumstances. The
                            testimonials on our website reflects experiences and there is no assurance you will achieve similar results.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Original Course Learning Interface Preview */
                    <div className="bg-gray-50 min-h-screen">
                      {/* Top Header */}
                      <div className="bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center text-gray-600 hover:text-gray-900 text-sm">
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back to Courses
                            </button>
                            <div>
                              <h1 className="text-lg font-bold text-gray-900">{websiteData.courseTitle}</h1>
                              <p className="text-sm text-gray-600">by {websiteData.instructorName}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">Lesson 1 of 12</div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">33%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        {/* Left Sidebar - Course Content */}
                        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
                          <div className="p-4">
                            <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
                            <div className="space-y-2">
                              {[
                                { title: 'Introduction to Web Development', duration: '15:30', completed: true, current: true },
                                { title: 'HTML Fundamentals', duration: '27:45', completed: true, current: false },
                                { title: 'CSS Styling and Layout', duration: '28:15', completed: true, current: false },
                                { title: 'JavaScript Basics', duration: '35:20', completed: false, current: false },
                                { title: 'Advanced JavaScript', duration: '42:10', completed: false, current: false },
                                { title: 'React Introduction', duration: '38:30', completed: false, current: false }
                              ].map((lesson, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                                    lesson.current
                                      ? 'bg-purple-50 border-purple-200'
                                      : 'hover:bg-gray-50 border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                      lesson.completed
                                        ? 'bg-green-100 text-green-600'
                                        : lesson.current
                                          ? 'bg-purple-100 text-purple-600'
                                          : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {lesson.completed ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <span>{index + 1}</span>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className={`font-medium text-sm ${
                                        lesson.current ? 'text-purple-900' : 'text-gray-900'
                                      }`}>
                                        {lesson.title}
                                      </h3>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs text-gray-600">{lesson.duration}</span>
                                        <Video className="w-3 h-3 text-gray-500" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="max-w-4xl mx-auto p-6">
                            {/* Lesson Header */}
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Introduction to Web Development</h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>Lesson 1</span>
                                  <span>•</span>
                                  <span>15:30</span>
                                  <span>•</span>
                                  <span>📺 YouTube</span>
                                </div>
                              </div>
                              <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors">
                                <Edit3 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Video Player */}
                            <div className="bg-black rounded-xl overflow-hidden mb-6 shadow-xl">
                              <div className="aspect-video relative">
                                {getEmbedUrl(websiteData.videoUrl) ? (
                                  <iframe
                                    src={getEmbedUrl(websiteData.videoUrl)}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Course Lesson"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center text-white">
                                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6">
                                        <Play className="w-16 h-16 text-white ml-2" />
                                      </div>
                                      <h3 className="text-2xl font-bold mb-2">Introduction to Web Development</h3>
                                      <p className="text-white/80">Watch the lesson video</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Lesson Overview */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Overview</h2>
                              <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                  Welcome to the complete web development bootcamp! In this lesson, we'll cover what you'll learn
                                  throughout the course and set up your development environment. This comprehensive course will take
                                  you from complete beginner to job-ready web developer.
                                </p>
                              </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between">
                              <button
                                disabled
                                className="flex items-center px-6 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                              >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Previous Lesson
                              </button>

                              <div className="flex items-center space-x-4">
                                <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center">
                                  <CheckCircle className="w-5 h-5 mr-2" />
                                  Mark as Complete
                                </button>

                                <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                  Next Lesson
                                  <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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