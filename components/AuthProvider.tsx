'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkSession, isInitialized } = useAuthStore();

  // التحقق من الجلسة عند تحميل التطبيق
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}
