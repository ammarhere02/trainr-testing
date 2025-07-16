import React, { useState } from 'react';
import { Copy, ExternalLink, Share2, QrCode, CheckCircle, Globe, Users, BookOpen, Video, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

interface EducatorWelcomeProps {
  educatorData: any;
  onContinue: () => void;
}

export default function EducatorWelcome({ educatorData, onContinue }: EducatorWelcomeProps) {
  const [copied, setCopied] = useState(false);

  const copySubdomain = () => {
    navigator.clipboard.writeText(`https://${educatorData.fullSubdomain}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareSubdomain = (platform: string) => {
    const url = `https://${educatorData.fullSubdomain}`;
    const text = `Join my online learning community at ${educatorData.businessName}!`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(`Join ${educatorData.businessName}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Trainr!</h1>
            <p className="text-purple-100">Your teaching account has been created successfully</p>
          </div>

          <div className="p-8">
            {/* Account Details */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hello, {educatorData.firstName}! 👋
              </h2>
              <p className="text-gray-600">
                Your <strong>{educatorData.businessName}</strong> is now live and ready for students
              </p>
            </div>

            {/* Subdomain Showcase */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Student Portal</h3>
                    <p className="text-gray-600 text-sm">Students will sign up here</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copySubdomain}
                    className={`p-2 rounded-lg transition-colors ${
                      copied ? 'bg-green-100 text-green-600' : 'bg-white text-gray-600 hover:text-purple-600'
                    }`}
                    title="Copy link"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`https://${educatorData.fullSubdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white text-gray-600 hover:text-purple-600 rounded-lg transition-colors"
                    title="Visit site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {educatorData.fullSubdomain}
                  </div>
                  <p className="text-gray-600 text-sm">Your personalized student signup portal</p>
                </div>
              </div>

              {copied && (
                <div className="mt-3 text-center">
                  <span className="text-green-600 text-sm font-medium">✓ Link copied to clipboard!</span>
                </div>
              )}
            </div>

            {/* Share Options */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">Share Your Student Portal</h3>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => shareSubdomain('twitter')}
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Share on Twitter"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareSubdomain('facebook')}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share on Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareSubdomain('linkedin')}
                  className="bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 transition-colors"
                  title="Share on LinkedIn"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => shareSubdomain('email')}
                  className="bg-gray-600 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Share via Email"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                What's Next?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create Your First Course</h4>
                    <p className="text-gray-600 text-sm">Upload videos and build your curriculum</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Set Up Community</h4>
                    <p className="text-gray-600 text-sm">Create discussion spaces for students</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Schedule Live Calls</h4>
                    <p className="text-gray-600 text-sm">Plan Q&A sessions and workshops</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Invite Students</h4>
                    <p className="text-gray-600 text-sm">Share your portal link to grow your community</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Need help getting started?{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Check out our setup guide
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}</parameter>