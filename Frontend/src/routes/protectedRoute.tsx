// src/components/ProtectedRoute.tsx
import { type ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          // Basic token format check
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            // Check if token is expired (basic check)
            try {
              const payload = JSON.parse(atob(tokenParts[1]));
              const currentTime = Date.now() / 1000;
              
              if (payload.exp && payload.exp > currentTime) {
                setIsAuthenticated(true);
              } else {
                console.warn("Token expired, clearing auth data");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsAuthenticated(false);
              }
            } catch (e) {
              console.error("Error parsing token payload:", e);
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => checkAuth();
    window.addEventListener("user-updated", handleAuthChange);
    
    return () => {
      window.removeEventListener("user-updated", handleAuthChange);
    };
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // User is authenticated but shouldn't be on this page (like login/signup)
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;