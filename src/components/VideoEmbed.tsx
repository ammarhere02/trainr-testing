import React, { useState } from 'react';
import { Play, ExternalLink, Maximize, Volume2, VolumeX, Edit3 } from 'lucide-react';

interface VideoEmbedProps {
  url: string;
  source: 'youtube' | 'loom';
  title?: string;
  thumbnail?: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export default function VideoEmbed({
  url,
  source,
  title,
  thumbnail,
  className = "",
  autoplay = false,
  controls = true,
  onEdit,
  onRemove
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const getVideoId = (url: string, source: 'youtube' | 'loom'): string | null => {
    if (source === 'youtube') {
      const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
        /youtube\.com\/watch\?v=([^"&?\/\s]{11})/,
        /youtu\.be\/([^"&?\/\s]{11})/,
        /youtube\.com\/embed\/([^"&?\/\s]{11})/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
    } else if (source === 'loom') {
      const patterns = [
        /loom\.com\/share\/([a-f0-9]{32})/,
        /loom\.com\/embed\/([a-f0-9]{32})/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
      }
    }
    
    return null;
  };

  const getEmbedUrl = (): string => {
    const videoId = getVideoId(url, source);
    if (!videoId) return '';

    if (source === 'youtube') {
      const params = new URLSearchParams();
      if (autoplay) params.set('autoplay', '1');
      if (!controls) params.set('controls', '0');
      params.set('rel', '0');
      params.set('modestbranding', '1');
      
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } else if (source === 'loom') {
      const params = new URLSearchParams();
      if (autoplay) params.set('autoplay', 'true');
      if (!controls) params.set('hide_owner', 'true');
      
      return `https://www.loom.com/embed/${videoId}?${params.toString()}`;
    }

    return '';
  };

  const getThumbnailUrl = (): string => {
    const videoId = getVideoId(url, source);
    if (!videoId) return '';

    if (source === 'youtube') {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (source === 'loom') {
      return `https://cdn.loom.com/sessions/thumbnails/${videoId}-with-play.gif`;
    }

    return '';
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const embedUrl = getEmbedUrl();
  const thumbnailUrl = thumbnail || getThumbnailUrl();

  if (!embedUrl) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Invalid video URL</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Video Player or Thumbnail */}
      <div className="aspect-video relative">
        {isPlaying ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || 'Video'}
          />
        ) : (
          <div 
            className="relative w-full h-full cursor-pointer group"
            onClick={handlePlay}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback thumbnail
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMzYwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0yNTYgMTQ0TDM4NCAxODBMMjU2IDIxNlYxNDRaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==';
              }}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-gray-800 ml-1" />
              </div>
            </div>

            {/* Video Source Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                source === 'youtube' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                {source === 'youtube' ? '📺 YouTube' : '🔴 Loom'}
              </span>
            </div>

            {/* Controls Overlay */}
            {showControls && (onEdit || onRemove) && (
              <div className="absolute top-3 right-3 flex items-center space-x-2">
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="p-2 bg-black/70 hover:bg-black/80 text-white rounded-lg transition-colors"
                    title="Edit video"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="p-2 bg-black/70 hover:bg-black/80 text-white rounded-lg transition-colors"
                    title="Remove video"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* External Link */}
            <div className="absolute bottom-3 right-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-black/70 hover:bg-black/80 text-white rounded-lg transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      {title && (
        <div className="p-4 bg-white">
          <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${
              source === 'youtube' ? 'text-red-600' : 'text-purple-600'
            }`}>
              {source === 'youtube' ? 'YouTube' : 'Loom'}
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}