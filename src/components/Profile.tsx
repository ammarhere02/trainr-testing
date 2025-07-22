import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Target,
  Camera,
  Edit3,
  Save,
  X,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  ChevronDown,
  ChevronUp,
  LogOut,
  Clock
} from 'lucide-react';

export default function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(true);
  
  const [profileData, setProfileData] = useState({
    firstName: 'R',
    lastName: 'Malik',
    bio: 'Business & A.I',
    location: 'UK',
    url: 'trainr.com/@mrmalik',
    email: 'mrrayanmalik@hotmail.com',
    timezone: '(GMT +01:00) Europe/London',
    socialLinks: {
      instagram: 'https://www.instagram.com/realrayanmalik',
      twitter: '',
      youtube: 'https://www.youtube.com/@realrayanmalik',
      linkedin: '',
      facebook: ''
    }
  });

  const [tempProfileData, setTempProfileData] = useState(profileData);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const achievements = [
    { name: 'Course Completer', description: 'Finished 5 courses', icon: BookOpen, earned: true },
    { name: 'Community Helper', description: 'Helped 50+ members', icon: Users, earned: true },
    { name: 'Discussion Starter', description: 'Started 10 discussions', icon: TrendingUp, earned: true },
    { name: 'Call Attendee', description: 'Attended 25 live calls', icon: Calendar, earned: false },
    { name: 'Master Learner', description: 'Earned 1000+ XP', icon: Award, earned: false },
    { name: 'Top Contributor', description: 'Monthly top contributor', icon: Star, earned: false }
  ];

  const stats = [
    { label: 'Current Level', value: '12', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Total XP', value: '2,847', icon: Star, color: 'text-purple-600' },
    { label: 'Courses Completed', value: '8', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Community Points', value: '1,234', icon: Users, color: 'text-green-600' }
  ];

  const recentActivity = [
    { type: 'course', action: 'Completed lesson', title: 'React Hooks Deep Dive', time: '2 hours ago' },
    { type: 'discussion', action: 'Replied to', title: 'Best practices for state management', time: '4 hours ago' },
    { type: 'achievement', action: 'Earned badge', title: 'Discussion Starter', time: '1 day ago' },
    { type: 'call', action: 'Attended', title: 'JavaScript Q&A Session', time: '2 days ago' }
  ];

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditingProfile(false);
  };

  const handleChangeEmail = () => {
    // In real app, this would trigger email verification
    console.log('Change email requested');
    setIsEditingEmail(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // In real app, this would update the password
    console.log('Password change requested');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditingPassword(false);
  };

  const handleLogoutEverywhere = () => {
    if (confirm('Are you sure you want to log out of all devices?')) {
      // In real app, this would invalidate all sessions
      console.log('Logout everywhere requested');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Profile"
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-gray-600 mb-4">{profileData.bio}</p>
              
              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Level 12</span>
                  <span className="text-sm text-gray-600">2,847 / 3,000 XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">153 XP to next level</p>
              </div>

              <button 
                onClick={() => {
                  setTempProfileData(profileData);
                  setIsEditingProfile(true);
                }}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <stat.icon className={`w-5 h-5 mr-3 ${stat.color}`} />
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
            
            {isEditingProfile ? (
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Change profile photo
                  </button>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={tempProfileData.firstName}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">You can only change your name once.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={tempProfileData.lastName}
                      onChange={(e) => setTempProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="text"
                    value={tempProfileData.url}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can change your URL once you've got 90 contributions, 30 followers, and been using it for 90 days.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={tempProfileData.bio}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    maxLength={150}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end text-xs text-gray-500 mt-1">
                    {tempProfileData.bio.length} / 150
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={tempProfileData.location}
                    onChange={(e) => setTempProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Change my map location
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">
                      Remove my map location
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <button
                    onClick={() => setShowSocialLinks(!showSocialLinks)}
                    className="flex items-center text-lg font-semibold text-gray-900 mb-4"
                  >
                    Social links
                    {showSocialLinks ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                  </button>
                  
                  {showSocialLinks && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                        <input
                          type="url"
                          value={tempProfileData.socialLinks.instagram}
                          onChange={(e) => setTempProfileData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://www.instagram.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">X</label>
                        <input
                          type="url"
                          value={tempProfileData.socialLinks.twitter}
                          onChange={(e) => setTempProfileData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://x.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                        <input
                          type="url"
                          value={tempProfileData.socialLinks.youtube}
                          onChange={(e) => setTempProfileData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://www.youtube.com/@username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={tempProfileData.socialLinks.linkedin}
                          onChange={(e) => setTempProfileData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://www.linkedin.com/in/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                        <input
                          type="url"
                          value={tempProfileData.socialLinks.facebook}
                          onChange={(e) => setTempProfileData(prev => ({
                            ...prev,
                            socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="https://www.facebook.com/username"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Display Mode */}
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80"
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
                    <p className="text-gray-600">{profileData.bio}</p>
                    <p className="text-gray-500 text-sm">{profileData.location}</p>
                  </div>
                  <button
                    onClick={() => {
                      setTempProfileData(profileData);
                      setIsEditingProfile(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>

                {/* Social Links Display */}
                {(profileData.socialLinks.instagram || 
                  profileData.socialLinks.youtube || profileData.socialLinks.linkedin) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
                    <div className="flex flex-wrap gap-3">
                      {profileData.socialLinks.instagram && (
                        <a href={profileData.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                           className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                          <Instagram className="w-4 h-4" />
                          <span className="text-sm">Instagram</span>
                        </a>
                      )}
                      {profileData.socialLinks.youtube && (
                        <a href={profileData.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                           className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                          <Youtube className="w-4 h-4" />
                          <span className="text-sm">YouTube</span>
                        </a>
                      )}
                      {profileData.socialLinks.linkedin && (
                        <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                           className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
                <button
                  onClick={() => setIsEditingEmail(true)}
                  className="text-gray-500 hover:text-purple-600 font-medium transition-colors"
                >
                  CHANGE EMAIL
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                  <p className="text-gray-600">Change your password</p>
                </div>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-gray-500 hover:text-purple-600 font-medium transition-colors"
                >
                  CHANGE PASSWORD
                </button>
              </div>

              {/* Timezone */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Timezone</h3>
                <select 
                  value={profileData.timezone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="(GMT +01:00) Europe/London">(GMT +01:00) Europe/London</option>
                  <option value="(GMT +00:00) UTC">(GMT +00:00) UTC</option>
                  <option value="(GMT -05:00) Eastern Time">(GMT -05:00) Eastern Time</option>
                  <option value="(GMT -08:00) Pacific Time">(GMT -08:00) Pacific Time</option>
                </select>
              </div>

              {/* Log out of all devices */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Log out of all devices</h3>
                  <p className="text-gray-600">Log out of all active sessions on all devices.</p>
                </div>
                <button
                  onClick={handleLogoutEverywhere}
                  className="text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  LOG OUT EVERYWHERE
                </button>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? 'border-purple-200 bg-purple-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-purple-600' : 'bg-gray-400'
                    }`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                    </div>
                  </div>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Email Change Modal */}
      {isEditingEmail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter new email"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingEmail(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeEmail}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isEditingPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditingPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}