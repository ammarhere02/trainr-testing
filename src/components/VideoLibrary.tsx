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
  TrendingUp
} from 'lucide-react';

export default function VideoLibrary() {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);

  // Load recordings from localStorage
  useEffect(() => {
    const loadRecordings = () => {
      const saved = localStorage.getItem('recordings');
      if (saved) {
        try {
          const parsedRecordings = JSON.parse(saved);
          setRecordings(parsedRecordings);
        } catch (error) {
          console.error('Error loading recordings:', error);
          setRecordings([]);
        }
      }
    };

    loadRecordings();
    
    // Listen for storage changes to update when new recordings are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'recordings') {
        loadRecordings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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

  // Delete recording
  const deleteRecording = (id: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      const updatedRecordings = recordings.filter(r => r.id !== id);
      setRecordings(updatedRecordings);
      localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
    }
  };

  // Download recording (for cloud-stored videos)
  const downloadRecording = (recording: any) => {
    // For cloud videos, we'd need to fetch the video URL
    // For now, show a message about cloud download
    if (recording.cloudflareId) {
      alert('Cloud video download feature coming soon!');
    } else {
      alert('Local video file not available for download.');
    }
  };

  // Copy video link
  const copyVideoLink = (recording: any) => {
    if (recording.cloudflareId) {
      const link = `https://trainr.app/video/${recording.cloudflareId}`;
      navigator.clipboard.writeText(link);
      alert('Video link copied to clipboard!');
    } else {
      alert('No shareable link available for this recording.');
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
  const bulkDelete = () => {
    if (selectedVideos.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedVideos.length} recording(s)?`)) {
      const updatedRecordings = recordings.filter(r => !selectedVideos.includes(r.id));
      setRecordings(updatedRecordings);
      localStorage.setItem('recordings', JSON.stringify(updatedRecordings));
      setSelectedVideos([]);
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

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
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
      {recordings.length === 0 && (
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

      {/* Videos Grid/List */}
      {recordings.length > 0 && (
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
                      <div className="text-center text-white">
                        <FileVideo className="w-12 h-12 mx-auto mb-2 opacity-60" />
                        <p className="text-sm opacity-80">Video Recording</p>
                      </div>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
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

                    {/* Cloud Badge */}
                    {recording.cloudflareId && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                        Cloud
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{new Date(recording.date).toLocaleDateString()}</span>
                      <span>{formatFileSize(recording.size)}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="capitalize">{recording.mode || 'screen'} recording</span>
                      <span>{recording.type?.toUpperCase() || 'WEBM'}</span>
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
                            <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center">
                              <Play className="w-3 h-3 text-white" />
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
                            {recording.type?.toUpperCase() || 'WEBM'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {recording.cloudflareId ? (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              Cloud
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              Local
                            </span>
                          )}
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
    </div>
  );
}