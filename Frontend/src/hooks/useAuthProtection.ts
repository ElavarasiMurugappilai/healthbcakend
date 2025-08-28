import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { checkTokenValidity } from '../api';
import type { User, AuthState } from '../types';

export const useAuthProtection = (redirectTo: string = '/login') => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        console.log('🔐 Auth Protection Check:', {
          hasToken: !!token,
          hasUser: !!userStr,
          currentPath: window.location.pathname,
        });

        if (!token || !userStr) {
          throw new Error('No authentication data');
        }

        const user: User = JSON.parse(userStr);
        const isTokenValid = await checkTokenValidity();

        if (!isTokenValid) {
          throw new Error('Token invalid');
        }

        if (mounted) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
          });
        }
      } catch (error) {
        console.error('❌ Auth protection failed:', error);

        if (mounted) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('profile');
          window.dispatchEvent(new Event('user-updated'));

          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });

          const currentPath = window.location.pathname;
          if (!['/login', '/signup', '/'].includes(currentPath)) {
            toast.error('Session expired. Please log in again.');
            navigate(redirectTo);
          }
        }
      }
    };

    // Initial check
    checkAuth();

    // ✅ Always check every 5 minutes (no stale state issues)
    const intervalId = setInterval(checkAuth, 5 * 60 * 1000);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('🔄 Auth data changed in another tab');
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for user updates
    const handleUserUpdate = () => {
      console.log('🔄 User data updated, rechecking auth');
      checkAuth();
    };
    window.addEventListener('user-updated', handleUserUpdate);

    return () => {
      mounted = false;
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [navigate, redirectTo]);

  return authState;
};
