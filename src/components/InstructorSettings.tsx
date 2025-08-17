import { useState } from "react";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Camera,
  Save,
  Eye,
  EyeOff,
  Lock,
  Upload,
  X,
  Plus,
  Edit,
  Clock,
  DollarSign,
  Download,
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: "instructor" | "student";
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface Instructor {
  id: string;
  business_name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  specialization?: string[];
  years_of_experience?: number;
  social_links?: any;
  total_courses?: number;
  total_students?: number;
  average_rating?: number;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

interface InstructorSettingsProps {
  instructor: Profile & {
    instructor?: Instructor | null;
  };
}

function InstructorSettings({ instructor }: InstructorSettingsProps) {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changes, setChanges] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    full_name: instructor.full_name || "",
    email: instructor.email || "",
    phone: instructor.phone || "",
    bio: instructor.bio || "",
    business_name: instructor.instructor?.business_name || "",
    website: instructor.instructor?.website || "",
    description: instructor.instructor?.description || "",
    years_of_experience: instructor.instructor?.years_of_experience || 0,
    specialization: instructor.instructor?.specialization || [],
    social_links: instructor.instructor?.social_links || {
      linkedin: "",
      twitter: "",
      github: "",
      portfolio: "",
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    course_updates: true,
    student_messages: true,
    new_enrollments: true,
    reviews_ratings: true,
    marketing_emails: false,
    weekly_reports: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: "public",
    show_contact_info: false,
    show_student_count: true,
    show_ratings: true,
    allow_student_contact: true,
    show_in_search: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    payout_method: "bank_transfer",
    currency: "USD",
    tax_id: "",
    bank_account: "****1234",
    auto_payout: true,
    payout_threshold: 100,
  });

  const settingsSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Palette },
  ];

  const handleSave = () => {
    // Simulate saving
    setChanges(false);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
    console.log("Saving settings...", profileData);
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setChanges(true);
  };

  const addSpecialization = () => {
    const newSpecialization = prompt("Enter a new specialization:");
    if (newSpecialization) {
      handleProfileChange("specialization", [
        ...profileData.specialization,
        newSpecialization,
      ]);
    }
  };

  const removeSpecialization = (index: number) => {
    const updated = profileData.specialization.filter((_, i) => i !== index);
    handleProfileChange("specialization", updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-gray-600">
            Manage your account, preferences, and business settings
          </p>
        </div>
        {changes && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-orange-600 font-medium">
              You have unsaved changes
            </span>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Settings
            </h3>
            <nav className="space-y-2">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="w-5 h-5 mr-3" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Profile Settings */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Profile Settings
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 text-purple-600 border border-purple-300 rounded-xl hover:bg-purple-50 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {instructor.full_name?.charAt(0) || "I"}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Profile Picture
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Upload a professional photo that represents you
                    </p>
                    {isEditing && (
                      <button className="flex items-center px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) =>
                        handleProfileChange("full_name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileData.years_of_experience}
                      onChange={(e) =>
                        handleProfileChange(
                          "years_of_experience",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Tell students about yourself, your expertise, and teaching philosophy..."
                  />
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm"
                      >
                        {spec}
                        {isEditing && (
                          <button
                            onClick={() => removeSpecialization(index)}
                            className="ml-2 text-purple-500 hover:text-purple-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {isEditing && (
                      <button
                        onClick={addSpecialization}
                        className="inline-flex items-center px-3 py-1 border border-purple-300 text-purple-600 rounded-lg text-sm hover:bg-purple-50"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Business Settings */}
            {activeSection === "business" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Business Settings
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={profileData.business_name}
                      onChange={(e) =>
                        handleProfileChange("business_name", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) =>
                        handleProfileChange("website", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) =>
                      handleProfileChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe your business, mission, and what makes you unique..."
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Social Media Links
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={profileData.social_links.linkedin}
                        onChange={(e) =>
                          handleProfileChange("social_links", {
                            ...profileData.social_links,
                            linkedin: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={profileData.social_links.twitter}
                        onChange={(e) =>
                          handleProfileChange("social_links", {
                            ...profileData.social_links,
                            twitter: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://twitter.com/your-handle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={profileData.social_links.github}
                        onChange={(e) =>
                          handleProfileChange("social_links", {
                            ...profileData.social_links,
                            github: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://github.com/your-username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio
                      </label>
                      <input
                        type="url"
                        value={profileData.social_links.portfolio}
                        onChange={(e) =>
                          handleProfileChange("social_links", {
                            ...profileData.social_links,
                            portfolio: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="https://your-portfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Notification Settings
                </h3>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Email Notifications
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          key: "email_notifications",
                          label: "Email Notifications",
                          desc: "Receive notifications via email",
                        },
                        {
                          key: "course_updates",
                          label: "Course Updates",
                          desc: "Get notified about course-related activities",
                        },
                        {
                          key: "student_messages",
                          label: "Student Messages",
                          desc: "New messages from students",
                        },
                        {
                          key: "new_enrollments",
                          label: "New Enrollments",
                          desc: "When students enroll in your courses",
                        },
                        {
                          key: "reviews_ratings",
                          label: "Reviews & Ratings",
                          desc: "New reviews and ratings for your courses",
                        },
                        {
                          key: "weekly_reports",
                          label: "Weekly Reports",
                          desc: "Weekly performance and analytics reports",
                        },
                      ].map((setting) => (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {setting.label}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {setting.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                !!notificationSettings[
                                  setting.key as keyof typeof notificationSettings
                                ]
                              }
                              onChange={(e) =>
                                setNotificationSettings((prev) => ({
                                  ...prev,
                                  [setting.key]: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Push Notifications
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Push Notifications
                          </h5>
                          <p className="text-sm text-gray-600">
                            Receive push notifications on your devices
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.push_notifications}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                push_notifications: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Marketing Emails
                          </h5>
                          <p className="text-sm text-gray-600">
                            Receive promotional emails and updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings.marketing_emails}
                            onChange={(e) =>
                              setNotificationSettings((prev) => ({
                                ...prev,
                                marketing_emails: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === "privacy" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Privacy Settings
                </h3>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Profile Visibility
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={privacySettings.profile_visibility}
                          onChange={(e) =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              profile_visibility: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="public">
                            Public - Visible to everyone
                          </option>
                          <option value="students">
                            Students Only - Visible to enrolled students
                          </option>
                          <option value="private">
                            Private - Only visible to you
                          </option>
                        </select>
                      </div>

                      {[
                        {
                          key: "show_contact_info",
                          label: "Show Contact Information",
                          desc: "Display email and phone on profile",
                        },
                        {
                          key: "show_student_count",
                          label: "Show Student Count",
                          desc: "Display number of students taught",
                        },
                        {
                          key: "show_ratings",
                          label: "Show Ratings",
                          desc: "Display course ratings and reviews",
                        },
                        {
                          key: "allow_student_contact",
                          label: "Allow Student Contact",
                          desc: "Let students contact you directly",
                        },
                        {
                          key: "show_in_search",
                          label: "Show in Search Results",
                          desc: "Appear in instructor search results",
                        },
                      ].map((setting) => (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {setting.label}
                            </h5>
                            <p className="text-sm text-gray-600">
                              {setting.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                !!privacySettings[
                                  setting.key as keyof typeof privacySettings
                                ]
                              }
                              onChange={(e) =>
                                setPrivacySettings((prev) => ({
                                  ...prev,
                                  [setting.key]: e.target.checked,
                                }))
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeSection === "payments" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Payment Settings
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Payout Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payout Method
                        </label>
                        <select
                          value={paymentSettings.payout_method}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({
                              ...prev,
                              payout_method: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="paypal">PayPal</option>
                          <option value="stripe">Stripe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={paymentSettings.currency}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({
                              ...prev,
                              currency: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Payout Amount
                        </label>
                        <input
                          type="number"
                          value={paymentSettings.payout_threshold}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({
                              ...prev,
                              payout_threshold: parseInt(e.target.value),
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Tax Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax ID / SSN
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.tax_id}
                          onChange={(e) =>
                            setPaymentSettings((prev) => ({
                              ...prev,
                              tax_id: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter your tax identification number"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Auto Payout
                          </h5>
                          <p className="text-sm text-gray-600">
                            Automatically transfer earnings
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={paymentSettings.auto_payout}
                            onChange={(e) =>
                              setPaymentSettings((prev) => ({
                                ...prev,
                                auto_payout: e.target.checked,
                              }))
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Recent Payouts
                    </h4>
                    <button className="flex items-center px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        date: "Aug 15, 2025",
                        amount: "$2,450.00",
                        status: "Completed",
                        method: "Bank Transfer",
                      },
                      {
                        date: "Aug 1, 2025",
                        amount: "$1,890.00",
                        status: "Completed",
                        method: "Bank Transfer",
                      },
                      {
                        date: "Jul 15, 2025",
                        amount: "$2,100.00",
                        status: "Completed",
                        method: "Bank Transfer",
                      },
                    ].map((payout, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {payout.amount}
                            </p>
                            <p className="text-sm text-gray-600">
                              {payout.date} • {payout.method}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {payout.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Security Settings
                </h3>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Password & Authentication
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-12"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Two-Factor Authentication
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">
                          Enable 2FA
                        </h5>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Active Sessions
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          device: "Chrome on Windows",
                          location: "New York, US",
                          current: true,
                          lastActive: "Now",
                        },
                        {
                          device: "Safari on iPhone",
                          location: "New York, US",
                          current: false,
                          lastActive: "2 hours ago",
                        },
                        {
                          device: "Chrome on Mac",
                          location: "San Francisco, US",
                          current: false,
                          lastActive: "1 day ago",
                        },
                      ].map((session, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {session.device}
                              {session.current && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {session.location} • {session.lastActive}
                            </p>
                          </div>
                          {!session.current && (
                            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeSection === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Preferences
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      <Palette className="w-5 h-5 inline mr-2" />
                      Display Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                          <option value="UTC-5">EST (UTC-5)</option>
                          <option value="UTC-8">PST (UTC-8)</option>
                          <option value="UTC+0">GMT (UTC+0)</option>
                          <option value="UTC+1">CET (UTC+1)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      <Clock className="w-5 h-5 inline mr-2" />
                      Course Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Course Price
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="99.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course Duration (hours)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="10"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Auto-publish courses
                          </h5>
                          <p className="text-sm text-gray-600">
                            Automatically publish completed courses
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorSettings;
