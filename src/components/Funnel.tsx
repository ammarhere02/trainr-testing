import React, { useState } from 'react';
import { 
  Play, 
  Users, 
  Globe, 
  DollarSign, 
  User, 
  Lock, 
  CheckCircle, 
  Gift,
  Star,
  Clock,
  Target,
  TrendingUp,
  Award,
  Zap,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  FileText,
  Upload,
  Link2,
  ExternalLink,
  Calendar,
  BookOpen,
  MessageCircle,
  Heart,
  Share2,
  Download,
  ArrowRight,
  Sparkles,
  Shield,
  Rocket,
  Crown
} from 'lucide-react';

interface FunnelProps {
  userRole?: 'educator' | 'student';
}

export default function Funnel({ userRole = 'student' }: FunnelProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingBenefits, setIsEditingBenefits] = useState(false);
  const [isEditingActionItems, setIsEditingActionItems] = useState(false);
  const [isEditingDisclaimer, setIsEditingDisclaimer] = useState(false);
  const [isEditingResources, setIsEditingResources] = useState(false);
  
  const [title, setTitle] = useState('Complete Web Development Bootcamp');
  const [tempTitle, setTempTitle] = useState(title);
  const [description, setDescription] = useState('Learn how to build modern web applications from scratch with React, Node.js, and MongoDB');
  const [tempDescription, setTempDescription] = useState(description);
  const [videoUrl, setVideoUrl] = useState(() => {
    const saved = localStorage.getItem('funnel-video-url');
    return saved || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  });
  const [tempVideoUrl, setTempVideoUrl] = useState(videoUrl);
  
  const [benefits, setBenefits] = useState([
    'Master React, Node.js, and MongoDB',
    'Build 5+ real-world projects for your portfolio',
    'Learn modern JavaScript ES6+ features',
    'Understand database design and API development',
    'Deploy applications to production',
    'Get lifetime access to course materials'
  ]);
  const [tempBenefits, setTempBenefits] = useState(benefits.join('\n'));

  const [actionItems, setActionItems] = useState([
    {
      id: 1,
      text: 'Follow for exclusive content: ',
      links: [
        { text: 'YouTube', url: 'https://youtube.com/@trainr' },
        { text: 'Instagram', url: 'https://instagram.com/trainr' },
        { text: 'TikTok', url: 'https://tiktok.com/@trainr' }
      ]
    },
    {
      id: 2,
      text: 'Newsletter for important updates: ',
      links: [
        { text: 'trainr.com/newsletter', url: 'https://trainr.com/newsletter' }
      ]
    },
    {
      id: 3,
      text: 'Leave a testimonial. Win special prizes: ',
      links: [
        { text: 'testimonial.trainr.com', url: 'https://testimonial.trainr.com' }
      ]
    }
  ]);

  const [disclaimer, setDisclaimer] = useState('Our course material is provided for educational purposes only and does not guarantee any financial success. Results vary and are dependent on individual effort and circumstances. The examples shown are not typical, and there is no assurance you will achieve similar results. Only hard work pays off!');
  const [tempDisclaimer, setTempDisclaimer] = useState(disclaimer);

  const [resources, setResources] = useState([
    { id: 1, name: 'Course Workbook.pdf', type: 'pdf', size: '2.4 MB' },
    { id: 2, name: 'Project Templates.zip', type: 'zip', size: '15.7 MB' },
    { id: 3, name: 'Resource Links.txt', type: 'txt', size: '1.2 KB' }
  ]);

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handleSaveTitle = () => {
    setTitle(tempTitle);
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    setDescription(tempDescription);
    setIsEditingDescription(false);
  };

  const handleSaveVideo = () => {
    setVideoUrl(tempVideoUrl);
    localStorage.setItem('funnel-video-url', tempVideoUrl);
    setIsEditingVideo(false);
  };

  const handleSaveBenefits = () => {
    setBenefits(tempBenefits.split('\n').filter(benefit => benefit.trim()));
    setIsEditingBenefits(false);
  };

  const handleSaveActionItems = () => {
    setIsEditingActionItems(false);
    console.log('Saving action items:', actionItems);
  };

  const handleSaveDisclaimer = () => {
    setDisclaimer(tempDisclaimer);
    setIsEditingDisclaimer(false);
  };

  const handleSaveResources = () => {
    setIsEditingResources(false);
    console.log('Saving resources:', resources);
  };

  const addActionItem = () => {
    const newItem = {
      id: Date.now(),
      text: 'New action item: ',
      links: [{ text: 'Link', url: 'https://example.com' }]
    };
    setActionItems([...actionItems, newItem]);
  };

  const updateActionItem = (id: number, field: string, value: any) => {
    setActionItems(actionItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeActionItem = (id: number) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  const addLinkToActionItem = (itemId: number) => {
    setActionItems(actionItems.map(item => 
      item.id === itemId 
        ? { ...item, links: [...item.links, { text: 'New Link', url: 'https://example.com' }] }
        : item
    ));
  };

  const updateActionItemLink = (itemId: number, linkIndex: number, field: string, value: string) => {
    setActionItems(actionItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            links: item.links.map((link, index) => 
              index === linkIndex ? { ...link, [field]: value } : link
            )
          }
        : item
    ));
  };

  const removeLinkFromActionItem = (itemId: number, linkIndex: number) => {
    setActionItems(actionItems.map(item => 
      item.id === itemId 
        ? { ...item, links: item.links.filter((_, index) => index !== linkIndex) }
        : item
    ));
  };

  const addResource = () => {
    const newResource = {
      id: Date.now(),
      name: 'New Resource.pdf',
      type: 'pdf',
      size: '0 KB'
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (id: number, field: string, value: string) => {
    setResources(resources.map(resource => 
      resource.id === id ? { ...resource, [field]: value } : resource
    ));
  };

  const removeResource = (id: number) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const handleCancelEdit = (type: string) => {
    switch (type) {
      case 'title':
        setTempTitle(title);
        setIsEditingTitle(false);
        break;
      case 'description':
        setTempDescription(description);
        setIsEditingDescription(false);
        break;
      case 'video':
        setTempVideoUrl(videoUrl);
        setIsEditingVideo(false);
        break;
      case 'benefits':
        setTempBenefits(benefits.join('\n'));
        setIsEditingBenefits(false);
        break;
      case 'disclaimer':
        setTempDisclaimer(disclaimer);
        setIsEditingDisclaimer(false);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Course Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              <Crown className="w-4 h-4 mr-2" />
              Premium Course
              <Sparkles className="w-4 h-4 ml-2" />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            {isEditingTitle && userRole === 'educator' ? (
              <div className="flex items-center justify-center space-x-3 mb-6">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="text-4xl md:text-6xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none text-center max-w-4xl"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <Save className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleCancelEdit('title')}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {title}
                </h1>
                {userRole === 'educator' && (
                  <button
                    onClick={() => {
                      setTempTitle(title);
                      setIsEditingTitle(true);
                    }}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Description */}
            {isEditingDescription && userRole === 'educator' ? (
              <div className="space-y-3 max-w-3xl mx-auto">
                <textarea
                  value={tempDescription}
                  onChange={(e) => setTempDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg text-center"
                />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleCancelEdit('description')}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDescription}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative max-w-3xl mx-auto">
                <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
                {userRole === 'educator' && (
                  <button
                    onClick={() => {
                      setTempDescription(description);
                      setIsEditingDescription(true);
                    }}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Course Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">2,847 students</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium text-gray-900">4.9 rating</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">40+ hours</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full shadow-sm">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700">FREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Video & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
                  {getEmbedUrl(videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Course Introduction"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6">
                          <Play className="w-16 h-16 text-white ml-2" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Course Preview</h3>
                        <p className="text-white/80">Watch the introduction video</p>
                        {userRole === 'educator' && (
                          <p className="text-white/60 text-sm mt-2">Click "Edit Video" to add content</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Edit Video Button for Educators */}
                {userRole === 'educator' && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => {
                        setTempVideoUrl(videoUrl);
                        setIsEditingVideo(true);
                      }}
                      className="bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center backdrop-blur-sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Video
                    </button>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60"
                      alt="Dr. Angela Yu"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">Dr. Angela Yu</h4>
                      <p className="text-sm text-gray-600">Lead Instructor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">1.2K</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Curriculum Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">What You'll Learn</h2>
                {userRole === 'educator' && !isEditingBenefits && (
                  <button
                    onClick={() => {
                      setTempBenefits(benefits.join('\n'));
                      setIsEditingBenefits(true);
                    }}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isEditingBenefits && userRole === 'educator' ? (
                <div className="space-y-4">
                  <textarea
                    value={tempBenefits}
                    onChange={(e) => setTempBenefits(e.target.value)}
                    rows={8}
                    placeholder="Enter each benefit on a new line"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleCancelEdit('benefits')}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBenefits}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-1 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bonus Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative p-8 text-white">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Gift className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      🎁 Exclusive Bonus Worth $497
                    </h3>
                    <p className="text-lg opacity-90 leading-relaxed">
                      Get a personalized one-on-one onboarding call with our expert instructors. 
                      We'll create a custom learning roadmap just for you and answer all your questions.
                    </p>
                    <div className="mt-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Limited time offer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
                {userRole === 'educator' && !isEditingActionItems && (
                  <button
                    onClick={() => setIsEditingActionItems(true)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isEditingActionItems && userRole === 'educator' ? (
                <div className="space-y-6">
                  {actionItems.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="font-bold text-lg text-purple-600">{index + 1}.</span>
                        <button
                          onClick={() => removeActionItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateActionItem(item.id, 'text', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Action item text..."
                        />
                      </div>

                      <div className="space-y-3">
                        {item.links.map((link, linkIndex) => (
                          <div key={linkIndex} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={link.text}
                              onChange={(e) => updateActionItemLink(item.id, linkIndex, 'text', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="Link text"
                            />
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateActionItemLink(item.id, linkIndex, 'url', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="https://..."
                            />
                            <button
                              onClick={() => removeLinkFromActionItem(item.id, linkIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addLinkToActionItem(item.id)}
                          className="text-purple-600 hover:text-purple-700 text-sm flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Link
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-6">
                    <button
                      onClick={addActionItem}
                      className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Action Item
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditingActionItems(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveActionItems}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {actionItems.map((item, index) => (
                    <div key={item.id} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium mb-2">{item.text}</p>
                        <div className="flex flex-wrap gap-3">
                          {item.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-white px-4 py-2 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors font-medium shadow-sm border border-purple-200"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              {link.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
                {userRole === 'educator' && !isEditingResources && (
                  <button
                    onClick={() => setIsEditingResources(true)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isEditingResources && userRole === 'educator' ? (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl">
                      <FileText className="w-6 h-6 text-gray-500" />
                      <input
                        type="text"
                        value={resource.name}
                        onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="text"
                        value={resource.size}
                        onChange={(e) => updateResource(resource.id, 'size', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        placeholder="Size"
                      />
                      <button
                        onClick={() => removeResource(resource.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={addResource}
                        className="flex items-center text-purple-600 hover:text-purple-700"
                      >
                        <Plus className="w-5 h-5 mr-1" />
                        Add Resource
                      </button>
                      <button className="flex items-center text-blue-600 hover:text-blue-700">
                        <Upload className="w-5 h-5 mr-1" />
                        Upload File
                      </button>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditingResources(false)}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveResources}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl hover:from-purple-50 hover:to-blue-50 transition-colors cursor-pointer group">
                      <div className="bg-white rounded-lg p-3 shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{resource.name}</h4>
                        <p className="text-sm text-gray-600">{resource.size}</p>
                      </div>
                      <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200">
              <div className="border-l-4 border-gray-400 pl-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">Important Disclaimer</h3>
                  {userRole === 'educator' && !isEditingDisclaimer && (
                    <button
                      onClick={() => {
                        setTempDisclaimer(disclaimer);
                        setIsEditingDisclaimer(true);
                      }}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {isEditingDisclaimer && userRole === 'educator' ? (
                  <div className="space-y-4">
                    <textarea
                      value={tempDisclaimer}
                      onChange={(e) => setTempDisclaimer(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleCancelEdit('disclaimer')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDisclaimer}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{disclaimer}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Course Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Web Development Bootcamp</h3>
                    <p className="text-purple-100 text-sm">trainr.app/web-dev-bootcamp</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-6 text-center border-b border-gray-100">
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      <span className="line-through text-2xl text-gray-400 mr-2">$2,997</span>
                      FREE
                    </div>
                    <p className="text-green-600 font-medium">Limited Time Offer</p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4">
                    Join Course FREE
                  </button>
                  
                  <p className="text-xs text-gray-600">
                    🔒 Secure enrollment • No credit card required
                  </p>
                </div>

                {/* Course Features */}
                <div className="p-6 space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">What's Included:</h4>
                  {[
                    { icon: Clock, text: '40+ hours of content', color: 'text-purple-600' },
                    { icon: BookOpen, text: '5 real-world projects', color: 'text-blue-600' },
                    { icon: Award, text: 'Certificate of completion', color: 'text-green-600' },
                    { icon: Zap, text: 'Lifetime access', color: 'text-yellow-600' },
                    { icon: Users, text: 'Community support', color: 'text-red-600' },
                    { icon: Rocket, text: 'Job placement help', color: 'text-indigo-600' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">2,847</div>
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
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Your Instructor</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80"
                    alt="Dr. Angela Yu"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-gray-900">Dr. Angela Yu</h5>
                    <p className="text-sm text-gray-600">Lead Developer & Instructor</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.9 • 500K+ students</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Former lead developer at major tech companies. Passionate about teaching 
                  and helping students launch successful careers in web development.
                </p>
              </div>

              {/* Guarantee */}
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

      {/* Edit Video Modal */}
      {isEditingVideo && userRole === 'educator' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Introduction Video</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={tempVideoUrl}
                    onChange={(e) => setTempVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Video Preview */}
                {tempVideoUrl && getEmbedUrl(tempVideoUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview
                    </label>
                    <div className="bg-black rounded-xl overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={getEmbedUrl(tempVideoUrl)}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video Preview"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleCancelEdit('video')}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveVideo}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Save Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}