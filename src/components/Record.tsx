import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Camera, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Settings, 
  ArrowLeft, 
  Clock, 
  Users, 
  Eye, 
  Share2, 
  Trash2, 
  Edit3, 
  MoreHorizontal, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  FileVideo, 
  Maximize, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'screen' | 'camera' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedRecording, setCompletedRecording] = useState<any>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: 'unknown' | 'granted' | 'denied',
    microphone: 'unknown' | 'granted' | 'denied'
  }>({
    camera: 'unknown',
    microphone: 'unknown'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const processAndDownloadVideo = async (recordedChunks: Blob[]) => {
    try {
      setIsProcessing(true);
      
      // Create blob from recorded chunks
      const blob = new Blob(recordedChunks, { type: 'video/mp4' });
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.mp4`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check permissions
  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermissionStatus({
        camera: cameraPermission.state as 'granted' | 'denied',
        microphone: microphonePermission.state as 'granted' | 'denied'
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  // Start screen recording
  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: isAudioOn
      });

      streamRef.current = stream;
      setRecordingType('screen');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        processAndDownloadVideo(chunks);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Handle stream end (user stops sharing)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

    } catch (error) {
      console.error('Error starting screen recording:', error);
      alert('Failed to start screen recording. Please check permissions.');
    }
  };

  // Start camera recording
  const startCameraRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn
      });

      streamRef.current = stream;
      setRecordingType('camera');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        processAndDownloadVideo(chunks);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

    } catch (error) {
      console.error('Error starting camera recording:', error);
      alert('Failed to start camera recording. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setRecordingType(null);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const [recordings] = useState([
    {
      id: 1,
      title: 'React Hooks Tutorial',
      duration: '15:32',
      size: '245 MB',
      date: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 1247,
      type: 'screen'
    },
    {
      id: 2,
      title: 'JavaScript Best Practices',
      duration: '22:15',
      size: '387 MB',
      date: '2024-01-12',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 856,
      type: 'camera'
    },
    {
      id: 3,
      title: 'CSS Grid Layout Demo',
      duration: '18:45',
      size: '298 MB',
      date: '2024-01-10',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 634,
      type: 'screen'
    }
  ]);

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
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center space-x-4">
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium">Recording</span>
                <span className="text-red-600">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Record</h1>
            <p className="text-gray-600 mt-2">Create video content for your courses</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recording Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Preview */}
              <div className="relative bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full aspect-video object-cover"
                />
                
                {!isRecording && !streamRef.current && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Ready to Record</h3>
                      <p className="text-gray-300">Choose screen or camera recording to get started</p>
                    </div>
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    REC {formatTime(recordingTime)}
                  </div>
                )}

                {/* Recording Type Indicator */}
                {recordingType && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    {recordingType === 'screen' ? (
                      <>
                        <Monitor className="w-4 h-4 mr-1" />
                        Screen
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-1" />
                        Camera
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                {!isRecording ? (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={startScreenRecording}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Monitor className="w-5 h-5 mr-2" />
                      Record Screen
                    </button>
                    <button
                      onClick={startCameraRecording}
                      className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Record Camera
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-colors ${
                          isVideoOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 hover:bg-red-200'
                        }`}
                        title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                      >
                        {isVideoOn ? (
                          <Video className="w-5 h-5 text-gray-700" />
                        ) : (
                          <VideoOff className="w-5 h-5 text-red-600" />
                        )}
                      </button>

                      <button
                        onClick={toggleAudio}
                        className={`p-3 rounded-full transition-colors ${
                          isAudioOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 hover:bg-red-200'
                        }`}
                        title={isAudioOn ? 'Mute' : 'Unmute'}
                      >
                        {isAudioOn ? (
                          <Mic className="w-5 h-5 text-gray-700" />
                        ) : (
                          <MicOff className="w-5 h-5 text-red-600" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={stopRecording}
                      className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Processing Recording</h4>
                    <p className="text-blue-700 text-sm">Your video is being processed and will download automatically...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recording Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recording Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Video Quality</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>1080p HD</option>
                    <option>720p</option>
                    <option>480p</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Frame Rate</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>30 FPS</option>
                    <option>60 FPS</option>
                    <option>24 FPS</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Audio Quality</span>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recording Tips</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ensure good lighting for camera recordings</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use a quiet environment for better audio</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Close unnecessary apps before screen recording</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Test your microphone before starting</span>
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Storage</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium">15.2 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '15.2%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium">84.8 GB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Recordings */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Recordings</h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={recording.thumbnail}
                    alt={recording.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
                      <Play className="w-6 h-6 text-purple-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {recording.duration}
                  </div>
                  <div className="absolute top-2 left-2">
                    {recording.type === 'screen' ? (
                      <Monitor className="w-4 h-4 text-white" />
                    ) : (
                      <Camera className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{recording.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{recording.date}</span>
                    <span>{recording.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      <span>{recording.views}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}