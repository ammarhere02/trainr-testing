import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import ScreenRecorder from './ScreenRecorder';

interface RecordProps {
  onBack: () => void;
}

export default function Record({ onBack }: RecordProps) {
  // Pause/Resume recording
  const togglePause = () => {
    if (mediaRecorder) {
      if (isPaused) {
        mediaRecorder.resume();
      } else {
        mediaRecorder.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (recordingMode === 'screen') return;
    
    if (cameraStream) {
      const videoTrack = cameraStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
      }
    }
    setIsCameraOn(!isCameraOn);
  };

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (currentStream) {
      const audioTrack = currentStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
    setIsMicOn(!isMicOn);
  };

  // Download recording as MP4
  const downloadRecording = (recording: any) => {
    if (recording.blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(recording.blob);
      a.download = `${recording.title}.mp4`; // Changed from .mp4 to .mp4 for clarity
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href); // Clean up
    } else if (recording.url) {
      const a = document.createElement('a');
      a.href = recording.url;
      a.download = `${recording.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Delete recording
  const deleteRecording = (id: number) => {
    if (confirm('Are you sure you want to delete this recording?')) {
      const updatedRecordings = recordings.filter(r => r.id !== id);
      setRecordings(updatedRecordings);
      localStorage.setItem('recorded-videos', JSON.stringify(updatedRecordings));
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Save recording to library
  const saveToLibrary = () => {
    if (!completedRecording) return;
    
    const recordingToSave = {
      ...completedRecording,
      title: recordingTitle || completedRecording.title
    };
    
    const updatedRecordings = [recordingToSave, ...recordings];
    setRecordings(updatedRecordings);
    
    // Save to localStorage (without blob for storage efficiency)
    const recordingsForStorage = updatedRecordings.map(r => ({
      ...r,
      blob: undefined // Don't store blob in localStorage
    }));
    localStorage.setItem('recorded-videos', JSON.stringify(recordingsForStorage));
    
    setShowSaveModal(false);
    setCompletedRecording(null);
    setRecordingTitle('');
  };

  // Download recording directly
  const downloadDirectly = () => {
    if (!completedRecording) return;
    
    const recordingToDownload = {
      ...completedRecording,
      title: recordingTitle || completedRecording.title
    };
    
    downloadRecording(recordingToDownload);
    setShowSaveModal(false);
    setCompletedRecording(null);
    setRecordingTitle('');
  };

  // Save and download
  const saveAndDownload = () => {
    if (!completedRecording) return;
    
    const recordingToSave = {
      ...completedRecording,
      title: recordingTitle || completedRecording.title
    };
    
    // Save to library
    const updatedRecordings = [recordingToSave, ...recordings];
    setRecordings(updatedRecordings);
    
    const recordingsForStorage = updatedRecordings.map(r => ({
      ...r,
      blob: undefined
    }));
    localStorage.setItem('recorded-videos', JSON.stringify(recordingsForStorage));
    
    // Download
    downloadRecording(recordingToSave);
    
    setShowSaveModal(false);
    setCompletedRecording(null);
    setRecordingTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hidden canvas for compositing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hidden camera video for compositing */}
      <video ref={cameraVideoRef} autoPlay muted playsInline style={{ display: 'none' }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Recorder</h1>
            <p className="text-gray-600">Record your screen, camera, or both for course content</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recording Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Recording Controls Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {isRecording && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <span className={`font-medium ${isRecording ? 'text-red-600' : 'text-gray-600'}`}>
                      {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready to Record'}
                    </span>
                  </div>
                  {isRecording && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-mono">{formatTime(recordingTime)}</span>
                    </div>
                  )}
                </div>

                {/* Recording Mode Selector */}
                {!isRecording && (
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setRecordingMode('screen')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        recordingMode === 'screen' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Monitor className="w-4 h-4 mr-1 inline" />
                      Screen
                    </button>
                    <button
                      onClick={() => setRecordingMode('camera')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        recordingMode === 'camera' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Camera className="w-4 h-4 mr-1 inline" />
                      Camera
                    </button>
                    <button
                      onClick={() => setRecordingMode('both')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        recordingMode === 'both' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Video className="w-4 h-4 mr-1 inline" />
                      Both
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview Area */}
            <div className="relative bg-gray-900 aspect-video recording-container">
              {/* Screen Video */}
              {(recordingMode === 'screen' || recordingMode === 'both') && (
                <video
                  ref={screenVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Camera Video (for camera-only mode) */}
              {recordingMode === 'camera' && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* Camera Overlay (for both mode) */}
              {recordingMode === 'both' && isRecording && cameraStream && (
                <div
                  className="absolute w-48 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-move"
                  style={{
                    left: `${cameraPosition.x}px`,
                    top: `${cameraPosition.y}px`,
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror camera
                    ref={(el) => {
                      if (el && cameraStream) {
                        el.srcObject = cameraStream;
                      }
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Move className="w-3 h-3 mr-1" />
                    Drag
                  </div>
                </div>
              )}

              {/* Preview State */}
              {!isRecording && !isScreenSharing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {recordingMode === 'screen' && <Monitor className="w-12 h-12" />}
                      {recordingMode === 'camera' && <Camera className="w-12 h-12" />}
                      {recordingMode === 'both' && <Video className="w-12 h-12" />}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {recordingMode === 'screen' && 'Screen Recording'}
                      {recordingMode === 'camera' && 'Camera Recording'}
                      {recordingMode === 'both' && 'Screen + Camera Recording'}
                    </h3>
                    <p className="text-gray-300">
                      {recordingMode === 'screen' && 'Record your screen and audio'}
                      {recordingMode === 'camera' && 'Record using your camera'}
                      {recordingMode === 'both' && 'Record screen with moveable camera overlay'}
                    </p>
                  </div>
                </div>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Processing recording...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4">
                {/* Camera Toggle */}
                {recordingMode !== 'screen' && (
                  <button
                    onClick={toggleCamera}
                    disabled={isRecording}
                    className={`p-3 rounded-full transition-colors ${
                      isCameraOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 hover:bg-red-200'
                    } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {isCameraOn ? (
                      <Camera className="w-5 h-5 text-gray-700" />
                    ) : (
                      <CameraOff className="w-5 h-5 text-red-600" />
                    )}
                  </button>
                )}

                {/* Microphone Toggle */}
                <button
                  onClick={toggleMicrophone}
                  disabled={isRecording}
                  className={`p-3 rounded-full transition-colors ${
                    isMicOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-100 hover:bg-red-200'
                  } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {isMicOn ? (
                    <Mic className="w-5 h-5 text-gray-700" />
                  ) : (
                    <MicOff className="w-5 h-5 text-red-600" />
                  )}
                </button>

                {/* Main Record/Stop Button */}
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={isProcessing}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Recording
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
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
                    <button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                      title="Stop recording"
                    >
                      <Square className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview of Last Recording */}
          {previewUrl && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Latest Recording</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => downloadRecording(recordings[0])}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                    title="Download as MP4"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <video
                src={previewUrl}
                controls
                className="w-full rounded-lg bg-gray-900"
                style={{ maxHeight: '300px' }}
              />
              <div className="mt-3 text-sm text-gray-600">
                Click download to save as MP4 file
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recording Settings */}
          {showSettings && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recording Settings</h3>
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
                    Frame Rate
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                    <option>30 FPS (Recommended)</option>
                    <option>60 FPS</option>
                    <option>24 FPS</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Include Microphone</span>
                  <input type="checkbox" checked={isMicOn} onChange={() => setIsMicOn(!isMicOn)} className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Auto-save Recordings</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recording Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Recordings</span>
                <span className="font-medium">{recordings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="font-medium">
                  {formatFileSize(recordings.reduce((total, r) => total + (r.size || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Duration</span>
                <span className="font-medium">
                  {formatTime(recordings.reduce((total, r) => total + (r.duration || 0), 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Recording Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recording Tips</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Close unnecessary applications for better performance</li>
              <li>• Use a quiet environment for clear audio</li>
              <li>• Check your lighting if using camera</li>
              <li>• Test your setup before important recordings</li>
              <li>• In "Both" mode, drag the camera circle to reposition</li>
              <li>• Recordings are saved as MP4 files</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recordings Library */}
      {recordings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recordings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <video
                    src={recording.url}
                    className="w-full h-48 object-cover bg-gray-900"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='white' font-size='16'%3ERecording%3C/text%3E%3C/svg%3E"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {formatTime(recording.duration)}
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      recording.type === 'screen' ? 'bg-blue-500 text-white' :
                      recording.type === 'camera' ? 'bg-green-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {recording.type === 'screen' && 'Screen'}
                      {recording.type === 'camera' && 'Camera'}
                      {recording.type === 'both' && 'Screen + Camera'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2 truncate">{recording.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{new Date(recording.date).toLocaleDateString()}</span>
                    <span>{formatFileSize(recording.size)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        const video = document.createElement('video');
                        video.src = recording.url;
                        video.controls = true;
                        video.style.width = '100%';
                        video.style.maxHeight = '80vh';
                        
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4';
                        modal.onclick = () => document.body.removeChild(modal);
                        modal.appendChild(video);
                        document.body.appendChild(modal);
                      }}
                      className="text-purple-600 hover:text-purple-700 transition-colors flex items-center text-sm"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Play
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadRecording(recording)}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        title="Download MP4"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Recording Modal */}
      {showSaveModal && completedRecording && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recording Completed!</h3>
              
              {/* Recording Preview */}
              <div className="mb-6">
                <video
                  src={completedRecording.url}
                  className="w-full h-32 object-cover rounded-lg bg-gray-900"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='200' y='150' text-anchor='middle' fill='white' font-size='16'%3ERecording Preview%3C/text%3E%3C/svg%3E"
                />
                <div className="mt-2 text-sm text-gray-600">
                  Duration: {formatTime(completedRecording.duration)} • Size: {formatFileSize(completedRecording.size)}
                </div>
              </div>

              {/* Recording Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recording Title (Optional)
                </label>
                <input
                  type="text"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder={completedRecording.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={saveAndDownload}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save to Library & Download MP4
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={saveToLibrary}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Only
                  </button>
                  <button
                    onClick={downloadDirectly}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download MP4
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setCompletedRecording(null);
                    setRecordingTitle('');
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
                >
                  Discard Recording
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}