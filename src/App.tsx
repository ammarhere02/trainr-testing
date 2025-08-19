import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Hero from "./components/Hero";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import InstructorAuth from "./components/auth/InstructorAuth";
import StudentAuth from "./components/auth/StudentAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DatabaseTestNew from "./components/DatabaseTestNew";

function App() {
  const { user, userData, role, isLoading, error } = useAuth();

  // Debug logging
  console.log('App render:', { user: !!user, userData: !!userData, role, isLoading, error });

  if (isLoading) {
    console.log('App: Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">Initializing authentication...</p>
        </div>
      </div>
    );
   }

  if (error) {
    console.log('App: Showing error state:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">Authentication Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('App: Rendering main router');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing Page - redirect to dashboard if logged in */}
          <Route
            path="/"
            element={
              user ? (
                role === "instructor" ? (
                  <Navigate to="/dashboard-instructor" replace />
                ) : (
                  <Navigate to="/dashboard-student" replace />
                )
              ) : (
                <Hero onLogin={() => {}} onShowEducatorSignup={() => {}} />
              )
            }
          />

          {/* Database Test Route */}
          <Route path="/test-db" element={<DatabaseTestNew />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard-instructor"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorDashboard
                  instructorData={
                    role === "instructor" && userData
                      ? {
                          ...userData.profile,
                          instructor: userData.instructor || null,
                        }
                      : undefined
                  }
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard-student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard
                  studentData={
                    role === "student" && userData?.student
                      ? userData.student
                      : undefined
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* Auth Pages - redirect to dashboard if already logged in */}
          <Route
            path="/login/instructor"
            element={
              user && role === "instructor" ? (
                <Navigate to="/dashboard-instructor" replace />
              ) : user && role === "student" ? (
                <Navigate to="/dashboard-student" replace />
              ) : (
                <InstructorAuth
                  onSuccess={() =>
                    (window.location.href = "/dashboard-instructor")
                  }
                />
              )
            }
          />

          <Route
            path="/login/student"
            element={
              user && role === "student" ? (
                <Navigate to="/dashboard-student" replace />
              ) : user && role === "instructor" ? (
                <Navigate to="/dashboard-instructor" replace />
              ) : (
                <StudentAuth
                  onSuccess={() =>
                    (window.location.href = "/dashboard-student")
                  }
                />
              )
            }
          />

          {/* Legacy routes for backward compatibility */}
          <Route
            path="/login"
            element={
              user ? (
                role === "instructor" ? (
                  <Navigate to="/dashboard-instructor" replace />
                ) : (
                  <Navigate to="/dashboard-student" replace />
                )
              ) : (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Choose Your Login Type
                    </h2>
                    <div className="space-y-4">
                      <a
                        href="/login/instructor"
                        className="block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                      >
                        Login as Instructor
                      </a>
                      <a
                        href="/login/student"
                        className="block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Login as Student
                      </a>
                    </div>
                  </div>
                </div>
              )
            }
          />

          {/* Catch all - redirect based on auth status */}
          <Route
            path="*"
            element={
              user ? (
                role === "instructor" ? (
                  <Navigate to="/dashboard-instructor" replace />
                ) : (
                  <Navigate to="/dashboard-student" replace />
                )
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
