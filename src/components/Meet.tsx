import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Users, 
  MessageCircle, 
  Settings, 
  Copy, 
  Link, 
  UserPlus, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Grid, 
  Speaker, 
  Camera, 
  Hand, 
  MoreVertical,
  Clock,
  Share2,
  Download,
  Play,
  Square,
  Pause,
  Eye,
  EyeOff,
  Crown,
  Shield,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Calendar,
  Plus
} from 'lucide-react';

export default function Meet() {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [roomName, setRoomName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [participantCount, setParticipantCount] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock participants data
  const [participants, setParticipants] = useState([
    { id: 1, name: 'You (Host)', isHost: true, videoOn: true, audioOn: true, isHandRaised: false },
    { id: 2, name: 'Sarah Johnson', isHost: false, videoOn: true, audioOn: true, isHandRaised: false },
    { id: 3, name: 'Mike Chen', isHost: false, videoOn: false, audioOn: true, isHandRaised: true },
    { id: 4, name: 'Emma Davis', isHost: false, videoOn: true, audioOn: false, isHandRaised: false }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Sarah Johnson', message: 'Thanks for hosting this session!', time: '10:30 AM' },
    { id: 2, sender: 'Mike Chen', message: 'Can you share the slides?', time: '10:32 AM' },
    { id: 3, sender: 'You', message: 'Sure! Let me share my screen', time: '10:33 AM' }
  ]);

  const [newMessage, setNewMessage] = useState('');

  // Timer effect for call duration
  useEffect(() => {
    if (isInCall) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInCall]);

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

  // Generate meeting link
  const generateMeetingLink = () => {
    const roomId = Math.random().toString(36).substr(2, 9);
    const link = `https://meet.trainr.app/room/${roomId}`;
    setMeetingLink(link);
    return link;
  };

  // Start instant meeting
  const startInstantMeeting = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
        audio: isAudioOn
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const link = generateMeetingLink();
      setIsInCall(true);
      setParticipantCount(1);
      
      // Auto-copy link to clipboard
      navigator.clipboard.writeText(link);
      
    } catch (err) {
      console.error('Failed to start meeting:', err);
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  // Create scheduled meeting
  const createScheduledMeeting = () => {
    const link = generateMeetingLink();
    setShowCreateModal(false);
    setRoomName('');
    
    // In real app, this would save to backend
    console.log('Created scheduled meeting:', { roomName, link });
  };

  // End call
  const endCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsInCall(false);
    setIsRecording(false);
    setIsScreenSharing(false);
    setCallDuration(0);
    setParticipantCount(1);
  };

  // Toggle video
  const toggleVideo = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(!isVideoOn);
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(!isAudioOn);
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // In a real app, you'd replace the video track
      setIsScreenSharing(true);
      
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        setIsScreenSharing(false);
      });
      
    } catch (err) {
      console.error('Failed to start screen sharing:', err);
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  // Copy meeting link
  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  if (!isInCall) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trainr Meet</h1>
            <p className="text-gray-600 mt-2">Host live video calls with your students</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Start */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Instant Meeting</h2>
              <p className="text-gray-600 mb-8">
                Start a meeting right now and invite students with a shareable link
              </p>
              
              <button
                onClick={startInstantMeeting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4"
              >
                Start Meeting Now
              </button>
              
              <p className="text-sm text-gray-500">
                Meeting link will be automatically copied to clipboard
              </p>
            </div>

            {/* Quick Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Quick Settings</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Camera</span>
                </div>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isVideoOn ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isVideoOn ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mic className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Microphone</span>
                </div>
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAudioOn ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAudioOn ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Meeting */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Meeting</h2>
              <p className="text-gray-600 mb-8">
                Create a meeting link for later and share it with your students
              </p>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Create Meeting Link
              </button>
            </div>

            {/* Recent Meetings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Recent Meetings</h3>
              <div className="space-y-3">
                {[
                  { name: 'React Fundamentals Q&A', time: '2 hours ago', participants: 12 },
                  { name: 'JavaScript Best Practices', time: '1 day ago', participants: 8 },
                  { name: 'Web Development Office Hours', time: '3 days ago', participants: 15 }
                ].map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{meeting.name}</h4>
                      <p className="text-sm text-gray-600">{meeting.time} • {meeting.participants} participants</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Video Conferencing Platform</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: 'Video & Audio Calls',
                description: 'HD meetings, virtual backgrounds, gallery view'
              },
              {
                icon: Monitor,
                title: 'Screen Sharing',
                description: 'Share apps, whiteboards, annotate, collaborate'
              },
              {
                icon: MessageCircle,
                title: 'Chat & Messaging',
                description: 'In-meeting and team chat with file sharing'
              },
              {
                icon: Users,
                title: 'Webinars & Events',
                description: 'Host large broadcasts, breakout rooms, polls'
              },
              {
                icon: Calendar,
                title: 'Scheduling & Calendar',
                description: 'One-click links, reminders, integrations'
              },
              {
                icon: Settings,
                title: 'Security Controls',
                description: 'Waiting rooms, passcodes, host permissions'
              },
              {
                icon: Download,
                title: 'Recording & Transcription',
                description: 'Cloud/local recording, live transcripts'
              },
              {
                icon: Hand,
                title: 'Interactive Features',
                description: 'Raise hand, reactions, polls, Q&A'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Additional Features */}
          <div className="mt-8 pt-6 border-t border-purple-200">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Up to 1000 participants</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">99.9% uptime guarantee</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Create Meeting Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Meeting Link</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g., React Fundamentals Q&A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createScheduledMeeting}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Create Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // In-call interface
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Live</span>
          </div>
          <div className="text-white">
            <Clock className="w-4 h-4 inline mr-2" />
            {formatTime(callDuration)}
          </div>
          <div className="text-white">
            <Users className="w-4 h-4 inline mr-2" />
            {participantCount} participants
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {meetingLink && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">Meeting ID:</span>
              <code className="bg-gray-700 text-white px-2 py-1 rounded text-sm">
                {meetingLink.split('/').pop()}
              </code>
              <button
                onClick={copyMeetingLink}
                className="text-gray-300 hover:text-white transition-colors"
                title="Copy meeting link"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {isRecording && (
            <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="absolute inset-0">
            {isScreenSharing ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <Monitor className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Screen Sharing Active</p>
                  <p className="text-gray-300">Your screen is being shared with participants</p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Video overlay info */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                You (Host)
              </div>
            </div>
          </div>

          {/* Participant thumbnails */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {participants.slice(1, 4).map((participant) => (
              <div key={participant.id} className="relative">
                <div className="w-32 h-24 bg-gray-700 rounded-lg overflow-hidden">
                  {participant.videoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <VideoOff className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 left-1 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
                  {participant.name.split(' ')[0]}
                </div>
                {!participant.audioOn && (
                  <div className="absolute top-1 right-1 bg-red-500 rounded-full p-1">
                    <MicOff className="w-3 h-3 text-white" />
                  </div>
                )}
                {participant.isHandRaised && (
                  <div className="absolute top-1 left-1 bg-yellow-500 rounded-full p-1">
                    <Hand className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowChat(true);
                    setShowParticipants(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    showChat ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => {
                    setShowParticipants(true);
                    setShowChat(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    showParticipants ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Participants ({participants.length})
                </button>
              </div>
            </div>

            {/* Chat */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Participants */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium text-sm">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{participant.name}</span>
                            {participant.isHost && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {participant.videoOn ? (
                              <Video className="w-3 h-3 text-green-500" />
                            ) : (
                              <VideoOff className="w-3 h-3 text-gray-400" />
                            )}
                            {participant.audioOn ? (
                              <Mic className="w-3 h-3 text-green-500" />
                            ) : (
                              <MicOff className="w-3 h-3 text-red-500" />
                            )}
                            {participant.isHandRaised && (
                              <Hand className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      {!participant.isHost && (
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Control */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-colors ${
              isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isAudioOn ? 'Mute' : 'Unmute'}
          >
            {isAudioOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Video Control */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={startScreenShare}
            className={`p-4 rounded-full transition-colors ${
              isScreenSharing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Share screen"
          >
            <Monitor className="w-6 h-6 text-white" />
          </button>

          {/* Record */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-4 rounded-full transition-colors ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            )}
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => {
              setShowChat(!showChat);
              if (showParticipants) setShowParticipants(false);
            }}
            className={`p-4 rounded-full transition-colors ${
              showChat ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle chat"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Participants Toggle */}
          <button
            onClick={() => {
              setShowParticipants(!showParticipants);
              if (showChat) setShowChat(false);
            }}
            className={`p-4 rounded-full transition-colors ${
              showParticipants ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Toggle participants"
          >
            <Users className="w-6 h-6 text-white" />
          </button>

          {/* Settings */}
          <button
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            title="Settings"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>

          {/* End Call */}
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors ml-8"
            title="End call"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}