import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Square, 
  Play, 
  Pause, 
  Settings, 
  Monitor, 
  Camera, 
  Volume2,
  Clock,
  Users,
  Share2,
  Download,
  Trash2,
  Copy,
  Link,
  Eye,
  BarChart3,
  Globe,
  Lock,
  Edit3,
  Star,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface RecordProps {
  onBack?: () => void;
}

export default function Record(props: RecordProps) {
  const { onBack = () => {} } = props;
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [recordingMode, setRecordingMode] = useState<'screen' | 'camera' | 'both'>('screen');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedRecording, setCompletedRecording] = useState<any>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<{
    camera: 'unknown' | 'granted' | 'denied';
    microphone: 'unknown' | 'granted' | 'denied';
  }>({
    camera: 'unknown',
    microphone: 'unknown'
  });

  // Refs for media streams and recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const cameraPreviewRef = useRef<HTMLVideoElement>(null);

  // Mock recordings data
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      title: 'React Hooks Tutorial - Complete Guide',
      duration: '15:32',
      size: '245 MB',
      date: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 1247,
      status: 'ready',
      shareLink: 'https://trainr.app/watch/abc123',
      isPublic: true,
      comments: 23,
      likes: 89,
      description: 'A comprehensive guide to React Hooks covering useState, useEffect, and custom hooks',
      blob: null
    },
    {
      id: 2,
      title: 'JavaScript Best Practices for 2024',
      duration: '22:15',
      size: '387 MB',
      date: '2024-01-12',
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 856,
      status: 'ready',
      shareLink: 'https://trainr.app/watch/def456',
      isPublic: false,
      comments: 12,
      likes: 67,
      description: 'Modern JavaScript best practices including ES6+ features and performance optimization',
      blob: null
    }
  ]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  // Get screen stream
  const getScreenStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: micEnabled // Only screen stream includes audio
      });
      return stream;
    } catch (err) {
      throw new Error('Failed to capture screen. Please make sure you grant permission.');
    }
  };

  // Get camera stream
  const getCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cameraEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user'
        } : false,
        audio: micEnabled && recordingMode === 'camera' // Only include audio for camera-only mode
      });
      return stream;
    } catch (err) {
      throw new Error('Failed to access camera/microphone. Please check permissions.');
    }
  };

  // Combine streams for screen + camera mode
  const combineStreams = (screenStream: MediaStream, cameraStream: MediaStream) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 1920;
    canvas.height = 1080;

    const screenVideo = document.createElement('video');
    const cameraVideo = document.createElement('video');
    
    screenVideo.srcObject = screenStream;
    cameraVideo.srcObject = cameraStream;
    
    screenVideo.play();
    cameraVideo.play();

    const stream = canvas.captureStream(30);
    
    // Add audio tracks
    screenStream.getAudioTracks().forEach(track => stream.addTrack(track));
    cameraStream.getAudioTracks().forEach(track => stream.addTrack(track));

    const drawFrame = () => {
      if (screenVideo.readyState >= 2 && cameraVideo.readyState >= 2) {
        // Draw screen
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        
        // Draw camera in corner (if enabled)
        if (cameraEnabled) {
          const cameraWidth = 320;
          const cameraHeight = 180;
          const x = canvas.width - cameraWidth - 20;
          const y = 20;
          
          // Add border
          ctx.fillStyle = 'white';
          ctx.fillRect(x - 2, y - 2, cameraWidth + 4, cameraHeight + 4);
          
          ctx.drawImage(cameraVideo, x, y, cameraWidth, cameraHeight);
        }
      }
      
      if (isRecording) {
        requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();
    return stream;
  };

  // Check current permissions
  const checkPermissions = async () => {
    try {
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermissionStatus({
        camera: cameraPermission.state === 'granted' ? 'granted' : 
                cameraPermission.state === 'denied' ? 'denied' : 'unknown',
        microphone: microphonePermission.state === 'granted' ? 'granted' : 
                   microphonePermission.state === 'denied' ? 'denied' : 'unknown'
      });
    } catch (error) {
      console.log('Permission API not supported, will request during recording');
    }
  };

  // Request permissions explicitly
  const requestPermissions = async () => {
    try {
      setError('');
      
      // Request microphone permission
      if (micEnabled) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStream.getTracks().forEach(track => track.stop()); // Stop immediately, just testing permission
          setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
        } catch (err) {
          setPermissionStatus(prev => ({ ...prev, microphone: 'denied' }));
          throw new Error('Microphone permission denied. Please allow microphone access in your browser settings.');
        }
      }
      
      // Request camera permission
      if (cameraEnabled && (recordingMode === 'camera' || recordingMode === 'both' || recordingMode === 'screen')) {
        try {
          const camStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
              facingMode: 'user'
            } 
          });
          camStream.getTracks().forEach(track => track.stop()); // Stop immediately, just testing permission
          setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
        } catch (err) {
          setPermissionStatus(prev => ({ ...prev, camera: 'denied' }));
          throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
        }
      }
      
      setShowPermissionModal(false);
      // Now start recording with permissions granted
      handleStartRecording();
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get permissions');
    }
  };

  // Check permissions on component mount
  React.useEffect(() => {
    checkPermissions();
  }, []);

  // Start recording
  const handleStartRecording = async (skipPermissionCheck = false) => {
    // Check if we need to request permissions first
    if (!skipPermissionCheck) {
      const needsCamera = cameraEnabled && (recordingMode === 'camera' || recordingMode === 'both' || recordingMode === 'screen');
      const needsMic = micEnabled;
      
      if ((needsCamera && permissionStatus.camera !== 'granted') || 
          (needsMic && permissionStatus.microphone !== 'granted')) {
        setShowPermissionModal(true);
        return;
      }
    }
    
    try {
      setError('');
      setIsProcessing(true);
      recordedChunksRef.current = [];

      let finalStream: MediaStream;

      if (recordingMode === 'screen') {
        const screenStream = await getScreenStream();
        screenStreamRef.current = screenStream;
        finalStream = screenStream;
        
        // If camera is enabled in screen mode, get camera stream for overlay
        if (cameraEnabled) {
          const cameraStream = await getCameraStream();
          cameraStreamRef.current = cameraStream;
          
          // Show camera preview in circle
          if (cameraPreviewRef.current) {
            cameraPreviewRef.current.srcObject = cameraStream;
            // Wait for metadata to load, then play
            await new Promise((resolve) => {
              cameraPreviewRef.current!.onloadedmetadata = () => {
                cameraPreviewRef.current!.play().then(resolve).catch(console.warn);
              };
            });
          }
        }
      } else if (recordingMode === 'camera') {
        const cameraStream = await getCameraStream();
        cameraStreamRef.current = cameraStream;
        finalStream = cameraStream;
        
        // For camera-only mode, show in main preview
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = cameraStream;
          await new Promise((resolve) => {
            previewVideoRef.current!.onloadedmetadata = () => {
              previewVideoRef.current!.play().then(resolve).catch(console.warn);
            };
          });
        }
      } else {
        // Both screen and camera
        const screenStream = await getScreenStream();
        const cameraStream = await getCameraStream();
        screenStreamRef.current = screenStream;
        cameraStreamRef.current = cameraStream;
        finalStream = combineStreams(screenStream, cameraStream);
        combinedStreamRef.current = finalStream;
        
        // Show camera preview in circle for both mode
        if (cameraPreviewRef.current) {
          cameraPreviewRef.current.srcObject = cameraStream;
          await new Promise((resolve) => {
            cameraPreviewRef.current!.onloadedmetadata = () => {
              cameraPreviewRef.current!.play().then(resolve).catch(console.warn);
            };
          });
        }
      }

      // Show preview for screen and both modes
      if (previewVideoRef.current && recordingMode !== 'camera') {
        previewVideoRef.current.srcObject = finalStream;
        await new Promise((resolve) => {
          previewVideoRef.current!.onloadedmetadata = () => {
            previewVideoRef.current!.play().then(resolve).catch(console.warn);
          };
        });
      }

      // Set up MediaRecorder with best available format
      let mediaRecorder: MediaRecorder;
      
      // Try to use the best available format for MP4 output
      const supportedMimeTypes = [
        'video/webm;codecs=h264,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4;codecs=h264,aac',
        'video/mp4'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported video format found in your browser');
      }
      
      mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: recordingMode === 'camera' ? 2000000 : 4000000, // Higher quality
        audioBitsPerSecond: 128000
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        handleRecordingComplete();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data more frequently for better quality

      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setIsProcessing(false);

      // Handle screen share stop
      if (screenStreamRef.current) {
        screenStreamRef.current.getVideoTracks()[0].addEventListener('ended', () => {
          handleStopRecording();
        });
      }

      // Handle camera stream stop
      if (cameraStreamRef.current && recordingMode === 'camera') {
        cameraStreamRef.current.getVideoTracks()[0].addEventListener('ended', () => {
          handleStopRecording();
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setIsProcessing(false);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    // Stop all streams
    [screenStreamRef.current, cameraStreamRef.current, combinedStreamRef.current].forEach(stream => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    });

    // Clear preview
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
    if (cameraPreviewRef.current) {
      cameraPreviewRef.current.srcObject = null;
    }

    // Reset refs
    screenStreamRef.current = null;
    cameraStreamRef.current = null;
    combinedStreamRef.current = null;

    setIsRecording(false);
    setIsPaused(false);
  };

  // Handle recording completion
  const handleRecordingComplete = () => {
    // Create blob with WebM type first
    const webmBlob = new Blob(recordedChunksRef.current, { 
      type: recordedChunksRef.current[0]?.type || 'video/webm' 
    });
    const duration = formatTime(recordingTime);
    const size = `${(webmBlob.size / (1024 * 1024)).toFixed(1)} MB`;
    
    // Create URL for the recorded video
    const url = URL.createObjectURL(webmBlob);
    
    // Create new recording entry
    const newRecording = {
      id: Date.now(),
      title: `Screen Recording ${new Date().toLocaleDateString()}`,
      duration,
      size,
      date: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=300',
      views: 0,
      status: 'ready',
      shareLink: `https://trainr.app/watch/${Math.random().toString(36).substr(2, 9)}`,
      isPublic: false,
      comments: 0,
      likes: 0,
      description: 'New screen recording',
      blob: webmBlob,
      url: url,
      format: 'webm'
    };

    setCompletedRecording(newRecording);
    setShowCompletionModal(true);
    setRecordingTime(0);
  };

  // Convert WebM to MP4 using FFmpeg.wasm (simplified version)
  const convertToMp4 = async (webmBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // Create a new blob with MP4 MIME type
      // Note: This changes the MIME type but doesn't actually convert the codec
      // For true conversion, you would need FFmpeg.wasm or server-side processing
      const mp4Blob = new Blob([webmBlob], { type: 'video/mp4' });
      resolve(mp4Blob);
    });
  };

  // Pause/Resume recording
  const handlePauseResume = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
      } else {
        mediaRecorderRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  // Share recording
  const handleShare = (recording: any) => {
    setSelectedRecording(recording);
    setShowShareModal(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message (in real app, use toast)
    alert('Link copied to clipboard!');
  };

  // Download recording
  const handleDownload = (recording: any) => {
    if (recording.url) {
      const a = document.createElement('a');
      a.href = recording.url;
      // Download with appropriate extension
      const extension = recording.format === 'webm' ? 'webm' : 'mp4';
      a.download = `${recording.title}.${extension}`;
      a.click();
    }
  };

  // Delete recording
  const handleDelete = (recordingId: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      setRecordings(prev => prev.filter(r => r.id !== recordingId));
    }
  };

  // Handle completion modal actions
  const handleSaveRecording = () => {
    if (completedRecording) {
      setRecordings(prev => [completedRecording, ...prev]);
      setShowCompletionModal(false);
      setCompletedRecording(null);
    }
  };

  const handleDownloadAndSave = () => {
    if (completedRecording) {
      // Download the file
      const a = document.createElement('a');
      a.href = completedRecording.url;
      const extension = completedRecording.format === 'webm' ? 'webm' : 'mp4';
      a.download = `${completedRecording.title}.${extension}`;
      a.click();
      
      // Also save to recordings list
      setRecordings(prev => [completedRecording, ...prev]);
      setShowCompletionModal(false);
      setCompletedRecording(null);
    }
  };

  const handleDiscardRecording = () => {
    if (completedRecording && completedRecording.url) {
      URL.revokeObjectURL(completedRecording.url);
    }
    setShowCompletionModal(false);
    setCompletedRecording(null);
  };

  const handleDownloadOnly = () => {
    if (completedRecording) {
      const a = document.createElement('a');
      a.href = completedRecording.url;
      const extension = completedRecording.format === 'webm' ? 'webm' : 'mp4';
      a.download = `${completedRecording.title}.${extension}`;
      a.click();
      
      // Clean up the blob URL after download
      setTimeout(() => {
        URL.revokeObjectURL(completedRecording.url);
      }, 1000);
      
      setShowCompletionModal(false);
      setCompletedRecording(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Screen Recorder</h1>
          <p className="text-gray-600 mt-2">Record your screen and share instantly like Loom</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Storage: 2.1GB / 10GB used
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '21%' }}></div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recording Studio */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Record</h2>
            
            {/* Camera Circle Overlay - Show when recording with camera enabled */}
            {isRecording && cameraEnabled && (recordingMode === 'screen' || recordingMode === 'both') && (
              <div className="fixed bottom-6 right-6 w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-black z-50">
                <video
                  ref={cameraPreviewRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  autoPlay
                  style={{ transform: 'scaleX(-1)' }}
                />
                {/* Recording indicator */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
            
            {/* Screen Preview */}
            <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
              <div className="aspect-video relative">
                <>
                {isRecording ? (
                  <video
                    ref={previewVideoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    autoPlay
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    {recordingMode === 'screen' ? (
                      <div className="text-center">
                        <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Screen Recording Preview</p>
                        <p className="text-gray-500 text-sm mt-2">Click record to start capturing your screen</p>
                        {cameraEnabled && (
                          <p className="text-gray-500 text-sm mt-1">Camera will appear in bottom-right corner</p>
                        )}
                      </div>
                    ) : recordingMode === 'camera' ? (
                      <div className="text-center">
                        {cameraEnabled ? (
                          <>
                            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">Camera Preview</p>
                            <p className="text-gray-500 text-sm mt-2">Click record to start recording from your camera</p>
                          </>
                        ) : (
                          <>
                            <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">Camera Disabled</p>
                            <p className="text-gray-500 text-sm mt-2">Enable camera to record video</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">Screen + Camera Preview</p>
                        <p className="text-gray-500 text-sm mt-2">Click record to start recording screen and camera</p>
                        {cameraEnabled && (
                          <p className="text-gray-500 text-sm mt-1">Camera will appear in bottom-right corner</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {recordingMode === 'screen' ? 'Screen Only' :
                     recordingMode === 'camera' ? 'Camera Only' : 'Screen + Camera'}
                  </span>
                </div>
                </>
              </div>
            </div>

            {/* Recording Mode Selection */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => setRecordingMode('screen')}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  recordingMode === 'screen' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Screen Only
              </button>
              <button
                onClick={() => setRecordingMode('camera')}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  recordingMode === 'camera' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera Only
              </button>
              <button
                onClick={() => setRecordingMode('both')}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  recordingMode === 'both' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Video className="w-4 h-4 mr-2" />
                Screen + Camera
              </button>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                disabled={isRecording}
                className={`p-3 rounded-full transition-colors disabled:opacity-50 ${
                  micEnabled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-100 text-red-600'
                }`}
                title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              
              {recordingMode !== 'screen' && (
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors disabled:opacity-50 ${cameraEnabled ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-red-100 text-red-600'}`}
                  title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              )}

              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  disabled={isProcessing}
                  className="bg-red-600 text-white p-6 rounded-full hover:bg-red-700 transition-colors shadow-lg disabled:opacity-50"
                  title="Start recording"
                >
                  {isProcessing ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  )}
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePauseResume}
                    className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                    title={isPaused ? 'Resume recording' : 'Pause recording'}
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
                    title="Stop recording"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Quick Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your browser will ask for {recordingMode === 'camera' ? 'camera' : recordingMode === 'screen' ? 'screen sharing' : 'camera and screen sharing'} permission</li>
                <li>• Recordings are saved locally and can be downloaded</li>
                {cameraEnabled && (recordingMode === 'screen' || recordingMode === 'both') && <li>• Your camera will appear in a circle overlay during recording</li>}
                {recordingMode === 'both' && <li>• Use screen + camera for the most engaging content</li>}
                {recordingMode === 'screen' && <li>• Stop sharing your screen to automatically end recording</li>}
                {recordingMode === 'camera' && <li>• Camera-only recordings are perfect for talking head videos</li>}
                <li>• Make sure your camera and microphone permissions are enabled</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Recordings</span>
                <span className="font-medium">{recordings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Views</span>
                <span className="font-medium">{recordings.reduce((sum, r) => sum + r.views, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-medium">{recordings.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length} recordings</span>
              </div>
            </div>
          </div>

          {/* Recording Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Default Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Quality
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                  <option>1080p (Recommended)</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Share
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                  <option>Generate link after recording</option>
                  <option>Private by default</option>
                  <option>Public by default</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto-save to cloud</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Recordings */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Recordings</h2>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All recordings</option>
              <option>Public</option>
              <option>Private</option>
              <option>Processing</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                {recording.url ? (
                  <video
                    src={recording.url}
                    className="w-full h-48 object-cover"
                    poster={recording.thumbnail}
                  />
                ) : (
                  <img
                    src={recording.thumbnail}
                    alt={recording.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
                    <Play className="w-6 h-6 text-purple-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {recording.duration}
                </div>
                <div className="absolute top-2 left-2">
                  {recording.isPublic ? (
                    <Globe className="w-4 h-4 text-green-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                {recording.status === 'processing' && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    Processing...
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recording.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recording.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {recording.views}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {recording.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {recording.comments}
                    </div>
                  </div>
                  <span>{new Date(recording.date).toLocaleDateString()}</span>
                </div>

                {recording.status === 'ready' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShare(recording)}
                      className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </button>
                    <button 
                      onClick={() => handleDownload(recording)}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(recording.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && selectedRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Recording</h3>
              
              <div className="mb-4">
                {selectedRecording.url ? (
                  <video
                    src={selectedRecording.url}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    poster={selectedRecording.thumbnail}
                  />
                ) : (
                  <img
                    src={selectedRecording.thumbnail}
                    alt={selectedRecording.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-medium text-gray-900">{selectedRecording.title}</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedRecording.shareLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedRecording.shareLink)}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Public access</span>
                  <input type="checkbox" className="rounded" defaultChecked={selectedRecording.isPublic} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Allow comments</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show view count</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Update Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recording Completion Modal */}
      {showCompletionModal && completedRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Recording Complete!</h3>
                <p className="text-gray-600">Your screen recording is ready. What would you like to do?</p>
              </div>

              {/* Recording Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <video
                      src={completedRecording.url}
                      className="w-20 h-14 object-cover rounded-lg"
                      poster={completedRecording.thumbnail}
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{completedRecording.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {completedRecording.duration}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                        {completedRecording.size}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleSaveRecording}
                    className="bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Save to Library
                  </button>
                  <button
                    onClick={handleDownloadAndSave}
                    className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download & Save
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadOnly}
                    className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Only
                  </button>
                  <button
                    onClick={handleDiscardRecording}
                    className="bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Discard
                  </button>
                </div>
              </div>

              {/* Action Descriptions */}
              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <div className="flex items-start space-x-2">
                  <Video className="w-3 h-3 mt-0.5 text-purple-600" />
                  <span><strong>Save to Library:</strong> Keep in your recordings for sharing and future access</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="w-3 h-3 mt-0.5 text-blue-600" />
                  <span><strong>Download & Save:</strong> Save to your device AND keep in library</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Download className="w-3 h-3 mt-0.5 text-gray-600" />
                  <span><strong>Download Only:</strong> Save to your device without keeping in library</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Trash2 className="w-3 h-3 mt-0.5 text-red-600" />
                  <span><strong>Discard:</strong> Delete the recording permanently</span>
                </div>
              </div>

              {/* Quick Share Option */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Generate shareable link</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Creates an instant share link like Loom (can be changed later)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}