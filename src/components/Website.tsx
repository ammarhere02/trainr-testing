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
                  
                  {/* Course Learning Interface Mockup - Based on Reference Image */}
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