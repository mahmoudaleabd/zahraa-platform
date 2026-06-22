'use client';

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase/client';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
  };
  aud?: string;
  created_at?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isLoading: false,
        isInitialized: false,
        error: null,

        setAuth: (user: User, token: string) => {
          set({ user, token, isLoading: false, error: null });
        },

        logout: async () => {
          try {
            set({ isLoading: true });
            await supabase.auth.signOut();
            set({
              user: null,
              token: null,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : 'خطأ في تسجيل الخروج';
            set({ error: message, isLoading: false });
          }
        },

        checkSession: async () => {
          try {
            set({ isLoading: true });
            
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();

            if (error || !session) {
              set({
                user: null,
                token: null,
                isLoading: false,
                isInitialized: true,
                error: null,
              });
              return;
            }

            const user = session.user as User;
            const token = session.access_token;

            set({
              user,
              token,
              isLoading: false,
              isInitialized: true,
              error: null,
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : 'خطأ في التحقق من الجلسة';
            set({
              isInitialized: true,
              isLoading: false,
              error: message,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        setError: (error: string) => {
          set({ error });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
);
