import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Link2,
  Settings,
  Eye,
  Users,
  Star,
  BarChart3,
  Target,
  Award,
  Zap,
  MessageCircle,
  Share2,
  ExternalLink
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number | null;
  onBack: () => void;
}

export default function CourseLearning({ courseId, onBack }: CourseLearningProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState<number | null>(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  
  // Course data - in real app this would be fetched based on courseId
  const [courseData, setCourseData] = useState({
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    instructor: 'Dr. Angela Yu',
    duration: '40 hours',
    students: 2847,
    rating: 4.9,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    progress: 65
  });

  const [tempData, setTempData] = useState(courseData);
  
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      duration: '15:30',
      type: 'video',
      completed: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Overview of web development and what you\'ll learn in this course'
    },
    {
      id: 2,
      title: 'HTML Fundamentals',
      duration: '25:45',
      type: 'video',
      completed: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Learn the building blocks of web pages with HTML'
    },
    {
      id: 3,
      title: 'CSS Styling and Layout',
      duration: '32:20',
      type: 'video',
      completed: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Style your web pages with CSS and create responsive layouts'
    },
    {
      id: 4,
      title: 'JavaScript Basics',
      duration: '28:15',
      type: 'video',
      completed: false,
      videoUrl: '',
      description: 'Learn programming fundamentals with JavaScript'
    },
    {
      id: 5,
      title: 'React Introduction',
      duration: '35:10',
      type: 'video',
      completed: false,
      videoUrl: '',
      description: 'Build dynamic user interfaces with React'
    }
  ]);

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    type: 'video'
  });

  const [tempLesson, setTempLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: ''
  });

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
    setCourseData(prev => ({ ...prev, title: tempData.title }));
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    setCourseData(prev => ({ ...prev, description: tempData.description }));
    setIsEditingDescription(false);
  };

  const handleSaveVideo = () => {
    setCourseData(prev => ({ ...prev, videoUrl: tempData.videoUrl }));
    setIsEditingVideo(false);
  };

  const handleSaveLesson = (lessonId: number) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId 
        ? { 
            ...lesson, 
            title: tempLesson.title,
            description: tempLesson.description,
            videoUrl: tempLesson.videoUrl,
            duration: tempLesson.duration
          }
        : lesson
    ));
    setIsEditingLesson(null);
  };

  const handleEditLesson = (lesson: any) => {
    setTempLesson({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration
    });
    setIsEditingLesson(lesson.id);
  };

  const handleAddLesson = () => {
    const newLessonData = {
      id: Date.now(),
      title: newLesson.title,
      description: newLesson.description,
      videoUrl: newLesson.videoUrl,
      duration: newLesson.duration,
      type: newLesson.type,
      completed: false
    };
    
    setLessons(prev => [...prev, newLessonData]);
    setNewLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      type: 'video'
    });
    setShowAddLessonModal(false);
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
    }
  };

  const handleCancelEdit = (type: string) => {
    switch (type) {
      case 'title':
        setTempData(prev => ({ ...prev, title: courseData.title }));
        setIsEditingTitle(false);
        break;
      case 'description':
        setTempData(prev => ({ ...prev, description: courseData.description }));
        setIsEditingDescription(false);
        break;
      case 'video':
        setTempData(prev => ({ ...prev, videoUrl: courseData.videoUrl }));
        setIsEditingVideo(false);
        break;
      case 'lesson':
        setIsEditingLesson(null);
        break;
    }
  };

  if (!courseId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Course Settings
          </button>
          <button 
            onClick={() => setShowAddLessonModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Course Title */}
            <div className="mb-6">
              {isEditingTitle ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempData.title}
                    onChange={(e) => setTempData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCancelEdit('title')}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTitle}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
                  <button
                    onClick={() => {
                      setTempData(courseData);
                      setIsEditingTitle(true);
                    }}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Course Description */}
            <div className="mb-6">
              {isEditingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={tempData.description}
                    onChange={(e) => setTempData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex space-x-2">
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
                <div className="relative">
                  <p className="text-gray-600 leading-relaxed">{courseData.description}</p>
                  <button
                    onClick={() => {
                      setTempData(courseData);
                      setIsEditingDescription(true);
                    }}
                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {courseData.students.toLocaleString()} students
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {courseData.duration}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                {courseData.rating} rating
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Certificate included
              </div>
            </div>
          </div>

          {/* Main Video Player */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800">
                {getEmbedUrl(courseData.videoUrl) ? (
                  <iframe
                    src={getEmbedUrl(courseData.videoUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Course Video"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-6">
                        <Play className="w-16 h-16 text-white ml-2" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Course Introduction</h3>
                      <p className="text-white/80">Add a video to get started</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Edit Video Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    setTempData(courseData);
                    setIsEditingVideo(true);
                  }}
                  className="bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center backdrop-blur-sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Video
                </button>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60"
                    alt={courseData.instructor}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{courseData.instructor}</h4>
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Discuss</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Lessons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              <div className="text-sm text-gray-600">
                {lessons.filter(l => l.completed).length} of {lessons.length} lessons completed
              </div>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {isEditingLesson === lesson.id ? (
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lesson Title
                        </label>
                        <input
                          type="text"
                          value={tempLesson.title}
                          onChange={(e) => setTempLesson(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={tempLesson.description}
                          onChange={(e) => setTempLesson(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video URL
                          </label>
                          <input
                            type="url"
                            value={tempLesson.videoUrl}
                            onChange={(e) => setTempLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            value={tempLesson.duration}
                            onChange={(e) => setTempLesson(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="15:30"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleCancelEdit('lesson')}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveLesson(lesson.id)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Save Lesson
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <span className="text-gray-600 font-medium text-sm">{index + 1}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Video className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{lesson.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Edit lesson"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          {lesson.completed ? 'Rewatch' : 'Start'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium">{courseData.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${courseData.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Lessons</span>
                  <span className="font-medium">{lessons.filter(l => l.completed).length}/{lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Spent</span>
                  <span className="font-medium">12.5 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Time Left</span>
                  <span className="font-medium">27.5 hours</span>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm text-gray-600">Total Students</span>
                  </div>
                  <span className="font-medium text-gray-900">{courseData.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-600 mr-3" />
                    <span className="text-sm text-gray-600">Average Rating</span>
                  </div>
                  <span className="font-medium text-gray-900">{courseData.rating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm text-gray-600">Completion Rate</span>
                  </div>
                  <span className="font-medium text-gray-900">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-600">Engagement</span>
                  </div>
                  <span className="font-medium text-gray-900">92%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                  <Download className="w-4 h-4 mr-3" />
                  Download Resources
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Ask Question
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                  <Share2 className="w-4 h-4 mr-3" />
                  Share Course
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors flex items-center">
                  <Award className="w-4 h-4 mr-3" />
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Video Modal */}
      {isEditingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Course Video</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    YouTube Video URL
                  </label>
                  <input
                    type="url"
                    value={tempData.videoUrl}
                    onChange={(e) => setTempData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Video Preview */}
                {tempData.videoUrl && getEmbedUrl(tempData.videoUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview
                    </label>
                    <div className="bg-black rounded-xl overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={getEmbedUrl(tempData.videoUrl)}
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

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Lesson</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter lesson title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the lesson"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={newLesson.videoUrl}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="15:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type
                  </label>
                  <select
                    value={newLesson.type}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="video">Video Lesson</option>
                    <option value="text">Text Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>

                {/* Video Preview */}
                {newLesson.videoUrl && getEmbedUrl(newLesson.videoUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Video Preview
                    </label>
                    <div className="bg-black rounded-xl overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={getEmbedUrl(newLesson.videoUrl)}
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
                    onClick={() => setShowAddLessonModal(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLesson}
                    disabled={!newLesson.title.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Lesson
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