import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar, 
  Clock, 
  FileVideo, 
  Eye, 
  Share2, 
  Edit3, 
  MoreHorizontal, 
  Upload, 
  Plus, 
  SortAsc, 
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  ExternalLink,
  Copy,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  X,
  AlertCircle
} from 'lucide-react';
import { videoStorage, StoredVideo } from '../utils/videoStorage';

export default function VideoLibrary() {
  const [recordings, setRecordings] = useState<StoredVideo[]>([]);
  const [videoUrls, setVideoUrls] = useState<{ [key: number]: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load recordings from localStorage
  useEffect(() => {
    const loadRecordings = async () => {
      setIsLoading(true);
      try {
        await videoStorage.init();
        const videos = await videoStorage.getAllVideos();
        setRecordings(videos);
        
        // Create blob URLs for all videos
        const urls: { [key: number]: string } = {};
        videos.forEach(video => {
          urls[video.id] = videoStorage.createVideoURL(video.blob);
        });
        setVideoUrls(urls);
      } catch (error) {
        console.error('Error loading recordings:', error);
        setRecordings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecordings();
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(videoUrls).forEach(url => {
        videoStorage.revokeVideoURL(url);
      });
    };
  }, [videoUrls]);

  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(recording => {
      const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || 
        (filterType === 'screen' && recording.mode === 'screen') ||
        (filterType === 'camera' && recording.mode === 'camera');
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredRecordings.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const paginatedRecordings = filteredRecordings.slice(startIndex, startIndex + videosPerPage);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play video function
  const playVideo = (recording: any) => {
    // Create a fresh blob URL for playback
    if (recording.blob) {
      const videoUrl = URL.createObjectURL(recording.blob);
      setSelectedVideo({ ...recording, videoUrl });
      setShowVideoModal(true);
    } else {
      alert('Video file not available for playback.');
    }
  };

  // Delete recording
  const deleteRecording = async (id: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      try {
        // Revoke blob URL
        if (videoUrls[id]) {
          videoStorage.revokeVideoURL(videoUrls[id]);
          setVideoUrls(prev => {
            const newUrls = { ...prev };
            delete newUrls[id];
            return newUrls;
          });
        }
        
        await videoStorage.deleteVideo(id);
        setRecordings(prev => prev.filter(r => r.id !== id));
        
        if (selectedVideo && selectedVideo.id === id) {
          setShowVideoModal(false);
          setSelectedVideo(null);
        }
      } catch (error) {
        console.error('Error deleting recording:', error);
        alert('Failed to delete recording. Please try again.');
      }
    }
  };

  // Download recording (for cloud-stored videos)
  const downloadRecording = (recording: any) => {
    if (recording.blob) {
      const videoUrl = URL.createObjectURL(recording.blob);
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `${recording.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);
    } else {
      alert('Video file not available for download.');
    }
  };

  // Copy video link
  const copyVideoLink = (recording: any) => {
    const videoUrl = videoUrls[recording.id];
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      alert('Video link copied to clipboard!');
    } else {
      alert('No video link available.');
    }
  };

  // Select/deselect video
  const toggleVideoSelection = (id: number) => {
    setSelectedVideos(prev => 
      prev.includes(id) 
        ? prev.filter(videoId => videoId !== id)
        : [...prev, id]
    );
  };

  // Select all videos
  const selectAllVideos = () => {
    if (selectedVideos.length === paginatedRecordings.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(paginatedRecordings.map(r => r.id));
    }
  };

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedVideos.length} recording(s)?`)) {
      try {
        // Revoke blob URLs for selected videos
        selectedVideos.forEach(id => {
          if (videoUrls[id]) {
            videoStorage.revokeVideoURL(videoUrls[id]);
          }
        });
        
        await videoStorage.deleteMultipleVideos(selectedVideos);
        setRecordings(prev => prev.filter(r => !selectedVideos.includes(r.id)));
        setVideoUrls(prev => {
          const newUrls = { ...prev };
          selectedVideos.forEach(id => delete newUrls[id]);
          return newUrls;
        });
        setSelectedVideos([]);
      } catch (error) {
        console.error('Error deleting recordings:', error);
        alert('Failed to delete recordings. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
          <p className="text-gray-600 mt-2">Manage your recorded videos and content</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Video
          </button>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New Recording
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Videos</p>
              <p className="text-2xl font-bold text-gray-900">{recordings.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(recordings.reduce((total, r) => total + r.duration, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatFileSize(recordings.reduce((total, r) => total + r.size, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cloud Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {recordings.filter(r => r.cloudflareId).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="screen">Screen Recordings</option>
              <option value="camera">Camera Recordings</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="duration">Sort by Duration</option>
              <option value="size">Sort by Size</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {selectedVideos.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedVideos.length} selected</span>
                <button
                  onClick={bulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && recordings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recordings yet</h3>
          <p className="text-gray-600 mb-6">Start recording to build your video library</p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center mx-auto">
            <Plus className="w-5 h-5 mr-2" />
            Start Recording
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-purple-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading videos...</h3>
          <p className="text-gray-600">Please wait while we load your video library</p>
        </div>
      )}

      {/* Videos Grid/List */}
      {!isLoading && recordings.length > 0 && (
        <>
          {/* Bulk Actions */}
          {recordings.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedVideos.length === paginatedRecordings.length && paginatedRecordings.length > 0}
                  onChange={selectAllVideos}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">
                  Select all ({paginatedRecordings.length})
                </span>
              </div>
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + videosPerPage, filteredRecordings.length)} of {filteredRecordings.length} videos
              </span>
            </div>
          )}

          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedRecordings.map((recording) => (
                <div key={recording.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    {/* Video Thumbnail */}
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      {recording.thumbnail ? (
                        <img
                          src={recording.thumbnail}
                          alt={recording.title}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => playVideo(recording)}
                        />
                      ) : (
                        <div 
                          className="relative w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center cursor-pointer"
                          onClick={() => playVideo(recording)}
                        >
                          <div className="text-center text-white">
                            <Video className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm font-medium">
                              {recording.mode === 'camera' ? 'Camera Recording' : 'Screen Recording'}
                            </p>
                            <p className="text-xs opacity-80">Click to play</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => playVideo(recording)}
                        className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                      >
                        <Play className="w-6 h-6 text-purple-600" />
                      </button>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {formatDuration(recording.duration)}
                    </div>

                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedVideos.includes(recording.id)}
                        onChange={() => toggleVideoSelection(recording.id)}
                        className="rounded"
                      />
                    </div>

                    {/* Recording Type Badge */}
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {recording.mode || 'screen'}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{new Date(recording.date).toLocaleDateString()}</span>
                      <span>{formatFileSize(recording.size)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="capitalize">{recording.mode || 'screen'} recording</span>
                      <span>{recording.type?.split('/')[1]?.toUpperCase() || 'WEBM'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadRecording(recording)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyVideoLink(recording)}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteRecording(recording.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedVideos.length === paginatedRecordings.length && paginatedRecordings.length > 0}
                          onChange={selectAllVideos}
                          className="rounded"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedRecordings.map((recording) => (
                      <tr key={recording.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedVideos.includes(recording.id)}
                            onChange={() => toggleVideoSelection(recording.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-gray-900 rounded overflow-hidden flex items-center justify-center">
                              {recording.thumbnail ? (
                                <img
                                  src={recording.thumbnail}
                                  alt={recording.title}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => playVideo(recording)}
                                />
                              ) : (
                                <button 
                                  onClick={() => playVideo(recording)}
                                  className="text-white hover:text-purple-300 transition-colors"
                                >
                                  <Play className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{recording.title}</div>
                              <div className="text-sm text-gray-500 capitalize">{recording.mode || 'screen'} recording</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{formatDuration(recording.duration)}</td>
                        <td className="py-3 px-4 text-gray-900">{formatFileSize(recording.size)}</td>
                        <td className="py-3 px-4 text-gray-900">
                          {new Date(recording.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                            {recording.type?.split('/')[1]?.toUpperCase() || 'WEBM'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                            {recording.mode || 'screen'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => downloadRecording(recording)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => copyVideoLink(recording)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="Copy Link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteRecording(recording.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Video Player Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{formatDuration(selectedVideo.duration)}</span>
                  <span>{formatFileSize(selectedVideo.size)}</span>
                  <span>{new Date(selectedVideo.date).toLocaleDateString()}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                    {selectedVideo.mode || 'screen'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-gray-900">
              {selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                        onError={(e) => {
                          console.error('Video playback error:', e);
                          alert('Failed to play video. The video file may be corrupted.');
                        }}
                  onLoadStart={() => console.log('Video loading started')}
                  onCanPlay={() => console.log('Video can play')}
                  autoPlay
                  className="w-full h-full"
                  title={selectedVideo.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-medium">Video not available</p>
                    <p className="text-sm opacity-80">The video file could not be loaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => downloadRecording(selectedVideo)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => copyVideoLink(selectedVideo)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
                <button
                  onClick={() => deleteRecording(selectedVideo.id)}
                    // Clean up the video URL when closing modal
                    if (selectedVideo.videoUrl) {
                      URL.revokeObjectURL(selectedVideo.videoUrl);
                    }
                    setSelectedVideo(null);
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}