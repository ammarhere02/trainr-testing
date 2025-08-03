import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Trash2, 
  Settings, 
  Monitor, 
  Camera, 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Save,
  X
} from 'lucide-react';
import { videoStorage, StoredVideo, generateVideoThumbnail } from '../utils/videoStorage';
import { getStreamAPI, isStreamConfigured } from '../utils/cloudflare';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen' | 'both'>('screen');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAndRequestPermissions = async () => {
    try {
      // Check current permissions
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      console.log('Camera permission:', cameraPermission.state);
      console.log('Microphone permission:', microphonePermission.state);
      
      // If permissions are denied, show helpful message
      if (cameraPermission.state === 'denied' || microphonePermission.state === 'denied') {
        alert('Camera or microphone access is blocked. Please:\n\n1. Click the lock/camera icon in your browser\'s address bar\n2. Set Camera and Microphone to "Allow"\n3. Refresh the page and try again\n\nFor Chrome: Click lock icon → Site settings → Camera/Microphone → Allow\nFor Firefox: Click shield icon → Permissions → Camera/Microphone → Allow');
        return false;
      }
      
      // Try to request permissions proactively by attempting to get user media
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({
          video: recordingMode !== 'screen',
          audio: isAudioEnabled
        });
        // Stop the test stream immediately
        testStream.getTracks().forEach(track => track.stop());
        return true;
      } catch (testError) {
        console.log('Permission test failed:', testError);
        if (testError instanceof Error && testError.name === 'NotAllowedError') {
          alert('Permission denied. Please:\n\n1. Click "Allow" when your browser asks for camera/microphone access\n2. If you previously denied access, click the lock/camera icon in your browser\'s address bar\n3. Set Camera and Microphone to "Allow"\n4. Refresh the page and try again');
          return false;
        }
        // For other errors, continue and let the main recording attempt handle them
        return true;
      }
      
    } catch (error) {
      console.log('Permission API not supported, will try direct access');
      return true;
    }
  };
  const startRecording = async () => {
    try {
      // Check permissions first
      const hasPermissions = await checkAndRequestPermissions();
      if (!hasPermissions) {
        return;
      }

      // Reset previous recording data
      chunksRef.current = [];
      setRecordedBlob(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      let stream: MediaStream;

      if (recordingMode === 'screen') {
        // Screen recording
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: isAudioEnabled
        });
        
        // Display screen stream in video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        
      } else if (recordingMode === 'camera') {
        // Camera recording
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled ? {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          } : false,
          audio: isAudioEnabled
        });
        
        // Display camera stream in video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          // Force the video to play
          try {
            await videoRef.current.play();
          } catch (playError) {
            console.log('Video play failed, but continuing with recording');
          }
        }
        
      } else {
        // Both screen and camera
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: isAudioEnabled
        });
        
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled ? {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          } : false,
          audio: false // Audio from screen only to avoid echo
        });

        setScreenStream(screenStream);
        setCameraStream(cameraStream);
        setShowCameraPreview(true);
        
        // Display screen stream in main video element
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
        
        // Display camera stream in preview element
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = cameraStream;
          cameraVideoRef.current.muted = true;
          try {
            await cameraVideoRef.current.play();
          } catch (playError) {
            console.log('Camera preview play failed, but continuing');
          }
        }

        // Create a canvas to combine both streams
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1920;
        canvas.height = 1080;

        // Create video elements for both streams
        const screenVideo = document.createElement('video');
        const cameraVideo = document.createElement('video');
        
        screenVideo.srcObject = screenStream;
        cameraVideo.srcObject = cameraStream;
        screenVideo.muted = true;
        cameraVideo.muted = true;
        
        // Wait for both videos to load
        await Promise.all([
          new Promise(resolve => {
            screenVideo.addEventListener('loadedmetadata', resolve, { once: true });
            screenVideo.load();
          }),
          new Promise(resolve => {
            cameraVideo.addEventListener('loadedmetadata', resolve, { once: true });
            cameraVideo.load();
          })
        ]);
        
        // Start playing both videos
        await Promise.all([
          screenVideo.play(),
          cameraVideo.play()
        ]);

        // Create a new stream from the canvas
        const combinedStream = canvas.captureStream(30);
        
        // Add audio from screen stream
        const audioTracks = screenStream.getAudioTracks();
        audioTracks.forEach(track => combinedStream.addTrack(track));

        // Function to draw both videos on canvas
        const drawFrame = () => {
          if (ctx && screenVideo.readyState >= 2) {
            // Draw screen video (full size)
            ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
            
            // Draw camera video if enabled and ready
            if (isVideoEnabled && cameraVideo.readyState >= 2 && !cameraVideo.paused) {
              const pipWidth = 320;
              const pipHeight = 240;
              const pipX = canvas.width - pipWidth - 20;
              const pipY = canvas.height - pipHeight - 20;
              
              // Add border around camera feed
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 3;
              ctx.strokeRect(pipX - 2, pipY - 2, pipWidth + 4, pipHeight + 4);
              
              // Draw camera video
              ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);
            }
          }
          
          // Continue drawing frames while recording
          if (isRecording) {
            requestAnimationFrame(drawFrame);
          }
        };

        // Start the drawing loop
        requestAnimationFrame(drawFrame);

        stream = combinedStream;
      }

      streamRef.current = stream;

      // Set up MediaRecorder with better options
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9,opus'
      };

      // Fallback to other formats if vp9 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
          options.mimeType = 'video/webm;codecs=vp8,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          options.mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          options.mimeType = 'video/mp4';
        } else {
          delete options.mimeType; // Use default
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size, 'bytes');
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        console.log('Recording stopped. Total chunks:', chunksRef.current.length);
        
        // Wait a moment for any final chunks
        setTimeout(() => {
          console.log('Processing recording chunks:', chunksRef.current.length);
          
          if (chunksRef.current.length === 0) {
            alert('No recording data captured. Please try recording for at least 1 second.');
            return;
          }

          // Filter out empty chunks
          const validChunks = chunksRef.current.filter(chunk => chunk.size > 0);
          console.log('Valid chunks:', validChunks.length, 'out of', chunksRef.current.length);

          if (validChunks.length === 0) {
            alert('No valid recording data captured. Please try again.');
            return;
          }

          // Calculate total size
          const totalSize = validChunks.reduce((total, chunk) => total + chunk.size, 0);
          console.log('Total recording size:', totalSize, 'bytes');

          if (totalSize < 1000) { // Less than 1KB is likely invalid
            alert('Recording is too small to be valid. Please record for at least 1 second.');
            return;
          }

          // Create blob from valid chunks only
          const mimeType = mediaRecorder.mimeType || 'video/webm';
          const blob = new Blob(validChunks, { type: mimeType });
          
          console.log('Created blob:', blob.size, 'bytes, type:', blob.type);
          
          if (blob.size === 0) {
            alert('Failed to create recording. Please try again.');
            return;
          }

          // Test the blob immediately
          const testVideo = document.createElement('video');
          const testUrl = URL.createObjectURL(blob);
          
          testVideo.addEventListener('loadedmetadata', () => {
            console.log('Blob test successful - duration:', testVideo.duration, 'seconds');
            URL.revokeObjectURL(testUrl);
            
            if (testVideo.duration === 0) {
              alert('Recording appears to be empty. Please try recording again.');
              return;
            }
            
            // Blob is valid, proceed with saving
            setRecordedBlob(blob);
            setHasRecording(true);
            setShowSaveOptions(true);

            // Create preview URL
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);

            // Update video element to show recording
            if (videoRef.current) {
              videoRef.current.srcObject = null;
              videoRef.current.src = url;
              videoRef.current.muted = false;
            }

            // Clean up streams
            cleanupStreams();
          });

          testVideo.addEventListener('error', (e) => {
            console.error('Blob test failed:', e);
            URL.revokeObjectURL(testUrl);
            alert('Recording is corrupted. Please try recording again.');
          });

          testVideo.src = testUrl;
          testVideo.load();
        }, 100); // Small delay to ensure all chunks are processed
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      // Start recording with time slice for regular data capture
      mediaRecorder.start(100); // Capture data every 100ms for better chunk collection
      setIsRecording(true);
      setRecordingTime(0);

      console.log('Recording started with MIME type:', mediaRecorder.mimeType);

    } catch (error) {
      console.error('Failed to start recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Permission denied. Please allow camera/microphone access:\n\n1. Click "Allow" when your browser asks for permissions\n2. If you previously denied access, click the lock/camera icon in your browser\'s address bar\n3. Set Camera and Microphone to "Allow" for this site\n4. Refresh the page and try again\n\nFor Chrome: Click the lock icon → Site settings → Camera/Microphone → Allow\nFor Firefox: Click the shield icon → Permissions → Camera/Microphone → Allow');
        } else if (error.name === 'NotFoundError') {
          alert('No camera or microphone found. Please check your devices.');
        } else {
          alert(`Failed to start recording: ${error.message}\n\nIf this is a permission issue, please:\n1. Check your browser permissions for this site\n2. Make sure your camera/microphone are not being used by other applications\n3. Try refreshing the page`);
        }
      } else {
        alert('Failed to start recording. Please check:\n\n1. Allow camera/microphone access when prompted\n2. Check browser permissions (click lock icon in address bar)\n3. Ensure no other apps are using your camera/microphone\n4. Try refreshing the page');
      }
      
      // Clean up on error
      cleanupStreams();
    }
  };
  
  const cleanupStreams = () => {
    // Stop main stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Stop additional streams for 'both' mode
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    setShowCameraPreview(false);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    // Clean up
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setRecordedBlob(null);
    setHasRecording(false);
    setShowSaveOptions(false);
    setRecordingTime(0);
    chunksRef.current = [];

    // Reset video element
    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.srcObject = null;
    }

    // Reset camera preview
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
    setShowCameraPreview(false);
  };

  // Save to library (local storage)
  const saveToLibrary = async () => {
    if (!recordedBlob) {
      alert('No recording data available. Please try recording again.');
      return;
    }

    console.log('Saving recording to library:', {
      blobSize: recordedBlob.size,
      blobType: recordedBlob.type,
      duration: recordingTime
    });
    setIsSavingToLibrary(true);

    try {
      // Generate thumbnail from video
      const thumbnail = await generateVideoThumbnail(recordedBlob);
      
      const metadata = {
        id: Date.now(),
        title: `Recording ${new Date().toLocaleString()}`,
        duration: recordingTime,
        mode: recordingMode,
        thumbnail: thumbnail
      };

      console.log('Saving video with metadata:', metadata);
      await videoStorage.saveVideo(recordedBlob, metadata);
      console.log('Video saved successfully to IndexedDB');
      alert('Recording saved to library successfully!');
      setShowSaveOptions(false);
      discardRecording();

    } catch (error) {
      console.error('Failed to save to library:', error);
      alert('Failed to save recording to library. Please try again.');
    } finally {
      setIsSavingToLibrary(false);
    }
  };

  const downloadRecording = () => {
    if (!recordedBlob) {
      alert('No recording available to download.');
      return;
    }

    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveOption = async (option: 'library' | 'download' | 'both' | 'discard') => {
    switch (option) {
      case 'library':
        await saveToLibrary();
        break;
      case 'download':
        downloadRecording();
        setShowSaveOptions(false);
        discardRecording();
        break;
      case 'both':
        downloadRecording();
        await saveToLibrary();
        break;
      case 'discard':
        discardRecording();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Record Video</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Recording Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setRecordingMode('screen')}
                disabled={isRecording}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingMode === 'screen' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Monitor className="w-4 h-4 mr-2 inline" />
                Screen
              </button>
              <button
                onClick={() => setRecordingMode('camera')}
                disabled={isRecording}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingMode === 'camera' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Camera className="w-4 h-4 mr-2 inline" />
                Camera
              </button>
              <button
                onClick={() => setRecordingMode('both')}
                disabled={isRecording}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingMode === 'both' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <Monitor className="w-3 h-3 mr-1" />
                  <Camera className="w-3 h-3 mr-2" />
                </div>
                Both
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-video bg-gray-900"
                  controls={hasRecording}
                />
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {isPaused ? 'PAUSED' : 'RECORDING'}
                    </span>
                  </div>
                )}

                {/* Timer */}
                {(isRecording || hasRecording) && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatTime(recordingTime)}
                  </div>
                )}

                {/* No Recording State */}
                {!isRecording && !hasRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {recordingMode === 'screen' ? (
                          <Monitor className="w-10 h-10" />
                        ) : recordingMode === 'camera' ? (
                          <Camera className="w-10 h-10" />
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Monitor className="w-6 h-6" />
                            <Camera className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Ready to Record {
                          recordingMode === 'screen' ? 'Screen' : 
                          recordingMode === 'camera' ? 'Camera' : 
                          'Screen + Camera'
                        }
                      </h3>
                      <p className="text-gray-300">
                        {recordingMode === 'both' 
                          ? 'Camera will appear as picture-in-picture overlay'
                          : 'Click the record button to start capturing'
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* Camera Preview for Both mode */}
                {showCameraPreview && recordingMode === 'both' && (
                  <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <video
                      ref={cameraVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Camera Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4">
                  {!isRecording && !hasRecording && (
                    <>
                      {/* Audio Toggle */}
                      <button
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className={`p-3 rounded-full transition-colors ${
                          isAudioEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                        }`}
                        title={isAudioEnabled ? 'Disable audio' : 'Enable audio'}
                      >
                        {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      </button>

                      {/* Video Toggle (only for camera mode) */}
                      {recordingMode === 'camera' && (
                        <button
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                          className={`p-3 rounded-full transition-colors ${
                            isVideoEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                          }`}
                          title={isVideoEnabled ? 'Disable video' : 'Enable video'}
                        >
                          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                      )}

                      {/* Video Toggle (for both mode) */}
                      {recordingMode === 'both' && (
                        <button
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                          className={`p-3 rounded-full transition-colors ${
                            isVideoEnabled ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-600'
                          }`}
                          title={isVideoEnabled ? 'Disable camera' : 'Enable camera'}
                        >
                          {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                      )}

                      {/* Start Recording */}
                      <button
                        onClick={startRecording}
                        className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
                        title="Start recording"
                      >
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                      </button>
                    </>
                  )}

                  {isRecording && (
                    <>
                      {/* Pause/Resume */}
                      <button
                        onClick={isPaused ? resumeRecording : pauseRecording}
                        className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                        title={isPaused ? 'Resume recording' : 'Pause recording'}
                      >
                        {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      </button>

                      {/* Stop Recording */}
                      <button
                        onClick={stopRecording}
                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                        title="Stop recording"
                      >
                        <Square className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {hasRecording && !isRecording && (
                    <>
                      {/* New Recording */}
                      <button
                        onClick={() => {
                          discardRecording();
                        }}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        New Recording
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recording Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recording Mode
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="screen"
                        name="mode"
                        checked={recordingMode === 'screen'}
                        onChange={() => setRecordingMode('screen')}
                        disabled={isRecording}
                        className="mr-2"
                      />
                      <label htmlFor="screen" className="text-sm text-gray-700">
                        Screen Recording
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="camera"
                        name="mode"
                        checked={recordingMode === 'camera'}
                        onChange={() => setRecordingMode('camera')}
                        disabled={isRecording}
                        className="mr-2"
                      />
                      <label htmlFor="camera" className="text-sm text-gray-700">
                        Camera Recording
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Audio & Video</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Microphone</span>
                      <button
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        disabled={isRecording}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isAudioEnabled ? 'bg-purple-600' : 'bg-gray-300'
                        } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isAudioEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                  
                  {recordingMode === 'both' && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Camera</span>
                      <button
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        disabled={isRecording}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isVideoEnabled ? 'bg-purple-600' : 'bg-gray-300'
                        } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isVideoEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  )}
                    {recordingMode === 'camera' && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Camera</span>
                        <button
                          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                          disabled={isRecording}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isVideoEnabled ? 'bg-purple-600' : 'bg-gray-300'
                          } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isVideoEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recording Info */}
            {(isRecording || hasRecording) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recording Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-medium">{formatTime(recordingTime)}</span>
                  </div>
                  {recordedBlob && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">File Size</span>
                        <span className="font-medium">
                          {(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Format</span>
                        <span className="font-medium">
                          {recordedBlob.type.split('/')[1]?.toUpperCase() || 'WebM'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mode</span>
                    <span className="font-medium capitalize">
                      {recordingMode === 'both' ? 'Screen + Camera' : recordingMode}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Options Modal */}
      {showSaveOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Recording</h3>
              <p className="text-gray-600 mb-6">Choose how you'd like to save your recording:</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSaveOption('library')}
                  disabled={isSavingToLibrary}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Save className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Save to Library</div>
                      <div className="text-sm text-gray-600">Save for later viewing</div>
                    </div>
                  </div>
                  {isSavingToLibrary && (
                    <Loader className="w-5 h-5 text-purple-600 animate-spin" />
                  )}
                </button>

                <button
                  onClick={() => handleSaveOption('download')}
                  disabled={isSavingToLibrary}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Download</div>
                      <div className="text-sm text-gray-600">Save to your device</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSaveOption('both')}
                  disabled={isSavingToLibrary}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Both</div>
                      <div className="text-sm text-gray-600">Save to library and download</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSaveOption('discard')}
                  disabled={isSavingToLibrary}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Discard</div>
                      <div className="text-sm text-gray-600">Delete this recording</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Upload Progress */}
              {isSavingToLibrary && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Saving to library...</span>
                    <span className="text-sm font-medium">Processing...</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300 animate-pulse"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}