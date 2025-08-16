import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Database, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DatabaseTest() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTestResult = (test: string, success: boolean, message: string, details?: any) => {
    setTests(prev => [...prev, { test, success, message, details, timestamp: new Date() }]);
  };

  const clearTests = () => {
    setTests([]);
    setError(null);
  };

  const testBasicConnection = async () => {
    setLoading(true);
    clearTests();

    try {
      // Test 1: Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      addTestResult(
        'Environment Variables',
        !!(supabaseUrl && supabaseKey),
        supabaseUrl && supabaseKey ? 
          `URL: ${supabaseUrl.substring(0, 30)}...` : 
          'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY',
        { url: supabaseUrl, hasKey: !!supabaseKey }
      );

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing environment variables');
      }

      // Test 2: Basic connection test
      try {
        const { data, error } = await supabase.from('instructors').select('count').limit(1);
        addTestResult(
          'Database Connection',
          !error,
          error ? error.message : 'Connection successful',
          { data, error }
        );
      } catch (connError: any) {
        addTestResult(
          'Database Connection',
          false,
          `Connection failed: ${connError.message}`,
          connError
        );
      }

      // Test 3: Test auth connection
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        addTestResult(
          'Auth Session Check',
          !sessionError,
          sessionError ? sessionError.message : session ? 'Active session found' : 'No active session',
          { session, error: sessionError }
        );
      } catch (authError: any) {
        addTestResult(
          'Auth Session Check',
          false,
          `Auth check failed: ${authError.message}`,
          authError
        );
      }

      // Test 4: Test signup endpoint (without actually creating user)
      try {
        // This should fail with "Signup requires a valid password" which means the endpoint is reachable
        const { error: signupError } = await supabase.auth.signUp({
          email: 'test@example.com',
          password: '' // Empty password to trigger validation error
        });
        
        addTestResult(
          'Signup Endpoint Test',
          signupError?.message.includes('password') || signupError?.message.includes('Password'),
          signupError ? 
            (signupError.message.includes('password') ? 'Endpoint reachable (password validation works)' : signupError.message) :
            'Unexpected success with empty password',
          { error: signupError }
        );
      } catch (signupError: any) {
        addTestResult(
          'Signup Endpoint Test',
          false,
          `Signup endpoint failed: ${signupError.message}`,
          signupError
        );
      }

    } catch (err: any) {
      setError(err.message);
      addTestResult('Test Execution', false, `Test failed: ${err.message}`, err);
    } finally {
      setLoading(false);
    }
  };

  const testFullSignup = async () => {
    setLoading(true);
    clearTests();

    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const testPassword = 'TestPassword123!';

      addTestResult('Starting Full Signup Test', true, `Using email: ${testEmail}`, { email: testEmail });

      // Test full signup flow
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: 'Test User',
            role: 'instructor'
          }
        }
      });

      addTestResult(
        'Auth Signup',
        !authError,
        authError ? authError.message : 'Auth user created successfully',
        { authData, authError }
      );

      if (authData.user && !authError) {
        // Test profile creation
        const { error: profileError } = await supabase
          .from('instructors')
          .insert({
            id: authData.user.id,
            email: testEmail,
            full_name: 'Test User',
            business_name: 'Test Business'
          });

        addTestResult(
          'Profile Creation',
          !profileError,
          profileError ? profileError.message : 'Instructor profile created successfully',
          { profileError }
        );

        // Clean up - sign out
        await supabase.auth.signOut();
        addTestResult('Cleanup', true, 'Signed out successfully', {});
      }

    } catch (err: any) {
      setError(err.message);
      addTestResult('Full Signup Test', false, `Test failed: ${err.message}`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Database & Auth Test</h1>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testBasicConnection}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            {loading ? 'Testing...' : 'Test Basic Connection'}
          </button>
          
          <button
            onClick={testFullSignup}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {loading ? 'Testing...' : 'Test Full Signup'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <strong className="text-red-800">Error:</strong>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {tests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
              <button
                onClick={clearTests}
                className="text-gray-500 hover:text-gray-700 px-3 py-1 text-sm"
              >
                Clear Results
              </button>
            </div>
            
            <div className="space-y-3">
              {tests.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.success 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{result.test}</h3>
                        <span className="text-xs text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Common Issues & Solutions:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Connection Closed:</strong> Check if your Supabase project is active and not paused</li>
            <li>• <strong>Invalid Credentials:</strong> Ensure the user exists in auth.users table</li>
            <li>• <strong>RLS Errors:</strong> Check Row Level Security policies in Supabase dashboard</li>
            <li>• <strong>Network Issues:</strong> Verify internet connection and firewall settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
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