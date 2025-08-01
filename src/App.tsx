import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ScreenRecorder from './components/ScreenRecorder';

export default function App() {
  const [showRecorder, setShowRecorder] = useState(false);

  if (showRecorder) {
    return <ScreenRecorder onBack={() => setShowRecorder(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Screen Recorder App
        </h1>
        <p className="text-gray-600 mb-6">
          Record your screen, webcam, or both with professional quality
        </p>
        <button
          onClick={() => setShowRecorder(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Open Screen Recorder
        </button>
      </div>
    </div>
  );
}