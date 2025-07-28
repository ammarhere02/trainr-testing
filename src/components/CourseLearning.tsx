import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  User, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Settings,
  Maximize,
  Volume2,
  Edit3,
  Trophy,
  Upload,
  Link,
  X,
  Plus
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number;
  onBack: () => void;
  userRole?: 'educator' | 'student';
}

export default function CourseLearning({ courseId, onBack, userRole = 'student' }: CourseLearningProps) {
  const [currentLesson, setCurrentLesson] = useState(4); // "Selling on Shopify" is lesson 5 (index 4)
  const [showModuleMenu, setShowModuleMenu] = useState<number | null>(null);
  const [showModuleGroupMenu, setShowModuleGroupMenu] = useState<number | null>(null);
  const [isEditingModuleName, setIsEditingModuleName] = useState<number | null>(null);
  const [isEditingModuleGroupName, setIsEditingModuleGroupName] = useState<number | null>(null);
  const [tempModuleName, setTempModuleName] = useState('');
  const [tempModuleGroupName, setTempModuleGroupName] = useState('');
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);
  const [videoSource, setVideoSource] = useState<'link' | 'upload' | 'library'>('link');
  const [videoLink, setVideoLink] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedLibraryVideo, setSelectedLibraryVideo] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [currentVideoThumbnail, setCurrentVideoThumbnail] = useState<string | null>(null);
  const [currentVideoSource, setCurrentVideoSource] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({
    1: true, // First module expanded by default
    2: false,
    3: false
  });
  
  // Mock library videos
  const [libraryVideos] = useState([
    { id: 1, title: 'React Hooks Tutorial Recording', duration: '15:32', thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, title: 'JavaScript Best Practices Session', duration: '22:15', thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 3, title: 'CSS Grid Layout Demo', duration: '18:45', thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ]);
  const [course, setCourse] = useState({
    id: courseId,
    title: 'FREE E-commerce Course',
    instructor: 'Dr. Angela Yu',
    progress: 65,
    totalLessons: 156,
    completedLessons: 102,
    modules: [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          {
            id: 1,
            title: 'Business Model & Branding',
            duration: '12:34',
            completed: true,
            type: 'video',
            current: true
          },
          {
            id: 2,
            title: 'Product Research',
            duration: '15:22',
            completed: true,
            type: 'video',
            current: false
          },
          {
            id: 3,
            title: 'Product Sourcing & Supplies',
            duration: '18:45',
            completed: true,
            type: 'video',
            current: false
          }
        ]
      },
      {
        id: 2,
        title: 'Selling Platforms',
        lessons: [
          {
            id: 4,
            title: 'Selling on Amazon',
            duration: '14:12',
            completed: true,
            type: 'video',
            current: false
          },
          {
            id: 5,
            title: 'Selling on Shopify',
            duration: '30:00',
            completed: false,
            type: 'video',
            current: false
          }
        ]
      },
      {
        id: 3,
        title: 'Marketing & Growth',
        lessons: [
          {
            id: 6,
            title: 'Getting Traffic',
            duration: '25:15',
            completed: false,
            type: 'video',
            current: false
          }
        ]
      }
    ]
  });

  // Helper function to get total lessons count
  const getTotalLessons = () => {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  // Helper function to get current lesson data
  const getCurrentLessonData = () => {
    let lessonIndex = 0;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lessonIndex === currentLesson) {
          return lesson;
        }
        lessonIndex++;
      }
    }
    return null;
  };

  const currentLessonData = getCurrentLessonData();

  // Toggle module expansion
  const toggleModuleExpansion = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Lesson management functions
  const handleEditLessonName = (lessonId: number, currentName: string) => {
    setIsEditingModuleName(lessonId);
    setTempModuleName(currentName);
    setShowModuleMenu(null);
  };

  const handleSaveLessonName = (lessonId: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, title: tempModuleName } : lesson
        )
      }))
    }));
    setIsEditingModuleName(null);
    setTempModuleName('');
  };

  const handleCancelEditLessonName = () => {
    setIsEditingModuleName(null);
    setTempModuleName('');
  };

  const handleMoveLessonUp = (lessonId: number) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      
      // Find the module and lesson
      for (let moduleIndex = 0; moduleIndex < newModules.length; moduleIndex++) {
        const module = newModules[moduleIndex];
        const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
        
        if (lessonIndex !== -1) {
          if (lessonIndex > 0) {
            [module.lessons[lessonIndex], module.lessons[lessonIndex - 1]] = 
            [module.lessons[lessonIndex - 1], module.lessons[lessonIndex]];
          }
          break;
        }
      }
      
      return { ...prev, modules: newModules };
    });
    setShowModuleMenu(null);
  };

  const handleMoveLessonDown = (lessonId: number) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      
      // Find the module and lesson
      for (let moduleIndex = 0; moduleIndex < newModules.length; moduleIndex++) {
        const module = newModules[moduleIndex];
        const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
        
        if (lessonIndex !== -1) {
          if (lessonIndex < module.lessons.length - 1) {
            [module.lessons[lessonIndex], module.lessons[lessonIndex + 1]] = 
            [module.lessons[lessonIndex + 1], module.lessons[lessonIndex]];
          }
          break;
        }
      }
      
      return { ...prev, modules: newModules };
    });
    setShowModuleMenu(null);
  };

  const handleDuplicateLesson = (lessonId: number) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      
      // Find the module and lesson
      for (let moduleIndex = 0; moduleIndex < newModules.length; moduleIndex++) {
        const module = newModules[moduleIndex];
        const lessonIndex = module.lessons.findIndex(lesson => lesson.id === lessonId);
        
        if (lessonIndex !== -1) {
          const lessonToDuplicate = module.lessons[lessonIndex];
          const duplicatedLesson = {
            ...lessonToDuplicate,
            id: Date.now(),
            title: `${lessonToDuplicate.title} (Copy)`,
            completed: false,
            current: false
          };
          
          module.lessons.splice(lessonIndex + 1, 0, duplicatedLesson);
          break;
        }
      }
      
      return { ...prev, modules: newModules };
    });
    setShowModuleMenu(null);
  };

  const handleDeleteLesson = (lessonId: number) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
        }))
      }));
      
      // Adjust current lesson if needed
      if (currentLesson > 0) {
        setCurrentLesson(currentLesson - 1);
      }
    }
    setShowModuleMenu(null);
  };

  // Module group management functions
  const handleEditModuleGroupName = (moduleId: number, currentName: string) => {
    setIsEditingModuleGroupName(moduleId);
    setTempModuleGroupName(currentName);
    setShowModuleGroupMenu(null);
  };

  const handleSaveModuleGroupName = (moduleId: number) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, title: tempModuleGroupName } : module
      )
    }));
    setIsEditingModuleGroupName(null);
    setTempModuleGroupName('');
  };

  const handleCancelEditModuleGroupName = () => {
    setIsEditingModuleGroupName(null);
    setTempModuleGroupName('');
  };

  const handleMoveModuleGroup = (moduleId: number, direction: 'up' | 'down') => {
    setCourse(prev => {
      const moduleIndex = prev.modules.findIndex(module => module.id === moduleId);
      if (direction === 'up' && moduleIndex > 0) {
        const newModules = [...prev.modules];
        [newModules[moduleIndex], newModules[moduleIndex - 1]] = [newModules[moduleIndex - 1], newModules[moduleIndex]];
        return { ...prev, modules: newModules };
      } else if (direction === 'down' && moduleIndex < prev.modules.length - 1) {
        const newModules = [...prev.modules];
        [newModules[moduleIndex], newModules[moduleIndex + 1]] = [newModules[moduleIndex + 1], newModules[moduleIndex]];
        return { ...prev, modules: newModules };
      }
      return prev;
    });
    setShowModuleGroupMenu(null);
  };

  const handleDuplicateModuleGroup = (moduleId: number) => {
    setCourse(prev => {
      const moduleIndex = prev.modules.findIndex(module => module.id === moduleId);
      const moduleToDuplicate = prev.modules[moduleIndex];
      
      const duplicatedModule = {
        ...moduleToDuplicate,
        id: Date.now(),
        title: `${moduleToDuplicate.title} (Copy)`,
        lessons: moduleToDuplicate.lessons.map(lesson => ({
          ...lesson,
          id: Date.now() + Math.random(),
          completed: false,
          current: false
        }))
      };
      
      const newModules = [...prev.modules];
      newModules.splice(moduleIndex + 1, 0, duplicatedModule);
      
      return { ...prev, modules: newModules };
    });
    setShowModuleGroupMenu(null);
  };

  const handleDeleteModuleGroup = (moduleId: number) => {
    if (confirm('Are you sure you want to delete this entire module and all its lessons?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.filter(module => module.id !== moduleId)
      }));
    }
    setShowModuleGroupMenu(null);
  };

  // Video editing functions
  const handleVideoEdit = () => {
    setShowVideoEditModal(true);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setUploadedFile(file);
      setVideoSource('upload');
    }
  };

  const handleAddVideo = async () => {
    setIsUploading(true);
    
    // Simulate upload/processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Set thumbnail and source based on video type
    if (videoSource === 'link') {
      setCurrentVideoThumbnail(getVideoThumbnail(videoLink));
      setCurrentVideoSource(videoLink);
    } else if (videoSource === 'upload' && uploadedFile) {
      // For uploaded files, create a thumbnail URL (in real app, this would be generated server-side)
      const thumbnailUrl = URL.createObjectURL(uploadedFile);
      setCurrentVideoThumbnail(thumbnailUrl);
      setCurrentVideoSource(uploadedFile.name);
    } else if (videoSource === 'library') {
      const selectedVideo = libraryVideos.find(v => v.id.toString() === selectedLibraryVideo);
      if (selectedVideo) {
        setCurrentVideoThumbnail(selectedVideo.thumbnail);
        setCurrentVideoSource(selectedVideo.title);
      }
    }
    
    // In real app, this would save the video to the lesson and library
    console.log('Adding video:', {
      source: videoSource,
      link: videoLink,
      file: uploadedFile,
      libraryVideo: selectedLibraryVideo
    });
    
    setIsUploading(false);
    setShowVideoEditModal(false);
    resetVideoForm();
  };

  // Get thumbnail for video links
  const getVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract YouTube video ID and generate thumbnail
      const videoId = extractYouTubeId(url);
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    } else if (url.includes('vimeo.com')) {
      // For Vimeo, we'd need to use their API, but for demo purposes use a placeholder
      return 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (url.includes('wistia.com')) {
      // For Wistia, similar API call needed, using placeholder
      return 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800';
    } else if (url.includes('loom.com')) {
      // For Loom, using placeholder
      return 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return null;
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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

  const isValidVideoLink = (url: string) => {
    const videoPatterns = [
      /youtube\.com\/watch\?v=|youtu\.be\//,
      /vimeo\.com\//,
      /wistia\.com\//,
      /loom\.com\//
    ];
    return videoPatterns.some(pattern => pattern.test(url));
  };

  const canAddVideo = () => {
    if (videoSource === 'link') return videoLink.trim() && isValidVideoLink(videoLink);
    if (videoSource === 'upload') return uploadedFile !== null;
    if (videoSource === 'library') return selectedLibraryVideo !== '';
    return false;
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
              Back to Course
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Progress: {course.completedLessons}/{course.totalLessons} lessons</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{course.title}</h1>
            <p className="text-sm text-gray-600">by {course.instructor}</p>
          </div>

          {/* Course Content */}
          <div className="p-4">
            <div className="space-y-3">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="space-y-2">
                  {/* Module Header */}
                  <div className="relative group">
                    {isEditingModuleGroupName === module.id ? (
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={tempModuleGroupName}
                          onChange={(e) => setTempModuleGroupName(e.target.value)}
                          className="w-full text-sm font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveModuleGroupName(module.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEditModuleGroupName();
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={handleCancelEditModuleGroupName}
                            className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveModuleGroupName(module.id)}
                            className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleModuleExpansion(module.id)}
                          className="flex-1 flex items-center p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <ChevronRight 
                            className={`w-4 h-4 mr-2 transition-transform ${
                              expandedModules[module.id] ? 'rotate-90' : ''
                            }`} 
                          />
                          <span className="text-sm font-semibold text-gray-900">{module.title}</span>
                        </button>
                        
                        {/* Three dots menu for module groups - educators only */}
                        {userRole === 'educator' && (
                          <div className="relative">
                            <button
                              onClick={() => setShowModuleGroupMenu(showModuleGroupMenu === module.id ? null : module.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {showModuleGroupMenu === module.id && (
                              <>
                                {/* Backdrop */}
                                <div 
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowModuleGroupMenu(null)}
                                />
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                  <button
                                    onClick={() => handleEditModuleGroupName(module.id, module.title)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    Edit name
                                  </button>
                                  
                                  <button
                                    onClick={() => handleMoveModuleGroup(module.id, 'up')}
                                    disabled={moduleIndex === 0}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Move up
                                  </button>
                                  
                                  <button
                                    onClick={() => handleMoveModuleGroup(module.id, 'down')}
                                    disabled={moduleIndex === course.modules.length - 1}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Move down
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDuplicateModuleGroup(module.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    Duplicate
                                  </button>
                                  
                                  <hr className="my-1 border-gray-200" />
                                  
                                  <button
                                    onClick={() => handleDeleteModuleGroup(module.id)}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Module Lessons */}
                  {expandedModules[module.id] && (
                    <div className="ml-6 space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const globalLessonIndex = course.modules
                          .slice(0, moduleIndex)
                          .reduce((total, mod) => total + mod.lessons.length, 0) + lessonIndex;
                        
                        return (
                          <div key={lesson.id} className="relative group">
                            {isEditingModuleName === lesson.id ? (
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <input
                                  type="text"
                                  value={tempModuleName}
                                  onChange={(e) => setTempModuleName(e.target.value)}
                                  className="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSaveLessonName(lesson.id);
                                    } else if (e.key === 'Escape') {
                                      handleCancelEditLessonName();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                  <button
                                    onClick={handleCancelEditLessonName}
                                    className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveLessonName(lesson.id)}
                                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <button
                                  onClick={() => setCurrentLesson(globalLessonIndex)}
                                  className={`flex-1 text-left p-3 rounded-lg transition-colors ${
                                    globalLessonIndex === currentLesson
                                      ? 'bg-purple-50 border border-purple-200'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600 font-medium min-w-[1.5rem]">
                                      {lessonIndex + 1}.
                                    </span>
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                      lesson.completed
                                        ? 'bg-green-500'
                                        : globalLessonIndex === currentLesson
                                        ? 'bg-purple-600'
                                        : 'bg-gray-300'
                                    }`}>
                                      {lesson.completed ? (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      ) : lesson.type === 'exercise' ? (
                                        <BookOpen className="w-2.5 h-2.5 text-white" />
                                      ) : (
                                        <Play className="w-2.5 h-2.5 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${
                                        globalLessonIndex === currentLesson ? 'text-purple-900' : 'text-gray-700'
                                      }`}>
                                        {lesson.title}
                                      </p>
                                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                                    </div>
                                  </div>
                                </button>
                                
                                {/* Three dots menu for individual lessons - educators only */}
                                {userRole === 'educator' && (
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowModuleMenu(showModuleMenu === lesson.id ? null : lesson.id)}
                                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    
                                    {showModuleMenu === lesson.id && (
                                      <>
                                        {/* Backdrop */}
                                        <div 
                                          className="fixed inset-0 z-10"
                                          onClick={() => setShowModuleMenu(null)}
                                        />
                                        
                                        {/* Dropdown Menu */}
                                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                          <button
                                            onClick={() => handleEditLessonName(lesson.id, lesson.title)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                          >
                                            Change lesson name
                                          </button>
                                          
                                          <button
                                            onClick={() => handleMoveLessonUp(lesson.id)}
                                            disabled={lessonIndex === 0}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            Move up
                                          </button>
                                          
                                          <button
                                            onClick={() => handleMoveLessonDown(lesson.id)}
                                            disabled={lessonIndex === module.lessons.length - 1}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            Move down
                                          </button>
                                          
                                          <button
                                            onClick={() => handleDuplicateLesson(lesson.id)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                          >
                                            Duplicate
                                          </button>
                                          
                                          <hr className="my-1 border-gray-200" />
                                          
                                          <button
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4">
              <button
                disabled={currentLesson === 0 || !course.modules.length}
                onClick={() => {
                  if (currentLesson > 0) {
                    setCurrentLesson(currentLesson - 1);
                  }
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              <button
                disabled={currentLesson === getTotalLessons() - 1 || !course.modules.length}
                onClick={() => {
                  if (currentLesson < getTotalLessons() - 1) {
                    setCurrentLesson(currentLesson + 1);
                  }
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Lesson Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentLessonData?.title}</h1>
                <p className="text-gray-600">Lesson {currentLesson + 1} of {getTotalLessons()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit3 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-8 shadow-lg max-w-4xl">
            <div className="aspect-video bg-black flex items-center justify-center relative">
              {currentVideoThumbnail ? (
                <>
                  {/* Video Thumbnail */}
                  <img
                    src={currentVideoThumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-6 hover:bg-white transition-colors group">
                      <Play className="w-12 h-12 text-gray-800 ml-1 group-hover:text-purple-600 transition-colors" />
                    </button>
                  </div>
                  
                  {/* Video Info */}
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                    <p className="text-sm font-medium">{currentLessonData?.title}</p>
                    <p className="text-xs opacity-80">{currentLessonData?.duration}</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-12 h-12 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Video Player</h3>
                  <p className="text-white/80">Duration: {currentLessonData?.duration}</p>
                  {userRole === 'educator' && (
                    <p className="text-white/60 text-sm mt-2">Click "Edit Video" to add content</p>
                  )}
                </div>
              )}
              
              {/* Edit Video Button - Educators only */}
              {userRole === 'educator' && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleVideoEdit}
                    className="bg-black/70 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center backdrop-blur-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {currentVideoThumbnail ? 'Change Video' : 'Add Video'}
                  </button>
                </div>
              )}
              
              {/* Video Controls */}
              {currentVideoThumbnail && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <div className="flex items-center space-x-4">
                      <button className="hover:text-purple-400 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="hover:text-purple-400 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span>0:00 / {currentLessonData?.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="hover:text-purple-400 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="hover:text-purple-400 transition-colors">
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div className="bg-white h-1 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Lesson Overview</h2>
            </div>
            <div className="prose max-w-none text-gray-700">
              <p>
                In this lesson, we'll dive deep into React props and state management. You'll learn how to pass data between 
                components and manage local component state effectively. We'll cover practical examples and best practices 
                to help you build more dynamic and interactive React applications.
              </p>
              <p className="mt-4">
                By the end of this lesson, you'll understand how to create reusable components that can receive and display 
                different data, and how to handle user interactions that change the component's appearance or behavior.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Edit Modal */}
      {showVideoEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {currentVideoThumbnail ? 'Change video' : 'Add a video'}
                </h3>
                <button
                  onClick={closeVideoModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Source
                    </label>
                    <select
                      value={videoSource}
                      onChange={(e) => setVideoSource(e.target.value as 'link' | 'upload' | 'library')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="link">Video Link</option>
                      <option value="upload">Upload File</option>
                      <option value="library">From Library</option>
                    </select>
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
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                )}

                {/* File Upload */}
                {videoSource === 'upload' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {uploadedFile && (
                      <p className="text-sm text-green-600 mt-2">Selected: {uploadedFile.name}</p>
                    )}
                  </div>
                )}

                {/* Library Selection */}
                {videoSource === 'library' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select from Library
                    </label>
                    <select
                      value={selectedLibraryVideo}
                      onChange={(e) => setSelectedLibraryVideo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Choose a video...</option>
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
                  onClick={handleAddVideo}
                  disabled={!canAddVideo() || isUploading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    canAddVideo() && !isUploading
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}