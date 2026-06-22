'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { Phone, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setAuth, checkSession, isInitialized } = useAuthStore();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // عرض أخطاء OAuth القادمة من رابط الاستدعاء (مثلاً بعد فشل Google)
  useEffect(() => {
    const oauthError = searchParams.get('error');
    const oauthMessage = searchParams.get('message');
    if (oauthError) {
      setError(oauthMessage ? decodeURIComponent(oauthMessage) : 'فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.');
    }
  }, [searchParams]);

  // التحقق من الجلسة عند التحميل
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // إعادة التوجيه إذا كان المستخدم مسجل الدخول بالفعل
  useEffect(() => {
    if (isInitialized && user) {
      router.push('/dashboard');
    }
  }, [user, isInitialized, router]);

  // تنسيق رقم الهاتف
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    // إذا بدأ بـ 002 نحول إلى 20
    let formatted = digitsOnly.startsWith('002') 
      ? '2' + digitsOnly.slice(3)
      : digitsOnly.startsWith('2')
      ? digitsOnly
      : '20' + digitsOnly;

    // تأكد من أنه يبدأ بـ 20
    if (!formatted.startsWith('20')) {
      formatted = '20' + formatted;
    }

    return formatted.slice(0, 12); // محمول مصري: 20 + 10 أرقام
  };

  // التحقق من صحة رقم الهاتف
  const isValidPhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    return formatted.length === 12 && formatted.startsWith('20');
  };

  // إرسال OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('الرجاء إدخال رقم هاتف مصري صحيح');
      return;
    }

    setIsLoading(true);
    try {
      const formatted = formatPhoneNumber(phoneNumber);
      
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        phone: `+${formatted}`,
        options: {
          shouldCreateUser: true,
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'فشل إرسال الكود');
        return;
      }

      setSuccess('تم إرسال كود التفعيل! تحقق من رسائلك النصية');
      // حفظ رقم الهاتف في sessionStorage لاستخدامه في صفحة التحقق
      sessionStorage.setItem('pendingPhone', formatted);
      
      // إعادة التوجيه إلى صفحة التحقق بعد ثانيتين
      setTimeout(() => {
        router.push('/auth/verify');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول عبر Google
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (googleError) {
        setError(googleError.message || 'فشل تسجيل الدخول عبر Google');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-deep">
        <Loader2 className="w-8 h-8 animate-spin text-gold-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-deep px-4">
      <div className="w-full max-w-md">
        {/* الشعار والعنوان */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-beige-snow mb-2">زهراء أكتوبر</h1>
          <p className="text-beige-gray">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSendOTP} className="space-y-6">
          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-rose-600/10 border border-rose-600 text-rose-600 px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* رسالة النجاح */}
          {success && (
            <div className="bg-emerald-600/10 border border-emerald-600 text-emerald-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* حقل رقم الهاتف */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-beige-snow mb-3">
              رقم الهاتف المحمول
            </label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-primary" />
              <input
                id="phone"
                type="tel"
                placeholder="+20 10 xxxx xxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
                className="w-full bg-charcoal-card border border-charcoal-border rounded-lg py-3 pr-12 pl-4 text-beige-snow placeholder-beige-gray focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-beige-gray mt-2">
              سيتم إرسال كود تفعيل سداسي إلى هاتفك
            </p>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={isLoading || !phoneNumber}
            className="w-full bg-gold-primary hover:bg-gold-hover text-charcoal-deep font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            إرسال كود التفعيل
          </button>
        </form>

        {/* الفاصل */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-charcoal-border" />
          <span className="text-beige-gray text-sm">أو</span>
          <div className="flex-1 h-px bg-charcoal-border" />
        </div>

        {/* زر Google */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-charcoal-deep font-bold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          الدخول عبر Google
        </button>

        {/* رابط التسجيل */}
        <p className="text-center text-beige-gray text-sm mt-6">
          ليس لديك حساب؟{' '}
          <button
            onClick={() => router.push('/auth/register')}
            className="text-gold-primary hover:text-gold-hover transition-colors"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  );
}
