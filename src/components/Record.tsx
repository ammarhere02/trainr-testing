import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Settings, 
  Monitor, 
  Camera, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Share2,
  Edit3,
  Save,
  X,
  Loader,
  Zap,
  Target,
  Users,
  BookOpen
} from 'lucide-react';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen' | 'both'>('camera');
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');
  const [recordingDescription, setRecordingDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
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
  }, [isRecording, isPaused]);

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

  // Initialize camera/screen
  const initializeMedia = async () => {
    try {
      let stream: MediaStream;

      if (recordingMode === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
      } else if (recordingMode === 'screen') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (isAudioOn) {
          // Combine screen video with microphone audio
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
          
          const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
          ]);
          stream = combinedStream;
        } else {
          stream = screenStream;
        }
      } else { // both
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        // For demo purposes, we'll use camera stream
        // In real app, you'd combine both streams
        stream = cameraStream;
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error('Failed to initialize media:', err);
      alert('Failed to access camera/microphone. Please check permissions.');
      throw err;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await initializeMedia();
      
      recordedChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsProcessing(true);
        
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
          setHasRecording(true);
          setShowSaveModal(true);
        }, 2000);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Reset recording
  const resetRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    
    setRecordingTime(0);
    setHasRecording(false);
    recordedChunksRef.current = [];
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Download recording
  const downloadRecording = () => {
    if (recordedChunksRef.current.length === 0) return;

    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recordingTitle || 'recording'}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save to library
  const saveToLibrary = () => {
    if (recordedChunksRef.current.length === 0) return;

    // In real app, this would upload to your video library
    console.log('Saving to library:', {
      title: recordingTitle,
      description: recordingDescription,
      duration: formatTime(recordingTime),
      size: recordedChunksRef.current.reduce((total, chunk) => total + chunk.size, 0)
    });

    // Simulate save process
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSaveModal(false);
      alert('Recording saved to your video library!');
      resetRecording();
    }, 1500);
  };

  // Toggle video
  const toggleVideo = async () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(!isAudioOn);
  };

  // Change recording mode
  const changeRecordingMode = async (mode: 'camera' | 'screen' | 'both') => {
    if (isRecording) {
      alert('Cannot change mode while recording');
      return;
    }

    setRecordingMode(mode);
    
    // Restart preview with new mode
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      try {
        await initializeMedia();
      } catch (error) {
        console.error('Failed to change recording mode:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
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
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Recording Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Recording Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {isRecording && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  <span className="text-white font-medium">
                    {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready to Record'}
                  </span>
                </div>
                {isRecording && (
                  <div className="text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm capitalize">{recordingMode} Mode</span>
              </div>
            </div>

            {/* Video Preview */}
            <div className="relative bg-gray-900 aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl">Camera Off</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader className="w-12 h-12 mx-auto mb-4 animate-spin" />
                    <p className="text-xl">Processing Recording...</p>
                    <p className="text-gray-300">This may take a moment</p>
                  </div>
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  REC {formatTime(recordingTime)}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-center space-x-4">
                {/* Audio Control */}
                <button
                  onClick={toggleAudio}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isAudioOn ? 'Mute' : 'Unmute'}
                >
                  {isAudioOn ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Video Control */}
                <button
                  onClick={toggleVideo}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Main Record/Stop Button */}
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
                    title="Start Recording"
                  >
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors"
                    title="Stop Recording"
                  >
                    <Square className="w-6 h-6" />
                  </button>
                )}

                {/* Pause/Resume */}
                {isRecording && (
                  <button
                    onClick={togglePause}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full transition-colors"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? (
                      <Play className="w-5 h-5" />
                    ) : (
                      <Pause className="w-5 h-5" />
                    )}
                  </button>
                )}

                {/* Reset */}
                <button
                  onClick={resetRecording}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isRecording 
                      ? 'bg-gray-600 opacity-50 cursor-not-allowed' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Recording Mode Selector */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recording Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => changeRecordingMode('camera')}
                disabled={isRecording}
                className={`p-4 border-2 rounded-lg transition-all ${
                  recordingMode === 'camera'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Camera className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium text-gray-900">Camera</div>
                <div className="text-sm text-gray-600">Record yourself</div>
              </button>
              
              <button
                onClick={() => changeRecordingMode('screen')}
                disabled={isRecording}
                className={`p-4 border-2 rounded-lg transition-all ${
                  recordingMode === 'screen'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Monitor className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="font-medium text-gray-900">Screen</div>
                <div className="text-sm text-gray-600">Record screen</div>
              </button>
              
              <button
                onClick={() => changeRecordingMode('both')}
                disabled={isRecording}
                className={`p-4 border-2 rounded-lg transition-all ${
                  recordingMode === 'both'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="relative mx-auto mb-2 w-8 h-8">
                  <Camera className="w-6 h-6 text-purple-600" />
                  <Monitor className="w-4 h-4 text-purple-600 absolute -bottom-1 -right-1" />
                </div>
                <div className="font-medium text-gray-900">Both</div>
                <div className="text-sm text-gray-600">Camera + Screen</div>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recording Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recording Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="font-medium">{formatTime(recordingTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mode</span>
                <span className="font-medium capitalize">{recordingMode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quality</span>
                <span className="font-medium">HD 1080p</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`font-medium ${
                  isRecording ? (isPaused ? 'text-yellow-600' : 'text-red-600') : 'text-gray-600'
                }`}>
                  {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Stopped'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recording Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Ensure good lighting for camera recordings</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Use a quiet environment for better audio</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Close unnecessary apps when recording screen</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Test your setup before important recordings</span>
              </div>
            </div>
          </div>

          {/* Recent Recordings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Recordings</h3>
            <div className="space-y-3">
              {[
                { name: 'React Hooks Tutorial', duration: '15:32', date: '2 hours ago' },
                { name: 'JavaScript Best Practices', duration: '22:15', date: '1 day ago' },
                { name: 'CSS Grid Layout', duration: '18:45', date: '3 days ago' }
              ].map((recording, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{recording.name}</h4>
                    <p className="text-xs text-gray-600">{recording.duration} • {recording.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Recording Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Save Recording</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recording Title
                  </label>
                  <input
                    type="text"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter recording title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={recordingDescription}
                    onChange={(e) => setRecordingDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the recording"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Quality:</span>
                    <span className="font-medium">HD 1080p</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={downloadRecording}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={saveToLibrary}
                  disabled={isProcessing}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save to Library
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSaveModal(false);
                  resetRecording();
                }}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recording Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Video Quality
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="1080p">HD 1080p (Recommended)</option>
                    <option value="720p">HD 720p</option>
                    <option value="480p">SD 480p</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Audio Quality
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Auto-save to Library
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Automatically save recordings</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Countdown Timer
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="0">No countdown</option>
                    <option value="3">3 seconds</option>
                    <option value="5">5 seconds</option>
                    <option value="10">10 seconds</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}