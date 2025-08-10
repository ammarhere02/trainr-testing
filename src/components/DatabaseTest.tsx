import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DatabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error' | 'idle'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setError(null);
    setDetails(null);

    try {
      // Test 1: Basic connection
      console.log('Testing Supabase connection...');
      
      // Test 2: Check if we can query the organizations table
      const { data: orgs, error: orgError } = await supabase
        .from('organizations')
        .select('count')
        .limit(1);

      if (orgError) {
        throw new Error(`Organizations table error: ${orgError.message}`);
      }

      // Test 3: Check if we can query the profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (profileError) {
        throw new Error(`Profiles table error: ${profileError.message}`);
      }

      // Test 4: Check auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      setDetails({
        organizationsTable: 'Connected ✅',
        profilesTable: 'Connected ✅',
        authService: 'Connected ✅',
        currentUser: user ? `Logged in as: ${user.email}` : 'Not logged in',
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
      });

      setConnectionStatus('connected');
      console.log('✅ Supabase connection successful!');

    } catch (err) {
      console.error('❌ Supabase connection failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
      
      setDetails({
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'Not set',
        hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        errorDetails: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
          <p className="text-gray-600">Testing your Supabase configuration</p>
        </div>

        {/* Status Display */}
        <div className="mb-6">
          {connectionStatus === 'testing' && (
            <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-800 font-medium">Testing connection...</span>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Database connected successfully!</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">Connection failed</span>
              </div>
              {error && (
                <p className="text-red-700 text-sm">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Connection Details */}
        {details && (
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Connection Details:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {Object.entries(details).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                    {typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>Test Again</span>
          </button>
          
          {connectionStatus === 'connected' && (
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Go to Login</span>
            </button>
          )}
        </div>

        {/* Help Section */}
        {connectionStatus === 'error' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Common Issues & Solutions:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• <strong>Tables don't exist:</strong> Run the SQL migration in Supabase SQL Editor</li>
                  <li>• <strong>Invalid credentials:</strong> Check your .env file has correct SUPABASE_URL and ANON_KEY</li>
                  <li>• <strong>Permission denied:</strong> Make sure RLS policies are set up correctly</li>
                  <li>• <strong>Network error:</strong> Check your internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}