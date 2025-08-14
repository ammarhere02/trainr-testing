import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Download,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  Star,
  MessageCircle,
  ThumbsUp,
  Share2,
  Flag,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Edit3,
  Save,
  X,
  FileText,
  Video,
  Link,
  Plus,
  Trash2
} from 'lucide-react';

interface CourseLearningProps {
  courseId: number | null;
  onBack: () => void;
}

export default function CourseLearning({ courseId, onBack }: CourseLearningProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  
  // Edit states
  const [editVideoData, setEditVideoData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: ''
  });
  
  const [editContentData, setEditContentData] = useState({
    title: '',
    content: '',
    resources: [] as any[]
  });

  // Mock course data - in real app this would be fetched based on courseId
  const course = {
    id: courseId,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch',
    instructor: 'Dr. Angela Yu',
    totalLessons: 12,
    completedLessons: 4,
    totalDuration: '40 hours'
  };

  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: 'Introduction to Web Development',
      duration: '15:30',
      completed: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Welcome to the complete web development bootcamp! In this lesson, we\'ll cover what you\'ll learn throughout the course.',
      content: `
# Welcome to Web Development!

In this comprehensive introduction, we'll explore:

## What You'll Learn
- HTML fundamentals and semantic markup
- CSS styling and responsive design
- JavaScript programming basics
- Modern frameworks like React
- Backend development with Node.js
- Database integration with MongoDB

## Course Structure
This bootcamp is designed to take you from complete beginner to job-ready developer. Each lesson builds upon the previous one, ensuring you have a solid foundation before moving to advanced topics.

## Prerequisites
- No prior programming experience required
- A computer with internet access
- Willingness to practice and learn

## Getting Started
Make sure you have a code editor installed. We recommend Visual Studio Code, which is free and has excellent support for web development.

Let's begin your journey to becoming a web developer!
      `,
      resources: [
        { id: 1, name: 'Course Syllabus.pdf', type: 'pdf', url: '#' },
        { id: 2, name: 'Setup Guide.txt', type: 'text', url: '#' },
        { id: 3, name: 'VS Code Extensions.md', type: 'markdown', url: '#' }
      ]
    },
    {
      id: 2,
      title: 'HTML Fundamentals',
      duration: '22:45',
      completed: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Learn the building blocks of web pages with HTML elements, attributes, and semantic markup.',
      content: `
# HTML Fundamentals

HTML (HyperText Markup Language) is the foundation of all web pages. Let's dive into the essential concepts.

## Basic Structure
Every HTML document follows this basic structure:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Content goes here -->
</body>
</html>
\`\`\`

## Common Elements
- **Headings**: \`<h1>\` to \`<h6>\`
- **Paragraphs**: \`<p>\`
- **Links**: \`<a href="url">Link text</a>\`
- **Images**: \`<img src="image.jpg" alt="Description">\`
- **Lists**: \`<ul>\`, \`<ol>\`, \`<li>\`

## Semantic HTML
Use semantic elements to give meaning to your content:
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`

## Practice Exercise
Create a simple webpage about yourself using the elements we've learned.
      `,
      resources: [
        { id: 1, name: 'HTML Cheat Sheet.pdf', type: 'pdf', url: '#' },
        { id: 2, name: 'Practice Files.zip', type: 'zip', url: '#' }
      ]
    },
    {
      id: 3,
      title: 'CSS Styling Basics',
      duration: '28:15',
      completed: false,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Style your HTML with CSS properties, selectors, and the box model.',
      content: `
# CSS Styling Basics

CSS (Cascading Style Sheets) is what makes websites look beautiful and professional.

## CSS Syntax
\`\`\`css
selector {
    property: value;
    another-property: another-value;
}
\`\`\`

## Common Selectors
- **Element**: \`h1 { color: blue; }\`
- **Class**: \`.my-class { font-size: 16px; }\`
- **ID**: \`#my-id { background: red; }\`

## The Box Model
Every element is a box with:
- **Content**: The actual content
- **Padding**: Space inside the element
- **Border**: The border around the element
- **Margin**: Space outside the element

## Colors and Typography
- Colors: \`color\`, \`background-color\`
- Fonts: \`font-family\`, \`font-size\`, \`font-weight\`
- Text: \`text-align\`, \`line-height\`, \`letter-spacing\`

## Layout Basics
- \`display\`: block, inline, flex, grid
- \`position\`: static, relative, absolute, fixed
- \`float\` and \`clear\` (legacy)
      `,
      resources: [
        { id: 1, name: 'CSS Reference.pdf', type: 'pdf', url: '#' },
        { id: 2, name: 'Color Palette.png', type: 'image', url: '#' }
      ]
    }
  ]);

  const currentLessonData = lessons[currentLesson];

  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handleEditVideo = () => {
    setEditVideoData({
      title: currentLessonData.title,
      description: currentLessonData.description,
      videoUrl: currentLessonData.videoUrl,
      duration: currentLessonData.duration
    });
    setIsEditingVideo(true);
  };

  const handleEditContent = () => {
    setEditContentData({
      title: currentLessonData.title,
      content: currentLessonData.content,
      resources: [...currentLessonData.resources]
    });
    setIsEditingContent(true);
  };

  const handleSaveVideo = () => {
    const updatedLessons = lessons.map((lesson, index) => 
      index === currentLesson 
        ? {
            ...lesson,
            title: editVideoData.title,
            description: editVideoData.description,
            videoUrl: editVideoData.videoUrl,
            duration: editVideoData.duration
          }
        : lesson
    );
    setLessons(updatedLessons);
    setIsEditingVideo(false);
  };

  const handleSaveContent = () => {
    const updatedLessons = lessons.map((lesson, index) => 
      index === currentLesson 
        ? {
            ...lesson,
            title: editContentData.title,
            content: editContentData.content,
            resources: editContentData.resources
          }
        : lesson
    );
    setLessons(updatedLessons);
    setIsEditingContent(false);
  };

  const handleCancelVideoEdit = () => {
    setIsEditingVideo(false);
    setEditVideoData({
      title: '',
      description: '',
      videoUrl: '',
      duration: ''
    });
  };

  const handleCancelContentEdit = () => {
    setIsEditingContent(false);
    setEditContentData({
      title: '',
      content: '',
      resources: []
    });
  };

  const addResource = () => {
    const newResource = {
      id: Date.now(),
      name: 'New Resource.pdf',
      type: 'pdf',
      url: '#'
    };
    setEditContentData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };

  const updateResource = (id: number, field: string, value: string) => {
    setEditContentData(prev => ({
      ...prev,
      resources: prev.resources.map(resource => 
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const removeResource = (id: number) => {
    setEditContentData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== id)
    }));
  };

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No course selected</p>
      </div>
    );
  }

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
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Lesson {currentLesson + 1} of {lessons.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content - Video and Lesson Content Combined */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Section */}
              <div className="relative">
                <div className="aspect-video bg-black">
                  {getEmbedUrl(currentLessonData.videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(currentLessonData.videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLessonData.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-4">
                          <Play className="w-16 h-16 text-white ml-2" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{currentLessonData.title}</h3>
                        <p className="text-white/80">Video content will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Info Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {isEditingVideo ? (
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="text"
                          value={editVideoData.title}
                          onChange={(e) => setEditVideoData(prev => ({ ...prev, title: e.target.value }))}
                          className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none flex-1"
                          placeholder="Video title"
                        />
                        <button
                          onClick={handleSaveVideo}
                          className="p-2 text-green-600 hover:text-green-700"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleCancelVideoEdit}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{currentLessonData.title}</h2>
                          <p className="text-gray-600">{currentLessonData.description}</p>
                        </div>
                        <button
                          onClick={handleEditVideo}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Edit video"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{currentLessonData.duration}</span>
                    </div>
                    <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  {isEditingContent ? (
                    <div className="flex items-center space-x-3 flex-1">
                      <input
                        type="text"
                        value={editContentData.title}
                        onChange={(e) => setEditContentData(prev => ({ ...prev, title: e.target.value }))}
                        className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-purple-500 focus:outline-none flex-1"
                        placeholder="Lesson title"
                      />
                      <button
                        onClick={handleSaveContent}
                        className="p-2 text-green-600 hover:text-green-700"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancelContentEdit}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900">Lesson Content</h3>
                      <button
                        onClick={handleEditContent}
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Edit content"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {isEditingContent ? (
                  <div className="space-y-6">
                    {/* Content Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Content (Markdown supported)
                      </label>
                      <textarea
                        value={editContentData.content}
                        onChange={(e) => setEditContentData(prev => ({ ...prev, content: e.target.value }))}
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                        placeholder="Enter lesson content using Markdown..."
                      />
                    </div>

                    {/* Resources Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Lesson Resources
                        </label>
                        <button
                          onClick={addResource}
                          className="flex items-center text-purple-600 hover:text-purple-700 text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Resource
                        </button>
                      </div>
                      <div className="space-y-3">
                        {editContentData.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <input
                              type="text"
                              value={resource.name}
                              onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="Resource name"
                            />
                            <select
                              value={resource.type}
                              onChange={(e) => updateResource(resource.id, 'type', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            >
                              <option value="pdf">PDF</option>
                              <option value="text">Text</option>
                              <option value="markdown">Markdown</option>
                              <option value="zip">ZIP</option>
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                            <input
                              type="url"
                              value={resource.url}
                              onChange={(e) => updateResource(resource.id, 'url', e.target.value)}
                              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              placeholder="URL"
                            />
                            <button
                              onClick={() => removeResource(resource.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: currentLessonData.content
                          .replace(/\n/g, '<br>')
                          .replace(/#{3}\s(.+)/g, '<h3 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h3>')
                          .replace(/#{2}\s(.+)/g, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
                          .replace(/#{1}\s(.+)/g, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
                          .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
                          .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
                          .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
                      }}
                    />

                    {/* Resources */}
                    {currentLessonData.resources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Lesson Resources</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {currentLessonData.resources.map((resource) => (
                            <a
                              key={resource.id}
                              href={resource.url}
                              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="bg-white rounded-lg p-2 shadow-sm">
                                <FileText className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{resource.name}</h5>
                                <p className="text-sm text-gray-600 capitalize">{resource.type} file</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={currentLesson === 0}
                    className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous Lesson
                  </button>
                  
                  <button
                    onClick={handleNextLesson}
                    disabled={currentLesson === lessons.length - 1}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Lesson
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentLesson
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        lesson.completed
                          ? 'bg-green-100 text-green-600'
                          : index === currentLesson
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${
                          index === currentLesson ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-600">{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Course Progress */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Course Progress</span>
                  <span className="font-medium">{Math.round(((currentLesson + 1) / lessons.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Video Modal */}
      {isEditingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Video</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Title
                  </label>
                  <input
                    type="text"
                    value={editVideoData.title}
                    onChange={(e) => setEditVideoData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Description
                  </label>
                  <textarea
                    value={editVideoData.description}
                    onChange={(e) => setEditVideoData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Enter video description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={editVideoData.videoUrl}
                    onChange={(e) => setEditVideoData(prev => ({ ...prev, videoUrl: e.target.value }))}
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
                    value={editVideoData.duration}
                    onChange={(e) => setEditVideoData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="15:30"
                  />
                </div>

                {/* Video Preview */}
                {editVideoData.videoUrl && getEmbedUrl(editVideoData.videoUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Preview
                    </label>
                    <div className="bg-black rounded-lg overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src={getEmbedUrl(editVideoData.videoUrl)}
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

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={handleCancelVideoEdit}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveVideo}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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