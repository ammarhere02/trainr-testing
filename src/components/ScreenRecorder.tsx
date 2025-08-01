import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Monitor, 
  Camera,
  Play, 
  Pause, 
  Square, 
  Download,
  Settings,
  Move,
  Maximize,
  Minimize
} from 'lucide-react';

// Types for recording state and configuration
interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  recordedChunks: Blob[];
  recordingUrl: string | null;
}

interface StreamState {
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  combinedStream: MediaStream | null;
}

interface CameraOverlay {
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  isResizing: boolean;
}

// Recording mode options
type RecordingMode = 'screen' | 'camera' | 'both';

const ScreenRecorder: React.FC = () => {
  // Recording state management
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    recordedChunks: [],
    recordingUrl: null
  });

  // Stream management
  const [streamState, setStreamState] = useState<StreamState>({
    screenStream: null,
    cameraStream: null,
    combinedStream: null
  });

  // UI state
  const [recordingMode, setRecordingMode] = useState<RecordingMode>('screen');
  const [cameraOverlay, setCameraOverlay] = useState<CameraOverlay>({
    x: 20,
    y: 20,
    width: 200,
    height: 150,
    isDragging: false,
    isResizing: false
  });

  // Refs for DOM elements and MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  /**
   * Timer effect for recording duration
   */
  useEffect(() => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1
        }));
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
  }, [recordingState.isRecording, recordingState.isPaused]);

  /**
   * Format recording time as MM:SS or HH:MM:SS
   */
  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Get screen capture stream with user selection
   */
  const getScreenStream = async (): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: false // Handle audio separately to avoid permission issues
      });
    } catch (error) {
      throw new Error('Screen capture permission denied or not supported');
    }
  };

  /**
   * Get camera stream
   */
  const getCameraStream = async (): Promise<MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: true // Include microphone audio
      });
    } catch (error) {
      throw new Error('Camera/microphone access denied or not available');
    }
  };

  /**
   * Create combined stream for screen + camera recording
   */
  const createCombinedStream = useCallback((screenStream: MediaStream, cameraStream: MediaStream): MediaStream => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas not available');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    // Set canvas dimensions to match screen stream
    canvas.width = 1920;
    canvas.height = 1080;

    // Create stream from canvas
    const canvasStream = canvas.captureStream(30);

    // Add audio from camera stream
    const audioTracks = cameraStream.getAudioTracks();
    audioTracks.forEach(track => canvasStream.addTrack(track));

    // Start compositing video feeds
    const composite = () => {
      if (!recordingState.isRecording) return;

      const screenVideo = screenVideoRef.current;
      const cameraVideo = cameraVideoRef.current;

      if (screenVideo && cameraVideo && ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw screen feed (full canvas)
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

        // Calculate camera overlay position and size
        const overlayX = (cameraOverlay.x / 100) * (canvas.width - cameraOverlay.width);
        const overlayY = (cameraOverlay.y / 100) * (canvas.height - cameraOverlay.height);

        // Draw camera feed as circle overlay
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          overlayX + cameraOverlay.width / 2,
          overlayY + cameraOverlay.height / 2,
          Math.min(cameraOverlay.width, cameraOverlay.height) / 2,
          0,
          Math.PI * 2
        );
        ctx.clip();
        ctx.drawImage(cameraVideo, overlayX, overlayY, cameraOverlay.width, cameraOverlay.height);
        ctx.restore();

        // Add border to camera circle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          overlayX + cameraOverlay.width / 2,
          overlayY + cameraOverlay.height / 2,
          Math.min(cameraOverlay.width, cameraOverlay.height) / 2,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      requestAnimationFrame(composite);
    };

    composite();
    return canvasStream;
  }, [recordingState.isRecording, cameraOverlay]);

  /**
   * Start recording based on selected mode
   */
  const startRecording = async (): Promise<void> => {
    try {
      let finalStream: MediaStream;
      let screenStream: MediaStream | null = null;
      let cameraStream: MediaStream | null = null;

      // Get streams based on recording mode
      switch (recordingMode) {
        case 'screen':
          screenStream = await getScreenStream();
          finalStream = screenStream;
          
          // Display screen stream
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
          }
          break;

        case 'camera':
          cameraStream = await getCameraStream();
          finalStream = cameraStream;
          
          // Display camera stream
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = cameraStream;
          }
          break;

        case 'both':
          screenStream = await getScreenStream();
          cameraStream = await getCameraStream();
          
          // Display individual streams
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
          }
          if (cameraVideoRef.current) {
            cameraVideoRef.current.srcObject = cameraStream;
          }

          // Wait for video elements to be ready
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Create combined stream
          finalStream = createCombinedStream(screenStream, cameraStream);
          break;

        default:
          throw new Error('Invalid recording mode');
      }

      // Update stream state
      setStreamState({
        screenStream,
        cameraStream,
        combinedStream: finalStream
      });

      // Set up MediaRecorder with optimal settings
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm'
      ];

      let selectedMimeType = 'video/webm';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
      });

      const chunks: Blob[] = [];

      // Handle data available event
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        
        setRecordingState(prev => ({
          ...prev,
          recordedChunks: chunks,
          recordingUrl: url
        }));
      };

      // Handle errors
      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
        stopRecording();
      };

      mediaRecorderRef.current = mediaRecorder;

      // Start recording
      mediaRecorder.start(1000); // Collect data every second

      // Update recording state
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        recordedChunks: [],
        recordingUrl: null
      }));

      // Handle screen share end (user clicks stop sharing)
      if (screenStream) {
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          stopRecording();
        });
      }

    } catch (error) {
      console.error('Failed to start recording:', error);
      
      // Clean up any partial streams
      streamState.screenStream?.getTracks().forEach(track => track.stop());
      streamState.cameraStream?.getTracks().forEach(track => track.stop());
      
      // Show user-friendly error message
      if (error instanceof Error) {
        alert(`Recording failed: ${error.message}`);
      } else {
        alert('Failed to start recording. Please check your permissions and try again.');
      }
    }
  };

  /**
   * Pause or resume recording
   */
  const togglePauseRecording = (): void => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    if (recordingState.isPaused) {
      mediaRecorder.resume();
      setRecordingState(prev => ({ ...prev, isPaused: false }));
    } else {
      mediaRecorder.pause();
      setRecordingState(prev => ({ ...prev, isPaused: true }));
    }
  };

  /**
   * Stop recording and clean up streams
   */
  const stopRecording = (): void => {
    const mediaRecorder = mediaRecorderRef.current;
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    // Stop all tracks
    streamState.screenStream?.getTracks().forEach(track => track.stop());
    streamState.cameraStream?.getTracks().forEach(track => track.stop());
    streamState.combinedStream?.getTracks().forEach(track => track.stop());

    // Clear video sources
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }

    // Reset state
    setRecordingState(prev => ({
      ...prev,
      isRecording: false,
      isPaused: false
    }));

    setStreamState({
      screenStream: null,
      cameraStream: null,
      combinedStream: null
    });

    mediaRecorderRef.current = null;
  };

  /**
   * Download recorded video as .webm file
   */
  const downloadRecording = (): void => {
    if (!recordingState.recordingUrl) return;

    const a = document.createElement('a');
    a.href = recordingState.recordingUrl;
    a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /**
   * Save recording to library (localStorage for demo)
   */
  const saveToLibrary = (): void => {
    if (!recordingState.recordingUrl) return;

    const recording = {
      id: Date.now(),
      title: `Recording ${new Date().toLocaleString()}`,
      url: recordingState.recordingUrl,
      duration: recordingState.recordingTime,
      mode: recordingMode,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage (in real app, this would be sent to backend)
    const existingRecordings = JSON.parse(localStorage.getItem('screen-recordings') || '[]');
    const updatedRecordings = [recording, ...existingRecordings];
    localStorage.setItem('screen-recordings', JSON.stringify(updatedRecordings));

    alert('Recording saved to library!');
  };

  /**
   * Handle camera overlay dragging
   */
  const handleCameraMouseDown = (e: React.MouseEvent): void => {
    if (recordingMode !== 'both' || !recordingState.isRecording) return;

    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setCameraOverlay(prev => ({ ...prev, isDragging: true }));
  };

  /**
   * Handle mouse move for dragging
   */
  const handleMouseMove = useCallback((e: MouseEvent): void => {
    if (!cameraOverlay.isDragging || !dragStartRef.current) return;

    const container = document.querySelector('.recording-preview');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newX = ((e.clientX - containerRect.left - dragStartRef.current.x) / containerRect.width) * 100;
    const newY = ((e.clientY - containerRect.top - dragStartRef.current.y) / containerRect.height) * 100;

    // Keep overlay within bounds
    const maxX = 100 - (cameraOverlay.width / containerRect.width) * 100;
    const maxY = 100 - (cameraOverlay.height / containerRect.height) * 100;

    setCameraOverlay(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }));
  }, [cameraOverlay.isDragging, cameraOverlay.width, cameraOverlay.height]);

  /**
   * Handle mouse up for dragging
   */
  const handleMouseUp = useCallback((): void => {
    setCameraOverlay(prev => ({ ...prev, isDragging: false }));
    dragStartRef.current = null;
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (cameraOverlay.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [cameraOverlay.isDragging, handleMouseMove, handleMouseUp]);

  /**
   * Resize camera overlay
   */
  const resizeCameraOverlay = (direction: 'increase' | 'decrease'): void => {
    setCameraOverlay(prev => {
      const factor = direction === 'increase' ? 1.2 : 0.8;
      const newWidth = Math.max(100, Math.min(400, prev.width * factor));
      const newHeight = Math.max(75, Math.min(300, prev.height * factor));
      
      return {
        ...prev,
        width: newWidth,
        height: newHeight
      };
    });
  };

  /**
   * Check if MediaRecorder is supported
   */
  const isMediaRecorderSupported = (): boolean => {
    return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm');
  };

  // Show error if MediaRecorder is not supported
  if (!isMediaRecorderSupported()) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Browser Not Supported</h2>
          <p className="text-red-700">
            Your browser doesn't support screen recording. Please use Chrome, Edge, or Firefox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hidden canvas for compositing (both mode) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hidden video elements for stream sources */}
      <video ref={screenVideoRef} autoPlay muted playsInline style={{ display: 'none' }} />
      <video ref={cameraVideoRef} autoPlay muted playsInline style={{ display: 'none' }} />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Screen Recorder</h1>
        <p className="text-gray-600">Record your screen, webcam, or both with professional quality</p>
      </div>

      {/* Recording Mode Selection */}
      {!recordingState.isRecording && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recording Mode</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setRecordingMode('screen')}
              className={`p-4 border-2 rounded-xl transition-all ${
                recordingMode === 'screen'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium text-gray-900">Screen Only</h4>
              <p className="text-sm text-gray-600">Record your screen</p>
            </button>

            <button
              onClick={() => setRecordingMode('camera')}
              className={`p-4 border-2 rounded-xl transition-all ${
                recordingMode === 'camera'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Camera className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium text-gray-900">Camera Only</h4>
              <p className="text-sm text-gray-600">Record from webcam</p>
            </button>

            <button
              onClick={() => setRecordingMode('both')}
              className={`p-4 border-2 rounded-xl transition-all ${
                recordingMode === 'both'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium text-gray-900">Screen + Camera</h4>
              <p className="text-sm text-gray-600">Record both with overlay</p>
            </button>
          </div>
        </div>
      )}

      {/* Recording Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Recording Status Bar */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {recordingState.isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-red-600">
                    {recordingState.isPaused ? 'Paused' : 'Recording'}
                  </span>
                </div>
              )}
              {recordingState.isRecording && (
                <div className="text-gray-600 font-mono">
                  {formatTime(recordingState.recordingTime)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Mode: {recordingMode.charAt(0).toUpperCase() + recordingMode.slice(1)}
            </div>
          </div>
        </div>

        {/* Video Preview Area */}
        <div className="relative bg-gray-900 aspect-video recording-preview">
          {/* Screen preview (for screen and both modes) */}
          {(recordingMode === 'screen' || recordingMode === 'both') && streamState.screenStream && (
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-contain"
              ref={(el) => {
                if (el && streamState.screenStream) {
                  el.srcObject = streamState.screenStream;
                }
              }}
            />
          )}

          {/* Camera preview (for camera-only mode) */}
          {recordingMode === 'camera' && streamState.cameraStream && (
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }} // Mirror camera
              ref={(el) => {
                if (el && streamState.cameraStream) {
                  el.srcObject = streamState.cameraStream;
                }
              }}
            />
          )}

          {/* Camera overlay (for both mode) */}
          {recordingMode === 'both' && recordingState.isRecording && streamState.cameraStream && (
            <div
              className="absolute rounded-full overflow-hidden border-4 border-white shadow-lg cursor-move bg-gray-800"
              style={{
                left: `${cameraOverlay.x}%`,
                top: `${cameraOverlay.y}%`,
                width: `${cameraOverlay.width}px`,
                height: `${cameraOverlay.height}px`,
              }}
              onMouseDown={handleCameraMouseDown}
            >
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror camera
                ref={(el) => {
                  if (el && streamState.cameraStream) {
                    el.srcObject = streamState.cameraStream;
                  }
                }}
              />
              
              {/* Overlay controls */}
              <div className="absolute top-1 right-1 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resizeCameraOverlay('decrease');
                  }}
                  className="bg-black/70 text-white p-1 rounded text-xs hover:bg-black/90"
                  title="Make smaller"
                >
                  <Minimize className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resizeCameraOverlay('increase');
                  }}
                  className="bg-black/70 text-white p-1 rounded text-xs hover:bg-black/90"
                  title="Make larger"
                >
                  <Maximize className="w-3 h-3" />
                </button>
              </div>
              
              <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Move className="w-3 h-3 inline mr-1" />
                Drag to move
              </div>
            </div>
          )}

          {/* Preview state when not recording */}
          {!recordingState.isRecording && !streamState.screenStream && !streamState.cameraStream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {recordingMode === 'screen' && <Monitor className="w-12 h-12" />}
                  {recordingMode === 'camera' && <Camera className="w-12 h-12" />}
                  {recordingMode === 'both' && <Video className="w-12 h-12" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Record</h3>
                <p className="text-gray-300">
                  {recordingMode === 'screen' && 'Click Start Recording to select your screen'}
                  {recordingMode === 'camera' && 'Click Start Recording to use your camera'}
                  {recordingMode === 'both' && 'Click Start Recording to capture screen with camera overlay'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            {!recordingState.isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Recording
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePauseRecording}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  {recordingState.isPaused ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  )}
                </button>
                
                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recording Result */}
      {recordingState.recordingUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recording Complete</h3>
          
          {/* Video Preview */}
          <video
            src={recordingState.recordingUrl}
            controls
            className="w-full max-h-96 rounded-lg bg-gray-900 mb-4"
          />
          
          {/* Recording Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Duration: {formatTime(recordingState.recordingTime)} • 
              Mode: {recordingMode} • 
              Format: WebM
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadRecording}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download .webm
            </button>
            
            <button
              onClick={saveToLibrary}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Video className="w-4 h-4 mr-2" />
              Save to Library
            </button>
            
            <button
              onClick={() => setRecordingState(prev => ({ ...prev, recordingUrl: null }))}
              className="text-gray-600 hover:text-gray-800 px-4 py-2 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Browser Compatibility Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-medium text-blue-900 mb-2">Browser Compatibility</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-blue-800">Chrome 72+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-blue-800">Edge 79+</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-blue-800">Firefox 66+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenRecorder;