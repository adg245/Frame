import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Gates a route behind authentication. Unauthenticated visitors are
 * redirected to login with the original destination preserved in state,
 * so LoginPage can send them back after a successful sign-in.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-lg border border-[var(--accent)] animate-pulse flex items-center justify-center bg-[var(--accent-muted)]">
          <span className="font-display text-sm font-bold text-[var(--accent)]">F</span>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    // Auth isn't set up yet — let the page through rather than trap the
    // user behind a login screen that cannot possibly succeed.
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
