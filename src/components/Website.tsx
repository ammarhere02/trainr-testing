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
                  
                  {/* Course Landing Page - Matching Reference Design */}
                  <div className="min-h-screen bg-white">
                    
                    {/* Header */}
                    <header className="bg-white border-b border-gray-200 px-6 py-4">
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
                    <div className="max-w-7xl mx-auto px-6 py-8">
                      <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Left Column - Course Content */}
                        <div className="lg:col-span-2 space-y-6">
                          
                          {/* Course Header */}
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                Beginner
                              </span>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-600 text-sm">4.9 ⭐ (1,234 reviews)</span>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-600 text-sm">2,847 students</span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                              {websiteData.courseTitle}
                            </h1>
                            <p className="text-lg text-gray-600 mb-4">
                              {websiteData.courseDescription}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Created by {websiteData.instructorName}</span>
                              <span>•</span>
                              <span>Last updated 12/2023</span>
                              <span>•</span>
                              <span>English</span>
                            </div>
                          </div>

                          {/* Video Player */}
                          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
                            <div className="aspect-video">
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
                          </div>

                          {/* What You'll Learn */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                            <div className="grid md:grid-cols-2 gap-3">
                              {websiteData.learningPoints.map((point, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <CheckCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 text-sm">{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Course Features */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">This course includes:</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {websiteData.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                  <span className="text-lg">{feature.icon}</span>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{feature.title}</div>
                                    <div className="text-gray-600 text-xs">{feature.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exclusive Bonus Section */}
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
                            <div className="flex items-start space-x-4">
                              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                                <span className="text-2xl">🎁</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold mb-2">
                                  Exclusive Bonus Worth $497
                                </h3>
                                <p className="text-orange-100 leading-relaxed">
                                  Get a personalized one-on-one onboarding call with our expert instructors. 
                                  We'll create a custom learning roadmap just for you and answer all your questions.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Next Steps */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
                            <div className="space-y-4">
                              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                  1
                                </div>
                                <div>
                                  <p className="text-gray-700 font-medium mb-2">Follow for exclusive content:</p>
                                  <div className="flex space-x-3">
                                    <a href="#" className="bg-white px-3 py-1 rounded text-purple-600 text-sm border">YouTube</a>
                                    <a href="#" className="bg-white px-3 py-1 rounded text-purple-600 text-sm border">Instagram</a>
                                    <a href="#" className="bg-white px-3 py-1 rounded text-purple-600 text-sm border">TikTok</a>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                  2
                                </div>
                                <div>
                                  <p className="text-gray-700 font-medium mb-2">Newsletter for important updates:</p>
                                  <a href="#" className="bg-white px-3 py-1 rounded text-purple-600 text-sm border">trainr.com/newsletter</a>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Course Resources */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Resources</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                              {websiteData.resources.map((resource, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                  <FileText className="w-5 h-5 text-gray-600" />
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">{resource.name}</div>
                                    <div className="text-gray-600 text-xs">{resource.size}</div>
                                  </div>
                                  <Download className="w-4 h-4 text-gray-400" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Important Disclaimer */}
                          <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                            <h3 className="font-bold text-gray-900 text-lg mb-3">Important Disclaimer</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              Our course material is provided for educational purposes only and does not guarantee any financial success. 
                              Results vary and are dependent on individual effort and circumstances. The examples shown are not typical, 
                              and there is no assurance you will achieve similar results. Only hard work pays off!
                            </p>
                          </div>
                        </div>

                        {/* Right Column - Sticky Sidebar */}
                        <div className="lg:col-span-1">
                          <div className="sticky top-8 space-y-6">
                            
                            {/* Course Card */}
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                              {/* Course Header */}
                              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white text-center">
                                <h3 className="text-lg font-bold">{websiteData.courseTitle}</h3>
                                <p className="text-purple-100 text-sm">{websiteData.courseSubtitle}</p>
                              </div>

                              {/* Pricing */}
                              <div className="p-6 text-center border-b border-gray-100">
                                <div className="mb-4">
                                  <div className="text-3xl font-bold text-gray-900 mb-2">
                                    <span className="line-through text-lg text-gray-400 mr-2">{websiteData.originalPrice}</span>
                                    {websiteData.coursePrice}
                                  </div>
                                  <p className="text-green-600 font-medium text-sm">Limited Time Offer</p>
                                </div>
                                
                                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all mb-3">
                                  Enroll Now
                                </button>
                                
                                <p className="text-xs text-gray-600">
                                  🔒 Secure enrollment • 30-day money-back guarantee
                                </p>
                              </div>

                              {/* Course Includes */}
                              <div className="p-6 space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                                {[
                                  { icon: Clock, text: '40+ hours of content', color: 'text-purple-600' },
                                  { icon: BookOpen, text: '5 real-world projects', color: 'text-blue-600' },
                                  { icon: Award, text: 'Certificate of completion', color: 'text-green-600' },
                                  { icon: Zap, text: 'Lifetime access', color: 'text-yellow-600' },
                                  { icon: Users, text: 'Community support', color: 'text-red-600' },
                                  { icon: Target, text: 'Job placement help', color: 'text-indigo-600' }
                                ].map((feature, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                                    <span className="text-gray-700 text-sm">{feature.text}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Live Stats */}
                              <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div>
                                    <div className="text-xl font-bold text-purple-600">{websiteData.stats.students}</div>
                                    <div className="text-xs text-gray-600">Students</div>
                                  </div>
                                  <div>
                                    <div className="text-xl font-bold text-green-600">156</div>
                                    <div className="text-xs text-gray-600">Online Now</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Instructor Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                              <h4 className="font-semibold text-gray-900 mb-4">Your Instructor</h4>
                              <div className="flex items-center space-x-3 mb-4">
                                <img
                                  src={websiteData.instructorImage}
                                  alt={websiteData.instructorName}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className="font-bold text-gray-900 text-sm">{websiteData.instructorName}</h5>
                                  <p className="text-gray-600 text-xs">{websiteData.instructorTitle}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-600">{websiteData.stats.rating} • {websiteData.stats.students} students</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {websiteData.instructorBio}
                              </p>
                            </div>

                            {/* Money-Back Guarantee */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
                              <div className="text-center">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Shield className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold mb-2">30-Day Guarantee</h4>
                                <p className="text-green-100 text-xs leading-relaxed">
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