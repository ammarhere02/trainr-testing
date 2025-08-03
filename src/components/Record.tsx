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
  Trash2, 
  Monitor, 
  Camera, 
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader,
  Save,
  X
} from 'lucide-react';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen' | 'both'>('screen');
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      // Reset everything
      chunksRef.current = [];
      setRecordedBlob(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      let stream: MediaStream;

      if (recordingMode === 'screen') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: isAudioEnabled
        });
      } else if (recordingMode === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: isAudioEnabled
        });
      } else { // both mode
        // Get both screen and camera streams
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: isAudioEnabled
        });
        
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: false // Avoid audio feedback
        });
        
        // Create a canvas to combine both streams
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 1920;
        canvas.height = 1080;
        
        // Create video elements for both streams
        const screenVideo = document.createElement('video');
        const cameraVideo = document.createElement('video');
        
        screenVideo.srcObject = screenStream;
        cameraVideo.srcObject = cameraStream;
        
        await screenVideo.play();
        await cameraVideo.play();
        
        // Function to draw both videos on canvas
        const drawFrame = () => {
          // Draw screen video (full canvas)
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
          
          // Draw camera video (picture-in-picture in bottom right)
          const pipWidth = 320;
          const pipHeight = 240;
          const pipX = canvas.width - pipWidth - 20;
          const pipY = canvas.height - pipHeight - 20;
          
          // Add border for camera feed
          ctx.fillStyle = 'white';
          ctx.fillRect(pipX - 4, pipY - 4, pipWidth + 8, pipHeight + 8);
          
          ctx.drawImage(cameraVideo, pipX, pipY, pipWidth, pipHeight);
          
          if (isRecording) {
            requestAnimationFrame(drawFrame);
          }
        };
        
        // Start drawing frames
        drawFrame();
        
        // Get stream from canvas
        stream = canvas.captureStream(30); // 30 FPS
        
        // Add audio from screen stream if enabled
        if (isAudioEnabled && screenStream.getAudioTracks().length > 0) {
          screenStream.getAudioTracks().forEach(track => {
            stream.addTrack(track);
          });
        }
        
        // Store references for cleanup
        streamRef.current = stream;
        // Store additional streams for cleanup
        (stream as any)._screenStream = screenStream;
        (stream as any)._cameraStream = cameraStream;
      }

      streamRef.current = stream;

      // Display stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }

      // Create MediaRecorder with the most compatible settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Collect data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        
        if (blob.size > 0) {
          setRecordedBlob(blob);
          setHasRecording(true);
          setShowSaveOptions(true);
          
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
            videoRef.current.muted = false;
          }
        } else {
          alert('Recording failed - no data captured');
        }
        
        cleanupStreams();
      };

      // Start recording with data collection every second
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);

    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please check permissions.');
      cleanupStreams();
    }
  };

  const cleanupStreams = () => {
    if (streamRef.current) {
      // Clean up additional streams for 'both' mode
      if ((streamRef.current as any)._screenStream) {
        (streamRef.current as any)._screenStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      if ((streamRef.current as any)._cameraStream) {
        (streamRef.current as any)._cameraStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    
    setRecordedBlob(null);
    setHasRecording(false);
    setShowSaveOptions(false);

    if (videoRef.current) {
      videoRef.current.src = '';
      videoRef.current.srcObject = null;
    }
  };

  const saveToLibrary = async () => {
    if (!recordedBlob) return;

    setIsSavingToLibrary(true);

    try {
      // Save to localStorage instead of IndexedDB for simplicity
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const videoData = {
          id: Date.now(),
          title: `Recording ${new Date().toLocaleString()}`,
          base64Data: base64,
          duration: recordingTime,
          size: recordedBlob!.size,
          mode: recordingMode,
          date: new Date().toISOString(),
          mimeType: 'video/webm'
        };

        // Get existing videos
        const existingVideos = JSON.parse(localStorage.getItem('video-library') || '[]');
        existingVideos.unshift(videoData);
        
        // Keep only last 10 videos to avoid storage issues
        const limitedVideos = existingVideos.slice(0, 10);
        localStorage.setItem('video-library', JSON.stringify(limitedVideos));

        alert('Recording saved to library successfully!');
        setShowSaveOptions(false);
        discardRecording();
        setIsSavingToLibrary(false);
      };
      
      reader.onerror = () => {
        alert('Failed to save recording');
        setIsSavingToLibrary(false);
      };
      
      reader.readAsDataURL(recordedBlob);

    } catch (error) {
      alert('Failed to save recording');
      setIsSavingToLibrary(false);
    }
  };

  const downloadRecording = () => {
    if (!recordedBlob) return;

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
                      RECORDING
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
                        Click the record button to start capturing
                      </p>
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
                        <span className="font-medium">WebM</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}