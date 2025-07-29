import React, { useState } from 'react';
import { 
  Play, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Clock, 
  Video, 
  FileText, 
  ArrowLeft,
  Upload,
  X,
  Save,
  Folder,
  FolderOpen
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number;
  onBack: () => void;
  userRole?: 'educator' | 'student';
}

export default function CourseLearning({ courseId, onBack, userRole = 'student' }: CourseLearningProps) {
  const [expandedFolders, setExpandedFolders] = useState<{ [key: number]: boolean }>({
    1: true,
    2: false,
    3: false
  });
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState<number | null>(null);
  const [showLessonMenu, setShowLessonMenu] = useState<number | null>(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState<any>(null);

  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    duration: '',
    description: '',
    videoUrl: '',
    content: ''
  });

  const [newFolder, setNewFolder] = useState({
    title: '',
    description: ''
  });

  const [editCourse, setEditCourse] = useState({
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400'
  });

  const [courseData, setCourseData] = useState({
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 65,
    totalLessons: 156,
    completedLessons: 101,
    duration: '40 hours'
  });

  const [folders, setFolders] = useState([
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn the basics of React',
      lessons: [
        { id: 1, title: 'Introduction to React', type: 'video', duration: '12:34', completed: true, description: 'Overview of React and its ecosystem' },
        { id: 2, title: 'JSX and Components', type: 'video', duration: '18:45', completed: true, description: 'Understanding JSX syntax and creating components' },
        { id: 3, title: 'Props and State', type: 'video', duration: '22:15', completed: false, description: 'Managing component data with props and state' }
      ]
    },
    {
      id: 2,
      title: 'Advanced React Concepts',
      description: 'Deep dive into advanced React patterns',
      lessons: [
        { id: 4, title: 'Hooks Deep Dive', type: 'video', duration: '25:30', completed: false, description: 'Master React hooks for state management' },
        { id: 5, title: 'Context API', type: 'video', duration: '20:12', completed: false, description: 'Global state management with Context' },
        { id: 6, title: 'Performance Optimization', type: 'video', duration: '28:45', completed: false, description: 'Optimize React app performance' }
      ]
    },
    {
      id: 3,
      title: 'Project: Build a Todo App',
      description: 'Hands-on project to practice React skills',
      lessons: [
        { id: 7, title: 'Project Setup', type: 'video', duration: '15:20', completed: false, description: 'Setting up the project structure' },
        { id: 8, title: 'Building Components', type: 'video', duration: '35:10', completed: false, description: 'Creating the main app components' },
        { id: 9, title: 'Adding Functionality', type: 'video', duration: '40:25', completed: false, description: 'Implementing CRUD operations' }
      ]
    }
  ]);

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleAddLesson = (folderId: number) => {
    setSelectedFolderId(folderId);
    setShowAddLessonModal(true);
    setShowFolderMenu(null);
  };

  const handleCreateLesson = () => {
    if (!selectedFolderId || !newLesson.title.trim()) return;

    const lesson = {
      id: Date.now(),
      title: newLesson.title,
      type: newLesson.type,
      duration: newLesson.duration || '0:00',
      completed: false,
      description: newLesson.description
    };

    setFolders(prev => prev.map(folder => 
      folder.id === selectedFolderId 
        ? { ...folder, lessons: [...folder.lessons, lesson] }
        : folder
    ));

    // Reset form
    setNewLesson({
      title: '',
      type: 'video',
      duration: '',
      description: '',
      videoUrl: '',
      content: ''
    });
    setShowAddLessonModal(false);
    setSelectedFolderId(null);
  };

  const handleEditFolder = (folder: any) => {
    setEditingFolder(folder);
    setNewFolder({
      title: folder.title,
      description: folder.description
    });
    setShowEditFolderModal(true);
    setShowFolderMenu(null);
  };

  const handleUpdateFolder = () => {
    if (!editingFolder || !newFolder.title.trim()) return;

    setFolders(prev => prev.map(folder => 
      folder.id === editingFolder.id 
        ? { ...folder, title: newFolder.title, description: newFolder.description }
        : folder
    ));

    setShowEditFolderModal(false);
    setEditingFolder(null);
    setNewFolder({ title: '', description: '' });
  };

  const handleDeleteFolder = (folderId: number) => {
    if (confirm('Are you sure you want to delete this folder and all its lessons?')) {
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    }
    setShowFolderMenu(null);
  };

  const handleDuplicateFolder = (folderId: number) => {
    const folderToDuplicate = folders.find(f => f.id === folderId);
    if (!folderToDuplicate) return;

    const duplicatedFolder = {
      ...folderToDuplicate,
      id: Date.now(),
      title: `${folderToDuplicate.title} (Copy)`,
      lessons: folderToDuplicate.lessons.map(lesson => ({
        ...lesson,
        id: Date.now() + Math.random(),
        completed: false
      }))
    };

    setFolders(prev => [...prev, duplicatedFolder]);
    setShowFolderMenu(null);
  };

  const handleAddFolder = () => {
    if (!newFolder.title.trim()) return;

    const folder = {
      id: Date.now(),
      title: newFolder.title,
      description: newFolder.description,
      lessons: []
    };

    setFolders(prev => [...prev, folder]);
    setNewFolder({ title: '', description: '' });
    setShowAddFolderModal(false);
  };

  const handleUpdateCourse = () => {
    setCourseData(prev => ({
      ...prev,
      title: editCourse.title,
      description: editCourse.description,
      thumbnail: editCourse.thumbnail
    }));
    setShowEditCourseModal(false);
  };

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this entire course? This action cannot be undone.')) {
      // In real app, this would delete the course and redirect
      console.log('Course deleted');
      onBack();
    }
    setShowCourseMenu(false);
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
          </div>
          
          {userRole === 'educator' && (
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Publish Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <img
                src={courseData.thumbnail}
                alt={courseData.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title}</h1>
                    <p className="text-gray-600 mb-4">{courseData.description}</p>
                  </div>
                  
                  {userRole === 'educator' && (
                    <div className="relative">
                      <button
                        onClick={() => setShowCourseMenu(!showCourseMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {showCourseMenu && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setShowCourseMenu(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                            <button
                              onClick={() => {
                                setShowEditCourseModal(true);
                                setShowCourseMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Edit course
                            </button>
                            <button
                              onClick={() => {
                                setShowAddFolderModal(true);
                                setShowCourseMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Add folder
                            </button>
                            <hr className="my-1 border-gray-200" />
                            <button
                              onClick={handleDeleteCourse}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Delete course
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{courseData.progress}% ({courseData.completedLessons}/{courseData.totalLessons} lessons)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${courseData.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="space-y-4">
          {folders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Folder Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {expandedFolders[folder.id] ? (
                        <FolderOpen className="w-5 h-5" />
                      ) : (
                        <Folder className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-semibold text-gray-900">{folder.title}</h3>
                      <p className="text-sm text-gray-600">{folder.description}</p>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {folder.lessons.length} lessons
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {expandedFolders[folder.id] ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    
                    {userRole === 'educator' && (
                      <div className="relative">
                        <button
                          onClick={() => setShowFolderMenu(showFolderMenu === folder.id ? null : folder.id)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {showFolderMenu === folder.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setShowFolderMenu(null)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                              <button
                                onClick={() => handleAddLesson(folder.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Add lesson
                              </button>
                              <button
                                onClick={() => handleEditFolder(folder)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Edit folder
                              </button>
                              <button
                                onClick={() => handleDuplicateFolder(folder.id)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Duplicate folder
                              </button>
                              <hr className="my-1 border-gray-200" />
                              <button
                                onClick={() => handleDeleteFolder(folder.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete folder
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Folder Content */}
              {expandedFolders[folder.id] && (
                <div className="divide-y divide-gray-100">
                  {folder.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : lesson.type === 'video' ? (
                              <Video className="w-4 h-4 text-gray-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          
                          {userRole === 'educator' && (
                            <div className="relative">
                              <button
                                onClick={() => setShowLessonMenu(showLessonMenu === lesson.id ? null : lesson.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              
                              {showLessonMenu === lesson.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowLessonMenu(null)}
                                  />
                                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                      Edit lesson
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                      Duplicate lesson
                                    </button>
                                    <hr className="my-1 border-gray-200" />
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                      Delete lesson
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Lesson</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Type
                    </label>
                    <select
                      value={newLesson.type}
                      onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="text">Text/Article</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="12:34"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the lesson"
                  />
                </div>

                {newLesson.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={newLesson.videoUrl}
                      onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddLessonModal(false);
                    setSelectedFolderId(null);
                    setNewLesson({
                      title: '',
                      type: 'video',
                      duration: '',
                      description: '',
                      videoUrl: '',
                      content: ''
                    });
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLesson}
                  disabled={!newLesson.title.trim()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Course</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={editCourse.title}
                    onChange={(e) => setEditCourse({...editCourse, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editCourse.description}
                    onChange={(e) => setEditCourse({...editCourse, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={editCourse.thumbnail}
                    onChange={(e) => setEditCourse({...editCourse, thumbnail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowEditCourseModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCourse}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
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
                    Folder Title
                  </label>
                  <input
                    type="text"
                    value={newFolder.title}
                    onChange={(e) => setNewFolder({...newFolder, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter folder title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newFolder.description}
                    onChange={(e) => setNewFolder({...newFolder, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the folder"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddFolderModal(false);
                    setNewFolder({ title: '', description: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFolder}
                  disabled={!newFolder.title.trim()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {showEditFolderModal && editingFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Folder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Folder Title
                  </label>
                  <input
                    type="text"
                    value={newFolder.title}
                    onChange={(e) => setNewFolder({...newFolder, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={newFolder.description}
                    onChange={(e) => setNewFolder({...newFolder, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditFolderModal(false);
                    setEditingFolder(null);
                    setNewFolder({ title: '', description: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFolder}
                  disabled={!newFolder.title.trim()}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}