'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after we're done loading authentication state
    // and if the user is not authenticated
    if (!loading && !isAuthenticated) {
      // Include current path as callback URL to redirect back after login
      const currentPath = encodeURIComponent(window.location.pathname);
      router.push(`/login?callbackUrl=${currentPath}`);
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing while loading
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}