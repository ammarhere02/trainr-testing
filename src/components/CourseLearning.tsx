import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Users, 
  Star,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  Share2,
  Edit3,
  Save,
  X,
  Video,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number | null;
  onBack: () => void;
}

export default function CourseLearning({ courseId, onBack }: CourseLearningProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingLessonData, setEditingLessonData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    videoSource: 'youtube',
    duration: ''
  });

  // Mock course data - in real app this would be fetched based on courseId
  const [courseData, setCourseData] = useState({
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch',
    instructor: 'Dr. Angela Yu',
    totalLessons: 12,
    completedLessons: 4,
    lessons: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        content: 'Welcome to the complete web development bootcamp! In this lesson, we\'ll cover what you\'ll learn throughout the course and set up your development environment.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoSource: 'youtube',
        duration: '15:30',
        completed: true
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        content: 'Learn the building blocks of web pages with HTML. We\'ll cover semantic markup, forms, and best practices.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoSource: 'youtube',
        duration: '22:45',
        completed: true
      },
      {
        id: 3,
        title: 'CSS Styling and Layout',
        content: 'Master CSS to create beautiful and responsive designs. Learn Flexbox, Grid, and modern CSS techniques.',
        videoUrl: 'https://vimeo.com/123456789',
        videoSource: 'vimeo',
        duration: '28:15',
        completed: true
      },
      {
        id: 4,
        title: 'JavaScript Basics',
        content: 'Dive into JavaScript programming. Learn variables, functions, DOM manipulation, and event handling.',
        videoUrl: 'https://www.loom.com/share/abc123def456',
        videoSource: 'loom',
        duration: '35:20',
        completed: true
      },
      {
        id: 5,
        title: 'Advanced JavaScript',
        content: 'Explore advanced JavaScript concepts including async/await, promises, and ES6+ features.',
        videoUrl: '',
        videoSource: 'youtube',
        duration: '42:10',
        completed: false
      },
      {
        id: 6,
        title: 'React Introduction',
        content: 'Get started with React, the popular JavaScript library for building user interfaces.',
        videoUrl: '',
        videoSource: 'youtube',
        duration: '38:30',
        completed: false
      }
    ]
  });

  const currentLesson = courseData.lessons[currentLessonIndex];
  const progress = (courseData.completedLessons / courseData.totalLessons) * 100;

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getVimeoVideoId = (url: string) => {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getLoomVideoId = (url: string) => {
    const regex = /loom\.com\/share\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string, source: string) => {
    if (!url) return '';
    
    switch (source) {
      case 'youtube':
        const youtubeId = getYouTubeVideoId(url);
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : '';
      case 'vimeo':
        const vimeoId = getVimeoVideoId(url);
        return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : '';
      case 'loom':
        const loomId = getLoomVideoId(url);
        return loomId ? `https://www.loom.com/embed/${loomId}` : '';
      case 'wistia':
        // Wistia embed format
        return url.includes('wistia') ? url : '';
      default:
        return url;
    }
  };

  const getVideoSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return '📺';
      case 'vimeo':
        return '🎬';
      case 'loom':
        return '🔴';
      case 'wistia':
        return '🎥';
      default:
        return '🎬';
    }
  };

  const handleEditLesson = () => {
    setEditingLessonData({
      title: currentLesson.title,
      content: currentLesson.content,
      videoUrl: currentLesson.videoUrl,
      videoSource: currentLesson.videoSource,
      duration: currentLesson.duration
    });
    setIsEditingLesson(true);
  };

  const handleSaveLesson = () => {
    const updatedLessons = courseData.lessons.map((lesson, index) => 
      index === currentLessonIndex 
        ? {
            ...lesson,
            title: editingLessonData.title,
            content: editingLessonData.content,
            videoUrl: editingLessonData.videoUrl,
            videoSource: editingLessonData.videoSource,
            duration: editingLessonData.duration
          }
        : lesson
    );

    setCourseData(prev => ({
      ...prev,
      lessons: updatedLessons
    }));

    setIsEditingLesson(false);
  };

  const handleCancelEdit = () => {
    setIsEditingLesson(false);
    setEditingLessonData({
      title: '',
      content: '',
      videoUrl: '',
      videoSource: 'youtube',
      duration: ''
    });
  };

  const handleVideoSourceChange = (source: string) => {
    setEditingLessonData(prev => ({
      ...prev,
      videoSource: source,
      videoUrl: '' // Clear URL when changing source
    }));
  };

  const nextLesson = () => {
    if (currentLessonIndex < courseData.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const markAsComplete = () => {
    if (!currentLesson.completed) {
      const updatedLessons = courseData.lessons.map((lesson, index) => 
        index === currentLessonIndex ? { ...lesson, completed: true } : lesson
      );
      
      setCourseData(prev => ({
        ...prev,
        lessons: updatedLessons,
        completedLessons: prev.completedLessons + 1
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Courses
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{courseData.title}</h1>
              <p className="text-sm text-gray-600">by {courseData.instructor}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Lesson {currentLessonIndex + 1} of {courseData.totalLessons}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Lesson List */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Course Content</h2>
            <div className="space-y-2">
              {courseData.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    index === currentLessonIndex
                      ? 'bg-purple-50 border border-purple-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      lesson.completed 
                        ? 'bg-green-100 text-green-600' 
                        : index === currentLessonIndex
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm ${
                        index === currentLessonIndex ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">{lesson.duration}</span>
                        {lesson.videoSource && (
                          <span className="text-xs">{getVideoSourceIcon(lesson.videoSource)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Lesson Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Lesson {currentLessonIndex + 1}</span>
                  <span>•</span>
                  <span>{currentLesson.duration}</span>
                  <span>•</span>
                  <span>{getVideoSourceIcon(currentLesson.videoSource)} {currentLesson.videoSource}</span>
                </div>
              </div>
              
              {/* Edit Button */}
              <button
                onClick={handleEditLesson}
                className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                title="Edit lesson content and video"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden mb-8 shadow-xl">
              <div className="aspect-video">
                {currentLesson.videoUrl && getEmbedUrl(currentLesson.videoUrl, currentLesson.videoSource) ? (
                  <iframe
                    src={getEmbedUrl(currentLesson.videoUrl, currentLesson.videoSource)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6">
                        <Play className="w-16 h-16 text-white ml-2" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">No Video Available</h3>
                      <p className="text-white/80">Click the edit button to add a video</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lesson Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{currentLesson.content}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevLesson}
                disabled={currentLessonIndex === 0}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous Lesson
              </button>

              <div className="flex items-center space-x-4">
                {!currentLesson.completed && (
                  <button
                    onClick={markAsComplete}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Mark as Complete
                  </button>
                )}

                <button
                  onClick={nextLesson}
                  disabled={currentLessonIndex === courseData.lessons.length - 1}
                  className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Lesson
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Lesson Modal */}
      {isEditingLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Edit Lesson</h2>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Lesson Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={editingLessonData.title}
                    onChange={(e) => setEditingLessonData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    placeholder="Enter lesson title"
                  />
                </div>

                {/* Video Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Video Content</h3>
                    <button
                      onClick={() => setShowVideoModal(true)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {editingLessonData.videoUrl ? 'Change Video' : 'Add Video'}
                    </button>
                  </div>

                  {/* Current Video Display */}
                  {editingLessonData.videoUrl ? (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getVideoSourceIcon(editingLessonData.videoSource)}</span>
                            <div>
                              <p className="font-medium text-gray-900">
                                {editingLessonData.videoSource.charAt(0).toUpperCase() + editingLessonData.videoSource.slice(1)} Video
                              </p>
                              <p className="text-sm text-gray-600">Duration: {editingLessonData.duration}</p>
                            </div>
                          </div>
                          <a
                            href={editingLessonData.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-600 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                        <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded truncate">
                          {editingLessonData.videoUrl}
                        </p>
                      </div>

                      {/* Video Preview */}
                      {getEmbedUrl(editingLessonData.videoUrl, editingLessonData.videoSource) && (
                        <div className="bg-black rounded-xl overflow-hidden">
                          <div className="aspect-video">
                            <iframe
                              src={getEmbedUrl(editingLessonData.videoUrl, editingLessonData.videoSource)}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Video Preview"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 text-center">
                      <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No video added yet</p>
                      <p className="text-sm text-gray-500">Click "Add Video" to include video content</p>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Lesson Content
                  </label>
                  <textarea
                    value={editingLessonData.content}
                    onChange={(e) => setEditingLessonData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Enter lesson description and learning objectives..."
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingLessonData.duration}
                    onChange={(e) => setEditingLessonData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 15:30"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLesson}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Source Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Add Video Content</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Video Source Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Choose Video Source
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
                      { id: 'vimeo', name: 'Vimeo', icon: '🎬', color: 'bg-blue-500' },
                      { id: 'loom', name: 'Loom', icon: '🔴', color: 'bg-purple-500' },
                      { id: 'wistia', name: 'Wistia', icon: '🎥', color: 'bg-green-500' }
                    ].map((source) => (
                      <button
                        key={source.id}
                        onClick={() => handleVideoSourceChange(source.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          editingLessonData.videoSource === source.id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${source.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                            {source.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{source.name}</h4>
                            <p className="text-sm text-gray-600">
                              {source.id === 'youtube' && 'Paste YouTube video URL'}
                              {source.id === 'vimeo' && 'Paste Vimeo video URL'}
                              {source.id === 'loom' && 'Paste Loom share URL'}
                              {source.id === 'wistia' && 'Paste Wistia embed URL'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={editingLessonData.videoUrl}
                    onChange={(e) => setEditingLessonData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={
                      editingLessonData.videoSource === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                      editingLessonData.videoSource === 'vimeo' ? 'https://vimeo.com/123456789' :
                      editingLessonData.videoSource === 'loom' ? 'https://www.loom.com/share/...' :
                      editingLessonData.videoSource === 'wistia' ? 'https://fast.wistia.net/embed/iframe/...' :
                      'Paste video URL here'
                    }
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste the full URL from {editingLessonData.videoSource.charAt(0).toUpperCase() + editingLessonData.videoSource.slice(1)}
                  </p>
                </div>

                {/* Duration Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Video Duration
                  </label>
                  <input
                    type="text"
                    value={editingLessonData.duration}
                    onChange={(e) => setEditingLessonData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 15:30"
                  />
                </div>

                {/* Video Preview */}
                {editingLessonData.videoUrl && getEmbedUrl(editingLessonData.videoUrl, editingLessonData.videoSource) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Video Preview
                    </label>
                    <div className="bg-black rounded-xl overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={getEmbedUrl(editingLessonData.videoUrl, editingLessonData.videoSource)}
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                  Save Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}