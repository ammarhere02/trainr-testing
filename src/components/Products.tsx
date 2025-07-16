import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  BookOpen,
  Video,
  FileText,
  Globe,
  Lock,
  Settings,
  Share2,
  ExternalLink,
  Tag,
  Zap,
  Award,
  Target,
  PlayCircle,
  PauseCircle,
  Image,
  Upload
} from 'lucide-react';

interface ProductsProps {
  onStartLearning: (courseId: number) => void;
}

export default function Products({ onStartLearning }: ProductsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    price: '',
    description: '',
    category: 'web-development',
    status: 'draft',
    thumbnail: '',
    duration: '',
    lessons: '',
    level: 'beginner',
    tags: '',
    isPublic: true,
    allowPreview: true
  });

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      price: 199,
      originalPrice: 299,
      description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
      category: 'web-development',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '40 hours',
      lessons: 156,
      level: 'beginner',
      students: 2847,
      rating: 4.8,
      reviews: 1234,
      revenue: 567430,
      sales: 2847,
      createdDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
      isPublic: true,
      allowPreview: true,
      previewUrl: 'https://trainr.app/preview/web-dev-bootcamp',
      salesUrl: 'https://trainr.app/course/web-dev-bootcamp'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      price: 149,
      originalPrice: null,
      description: 'Master advanced React patterns including hooks, context, HOCs, and performance optimization.',
      category: 'programming',
      status: 'published',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '25 hours',
      lessons: 89,
      level: 'advanced',
      students: 1532,
      rating: 4.9,
      reviews: 687,
      revenue: 228280,
      sales: 1532,
      createdDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      tags: ['React', 'JavaScript', 'Hooks', 'Performance'],
      isPublic: true,
      allowPreview: true,
      previewUrl: 'https://trainr.app/preview/advanced-react',
      salesUrl: 'https://trainr.app/course/advanced-react'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      price: 99,
      originalPrice: 149,
      description: 'Learn the principles of user interface and user experience design with hands-on projects.',
      category: 'design',
      status: 'draft',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '18 hours',
      lessons: 67,
      level: 'intermediate',
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      sales: 0,
      createdDate: '2024-01-12',
      lastUpdated: '2024-01-19',
      tags: ['Design', 'UI', 'UX', 'Figma'],
      isPublic: false,
      allowPreview: false,
      previewUrl: '',
      salesUrl: ''
    },
    {
      id: 4,
      title: 'Python for Data Science',
      price: 179,
      originalPrice: 249,
      description: 'Learn Python programming for data analysis, visualization, and machine learning.',
      category: 'data-science',
      status: 'scheduled',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '35 hours',
      lessons: 124,
      level: 'intermediate',
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      sales: 0,
      createdDate: '2024-01-14',
      lastUpdated: '2024-01-21',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      isPublic: false,
      allowPreview: false,
      previewUrl: '',
      salesUrl: ''
    }
  ]);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return CheckCircle;
      case 'draft':
        return FileText;
      case 'scheduled':
        return Clock;
      case 'archived':
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  // Get type icon
  const getTypeIcon = () => {
    return BookOpen;
  };

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle create course
  const handleCreateCourse = () => {
    const courseData = {
      id: Date.now(),
      title: newCourse.title,
      price: parseFloat(newCourse.price),
      originalPrice: null,
      description: newCourse.description,
      category: newCourse.category,
      status: newCourse.status,
      thumbnail: newCourse.thumbnail || 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: newCourse.duration,
      lessons: newCourse.lessons ? parseInt(newCourse.lessons) : null,
      level: newCourse.level,
      students: 0,
      rating: 0,
      reviews: 0,
      revenue: 0,
      sales: 0,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: newCourse.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublic: newCourse.isPublic,
      allowPreview: newCourse.allowPreview,
      previewUrl: '',
      salesUrl: ''
    };

    setCourses(prev => [courseData, ...prev]);
    setShowCreateModal(false);
    setNewCourse({
      title: '',
      price: '',
      description: '',
      category: 'web-development',
      status: 'draft',
      thumbnail: '',
      duration: '',
      lessons: '',
      level: 'beginner',
      tags: '',
      isPublic: true,
      allowPreview: true
    });
  };

  // Toggle course status
  const toggleCourseStatus = (courseId: number) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            status: course.status === 'published' ? 'draft' : 'published',
            lastUpdated: new Date().toISOString().split('T')[0]
          } 
        : course
    ));
  };

  // Delete course
  const deleteCourse = (courseId: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  // Copy course URL
  const copyCourseUrl = (course: any) => {
    const url = course.status === 'published' ? course.salesUrl : course.previewUrl;
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Course URL copied to clipboard!');
    }
  };

  // Calculate stats
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    totalRevenue: courses.reduce((sum, c) => sum + c.revenue, 0),
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your online courses</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
            
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {filteredCourses.length} of {courses.length} courses
            </span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const StatusIcon = getStatusIcon(course.status);
          const TypeIcon = getTypeIcon();
          
          return (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {course.status}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
                    <TypeIcon className="w-3 h-3 mr-1" />
                    Course
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  {course.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-900">${course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                    )}
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.reviews})</span>
                    </div>
                  )}
                </div>

                {course.status === 'published' && (
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{course.students.toLocaleString()}</div>
                      <div className="text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-green-600">${course.revenue.toLocaleString()}</div>
                      <div className="text-gray-600">Revenue</div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                  {course.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{course.tags.length - 3}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCourseStatus(course.id)}
                      className={`p-1 rounded transition-colors ${
                        course.status === 'published' 
                          ? 'text-gray-400 hover:text-red-600' 
                          : 'text-gray-400 hover:text-green-600'
                      }`}
                      title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {course.status === 'published' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => copyCourseUrl(course)}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors" 
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteCourse(course.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {course.status === 'published' && (
                    <a
                      href={course.salesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 transition-colors"
                      title="View Course"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Create New Course</h3>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter course title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="99"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select 
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="web-development">Web Development</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="data-science">Data Science</option>
                      <option value="marketing">Marketing</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select 
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the course"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="40 hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Lessons
                    </label>
                    <input
                      type="number"
                      value={newCourse.lessons}
                      onChange={(e) => setNewCourse({...newCourse, lessons: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="156"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select 
                      value={newCourse.status}
                      onChange={(e) => setNewCourse({...newCourse, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={newCourse.tags}
                      onChange={(e) => setNewCourse({...newCourse, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="HTML, CSS, JavaScript, React"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Public Course</span>
                      <p className="text-xs text-gray-500">Visible in public catalog</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newCourse.isPublic}
                      onChange={(e) => setNewCourse({...newCourse, isPublic: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Preview</span>
                      <p className="text-xs text-gray-500">Enable preview for potential customers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={newCourse.allowPreview}
                      onChange={(e) => setNewCourse({...newCourse, allowPreview: e.target.checked})}
                      className="rounded"
                    />
                  </div>
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
                  onClick={handleCreateCourse}
                  disabled={!newCourse.title || !newCourse.price}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}