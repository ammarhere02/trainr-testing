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
  const { user, userData, role, isLoading } = useAuth();
  const location = useLocation();

  // Helper function to get user name for URL
  const getUserName = () => {
    if (!userData || !userData.profile) {
      return "";
    }

    let fullName = "";
    if (userData.profile.full_name && userData.profile.full_name.trim()) {
      fullName = userData.profile.full_name;
    } else if (role === "student" && userData?.student?.full_name) {
      fullName = userData.student.full_name;
    }

    if (!fullName || !fullName.trim()) {
      return "";
    }

    const firstName = fullName.trim().split(" ")[0].toLowerCase();
    return firstName.replace(/[^a-z0-9]/g, "");
  };

  // Helper function to generate dashboard URL with name
  const getDashboardUrl = (userRole: string) => {
    if (!userData || !userData.profile) {
      return userRole === "instructor"
        ? "/dashboard-instructor"
        : "/dashboard-student";
    }

    const firstName = getUserName();
    if (userRole === "instructor") {
      return firstName
        ? `/dashboard-instructor/${firstName}`
        : "/dashboard-instructor";
    } else {
      return firstName
        ? `/dashboard-student/${firstName}`
        : "/dashboard-student";
    }
  };

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
    // Redirect to appropriate dashboard based on user's actual role with name
    const dashboardPath = getDashboardUrl(role || "instructor");
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}
