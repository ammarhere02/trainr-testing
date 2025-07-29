import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  CheckCircle, 
  Clock, 
  Users, 
  Star,
  ChevronDown,
  ChevronRight,
  Edit3,
  MoreHorizontal,
  Upload,
  Link,
  Video,
  X,
  Save,
  FileText,
  Monitor
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number;
  onBack: () => void;
  userRole?: 'educator' | 'student';
}

export default function CourseLearning({ courseId, onBack, userRole = 'student' }: CourseLearningProps) {
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);
  const [videoSource, setVideoSource] = useState('link');
  const [videoLink, setVideoLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedLibraryVideo, setSelectedLibraryVideo] = useState('');
  const [currentVideoSource, setCurrentVideoSource] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false
  });
  const [isEditingLessonContent, setIsEditingLessonContent] = useState(false);
  const [lessonContent, setLessonContent] = useState(`In this lesson, we'll dive deep into React props and state management. You'll learn how to pass data between components and manage local component state effectively. We'll cover practical examples and best practices to help you build more dynamic and interactive React applications.

By the end of this lesson, you'll understand how to create reusable components that can receive and display different data, and how to handle user interactions that change the component's appearance or behavior.`);
  const [tempLessonContent, setTempLessonContent] = useState(lessonContent);
  const [showLessonMenu, setShowLessonMenu] = useState(false);
  const [activeLessonMenu, setActiveLessonMenu] = useState<number | null>(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState('');
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Mock library videos
  const [libraryVideos] = useState([
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

  // Mock course data
  const [course, setCourse] = useState({
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    modules: [
      {
        id: 1,
        title: 'React Fundamentals',
        lessons: [
          { 
            id: 1, 
            title: 'Introduction to React', 
            duration: '12:34', 
            completed: true,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          { 
            id: 2, 
            title: 'Components and Props', 
            duration: '18:45', 
            completed: false,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          { 
            id: 3, 
            title: 'State Management', 
            duration: '22:15', 
            completed: false,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      },
      {
        id: 2,
        title: 'Advanced React',
        lessons: [
          { 
            id: 4, 
            title: 'Hooks Deep Dive', 
            duration: '25:30', 
            completed: false,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          { 
            id: 5, 
            title: 'Context API', 
            duration: '19:20', 
            completed: false,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      },
      {
        id: 3,
        title: 'Project Building',
        lessons: [
          { 
            id: 6, 
            title: 'Building a Todo App', 
            duration: '45:10', 
            completed: false,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          }
        ]
      }
    ]
  });

  const currentLessonData = course.modules
    .flatMap(module => module.lessons)
    .find(lesson => lesson.id === currentLessonId);

  // Reset thumbnail visibility when video URL changes
  React.useEffect(() => {
    setShowThumbnail(true);
  }, [currentLessonData?.videoUrl]);

  const handleVideoEdit = () => {
    if (currentLessonData?.videoUrl) {
      setVideoLink(currentLessonData.videoUrl);
    }
    setShowVideoEditModal(true);
  };

  const handleVideoSave = () => {
    let newVideoUrl = '';
    
    if (videoSource === 'link' && videoLink) {
      newVideoUrl = videoLink;
    } else if (videoSource === 'upload' && uploadedFile) {
      newVideoUrl = URL.createObjectURL(uploadedFile);
    } else if (videoSource === 'library' && selectedLibraryVideo) {
      const selectedVideo = libraryVideos.find(v => v.id.toString() === selectedLibraryVideo);
      newVideoUrl = selectedVideo?.url || '';
    }

    if (newVideoUrl) {
      // Update the course data with the new video URL
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === currentLessonId ? { ...lesson, videoUrl: newVideoUrl } : lesson
          )
        }))
      }));
    }

    setShowVideoEditModal(false);
    resetVideoForm();
  };

  const resetVideoForm = () => {
    setVideoSource('link');
    setVideoLink('');
    setUploadedFile(null);
    setSelectedLibraryVideo('');
  };

  const closeVideoModal = () => {
    setShowVideoEditModal(false);
    resetVideoForm();
  };

  const handleMarkAsComplete = () => {
    if (currentLessonData) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === currentLessonData.id ? { ...lesson, completed: !lesson.completed } : lesson
          )
        }))
      }));
    }
  };

  const handleEditLessonContent = () => {
    setTempLessonContent(lessonContent);
    setIsEditingLessonContent(true);
    setShowLessonMenu(false);
  };

  const handleSaveLessonContent = () => {
    setLessonContent(tempLessonContent);
    setIsEditingLessonContent(false);
  };

  const handleCancelEditLessonContent = () => {
    setTempLessonContent(lessonContent);
    setIsEditingLessonContent(false);
  };

  const moveLessonUp = (lessonId: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
        if (lessonIndex > 0) {
          const newLessons = [...module.lessons];
          [newLessons[lessonIndex - 1], newLessons[lessonIndex]] = [newLessons[lessonIndex], newLessons[lessonIndex - 1]];
          return { ...module, lessons: newLessons };
        }
        return module;
      })
    }));
    setActiveLessonMenu(null);
  };

  const moveLessonDown = (lessonId: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => {
        const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
        if (lessonIndex < module.lessons.length - 1 && lessonIndex !== -1) {
          const newLessons = [...module.lessons];
          [newLessons[lessonIndex], newLessons[lessonIndex + 1]] = [newLessons[lessonIndex + 1], newLessons[lessonIndex]];
          return { ...module, lessons: newLessons };
        }
        return module;
      })
    }));
    setActiveLessonMenu(null);
  };

  const deleteLesson = (lessonId: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
        }))
      }));
      
      // If we're deleting the current lesson, switch to the first available lesson
      if (currentLessonId === lessonId) {
        const firstLesson = course.modules.flatMap(m => m.lessons).find(l => l.id !== lessonId);
        if (firstLesson) {
          setCurrentLessonId(firstLesson.id);
        }
      }
    }
    setActiveLessonMenu(null);
  };

  const duplicateLesson = (lessonId: number) => {
    const lessonToDuplicate = course.modules
      .flatMap(module => module.lessons)
      .find(lesson => lesson.id === lessonId);
    
    if (lessonToDuplicate) {
      const newLesson = {
        ...lessonToDuplicate,
        id: Date.now(),
        title: `${lessonToDuplicate.title} (Copy)`,
        completed: false
      };
      
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => {
          const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
          if (lessonIndex !== -1) {
            const newLessons = [...module.lessons];
            newLessons.splice(lessonIndex + 1, 0, newLesson);
            return { ...module, lessons: newLessons };
          }
          return module;
        })
      }));
    }
    setActiveLessonMenu(null);
  };

  const startEditingLesson = (lessonId: number, currentTitle: string) => {
    setEditingLessonId(lessonId);
    setEditingLessonTitle(currentTitle);
    setActiveLessonMenu(null);
  };

  const saveEditingLesson = () => {
    if (editingLessonId && editingLessonTitle.trim()) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === editingLessonId 
              ? { ...lesson, title: editingLessonTitle.trim() }
              : lesson
          )
        }))
      }));
    }
    setEditingLessonId(null);
    setEditingLessonTitle('');
  };

  const cancelEditingLesson = () => {
    setEditingLessonId(null);
    setEditingLessonTitle('');
  };

  const handleEditCourse = () => {
    console.log('Edit course');
    setShowCourseMenu(false);
    // Add edit course logic here
  };

  const handleAddFolder = () => {
    setShowAddFolderModal(true);
    setShowCourseMenu(false);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newModule = {
      id: Date.now(),
      title: newFolderName.trim(),
      lessons: []
    };
    
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
    
    // Expand the new module by default
    setExpandedModules(prev => ({
      ...prev,
      [newModule.id]: true
    }));
    
    // Reset and close modal
    setNewFolderName('');
    setShowAddFolderModal(false);
  };

  const handleCancelAddFolder = () => {
    setNewFolderName('');
    setShowAddFolderModal(false);
  };
  const handleAddLesson = () => {
    console.log('Add lesson');
    setShowCourseMenu(false);
    // Add lesson logic here
  };

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      console.log('Delete course');
      setShowCourseMenu(false);
      // Add delete course logic here
    }
  };

  const isValidVideoLink = (url: string) => {
    const videoPatterns = [
      /youtube\.com\/watch\?v=|youtu\.be\//,
      /vimeo\.com\//,
      /wistia\.com\//,
      /loom\.com\//
    ];
    return videoPatterns.some(pattern => pattern.test(url));
  };

  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const getVimeoVideoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const isValidVideoUrl = (url: string) => {
    if (!url) return false;
    return getYouTubeVideoId(url) !== null || getVimeoVideoId(url) !== null;
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0`;
    }
    
    // Vimeo
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    
    // Return empty string for invalid URLs
    return '';
  };

  const getThumbnailUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube thumbnail
    const youtubeId = getYouTubeVideoId(url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    
    // Vimeo thumbnail (would need API call in real app)
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }
    
    return '';
  };

  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
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
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">by {course.instructor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleMarkAsComplete}
              className={`p-2 transition-colors ${
                currentLessonData?.completed 
                  ? 'text-green-600 hover:text-green-700' 
                  : 'text-gray-400 hover:text-green-600'
              }`}
              title={currentLessonData?.completed ? 'Completed' : 'Mark as complete'}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            {userRole === 'educator' && (
              <>
                <button 
                  onClick={handleEditLessonContent}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  title="Edit lesson content"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowLessonMenu(!showLessonMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="More options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {showLessonMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowLessonMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={handleEditLessonContent}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit lesson content
                        </button>
                        <button
                          onClick={handleVideoEdit}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Change video
                        </button>
                        <button
                          onClick={handleMarkAsComplete}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {currentLessonData?.completed ? 'Mark as incomplete' : 'Mark as complete'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 p-6">
        {/* Course Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              {userRole === 'educator' && (
                <div className="relative">
                  <button
                    onClick={() => setShowCourseMenu(!showCourseMenu)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Course options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {showCourseMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowCourseMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={handleEditCourse}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Edit course
                        </button>
                        <button
                          onClick={handleAddFolder}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Add folder
                        </button>
                        <button
                          onClick={handleAddLesson}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Add lesson
                        </button>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={handleDeleteCourse}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete course
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {course.modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleModuleExpansion(module.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{module.title}</span>
                    {expandedModules[module.id] ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedModules[module.id] && (
                    <div className="border-t border-gray-200">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${
                            currentLessonId === lesson.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              lesson.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              {lesson.completed ? (
                                <CheckCircle className="w-4 h-4 text-white" />
                              ) : (
                                <Play className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              {editingLessonId === lesson.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={editingLessonTitle}
                                    onChange={(e) => setEditingLessonTitle(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        saveEditingLesson();
                                      } else if (e.key === 'Escape') {
                                        cancelEditingLesson();
                                      }
                                    }}
                                    className="font-medium text-gray-900 text-sm bg-white border border-purple-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    autoFocus
                                  />
                                  <button
                                    onClick={saveEditingLesson}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={cancelEditingLesson}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <div className="font-medium text-gray-900 text-sm">{lesson.title}</div>
                              )}
                              <div className="text-xs text-gray-600">{lesson.duration}</div>
                            </div>
                          </div>
                          {userRole === 'educator' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLessonMenu(activeLessonMenu === lesson.id ? null : lesson.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Lesson options"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          )}
                          {userRole === 'educator' && (
                            <div className="relative">
                              {/* Lesson Menu Dropdown */}
                              {activeLessonMenu === lesson.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setActiveLessonMenu(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                    <button
                                      onClick={() => startEditingLesson(lesson.id, lesson.title)}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      Edit Name
                                    </button>
                                    <button
                                      onClick={() => moveLessonUp(lesson.id)}
                                      disabled={module.lessons.findIndex(l => l.id === lesson.id) === 0}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Move Up
                                    </button>
                                    <button
                                      onClick={() => moveLessonDown(lesson.id)}
                                      disabled={module.lessons.findIndex(l => l.id === lesson.id) === module.lessons.length - 1}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      Move Down
                                    </button>
                                    <button
                                      onClick={() => duplicateLesson(lesson.id)}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      Duplicate
                                    </button>
                                    <hr className="my-1 border-gray-200" />
                                    <button
                                      onClick={() => deleteLesson(lesson.id)}
                                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="relative bg-black aspect-video">
              {currentLessonData?.videoUrl ? (
                isValidVideoUrl(currentLessonData.videoUrl) ? (
                getEmbedUrl(currentLessonData.videoUrl) ? (
                <div className="relative w-full h-full">
                  <iframe
                    src={getEmbedUrl(currentLessonData.videoUrl)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentLessonData.title}
                    key={currentLessonData.videoUrl} // Force re-render when URL changes
                  />
                  {/* Thumbnail overlay for initial load */}
                  {showThumbnail && getThumbnailUrl(currentLessonData.videoUrl) && (
                    <div className="absolute inset-0 bg-black">
                      <img
                        src={getThumbnailUrl(currentLessonData.videoUrl)}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                        onLoad={(e) => {
                          // Hide thumbnail after a delay
                          setTimeout(() => {
                            setShowThumbnail(false);
                          }, 1000);
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-4">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl mb-2">Invalid video URL</p>
                      <p className="text-sm opacity-75 mb-4">Please check the video URL format</p>
                      {userRole === 'educator' && (
                        <button
                          onClick={handleVideoEdit}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Fix Video URL
                        </button>
                      )}
                    </div>
                  </div>
                )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-xl mb-2">
                        {currentLessonData?.videoUrl ? 'Invalid video URL' : 'No video available'}
                      </p>
                      {currentLessonData?.videoUrl && (
                        <p className="text-sm opacity-75 mb-4">Please check the video URL format</p>
                      )}
                      {userRole === 'educator' && (
                        <button
                          onClick={handleVideoEdit}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          {currentLessonData?.videoUrl ? 'Fix Video URL' : 'Add Video'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl mb-2">No video available</p>
                    {userRole === 'educator' && (
                      <button
                        onClick={handleVideoEdit}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Video
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Info */}
            <div className="p-4 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {currentLessonData?.title}
              </h2>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentLessonData?.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    2,847 students
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                  4.8 rating
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Lesson Overview</h2>
              {userRole === 'educator' && !isEditingLessonContent && (
                <button
                  onClick={handleEditLessonContent}
                  className="text-purple-600 hover:text-purple-700 transition-colors"
                  title="Edit content"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {isEditingLessonContent ? (
              <div className="space-y-4">
                <textarea
                  value={tempLessonContent}
                  onChange={(e) => setTempLessonContent(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Enter lesson overview content..."
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEditLessonContent}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLessonContent}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none text-gray-700">
                {lessonContent.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Edit Modal */}
      {showVideoEditModal && (
        <>
          {/* Backdrop to close lesson menu */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setActiveLessonMenu(null)}
          />
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Video</h3>
                
                <div className="space-y-6">
                  {/* Video Source Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Video Source
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setVideoSource('link')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          videoSource === 'link'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Link className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">Video Link</span>
                      </button>
                      <button
                        onClick={() => setVideoSource('upload')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          videoSource === 'upload'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Upload className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">Upload</span>
                      </button>
                      <button
                        onClick={() => setVideoSource('library')}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          videoSource === 'library'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Video className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <span className="text-sm font-medium">Library</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Link Input */}
                  {videoSource === 'link' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supports YouTube, Vimeo, Wistia, and Loom
                      </p>
                      {videoLink && getYouTubeVideoId(videoLink) && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">✓ Valid YouTube URL detected</p>
                          <p className="text-xs text-green-600">Video ID: {getYouTubeVideoId(videoLink)}</p>
                          <p className="text-xs text-gray-600 mt-1">Embed URL: {getEmbedUrl(videoLink)}</p>
                        </div>
                      )}
                      {videoLink && !isValidVideoUrl(videoLink) && videoLink.length > 10 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">⚠️ URL format not recognized</p>
                          <p className="text-xs text-yellow-600">Make sure it's a valid YouTube or Vimeo URL</p>
                        </div>
                      )}
                      
                      {/* Live Preview */}
                      {videoLink && isValidVideoUrl(videoLink) && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-blue-700 mb-2">Preview:</p>
                          <div className="bg-black rounded-lg overflow-hidden relative">
                            <div className="aspect-video">
                              <div className="relative w-full h-full">
                                <iframe
                                  src={getEmbedUrl(videoLink)}
                                  className="w-full h-full"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title="Video Preview"
                                />
                                <div className="relative w-full h-full">
                                  <img
                                    src={getThumbnailUrl(videoLink)}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-red-600 rounded-full p-3">
                                      <Play className="w-6 h-6 text-white ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                    Preview
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Upload */}
                  {videoSource === 'upload' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Video File
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {uploadedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {uploadedFile.name}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Library Selection */}
                  {videoSource === 'library' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose from Library
                      </label>
                      <select
                        value={selectedLibraryVideo}
                        onChange={(e) => setSelectedLibraryVideo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select a video</option>
                        {libraryVideos.map((video) => (
                          <option key={video.id} value={video.id.toString()}>
                            {video.title} ({video.duration})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={closeVideoModal}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVideoSave}
                    disabled={
                      (videoSource === 'link' && !videoLink) ||
                      (videoSource === 'upload' && !uploadedFile) ||
                      (videoSource === 'library' && !selectedLibraryVideo)
                    }
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Folder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFolder();
                      } else if (e.key === 'Escape') {
                        handleCancelAddFolder();
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., React Fundamentals"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Folders help organize your lessons into logical sections
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelAddFolder}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}