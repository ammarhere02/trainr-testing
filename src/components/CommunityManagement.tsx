import { useState } from "react";
import {
  Users,
  MessageCircle,
  Plus,
  ArrowLeft,
  Edit3,
  Trash2,
  Send,
  Clock,
  Eye,
  Star,
  BookOpen,
} from "lucide-react";

interface CommunityManagementProps {
  instructor: any;
}

export default function CommunityManagement({
  instructor,
}: CommunityManagementProps) {
  const [currentView, setCurrentView] = useState<"list" | "messages">("list");
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<any>(null);

  // Mock data - replace with real data later
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Web Development Fundamentals",
      description: "Community for students learning web development basics",
      course: "Web Development Course",
      memberCount: 45,
      messageCount: 127,
      lastActivity: "2 hours ago",
      isActive: true,
      createdAt: "2024-08-15",
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      description:
        "Discussions about advanced JavaScript concepts and best practices",
      course: "JavaScript Mastery",
      memberCount: 32,
      messageCount: 89,
      lastActivity: "5 hours ago",
      isActive: true,
      createdAt: "2024-08-10",
    },
    {
      id: 3,
      name: "React Development",
      description:
        "Community for React developers to share knowledge and troubleshoot",
      course: "React Complete Guide",
      memberCount: 58,
      messageCount: 203,
      lastActivity: "1 day ago",
      isActive: false,
      createdAt: "2024-08-05",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      communityId: 1,
      title: "Welcome to Web Development Community!",
      content:
        "Hello everyone! Welcome to our web development community. Here you'll find resources, discussions, and support for your learning journey.",
      author: "Instructor",
      createdAt: "2024-08-15T10:30:00Z",
      isPinned: true,
    },
    {
      id: 2,
      communityId: 1,
      title: "Week 1 Assignment Guidelines",
      content:
        "Please review the assignment requirements for this week. Make sure to submit your projects by Friday midnight. If you have any questions, feel free to ask!",
      author: "Instructor",
      createdAt: "2024-08-16T14:20:00Z",
      isPinned: false,
    },
    {
      id: 3,
      communityId: 1,
      title: "Additional Resources for HTML & CSS",
      content:
        "I've compiled some additional resources that might help you with HTML and CSS fundamentals. Check out MDN Web Docs and W3Schools for comprehensive guides.",
      author: "Instructor",
      createdAt: "2024-08-17T09:15:00Z",
      isPinned: false,
    },
  ]);
  console.log(instructor);

  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
    course: "",
  });

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    isPinned: false,
  });

  const handleCreateCommunity = () => {
    if (newCommunity.name && newCommunity.description && newCommunity.course) {
      const community = {
        id: communities.length + 1,
        ...newCommunity,
        memberCount: 0,
        messageCount: 0,
        lastActivity: "Just created",
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCommunities([...communities, community]);
      setNewCommunity({ name: "", description: "", course: "" });
      setShowCreateCommunity(false);
    }
  };

  const handleUpdateCommunity = () => {
    if (editingCommunity) {
      setCommunities(
        communities.map((c) =>
          c.id === editingCommunity.id ? editingCommunity : c
        )
      );
      setEditingCommunity(null);
    }
  };

  const handleDeleteCommunity = (id: number) => {
    setCommunities(communities.filter((c) => c.id !== id));
  };

  const handleCreateMessage = () => {
    if (newMessage.title && newMessage.content && selectedCommunity) {
      const message = {
        id: messages.length + 1,
        communityId: selectedCommunity.id,
        ...newMessage,
        author: "Instructor",
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, message]);
      setNewMessage({ title: "", content: "", isPinned: false });
      setShowCreateMessage(false);
    }
  };

  const handleUpdateMessage = () => {
    if (editingMessage) {
      setMessages(
        messages.map((m) => (m.id === editingMessage.id ? editingMessage : m))
      );
      setEditingMessage(null);
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const communityMessages = messages.filter(
    (m) => m.communityId === selectedCommunity?.id
  );

  if (currentView === "messages" && selectedCommunity) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView("list")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCommunity.name}
              </h1>
              <p className="text-gray-600">{selectedCommunity.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateMessage(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Message</span>
          </button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCommunity.memberCount}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {communityMessages.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Last Activity</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedCommunity.lastActivity}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Community Messages
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {communityMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No messages yet. Create your first message!
                </p>
              </div>
            ) : (
              communityMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-xl border ${
                    message.isPinned
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  } hover:shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {message.title}
                        </h3>
                        {message.isPinned && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{message.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {message.author}</span>
                        <span>•</span>
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingMessage(message)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Message Modal */}
        {showCreateMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create New Message
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Title
                  </label>
                  <input
                    type="text"
                    value={newMessage.title}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter message title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) =>
                      setNewMessage({ ...newMessage, content: e.target.value })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write your message content..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={newMessage.isPinned}
                    onChange={(e) =>
                      setNewMessage({
                        ...newMessage,
                        isPinned: e.target.checked,
                      })
                    }
                    className="mr-3 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="pinned"
                    className="text-sm font-medium text-gray-700"
                  >
                    Pin this message
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setShowCreateMessage(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMessage}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Create Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Message Modal */}
        {editingMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Message
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Title
                  </label>
                  <input
                    type="text"
                    value={editingMessage.title}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={editingMessage.content}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        content: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editPinned"
                    checked={editingMessage.isPinned}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        isPinned: e.target.checked,
                      })
                    }
                    className="mr-3 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label
                    htmlFor="editPinned"
                    className="text-sm font-medium text-gray-700"
                  >
                    Pin this message
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setEditingMessage(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMessage}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Update Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Community Management
          </h1>
          <p className="text-gray-600">
            Manage your course communities and engage with students
          </p>
        </div>
        <button
          onClick={() => setShowCreateCommunity(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Communities</p>
              <p className="text-2xl font-bold text-gray-900">
                {communities.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {communities.reduce((acc, c) => acc + c.memberCount, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Communities</p>
              <p className="text-2xl font-bold text-gray-900">
                {communities.filter((c) => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Communities List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Communities
          </h2>
        </div>
        <div className="p-6">
          {communities.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Communities Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first community to start engaging with students
              </p>
              <button
                onClick={() => setShowCreateCommunity(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Create Community
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {community.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            community.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {community.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {community.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{community.course}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{community.memberCount} members</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{community.messageCount} messages</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{community.lastActivity}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCommunity(community);
                          setCurrentView("messages");
                        }}
                        className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors"
                        title="View Messages"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setEditingCommunity(community)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                        title="Edit Community"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCommunity(community.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        title="Delete Community"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Community
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunity.name}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Web Development Fundamentals"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCommunity.description}
                  onChange={(e) =>
                    setNewCommunity({
                      ...newCommunity,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Describe what this community is about..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Course
                </label>
                <select
                  value={newCommunity.course}
                  onChange={(e) =>
                    setNewCommunity({ ...newCommunity, course: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  <option value="Web Development Course">
                    Web Development Course
                  </option>
                  <option value="JavaScript Mastery">JavaScript Mastery</option>
                  <option value="React Complete Guide">
                    React Complete Guide
                  </option>
                  <option value="Node.js Fundamentals">
                    Node.js Fundamentals
                  </option>
                  <option value="Python for Beginners">
                    Python for Beginners
                  </option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowCreateCommunity(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCommunity}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Create Community
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {editingCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Community
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Name
                </label>
                <input
                  type="text"
                  value={editingCommunity.name}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingCommunity.description}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Course
                </label>
                <select
                  value={editingCommunity.course}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      course: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  <option value="Web Development Course">
                    Web Development Course
                  </option>
                  <option value="JavaScript Mastery">JavaScript Mastery</option>
                  <option value="React Complete Guide">
                    React Complete Guide
                  </option>
                  <option value="Node.js Fundamentals">
                    Node.js Fundamentals
                  </option>
                  <option value="Python for Beginners">
                    Python for Beginners
                  </option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingCommunity.isActive}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      isActive: e.target.checked,
                    })
                  }
                  className="mr-3 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Community is active
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setEditingCommunity(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCommunity}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Update Community
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
