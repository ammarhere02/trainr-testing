import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Camera, 
  ArrowLeft,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Save,
  Share2,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'screen' | 'camera' | 'both'>('screen');
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isScreenEnabled, setIsScreenEnabled] = useState(true);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
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

  const processAndDownloadVideo = async (recordedChunks: Blob[]) => {
    setIsProcessing(true);
    
    try {
      // Create blob from chunks
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Create recording entry for library
      const recordingData = {
        id: Date.now(),
        title: `Recording ${new Date().toLocaleDateString()}`,
        duration: formatTime(recordingTime),
        size: `${(blob.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toISOString(),
        thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
        url: url,
        type: recordingMode
      };
      
      setRecordings(prev => [recordingData, ...prev]);
      setCompletedRecording(recordingData);
      setShowCompletionModal(true);
      
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

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

  // Start recording
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      let combinedStream: MediaStream;

      if (recordingMode === 'screen' || recordingMode === 'both') {
        // Get screen stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: isMicEnabled
        });
        
        streamRef.current = screenStream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }

        combinedStream = screenStream;

        // Handle screen share end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          stopRecording();
        });
      }

      if (recordingMode === 'camera' || recordingMode === 'both') {
        // Get camera stream
        if (isCameraEnabled) {
          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false // Avoid audio feedback
            });
            
            cameraStreamRef.current = cameraStream;
            
            if (cameraRef.current) {
              cameraRef.current.srcObject = cameraStream;
              cameraRef.current.style.transform = 'scaleX(-1)'; // Mirror effect
            }

            // For camera-only mode, use camera as main stream
            if (recordingMode === 'camera') {
              combinedStream = cameraStream;
              if (videoRef.current) {
                videoRef.current.srcObject = cameraStream;
                videoRef.current.style.transform = 'scaleX(-1)';
              }
            }
          } catch (error) {
            console.error('Camera access failed:', error);
            alert('Camera access failed. Recording without camera.');
          }
        }
      }

      // Start recording
      const mediaRecorder = new MediaRecorder(combinedStream!, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processAndDownloadVideo(recordedChunksRef.current);
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;

      setIsRecording(true);
      setRecordingTime(0);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check permissions and try again.');
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
        streamRef.current = null;
      }
      
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
        cameraStreamRef.current = null;
      }

      // Clear video sources
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.style.transform = '';
      }
      if (cameraRef.current) {
        cameraRef.current.srcObject = null;
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

  // Delete recording
  const deleteRecording = (id: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      setRecordings(prev => prev.filter(r => r.id !== id));
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
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-medium text-sm">
                  {isPaused ? 'Paused' : 'Recording'} {formatTime(recordingTime)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Recording Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Record Video</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <select
                    value={recordingMode}
                    onChange={(e) => setRecordingMode(e.target.value as 'screen' | 'camera' | 'both')}
                    disabled={isRecording}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="screen">Screen Only</option>
                    <option value="camera">Camera Only</option>
                    <option value="both">Screen + Camera</option>
                  </select>
                </div>
              </div>

              {/* Video Preview */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
                
                {/* Camera Overlay (for screen + camera mode) */}
                {(recordingMode === 'both' || (recordingMode === 'screen' && isCameraEnabled)) && (
                  <div className="absolute bottom-4 right-4">
                    <div className="relative">
                      <video
                        ref={cameraRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-32 h-24 object-cover rounded-lg border-2 border-white shadow-lg"
                      />
                      {isRecording && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                      )}
                    </div>
                  </div>
                )}

                {/* No Preview State */}
                {!isRecording && !streamRef.current && !cameraStreamRef.current && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Ready to Record</h3>
                      <p className="text-white/80">Click the record button to start</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4">
                {/* Camera Toggle */}
                <button
                  onClick={() => setIsCameraEnabled(!isCameraEnabled)}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isCameraEnabled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-red-100 text-red-600'
                  } disabled:opacity-50`}
                  title={isCameraEnabled ? 'Disable camera' : 'Enable camera'}
                >
                  {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Microphone Toggle */}
                <button
                  onClick={() => setIsMicEnabled(!isMicEnabled)}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isMicEnabled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-red-100 text-red-600'
                  } disabled:opacity-50`}
                  title={isMicEnabled ? 'Disable microphone' : 'Enable microphone'}
                >
                  {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Record/Stop Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`p-4 rounded-full font-semibold transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : isRecording ? (
                    <Square className="w-6 h-6" />
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
                  )}
                </button>

                {/* Pause/Resume Button */}
                {isRecording && (
                  <button
                    onClick={togglePause}
                    className="p-3 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                )}

                {/* Screen Share Toggle */}
                <button
                  onClick={() => setIsScreenEnabled(!isScreenEnabled)}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenEnabled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-red-100 text-red-600'
                  } disabled:opacity-50`}
                  title={isScreenEnabled ? 'Disable screen sharing' : 'Enable screen sharing'}
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              {isProcessing && (
                <div className="mt-4 text-center">
                  <p className="text-gray-600">Processing video... This may take a moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Recording Library */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recording Library</h2>
              
              {recordings.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No recordings yet</p>
                  <p className="text-gray-500 text-xs">Start recording to build your library</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div key={recording.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <img
                          src={recording.thumbnail}
                          alt={recording.title}
                          className="w-12 h-9 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{recording.title}</h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span>{recording.duration}</span>
                            <span>•</span>
                            <span>{recording.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRecording(recording);
                              setShowPreview(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && completedRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recording Complete!</h3>
              <p className="text-gray-600 mb-4">
                Your video has been processed and downloaded automatically.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{completedRecording.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{completedRecording.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">WebM</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}