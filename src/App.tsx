import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useCallback } from "react";
import Hero from "./components/Hero";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import InstructorAuth from "./components/auth/InstructorAuth";
import StudentAuth from "./components/auth/StudentAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DatabaseTestNew from "./components/DatabaseTestNew";

function App() {
    const { user, userData, role, isLoading, error } = useAuth();
    const navigate = useNavigate();

    // Helper function to get user name for URL
    const getUserName = useCallback(() => {
        if (!userData || !userData.profile) {
            console.log("userData or profile not available yet");
            return "";
        }

        console.log("getUserName called with userData:", {
            userData,
            role,
            profileFullName: userData?.profile?.full_name,
            studentFullName: userData?.student?.full_name,
            hasProfile: !!userData?.profile,
            hasStudent: !!userData?.student,
        });

        let fullName = "";

        if (userData.profile.full_name && userData.profile.full_name.trim()) {
            fullName = userData.profile.full_name;
            console.log("Using profile full_name:", fullName);
        } else if (role === "student" && userData?.student?.full_name) {
            fullName = userData.student.full_name;
            console.log("Using student full_name:", fullName);
        }

        if (!fullName || !fullName.trim()) {
            console.log("No valid full name found in userData:", {
                userData,
                role,
            });
            return "";
        }

        const firstName = fullName.trim().split(" ")[0].toLowerCase();
        const cleanFirstName = firstName.replace(/[^a-z0-9]/g, "");
        console.log("Extracted firstName:", firstName, "cleaned:", cleanFirstName);
        return cleanFirstName;
    }, [userData, role]);

    // Helper function to generate dashboard URL with name
    const getDashboardUrl = useCallback(
        (userRole: string) => {
            if (!userData || !userData.profile) {
                console.log("User data not complete, using generic URL");
                return userRole === "instructor"
                    ? "/dashboard-instructor"
                    : "/dashboard-student";
            }

            const firstName = getUserName();
            console.log("getDashboardUrl - firstName:", firstName, "for role:", userRole);

            if (userRole === "instructor") {
                return firstName
                    ? `/dashboard-instructor/${firstName}`
                    : "/dashboard-instructor";
            } else {
                return firstName
                    ? `/dashboard-student/${firstName}`
                    : "/dashboard-student";
            }
        },
        [userData, getUserName]
    );

    // 🔧 FIXED: Post-login navigation handler with better state detection
    useEffect(() => {
        console.log('Navigation useEffect triggered:', {
            user: !!user,
            userData: !!userData,
            role,
            isLoading,
            profileExists: !!(userData?.profile),
            currentPath: window.location.pathname
        });

        // Wait for auth to be completely initialized and user data to be available
        if (!isLoading && user && userData && userData.profile && role) {
            const currentPath = window.location.pathname;
            console.log('Checking if redirection needed from:', currentPath);

            // Check if we need to redirect
            const shouldRedirect =
                currentPath.includes("/login") ||
                currentPath === "/dashboard-instructor" ||
                currentPath === "/dashboard-student" ||
                currentPath === "/" ||
                (currentPath.startsWith("/dashboard-instructor/") && role === "student") ||
                (currentPath.startsWith("/dashboard-student/") && role === "instructor");

            if (shouldRedirect) {
                const targetUrl = getDashboardUrl(role);
                console.log("🚀 Redirecting from", currentPath, "to:", targetUrl);

                // Force immediate navigation
                navigate(targetUrl, { replace: true });
            }
        } else if (!isLoading && !user) {
            // User is not authenticated and not loading - ensure we're not on protected routes
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/dashboard-")) {
                console.log("Redirecting unauthenticated user from protected route");
                navigate("/", { replace: true });
            }
        }
    }, [user, userData, role, isLoading, navigate, getDashboardUrl]);

    console.log("App render:", {
        user: !!user,
        userData: !!userData,
        role,
        isLoading,
        error,
        userDataComplete: !!(userData && userData.profile),
    });

    if (isLoading) {
        console.log("App: Showing loading state");
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Initializing authentication...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        console.log("App: Showing error state:", error);
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

    console.log("App: Rendering main router");

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                {/* Landing Page */}
                <Route
                    path="/"
                    element={
                        user ? (
                            role === "instructor" ? (
                                <Navigate to={getDashboardUrl("instructor")} replace />
                            ) : (
                                <Navigate to={getDashboardUrl("student")} replace />
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
                    path="/dashboard-instructor/:name?"
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
                    path="/dashboard-student/:name?"
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

                {/* Auth Pages */}
                <Route
                    path="/login/instructor"
                    element={
                        user && role === "instructor" ? (
                            <Navigate to={getDashboardUrl("instructor")} replace />
                        ) : user && role === "student" ? (
                            <Navigate to={getDashboardUrl("student")} replace />
                        ) : (
                            <InstructorAuth />
                        )
                    }
                />

                <Route
                    path="/login/student"
                    element={
                        user && role === "student" ? (
                            <Navigate to={getDashboardUrl("student")} replace />
                        ) : user && role === "instructor" ? (
                            <Navigate to={getDashboardUrl("instructor")} replace />
                        ) : (
                            <StudentAuth />
                        )
                    }
                />

                {/* Legacy routes */}
                <Route
                    path="/login"
                    element={
                        user ? (
                            role === "instructor" ? (
                                <Navigate to={getDashboardUrl("instructor")} replace />
                            ) : (
                                <Navigate to={getDashboardUrl("student")} replace />
                            )
                        ) : (
                            <Navigate to="/login/instructor" replace />
                        )
                    }
                />

                <Route
                    path="/dashboard-instructor"
                    element={
                        user && role === "instructor" ? (
                            <Navigate to={getDashboardUrl("instructor")} replace />
                        ) : (
                            <Navigate to="/login/instructor" replace />
                        )
                    }
                />

                <Route
                    path="/dashboard-student"
                    element={
                        user && role === "student" ? (
                            <Navigate to={getDashboardUrl("student")} replace />
                        ) : (
                            <Navigate to="/login/student" replace />
                        )
                    }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}