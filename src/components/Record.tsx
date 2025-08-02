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

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingMode, setRecordingMode] = useState<'camera' | 'screen'>('camera');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      recordedChunksRef.current = [];
      
      let stream: MediaStream;
      
      if (recordingMode === 'screen') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: isAudioOn
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create MediaRecorder with proper options
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus'
      };
      
      // Fallback if vp9 not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setHasRecording(recordedChunksRef.current.length > 0);
      };

      // Start recording with time slicing
      mediaRecorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Failed to start recording. Please check camera/microphone permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
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
    
    recordedChunksRef.current = [];
    setHasRecording(false);
    setRecordingTime(0);
    setSaveStatus('idle');
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Create video blob from recorded chunks
  const createVideoBlob = (): Blob | null => {
    if (recordedChunksRef.current.length === 0) {
      return null;
    }
    
    return new Blob(recordedChunksRef.current, { type: 'video/webm' });
  };

  // Download recording locally
  const downloadRecording = () => {
    const blob = createVideoBlob();
    if (!blob) {
      alert('No recording to download');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save to library (cloud)
  const saveToLibrary = async () => {
    const blob = createVideoBlob();
    if (!blob) {
      alert('No recording to save');
      return;
    }

    try {
      setSaveStatus('saving');
      
      // Simulate cloud upload (replace with actual Cloudflare Stream upload)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, upload to Cloudflare Stream here
      console.log('Saving to library:', {
        size: blob.size,
        type: blob.type,
        duration: recordingTime
      });
      
      setSaveStatus('success');
      
      // Reset after successful save
      setTimeout(() => {
        resetRecording();
        setShowSaveModal(false);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to save to library:', error);
      setSaveStatus('error');
    }
  };

  // Handle save option selection
  const handleSaveOption = async (option: 'library' | 'download' | 'both' | 'discard') => {
    setIsSaving(true);
    
    try {
      switch (option) {
        case 'library':
          await saveToLibrary();
          break;
        case 'download':
          downloadRecording();
          setShowSaveModal(false);
          resetRecording();
          break;
        case 'both':
          downloadRecording();
          await saveToLibrary();
          break;
        case 'discard':
          resetRecording();
          setShowSaveModal(false);
          break;
      }
    } catch (error) {
      console.error('Save operation failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
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

  // Switch recording mode
  const switchMode = async (mode: 'camera' | 'screen') => {
    if (isRecording) {
      alert('Please stop recording before switching modes');
      return;
    }
    
    setRecordingMode(mode);
    
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Start new stream based on mode
    try {
      let stream: MediaStream;
      
      if (mode === 'screen') {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' },
          audio: isAudioOn
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isAudioOn
        });
      }

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
    } catch (err) {
      console.error('Failed to switch recording mode:', err);
    }
  };

  // Initialize camera on component mount
  useEffect(() => {
    switchMode('camera');
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-mono text-lg font-medium text-gray-900">
              {formatTime(recordingTime)}
            </span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">
                {isPaused ? 'Paused' : 'Recording'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Recording Area */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
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
                <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Camera Off</p>
              </div>
            </div>
          )}

          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                {isPaused ? 'PAUSED' : 'REC'}
              </span>
            </div>
          )}

          {/* Timer */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg">
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6">
          {/* Recording Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => switchMode('camera')}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingMode === 'camera' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </button>
              <button
                onClick={() => switchMode('screen')}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingMode === 'screen' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Screen
              </button>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              disabled={isRecording}
              className={`p-4 rounded-full transition-colors ${
                isAudioOn ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-100 hover:bg-red-200'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              {isAudioOn ? (
                <Mic className="w-6 h-6 text-gray-700" />
              ) : (
                <MicOff className="w-6 h-6 text-red-600" />
              )}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              disabled={isRecording}
              className={`p-4 rounded-full transition-colors ${
                isVideoOn ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-100 hover:bg-red-200'
              } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? (
                <Video className="w-6 h-6 text-gray-700" />
              ) : (
                <VideoOff className="w-6 h-6 text-red-600" />
              )}
            </button>

            {/* Record/Stop Button */}
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-full transition-colors shadow-lg"
                title="Start recording"
              >
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-full transition-colors shadow-lg"
                title="Stop recording"
              >
                <Square className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Pause/Resume */}
            {isRecording && (
              <button
                onClick={togglePause}
                className="bg-yellow-600 hover:bg-yellow-700 text-white p-4 rounded-full transition-colors"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <Play className="w-6 h-6" />
                ) : (
                  <Pause className="w-6 h-6" />
                )}
              </button>
            )}

            {/* Reset */}
            <button
              onClick={resetRecording}
              disabled={isRecording}
              className={`p-4 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Save Button */}
          {hasRecording && !isRecording && (
            <div className="text-center">
              <button
                onClick={() => setShowSaveModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center mx-auto"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Recording
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Options Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Save Recording</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {saveStatus === 'saving' && (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Saving your recording...</p>
                </div>
              )}

              {saveStatus === 'success' && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">Recording saved successfully!</p>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">Failed to save recording</p>
                  <button
                    onClick={() => setSaveStatus('idle')}
                    className="text-purple-600 hover:text-purple-700 mt-2"
                  >
                    Try again
                  </button>
                </div>
              )}

              {saveStatus === 'idle' && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleSaveOption('library')}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Save to Library
                  </button>
                  
                  <button
                    onClick={() => handleSaveOption('download')}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </button>
                  
                  <button
                    onClick={() => handleSaveOption('both')}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Both
                  </button>
                  
                  <button
                    onClick={() => handleSaveOption('discard')}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Discard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}