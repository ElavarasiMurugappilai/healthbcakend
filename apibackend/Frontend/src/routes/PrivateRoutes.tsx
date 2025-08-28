import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

interface PrivateRouteProps {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Test if token is valid by calling a protected route
        await api.get("/auth/me");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);
        // Remove invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [token]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children ? <>{children}</> : <Outlet />;
}