import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Pause, 
  Camera, 
  Monitor, 
  Settings, 
  Download, 
  Share2, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Calendar, 
  FileVideo, 
  Trash2, 
  Edit3, 
  Eye, 
  ArrowLeft,
  Loader,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Zap,
  Shield,
  Smartphone,
  Globe
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
  const [quality, setQuality] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [showSettings, setShowSettings] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastRecording, setLastRecording] = useState<any>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: 'unknown' | 'granted' | 'denied',
    microphone: 'unknown' | 'granted' | 'denied'
  }>({
    camera: 'unknown',
    microphone: 'unknown'
  });

  // Recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Process and download video function
  const processAndDownloadVideo = (chunks: Blob[]) => {
    setIsProcessing(true);

    try {
      // Create blob from chunks
      const blob = new Blob(chunks, { type: 'video/webm' });
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL
      URL.revokeObjectURL(url);
      
      // Set last recording data
      const recordingData = {
        duration: formatTime(recordingTime),
        size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        quality: quality,
        timestamp: new Date().toLocaleString(),
        type: recordingMode
      };
      
      setLastRecording(recordingData);
      setIsProcessing(false);
      setShowCompletionModal(true);
      
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
    }
  };

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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stream]);

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

  // Start recording function
  const startRecording = async () => {
    try {
      // Get user media based on recording mode
      let mediaStream: MediaStream;
      
      if (recordingMode === 'screen') {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: isAudioOn
        });
      } else if (recordingMode === 'camera') {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
      } else { // both
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        // For simplicity, we'll use camera stream (in real app, you'd combine them)
        mediaStream = cameraStream;
      }

      setStream(mediaStream);
      
      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Create MediaRecorder
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        processAndDownloadVideo(chunks);
      };

      setMediaRecorder(recorder);
      setRecordedChunks(chunks);
      
      // Start recording
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your camera and microphone permissions.');
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Handle record button click
  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume();
        setIsPaused(false);
      } else {
        mediaRecorder.pause();
        setIsPaused(true);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
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
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
              </span>
            </div>
            {isRecording && (
              <div className="text-sm font-mono text-gray-700">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Recording Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Video Preview */}
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {!isRecording && !stream && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Record</h3>
                      <p className="text-gray-300">Click the record button to start</p>
                    </div>
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">
                      {isPaused ? 'PAUSED' : 'RECORDING'}
                    </span>
                    <span className="text-white font-mono">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                )}

                {/* Recording Controls Overlay */}
                {isRecording && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-4 bg-black/70 backdrop-blur-sm rounded-full px-6 py-3">
                      <button
                        onClick={toggleVideo}
                        className={`p-2 rounded-full transition-colors ${
                          isVideoOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                      </button>
                      
                      <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-full transition-colors ${
                          isAudioOn ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                        }`}
                      >
                        {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={handleRecordClick}
                        className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <Square className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Controls */}
              <div className="p-6">
                <div className="flex items-center justify-center space-x-6">
                  {!isRecording ? (
                    <>
                      <button
                        onClick={handleRecordClick}
                        className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                      </button>
                      <span className="text-gray-600 font-medium">Click to start recording</span>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={togglePause}
                        className="bg-yellow-500 text-white p-3 rounded-full hover:bg-yellow-600 transition-colors"
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={handleRecordClick}
                        className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Square className="w-6 h-6" />
                      </button>
                      <span className="text-gray-600 font-medium">
                        {isPaused ? 'Recording paused' : 'Recording in progress'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                onClick={() => {
                  console.log('Share button clicked');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button 
                onClick={() => {
                  console.log('Upload to library clicked');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload to Library
              </button>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recording Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recording Mode
                  </label>
                  <select
                    value={recordingMode}
                    onChange={(e) => setRecordingMode(e.target.value as 'camera' | 'screen' | 'both')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isRecording}
                  >
                    <option value="camera">Camera Only</option>
                    <option value="screen">Screen Only</option>
                    <option value="both">Camera + Screen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as '720p' | '1080p' | '4k')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isRecording}
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Camera</span>
                    <button
                      onClick={toggleVideo}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isVideoOn ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                      disabled={isRecording}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isVideoOn ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Microphone</span>
                    <button
                      onClick={toggleAudio}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isAudioOn ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                      disabled={isRecording}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAudioOn ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{formatTime(recordingTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quality</span>
                  <span className="font-medium">{quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode</span>
                  <span className="font-medium capitalize">{recordingMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`font-medium ${
                    isRecording ? (isPaused ? 'text-yellow-600' : 'text-red-600') : 'text-gray-600'
                  }`}>
                    {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Recording</h3>
              <p className="text-gray-600">Please wait while we process your video...</p>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && lastRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recording Complete!</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{lastRecording.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span className="font-medium">{lastRecording.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="font-medium">{lastRecording.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">{lastRecording.type}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    // Reset for new recording
                    setRecordingTime(0);
                    setRecordedChunks([]);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Record Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}