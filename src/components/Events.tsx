import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Video, ExternalLink, Plus, ChevronLeft, ChevronRight, Link } from 'lucide-react';

export default function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddCall, setShowAddCall] = useState(false);
  const [newCall, setNewCall] = useState({
    title: '',
    date: '',
    time: '',
    duration: '60',
    url: '',
    description: '',
    maxAttendees: '100'
  });

  // Mock scheduled calls data
  const scheduledCalls = [
    {
      id: 1,
      title: 'Web Development Q&A Session',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      url: 'https://zoom.us/j/123456789',
      attendees: 156,
      maxAttendees: 200,
      host: 'Dr. Angela Yu',
      description: 'Weekly Q&A session for web development topics'
    },
    {
      id: 2,
      title: 'React Best Practices Workshop',
      date: '2024-01-18',
      time: '11:00',
      duration: 120,
      url: 'https://meet.google.com/abc-defg-hij',
      attendees: 89,
      maxAttendees: 100,
      host: 'Sarah Johnson',
      description: 'Deep dive into React best practices and patterns'
    },
    {
      id: 3,
      title: 'Community Networking Call',
      date: '2024-01-22',
      time: '18:00',
      duration: 90,
      url: 'https://teams.microsoft.com/l/meetup-join/xyz',
      attendees: 234,
      maxAttendees: 300,
      host: 'Mike Chen',
      description: 'Monthly community networking and collaboration session'
    }
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  
  const getCallsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledCalls.filter(call => call.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatTime = (time: string) => {
    return time;
  };

  const handleAddCall = () => {
    // Add call handling logic here
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Calls Calendar</h1>
          <p className="text-gray-600 mt-2">Schedule and manage your live sessions</p>
        </div>
        <button 
          onClick={() => setShowAddCall(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Call
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === today.toDateString();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                const callsForDay = getCallsForDate(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 min-h-[80px] text-left border border-gray-100 hover:bg-gray-50 transition-colors relative ${
                      !isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''
                    } ${isToday ? 'bg-purple-50 border-purple-200' : ''} ${
                      isSelected ? 'bg-purple-100 border-purple-300' : ''
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-purple-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.getDate()}
                    </span>
                    
                    {callsForDay.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {callsForDay.slice(0, 2).map((call) => (
                          <div
                            key={call.id}
                            className="text-xs bg-purple-600 text-white px-1 py-0.5 rounded truncate"
                          >
                            {formatTime(call.time)} {call.title}
                          </div>
                        ))}
                        {callsForDay.length > 2 && (
                          <div className="text-xs text-purple-600 font-medium">
                            +{callsForDay.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {getCallsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getCallsForDate(selectedDate).map((call) => (
                    <div key={call.id} className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">{call.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(call.time)} ({call.duration}min)
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {call.attendees}/{call.maxAttendees}
                        </div>
                        <div className="flex items-center">
                          <Link className="w-3 h-3 mr-1" />
                          <a 
                            href={call.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:underline truncate"
                          >
                            Join Call
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No calls scheduled for this date</p>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Calls</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Attendees</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Hours Hosted</span>
                <span className="font-medium">18.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Call Modal */}
      {showAddCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Schedule New Call</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call Title
                  </label>
                  <input
                    type="text"
                    value={newCall.title}
                    onChange={(e) => setNewCall({...newCall, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter call title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newCall.date}
                      onChange={(e) => setNewCall({...newCall, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newCall.time}
                      onChange={(e) => setNewCall({...newCall, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <select
                      value={newCall.duration}
                      onChange={(e) => setNewCall({...newCall, duration: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="30">30 min</option>
                      <option value="60">60 min</option>
                      <option value="90">90 min</option>
                      <option value="120">120 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Attendees
                    </label>
                    <input
                      type="number"
                      value={newCall.maxAttendees}
                      onChange={(e) => setNewCall({...newCall, maxAttendees: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting URL/Link
                  </label>
                  <input
                    type="url"
                    value={newCall.url}
                    onChange={(e) => setNewCall({...newCall, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/123456789 or any meeting link"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste your Zoom, Google Meet, Teams, or any other meeting link
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCall.description}
                    onChange={(e) => setNewCall({...newCall, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the call"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCall(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCall}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}