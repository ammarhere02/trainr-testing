import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "instructor" | "student";
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect if user doesn't have required role
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const dashboardPath =
      role === "instructor" ? "/dashboard-instructor" : "/dashboard-student";
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
