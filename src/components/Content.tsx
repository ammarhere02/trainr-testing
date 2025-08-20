import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Eye, 
  Clock, 
  Users, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Target,
  FileText,
  Video,
  Image,
  Share2,
  MessageCircle,
  Heart,
  ExternalLink,
  Settings,
  Download
} from 'lucide-react';
import VideoLinkInput from './VideoLinkInput';
import VideoEmbed from './VideoEmbed';

export default function Content() {
  const [currentView, setCurrentView] = useState<'calendar' | 'pipeline' | 'analytics'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [editingContentForVideo, setEditingContentForVideo] = useState<any>(null);
  const [contentItems, setContentItems] = useState(() => {
    const saved = localStorage.getItem('content-items');
    return saved ? JSON.parse(saved) : [
    {
      id: 1,
      title: 'React Hooks Deep Dive Tutorial',
      type: 'video',
      status: 'published',
      publishDate: '2024-01-15',
      author: 'Sarah Johnson',
      platform: 'YouTube',
      views: 12547,
      engagement: 8.5,
      stage: 'published',
      priority: 'high',
      tags: ['React', 'JavaScript', 'Tutorial'],
      description: 'Comprehensive guide to React Hooks with practical examples',
      videoSource: 'youtube',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'JavaScript Best Practices Guide',
      type: 'blog',
      status: 'scheduled',
      publishDate: '2024-01-18',
      author: 'Mike Chen',
      platform: 'Blog',
      views: 0,
      engagement: 0,
      stage: 'ready-to-publish',
      priority: 'medium',
      tags: ['JavaScript', 'Best Practices', 'Development'],
      description: 'Essential JavaScript best practices for modern development',
      videoSource: null,
      videoUrl: null
    },
    {
      id: 3,
      title: 'CSS Grid Layout Masterclass',
      type: 'video',
      status: 'in-progress',
      publishDate: '2024-01-22',
      author: 'Emma Davis',
      platform: 'YouTube',
      views: 0,
      engagement: 0,
      stage: 'content-creation',
      priority: 'high',
      tags: ['CSS', 'Layout', 'Design'],
      description: 'Master CSS Grid with real-world examples and projects',
      videoSource: 'vimeo',
      videoUrl: 'https://vimeo.com/123456789'
    },
    {
      id: 4,
      title: 'Web Development Trends 2024',
      type: 'blog',
      status: 'draft',
      publishDate: '2024-01-25',
      author: 'Sarah Johnson',
      platform: 'Blog',
      views: 0,
      engagement: 0,
      stage: 'ideation',
      priority: 'low',
      tags: ['Trends', 'Web Development', '2024'],
      description: 'Exploring the latest trends shaping web development in 2024',
      videoSource: null,
      videoUrl: null
    },
    {
      id: 5,
      title: 'Node.js Performance Optimization',
      type: 'video',
      status: 'review',
      publishDate: '2024-01-20',
      author: 'Mike Chen',
      platform: 'YouTube',
      views: 0,
      engagement: 0,
      stage: 'review',
      priority: 'medium',
      tags: ['Node.js', 'Performance', 'Backend'],
      description: 'Techniques to optimize Node.js application performance',
      videoSource: 'library',
      videoUrl: 'trainr://video/abc123'
    }
  ]});
  const [libraryVideos, setLibraryVideos] = useState([
    {
      id: 1,
      title: 'React Hooks Tutorial Recording',
      duration: '15:32',
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'trainr://video/abc123',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'JavaScript Best Practices Session',
      duration: '22:15',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: 'trainr://video/def456',
      createdDate: '2024-01-12'
    }
  ]);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'blog',
    platform: 'YouTube',
    videoSource: 'youtube',
    videoUrl: '',
    selectedLibraryVideo: '',
    priority: 'medium',
    publishDate: '',
    author: 'Sarah Johnson',
    description: '',
    tags: ''
  });


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'review':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'ideation':
        return 'bg-orange-100 text-orange-700';
      case 'content-creation':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-purple-100 text-purple-700';
      case 'ready-to-publish':
        return 'bg-green-100 text-green-700';
      case 'published':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'blog':
        return FileText;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();

  const getContentForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contentItems.filter(item => item.publishDate === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const filteredContent = contentItems.filter(item => 
    filterStatus === 'all' || item.status === filterStatus
  );

  const stageColumns = [
    { id: 'ideation', title: 'Ideation', items: contentItems.filter(item => item.stage === 'ideation') },
    { id: 'content-creation', title: 'Content Creation', items: contentItems.filter(item => item.stage === 'content-creation') },
    { id: 'review', title: 'Review', items: contentItems.filter(item => item.stage === 'review') },
    { id: 'ready-to-publish', title: 'Ready to Publish', items: contentItems.filter(item => item.stage === 'ready-to-publish') },
    { id: 'published', title: 'Published', items: contentItems.filter(item => item.stage === 'published') }
  ];

  const handleCreateContent = () => {
    console.log('Creating content:', newContent);
    
    // Create new content item
    const newItem = {
      id: Date.now(),
      title: newContent.title,
      type: newContent.type,
      status: 'draft',
      publishDate: newContent.publishDate,
      author: newContent.author,
      platform: newContent.platform,
      views: 0,
      engagement: 0,
      stage: 'ideation',
      priority: newContent.priority,
      tags: newContent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      description: newContent.description,
      videoSource: newContent.type === 'video' ? newContent.videoSource : null,
      videoUrl: newContent.type === 'video' ? (
        newContent.videoSource === 'library' ? newContent.selectedLibraryVideo : newContent.videoUrl
      ) : null
    };
    
    // Add to content items (in real app, this would be an API call)
    const updatedItems = [newItem, ...contentItems];
    setContentItems(updatedItems);
    localStorage.setItem('content-items', JSON.stringify(updatedItems));
    
    // Reset form and close modal
    setNewContent({
      title: '',
      type: 'blog',
      platform: 'YouTube',
      videoSource: 'youtube',
      videoUrl: '',
      selectedLibraryVideo: '',
      priority: 'medium',
      publishDate: '',
      author: 'Sarah Johnson',
      description: '',
      tags: ''
    });
    setShowCreateModal(false);
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setNewContent({
      title: content.title,
      type: content.type,
      platform: content.platform,
      videoSource: content.videoSource || 'youtube',
      videoUrl: content.videoUrl || '',
      selectedLibraryVideo: content.videoSource === 'library' ? content.videoUrl : '',
      priority: content.priority,
      publishDate: content.publishDate,
      author: content.author,
      description: content.description,
      tags: content.tags.join(', ')
    });
    setShowEditModal(true);
  };

  const handleUpdateContent = () => {
    if (!editingContent) return;
    
    const updatedItem = {
      ...editingContent,
      title: newContent.title,
      type: newContent.type,
      platform: newContent.platform,
      priority: newContent.priority,
      publishDate: newContent.publishDate,
      author: newContent.author,
      description: newContent.description,
      tags: newContent.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      videoSource: newContent.type === 'video' ? newContent.videoSource : null,
      videoUrl: newContent.type === 'video' ? (
        newContent.videoSource === 'library' ? newContent.selectedLibraryVideo : newContent.videoUrl
      ) : null
    };
    
    // Update content items
    const updatedItems = contentItems.map(item => 
      item.id === editingContent.id ? updatedItem : item
    );
    setContentItems(updatedItems);
    localStorage.setItem('content-items', JSON.stringify(updatedItems));
    
    // Reset and close
    setEditingContent(null);
    setShowEditModal(false);
    setNewContent({
      title: '',
      type: 'blog',
      platform: 'YouTube',
      videoSource: 'youtube',
      videoUrl: '',
      selectedLibraryVideo: '',
      priority: 'medium',
      publishDate: '',
      author: 'Sarah Johnson',
      description: '',
      tags: ''
    });
  };

  const handleVideoAdd = (videoData: any) => {
    if (editingContentForVideo) {
      // Update existing content
      const updatedItems = contentItems.map(item => 
        item.id === editingContentForVideo.id 
          ? { 
              ...item, 
              videoUrl: videoData.url,
              videoSource: videoData.source,
              videoTitle: videoData.title
            }
          : item
      );
      setContentItems(updatedItems);
      localStorage.setItem('content-items', JSON.stringify(updatedItems));
    } else {
      // Create new video content
      const newItem = {
        id: Date.now(),
        title: videoData.title || 'New Video Content',
        type: 'video',
        status: 'draft',
        publishDate: new Date().toISOString().split('T')[0],
        author: 'Current User',
        platform: videoData.source === 'youtube' ? 'YouTube' : 'Loom',
        views: 0,
        engagement: 0,
        stage: 'content-creation',
        priority: 'medium',
        tags: [videoData.source],
        description: `${videoData.source} video content`,
        videoSource: videoData.source,
        videoUrl: videoData.url
      };
      
      const updatedItems = [newItem, ...contentItems];
      setContentItems(updatedItems);
      localStorage.setItem('content-items', JSON.stringify(updatedItems));
    }
    
    setShowVideoInput(false);
    setEditingContentForVideo(null);
  };

  const getVideoSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return '📺';
      case 'vimeo':
        return '🎬';
      case 'wistia':
        return '🎥';
      case 'loom':
        return '🔴';
      case 'library':
        return '📚';
      default:
        return '🎬';
    }
  };

  const getVideoSourceName = (source: string) => {
    switch (source) {
      case 'youtube':
        return 'YouTube';
      case 'vimeo':
        return 'Vimeo';
      case 'wistia':
        return 'Wistia';
      case 'loom':
        return 'Loom';
      case 'library':
        return 'Trainr Library';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Planner</h1>
          <p className="text-gray-600 mt-2">Plan, create, and manage your content strategy</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Content
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'calendar' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2 inline" />
                Calendar
              </button>
              <button
                onClick={() => setCurrentView('pipeline')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'pipeline' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Target className="w-4 h-4 mr-2 inline" />
                Pipeline
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'analytics' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Analytics
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search content..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {currentView === 'calendar' && (
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === today.toDateString();
                  const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                  const contentForDay = getContentForDate(day);

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`p-2 min-h-[100px] text-left border border-gray-100 hover:bg-gray-50 transition-colors relative ${
                        !isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''
                      } ${isToday ? 'bg-purple-50 border-purple-200' : ''} ${
                        isSelected ? 'bg-purple-100 border-purple-300' : ''
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-purple-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.getDate()}
                      </span>
                      
                      {contentForDay.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {contentForDay.slice(0, 2).map((content) => {
                            const TypeIcon = getTypeIcon(content.type);
                            return (
                              <div
                                key={content.id}
                                className={`text-xs px-2 py-1 rounded truncate flex items-center ${getStatusColor(content.status)}`}
                              >
                                <TypeIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                {content.title}
                              </div>
                            );
                          })}
                          {contentForDay.length > 2 && (
                            <div className="text-xs text-purple-600 font-medium">
                              +{contentForDay.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            {selectedDate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {getContentForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getContentForDate(selectedDate).map((content) => {
                      const TypeIcon = getTypeIcon(content.type);
                      return (
                        <div key={content.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center mb-2">
                            <TypeIcon className="w-4 h-4 mr-2 text-gray-600" />
                            <h4 className="font-medium text-gray-900 text-sm">{content.title}</h4>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                            <span className="text-gray-600">{content.platform}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No content scheduled for this date</p>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Scheduled</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-medium">45.2K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {currentView === 'pipeline' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex overflow-x-auto space-x-6 pb-4">
            {stageColumns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {column.items.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {column.items.map((item) => {
                      const TypeIcon = getTypeIcon(item.type);
                      return (
                        <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <TypeIcon className="w-4 h-4 mr-2 text-gray-600" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Settings className="w-4 h-4" />
                            </button>
                            {item.type === 'video' && item.videoUrl && (
                              <div className="mt-2">
                                <VideoEmbed
                                  url={item.videoUrl}
                                  source={item.videoSource}
                                  title={item.videoTitle || item.title}
                                  className="w-32"
                                />
                              </div>
                            )}
                            {item.type === 'video' && (
                              <button 
                                onClick={() => {
                                  setEditingContentForVideo(item);
                                  setShowVideoInput(true);
                                }}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors" 
                                title="Edit Video"
                              >
                                <Video className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                            <span>{item.author}</span>
                            <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{item.tags.length - 2}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{item.platform}</span>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-400 hover:text-purple-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {currentView === 'analytics' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Performance</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">45.2K</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                  <div className="text-xs text-green-600 mt-1">↑ 12.5%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">8.7%</div>
                  <div className="text-sm text-gray-600">Avg. Engagement</div>
                  <div className="text-xs text-green-600 mt-1">↑ 3.2%</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24</div>
                  <div className="text-sm text-gray-600">Published</div>
                  <div className="text-xs text-green-600 mt-1">↑ 20%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Content</h3>
              <div className="space-y-4">
                {contentItems
                  .filter(item => item.status === 'published')
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="w-5 h-5 text-gray-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.platform}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{item.views.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{item.engagement}% engagement</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Content Types</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Videos</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Blog Posts</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Images</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Publishing Schedule</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">3 posts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Week</span>
                  <span className="font-medium">5 posts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">18 posts</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors">
                  Export Analytics
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors">
                  Schedule Report
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors">
                  Content Templates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Content</h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Title
                    </label>
                    <input
                      type="text"
                      value={newContent.title}
                      onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter content title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select 
                      value={newContent.type}
                      onChange={(e) => setNewContent({...newContent, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="blog">Blog Post</option>
                      <option value="image">Image</option>
                      <option value="infographic">Infographic</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select 
                      value={newContent.platform}
                      onChange={(e) => setNewContent({...newContent, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>YouTube</option>
                      <option>Blog</option>
                      <option>Instagram</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select 
                      value={newContent.priority}
                      onChange={(e) => setNewContent({...newContent, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={newContent.publishDate}
                      onChange={(e) => setNewContent({...newContent, publishDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <select 
                      value={newContent.author}
                      onChange={(e) => setNewContent({...newContent, author: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>Sarah Johnson</option>
                      <option>Mike Chen</option>
                      <option>Emma Davis</option>
                    </select>
                  </div>
                </div>

                {/* Video URL Section for Video Content */}
                {newContent.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Link
                    </label>
                    <div className="space-y-3">
                      {newContent.videoUrl ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                newContent.videoSource === 'youtube' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {newContent.videoSource === 'youtube' ? '📺 YouTube' : '🔴 Loom'}
                              </span>
                              <span className="text-sm text-gray-600 truncate">{newContent.videoUrl}</span>
                            </div>
                            <button
                              onClick={() => setNewContent({...newContent, videoUrl: '', videoSource: ''})}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowVideoInput(true)}
                          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all text-center"
                        >
                          <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium">Add YouTube or Loom Video</p>
                          <p className="text-sm text-gray-500">Click to paste video link</p>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={newContent.tags}
                    onChange={(e) => setNewContent({...newContent, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter tags separated by commas"
                  />
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
                  onClick={handleCreateContent}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Create Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Input Modal */}
      {showVideoInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add Video Link</h3>
              <VideoLinkInput
                onVideoAdd={(videoData) => {
                  if (editingContentForVideo) {
                    handleVideoAdd(videoData);
                  } else {
                    // For new content creation
                    setNewContent({
                      ...newContent,
                      videoUrl: videoData.url,
                      videoSource: videoData.source,
                      title: newContent.title || videoData.title || 'New Video Content'
                    });
                    setShowVideoInput(false);
                  }
                }}
                onCancel={() => {
                  setShowVideoInput(false);
                  setEditingContentForVideo(null);
                }}
                placeholder="Paste YouTube or Loom link for your content..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}