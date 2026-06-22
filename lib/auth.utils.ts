/**
 * Utility functions for authentication
 */

import { supabase } from '@/lib/supabase/client';


/**
 * Format Egyptian phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');
  
  let formatted = digitsOnly.startsWith('002')
    ? '2' + digitsOnly.slice(3)
    : digitsOnly.startsWith('2')
    ? digitsOnly
    : '20' + digitsOnly;

  if (!formatted.startsWith('20')) {
    formatted = '20' + formatted;
  }

  return formatted.slice(0, 12);
};

/**
 * Validate Egyptian phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone);
  return formatted.length === 12 && formatted.startsWith('20');
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sign in with OTP
 */
export const signInWithOTP = async (phone: string) => {
  const formatted = formatPhoneNumber(phone);

  if (!isValidPhoneNumber(phone)) {
    throw new Error('رقم الهاتف غير صحيح');
  }

  return supabase.auth.signInWithOtp({
    phone: `+${formatted}`,
    options: {
      shouldCreateUser: true,
    },
  });
};

/**
 * Verify OTP
 */
export const verifyOTP = async (phone: string, token: string) => {
  const formatted = formatPhoneNumber(phone);

  return supabase.auth.verifyOtp({
    phone: `+${formatted}`,
    token,
    type: 'sms',
  });
};

/**
 * Sign in with Google
 * يستخدم window.location.origin تلقائياً لبناء رابط الاستدعاء الكامل.
 * يجب استدعاء هذه الدالة من المتصفح فقط (Client Component).
 */
export const signInWithGoogle = async () => {
  const redirectTo = `${window.location.origin}/auth/callback`;
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo,
    },
  });
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
};

/**
 * Get current session
 */
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;
  return session;
};

/**
 * Sign out
 */
export const signOut = async () => {
  return supabase.auth.signOut();
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};
