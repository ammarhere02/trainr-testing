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
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen'>('screen');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const startRecording = async () => {
    try {
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
            mediaSource: 'screen',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: isAudioEnabled
        });
      } else {
        // Camera recording
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled ? {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          } : false,
          audio: isAudioEnabled
        });
      }

      streamRef.current = stream;

      // Display the stream in video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Prevent feedback
      }

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
        
        if (chunksRef.current.length === 0) {
          alert('No recording data captured. Please try again.');
          return;
        }

        // Calculate total size
        const totalSize = chunksRef.current.reduce((total, chunk) => total + chunk.size, 0);
        console.log('Total recording size:', totalSize, 'bytes');

        if (totalSize === 0) {
          alert('Recording is empty. Please try recording again.');
          return;
        }

        // Create blob from chunks
        const mimeType = mediaRecorder.mimeType || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        
        console.log('Created blob:', blob.size, 'bytes, type:', blob.type);
        
        if (blob.size === 0) {
          alert('Failed to create recording. Please try again.');
          return;
        }

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

        // Stop all tracks
        stream.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      };

      // Handle errors
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Recording error occurred. Please try again.');
      };

      // Start recording with time slice for regular data capture
      mediaRecorder.start(100); // Capture data every 100ms
      setIsRecording(true);
      setRecordingTime(0);

      console.log('Recording started with MIME type:', mediaRecorder.mimeType);

    } catch (error) {
      console.error('Failed to start recording:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Permission denied. Please allow camera/microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera or microphone found. Please check your devices.');
        } else {
          alert(`Failed to start recording: ${error.message}`);
        }
      } else {
        alert('Failed to start recording. Please check your permissions and try again.');
      }
    }
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
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
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

  const uploadToStream = async (blob: Blob): Promise<string> => {
    if (!isStreamConfigured()) {
      throw new Error('Cloudflare Stream not configured. Please check your environment variables.');
    }

    // Validate blob before upload
    if (!blob || blob.size === 0) {
      throw new Error('Cannot upload empty video file.');
    }

    if (blob.size < 1000) { // Less than 1KB is likely invalid
      throw new Error('Video file is too small to be valid.');
    }

    console.log('Uploading blob:', blob.size, 'bytes, type:', blob.type);

    const streamAPI = getStreamAPI();
    const metadata = {
      name: `Recording ${new Date().toLocaleString()}`,
      description: 'Recorded with Trainr'
    };

    try {
      const video = await streamAPI.uploadVideo(blob, metadata);
      return video.uid;
    } catch (error) {
      console.error('Upload to Cloudflare Stream failed:', error);
      throw error;
    }
  };

  const saveAndUploadToStream = async () => {
    if (!recordedBlob) {
      alert('No recording data available. Please try recording again.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const videoId = await uploadToStream(recordedBlob);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Save to local storage as well
      const recordings = JSON.parse(localStorage.getItem('recordings') || '[]');
      
      // Create a persistent blob URL for playback
      const videoUrl = URL.createObjectURL(recordedBlob);
      
      const newRecording = {
        id: Date.now(),
        title: `Recording ${new Date().toLocaleString()}`,
        date: new Date().toISOString(),
        duration: recordingTime,
        cloudflareId: videoId,
        localUrl: videoUrl,
        size: recordedBlob.size,
        type: recordedBlob.type,
        mode: recordingMode
      };
      recordings.unshift(newRecording);
      localStorage.setItem('recordings', JSON.stringify(recordings));

      alert('Recording saved to library successfully!');
      setShowSaveOptions(false);
      discardRecording();

    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload to Cloudflare Stream failed:\n\n${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const saveToLibraryAndDownload = async () => {
    if (!recordedBlob) {
      alert('No recording data available. Please try recording again.');
      return;
    }

    // Download first
    downloadRecording();
    
    // Then upload to cloud
    await saveAndUploadToStream();
  };

  const handleSaveOption = async (option: 'library' | 'download' | 'both' | 'discard') => {
    switch (option) {
      case 'library':
        await saveAndUploadToStream();
        break;
      case 'download':
        downloadRecording();
        setShowSaveOptions(false);
        discardRecording();
        break;
      case 'both':
        await saveToLibraryAndDownload();
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
                        ) : (
                          <Camera className="w-10 h-10" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Ready to Record {recordingMode === 'screen' ? 'Screen' : 'Camera'}
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
                    <span className="font-medium capitalize">{recordingMode}</span>
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
                  disabled={isUploading}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Save className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Save to Library</div>
                      <div className="text-sm text-gray-600">Upload to cloud storage</div>
                    </div>
                  </div>
                  {isUploading && (
                    <Loader className="w-5 h-5 text-purple-600 animate-spin" />
                  )}
                </button>

                <button
                  onClick={() => handleSaveOption('download')}
                  disabled={isUploading}
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
                  disabled={isUploading}
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
                  disabled={isUploading}
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
              {isUploading && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Uploading to library...</span>
                    <span className="text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
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