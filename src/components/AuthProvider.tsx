'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Handle hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated && pathname !== '/login' && !pathname.startsWith('/public-payment')) {
        router.push('/login');
      }
      
      if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
      
      if (isAuthenticated && pathname === '/') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, pathname, router, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  // Prevent render if not authenticated and not on public routes
  if (!isAuthenticated && pathname !== '/login' && !pathname.startsWith('/public-payment')) {
    return null; 
  }

  return <>{children}</>;
}
