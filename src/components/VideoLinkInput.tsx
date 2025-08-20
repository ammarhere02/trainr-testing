import React, { useState } from 'react';
import { Video, ExternalLink, Play, AlertCircle, CheckCircle, X } from 'lucide-react';

interface VideoLinkInputProps {
  onVideoAdd: (videoData: {
    url: string;
    source: 'youtube' | 'loom';
    title?: string;
    thumbnail?: string;
    duration?: string;
  }) => void;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

export default function VideoLinkInput({ 
  onVideoAdd, 
  onCancel, 
  placeholder = "Paste YouTube or Loom link here...",
  className = ""
}: VideoLinkInputProps) {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    source?: 'youtube' | 'loom';
    videoId?: string;
    title?: string;
    thumbnail?: string;
    error?: string;
  } | null>(null);

  // YouTube URL patterns
  const youtubePatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /youtube\.com\/watch\?v=([^"&?\/\s]{11})/,
    /youtu\.be\/([^"&?\/\s]{11})/,
    /youtube\.com\/embed\/([^"&?\/\s]{11})/
  ];

  // Loom URL patterns
  const loomPatterns = [
    /loom\.com\/share\/([a-f0-9]{32})/,
    /loom\.com\/embed\/([a-f0-9]{32})/
  ];

  const detectVideoSource = (url: string): { source: 'youtube' | 'loom' | null; videoId: string | null } => {
    // Check YouTube patterns
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        return { source: 'youtube', videoId: match[1] };
      }
    }

    // Check Loom patterns
    for (const pattern of loomPatterns) {
      const match = url.match(pattern);
      if (match) {
        return { source: 'loom', videoId: match[1] };
      }
    }

    return { source: null, videoId: null };
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getLoomThumbnail = (videoId: string): string => {
    return `https://cdn.loom.com/sessions/thumbnails/${videoId}-with-play.gif`;
  };

  const getYouTubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getLoomEmbedUrl = (videoId: string): string => {
    return `https://www.loom.com/embed/${videoId}`;
  };

  const validateUrl = async (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setValidationResult(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const detection = detectVideoSource(inputUrl);
      
      if (!detection.source || !detection.videoId) {
        setValidationResult({
          isValid: false,
          error: 'Please enter a valid YouTube or Loom URL'
        });
        return;
      }

      // Get video metadata
      let title = '';
      let thumbnail = '';

      if (detection.source === 'youtube') {
        title = 'YouTube Video';
        thumbnail = getYouTubeThumbnail(detection.videoId);
      } else if (detection.source === 'loom') {
        title = 'Loom Recording';
        thumbnail = getLoomThumbnail(detection.videoId);
      }

      setValidationResult({
        isValid: true,
        source: detection.source,
        videoId: detection.videoId,
        title,
        thumbnail
      });

    } catch (error) {
      setValidationResult({
        isValid: false,
        error: 'Failed to validate video URL'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateUrl(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleAddVideo = () => {
    if (validationResult?.isValid && validationResult.source && validationResult.videoId) {
      onVideoAdd({
        url: url,
        source: validationResult.source,
        title: validationResult.title,
        thumbnail: validationResult.thumbnail,
      });
      
      // Reset form
      setUrl('');
      setValidationResult(null);
    }
  };

  const handleCancel = () => {
    setUrl('');
    setValidationResult(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Add Video</h3>
          <p className="text-sm text-gray-600">Insert a YouTube or Loom video</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
              </div>
            )}
            {validationResult && !isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {validationResult.isValid ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          
          {/* Validation Message */}
          {validationResult && !isValidating && (
            <div className={`mt-2 text-sm ${validationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validationResult.isValid ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Valid {validationResult.source} video detected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{validationResult.error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Preview */}
        {validationResult?.isValid && validationResult.thumbnail && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={validationResult.thumbnail}
                  alt="Video thumbnail"
                  className="w-20 h-15 object-cover rounded-lg"
                  onError={(e) => {
                    // Fallback for broken thumbnails
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMkw0OCAzMEwzMiAzOFYyMloiIGZpbGw9IiM2QjdCODAiLz4KPC9zdmc+';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{validationResult.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    validationResult.source === 'youtube' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {validationResult.source === 'youtube' ? '📺 YouTube' : '🔴 Loom'}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supported Formats Help */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Supported Video Formats:</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">📺</span>
              <span><strong>YouTube:</strong> youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">🔴</span>
              <span><strong>Loom:</strong> loom.com/share/..., loom.com/embed/...</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAddVideo}
            disabled={!validationResult?.isValid}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Video className="w-4 h-4 mr-2" />
            Add Video
          </button>
        </div>
      </div>
    </div>
  );
}