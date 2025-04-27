import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  // If authenticated, render children
  return authService.isAuthenticated() ? <>{children}</> : null;
}
