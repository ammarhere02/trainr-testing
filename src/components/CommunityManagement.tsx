import { useState, useEffect } from "react";
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
import {
  communityApi,
  CommunityWithCourse,
  MessageWithAuthor,
} from "../lib/api/community";
import { useAuth } from "../hooks/useAuth";

interface CommunityManagementProps {
  instructor: any;
}

export default function CommunityManagement({
  instructor: _instructor,
}: CommunityManagementProps) {
  const { userData } = useAuth();
  const [currentView, setCurrentView] = useState<"list" | "messages">("list");
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunityWithCourse | null>(null);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [editingCommunity, setEditingCommunity] =
    useState<CommunityWithCourse | null>(null);
  const [editingMessage, setEditingMessage] =
    useState<MessageWithAuthor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for real data
  const [communities, setCommunities] = useState<CommunityWithCourse[]>([]);
  const [messages, setMessages] = useState<MessageWithAuthor[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (userData?.profile?.id) {
      loadCommunities();
      loadCourses();
    }
  }, [userData?.profile?.id]);

  useEffect(() => {
    if (selectedCommunity) {
      loadMessages(selectedCommunity.id);
    }
  }, [selectedCommunity]);

  const loadCommunities = async () => {
    if (!userData?.profile?.id) {
      setError("User not authenticated");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await communityApi.getInstructorCommunities(
        userData.profile.id
      );
      setCommunities(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load communities"
      );
      console.error("Error loading communities:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (communityId: string) => {
    try {
      setLoading(true);
      const data = await communityApi.getCommunityMessages(communityId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    if (!userData?.profile?.id) {
      console.error("User not authenticated");
      return;
    }
    try {
      const data = await communityApi.getInstructorCourses(userData.profile.id);
      setCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

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

  const handleCreateCommunity = async () => {
    if (
      newCommunity.name &&
      newCommunity.description &&
      newCommunity.course &&
      userData?.profile?.id
    ) {
      try {
        setLoading(true);
        setError(null);

        // Find the course name from the courses list
        const selectedCourse = courses.find(
          (c) => c.id === newCommunity.course
        );

        const community = await communityApi.createCommunity({
          name: newCommunity.name,
          description: newCommunity.description,
          instructor_id: userData.profile.id, // Use actual user ID from auth context
          course_id: newCommunity.course,
          course_name: selectedCourse?.title, // Include course name
        });

        // Reset form and close modal
        setNewCommunity({ name: "", description: "", course: "" });
        setShowCreateCommunity(false);

        // Reload communities to get fresh data from database
        await loadCommunities();

        console.log("Community created successfully:", community);
      } catch (error) {
        console.error("Error creating community:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create community"
        );
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Missing required fields or user not authenticated");
      setError("Please fill in all required fields");
    }
  };

  const handleUpdateCommunity = async () => {
    if (editingCommunity) {
      try {
        setLoading(true);
        setError(null);

        // Find the course name from the courses list
        const selectedCourse = courses.find(
          (c) => c.id === editingCommunity.course_id
        );

        await communityApi.updateCommunity(editingCommunity.id, {
          name: editingCommunity.name,
          description: editingCommunity.description ?? undefined,
          course_id: editingCommunity.course_id ?? undefined,
          course_name: selectedCourse?.title, // Include course name
          is_active: editingCommunity.is_active,
        });

        // Reset editing state
        setEditingCommunity(null);

        // Reload communities to get fresh data from database
        await loadCommunities();

        console.log("Community updated successfully");
      } catch (error) {
        console.error("Error updating community:", error);
        setError(
          error instanceof Error ? error.message : "Failed to update community"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCommunity = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await communityApi.deleteCommunity(id);

      // If the deleted community was selected, go back to list view
      if (selectedCommunity?.id === id) {
        setSelectedCommunity(null);
        setCurrentView("list");
      }

      // Reload communities to get fresh data from database
      await loadCommunities();

      console.log("Community deleted successfully");
    } catch (error) {
      console.error("Error deleting community:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete community"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (
      newMessage.title &&
      newMessage.content &&
      selectedCommunity &&
      userData?.profile?.id
    ) {
      try {
        setLoading(true);
        setError(null);

        const message = await communityApi.createMessage({
          community_id: selectedCommunity.id,
          title: newMessage.title,
          content: newMessage.content,
          author_id: userData.profile.id, // Use actual user ID from auth context
          is_pinned: newMessage.isPinned,
        });

        // Reset form and close modal
        setNewMessage({ title: "", content: "", isPinned: false });
        setShowCreateMessage(false);

        // Reload messages to get fresh data from database
        await loadMessages(selectedCommunity.id);

        console.log("Message created successfully:", message);
      } catch (error) {
        console.error("Error creating message:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create message"
        );
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Missing required fields or user not authenticated");
      setError("Please fill in all required fields");
    }
  };

  const handleUpdateMessage = async () => {
    if (editingMessage) {
      try {
        setLoading(true);
        setError(null);

        await communityApi.updateMessage(editingMessage.id, {
          title: editingMessage.title || "Message",
          content: editingMessage.content,
          is_pinned: editingMessage.message_type === "announcement",
        });

        // Reset editing state
        setEditingMessage(null);

        // Reload messages to get fresh data from database
        if (selectedCommunity) {
          await loadMessages(selectedCommunity.id);
        }

        console.log("Message updated successfully");
      } catch (error) {
        console.error("Error updating message:", error);
        setError(
          error instanceof Error ? error.message : "Failed to update message"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await communityApi.deleteMessage(id);

      // Reload messages to get fresh data from database
      if (selectedCommunity) {
        await loadMessages(selectedCommunity.id);
      }

      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete message"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePin = async (messageId: string, currentPinned: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const messageToUpdate = messages.find((m) => m.id === messageId);
      if (messageToUpdate) {
        await communityApi.updateMessage(messageId, {
          title: messageToUpdate.title || "",
          content: messageToUpdate.content,
          is_pinned: !currentPinned,
        });
      }

      // Reload messages to get fresh data from database
      if (selectedCommunity) {
        await loadMessages(selectedCommunity.id);
      }

      console.log("Message pin status updated successfully");
    } catch (error) {
      console.error("Error updating pin status:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update pin status"
      );
    } finally {
      setLoading(false);
    }
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
    (m) => m.community_id === selectedCommunity?.id
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading communities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

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
                  {selectedCommunity.member_count}
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
                  {selectedCommunity.created_at &&
                    formatDate(selectedCommunity.created_at)}
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
                    message.message_type === "announcement"
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200 bg-gray-50"
                  } hover:shadow-sm transition-all duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {message.message_type === "announcement"
                            ? "📢 Announcement"
                            : "💬 Discussion"}
                        </h3>
                        {message.message_type === "announcement" && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{message.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          By {message.author?.first_name}{" "}
                          {message.author?.last_name}
                        </span>
                        <span>•</span>
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() =>
                          handleTogglePin(
                            message.id,
                            message.is_pinned || false
                          )
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          message.is_pinned
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            : "hover:bg-gray-100 text-gray-600"
                        }`}
                        title={
                          message.is_pinned ? "Unpin message" : "Pin message"
                        }
                      >
                        <span className="w-4 h-4 flex items-center justify-center">
                          📌
                        </span>
                      </button>
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
                    Message Type
                  </label>
                  <select
                    value={editingMessage.message_type}
                    onChange={(e) =>
                      setEditingMessage({
                        ...editingMessage,
                        message_type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="discussion">Discussion</option>
                    <option value="announcement">Announcement (Pinned)</option>
                  </select>
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
                {communities.reduce((acc, c) => acc + (c.member_count || 0), 0)}
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
                {communities.filter((c) => c.is_active).length}
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
              {communities.map((community, idx) => (
                <div
                  key={community.id + idx}
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
                            community.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {community.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {community.description}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{community.courses?.title || "No Course"}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{community.member_count || 0} members</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{community.message_count || 0} messages</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {community.created_at &&
                              formatDate(community.created_at)}
                          </span>
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
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
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
                  value={editingCommunity.description || ""}
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
                  value={editingCommunity.course_id || ""}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      course_id: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingCommunity.is_active || false}
                  onChange={(e) =>
                    setEditingCommunity({
                      ...editingCommunity,
                      is_active: e.target.checked,
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
