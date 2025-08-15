import React, { useState } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Pin, 
  Users, 
  TrendingUp, 
  Calendar,
  Filter,
  ThumbsUp,
  Star,
  Trophy,
  Bell,
  HelpCircle,
  Rocket,
  CheckCircle,
  Image,
  Smile,
  Send,
  Paperclip,
  Link,
  Video,
  BarChart3,
  X,
  ChevronDown,
  Upload,
  Play,
  FileText,
  AlertCircle
} from 'lucide-react';
import { getCommunityPosts, createCommunityPost, togglePinPost } from '../lib/api/community';
import type { CommunityPostWithAuthor } from '../lib/api/community';

interface CommunityProps {
  userRole?: 'educator' | 'student';
}

export default function Community({ userRole = 'student' }: CommunityProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState<CommunityPostWithAuthor[]>([]);
  
  // Load posts on component mount
  React.useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const postsData = await getCommunityPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Pin/unpin post functionality (educators only)
  const handleTogglePin = async (postId: string) => {
    if (userRole !== 'educator') return;
    
    try {
      const updatedPost = await togglePinPost(postId);
      
      // Optimistic update
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, is_pinned: updatedPost.is_pinned } : post
      ));
    } catch (err) {
      console.error('Error toggling pin:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post');
    }
  };

  const filters = [
    { id: 'All', label: 'All', icon: null },
    { id: 'General', label: '💬 General', icon: null },
    { id: 'Questions', label: '❓ Questions', icon: null },
    { id: 'Wins', label: '🏆 #Wins', icon: null },
    { id: 'Introduction', label: '👋 Introduction', icon: null },
    { id: 'Announcements', label: '🚀 Announcements', icon: null }
  ];

  const categories = [
    { id: 'general', label: '💬 General', emoji: '💬' },
    { id: 'questions', label: '❓ Questions', emoji: '❓' },
    { id: 'wins', label: '🔔 #Wins', emoji: '🔔' },
    { id: 'introduction', label: '👋 Introduction', emoji: '👋' },
    { id: 'announcements', label: '🚀 Announcements', emoji: '🚀' }
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);


  // Handle post creation
  const handleCreatePost = async () => {
    if (!selectedCategory || !postBody.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const postData = {
        title: postTitle || 'Community Post',
        content: postBody,
        category: selectedCategory,
        image_url: attachedMedia.find(m => m.type === 'image')?.url || null,
        video_url: attachedMedia.find(m => m.type === 'video')?.url || null
      };

      const newPost = await createCommunityPost(postData);
      
      // Optimistic update - reload posts to get full data with author
      await loadPosts();
      
      // Reset form
      setPostTitle('');
      setPostBody('');
      setSelectedCategory('');
      setAttachedMedia([]);
      setShowPostModal(false);
      setShowCategoryDropdown(false);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      Array.from(files).forEach(file => {
        const mediaItem = {
          id: Date.now() + Math.random(),
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'file',
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size
        };
        setAttachedMedia(prev => [...prev, mediaItem]);
      });
      setIsUploading(false);
    }, 1000);
  };

  // Remove attached media
  const removeMedia = (mediaId: number) => {
    setAttachedMedia(prev => prev.filter(item => item.id !== mediaId));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Insert emoji
  const insertEmoji = (emoji: string) => {
    setPostBody(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Common emojis
  const commonEmojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏', '🚀'];

  // Check if post can be submitted
  const canSubmitPost = selectedCategory && postBody.trim().length > 0;

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Community</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={loadPosts}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowPostModal(false);
    setPostTitle('');
    setPostBody('');
    setSelectedCategory('');
    setAttachedMedia([]);
    setShowCategoryDropdown(false);
    setShowEmojiPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-6">
      {/* Post Creation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60"
            alt="Your avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <button
              type="text"
              onClick={() => setShowPostModal(true)}
              className="w-full px-4 py-3 bg-gray-50 rounded-full border-0 hover:bg-gray-100 transition-colors text-gray-600 text-left cursor-pointer"
            >
              Create a new post
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
        <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60'}
                  alt={post.author?.full_name || 'User'}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div className="flex items-center space-x-3 text-gray-600">
                  <span className="font-medium text-gray-900">{post.author?.full_name || 'Unknown User'}</span>
                  <span className="text-gray-500">{post.category}</span>
                  <span className="text-gray-500">{formatTimeAgo(post.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.is_pinned && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Pin className="w-4 h-4" />
                    <span className="text-sm">Pinned</span>
                  </div>
                )}
                {userRole === 'educator' && (
                  <button
                    onClick={() => handleTogglePin(post.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      post.is_pinned 
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={post.is_pinned ? 'Unpin post' : 'Pin post'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h3>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-6">
                  <p className="text-gray-700 leading-relaxed mb-3">{post.content}</p>
                </div>
                {post.image_url && (
                  <div className="flex-shrink-0">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Post Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comments}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {post.commentAvatars.slice(0, 3).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="Commenter"
                      className="w-6 h-6 rounded-full border-2 border-white object-cover bg-gray-200"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">New comment</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-gray-900">R Malik</span>
                  <span className="text-gray-500 ml-2">posting in</span>
                  <span className="font-medium text-gray-700 ml-1">Trainr Community</span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Title Field */}
              <div className="mb-4">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Title (optional but encouraged)"
                  className="w-full text-xl font-semibold placeholder-gray-400 border-0 focus:ring-0 p-0 bg-transparent resize-none"
                />
              </div>

              {/* Body Field */}
              <div className="mb-6">
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  placeholder="Write something..."
                  rows={6}
                  className="w-full placeholder-gray-400 border-0 focus:ring-0 p-0 bg-transparent resize-none text-gray-700"
                />
              </div>

              {/* Attached Media */}
              {attachedMedia.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {attachedMedia.map((media) => (
                      <div key={media.id} className="relative bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          {media.type === 'image' ? (
                            <img src={media.url} alt={media.name} className="w-12 h-12 object-cover rounded" />
                          ) : media.type === 'video' ? (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Play className="w-5 h-5 text-gray-600" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{media.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(media.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeMedia(media.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-blue-700">Uploading files...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              {/* Media Toolbar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* File Upload */}
                  <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Link */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Link className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Video */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Video className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Poll */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Emoji Picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                        <div className="grid grid-cols-6 gap-2">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => insertEmoji(emoji)}
                              className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <span className="font-medium">0</span>

                  {/* GIF */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <span className="font-medium">{post.comments_count || 0}</span>
                  </button>
                </div>

                {/* Category Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                      selectedCategory 
                        ? 'bg-gray-100 border-gray-300' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {selectedCategoryData ? (
                      <>
                        <span>{selectedCategoryData.emoji}</span>
                        <span className="font-medium text-gray-900">
                          {selectedCategoryData.label.replace(selectedCategoryData.emoji + ' ', '')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-600">Select a category</span>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      </>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {showCategoryDropdown && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-10">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                            selectedCategory === category.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                          }`}
                        >
                          <span>{category.emoji}</span>
                          <span>{category.label.replace(category.emoji + ' ', '')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!canSubmitPost}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    canSubmitPost
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      POSTING...
                    </>
                  ) : (
                    'POST'
                  )}
                </button>
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    canSubmitPost
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                <div className="text-sm text-gray-600">
                  {formatTimeAgo(post.created_at)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}