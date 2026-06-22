'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { setAuth, checkSession } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // التحقق من رقم الهاتف المحفوظ
  useEffect(() => {
    const saved = sessionStorage.getItem('pendingPhone');
    if (!saved) {
      router.push('/auth/login');
      return;
    }
    setPhoneNumber(saved);
  }, [router]);

  // عداد تنازلي لإعادة الإرسال
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  // معالجة إدخال الأرقام
  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    
    if (value.length > 1) {
      // إذا تم لصق عدة أرقام
      const pasteParts = value.replace(/\D/g, '').split('');
      pasteParts.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
    } else {
      newOtp[index] = value.replace(/\D/g, '');
    }
    
    setOtp(newOtp);
    
    // الانتقال إلى الحقل التالي
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // معالجة مفتاح Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // التحقق من OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('الرجاء إدخال كود سداسي الأرقام');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        phone: `+${phoneNumber}`,
        token: otpCode,
        type: 'sms',
      });

      if (verifyError) {
        setError(verifyError.message || 'كود التفعيل غير صحيح');
        setIsLoading(false);
        return;
      }

      if (data.user && data.session) {
        setAuth(
          {
            id: data.user.id,
            email: data.user.email,
            phone: data.user.phone,
            user_metadata: data.user.user_metadata,
          },
          data.session.access_token
        );

        // حفظ الجلسة
        await checkSession();
        
        // تنظيف
        sessionStorage.removeItem('pendingPhone');

        // إعادة التوجيه بعد قليل
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة إرسال الكود
  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      const { error: resendError } = await supabase.auth.signInWithOtp({
        phone: `+${phoneNumber}`,
        options: {
          shouldCreateUser: true,
        },
      });

      if (resendError) {
        setError(resendError.message || 'فشل إعادة الإرسال');
        return;
      }

      setOtp(['', '', '', '', '', '']);
      setTimeLeft(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-deep px-4">
      <div className="w-full max-w-md">
        {/* الزر للعودة */}
        <button
          onClick={() => router.push('/auth/login')}
          className="flex items-center gap-2 text-gold-primary hover:text-gold-hover mb-8 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>عودة</span>
        </button>

        {/* الرأس */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-beige-snow mb-2">تفعيل حسابك</h1>
          <p className="text-beige-gray">
            أدخل الكود السداسي الذي تم إرساله إلى
            <br />
            <span className="text-gold-primary font-semibold">+{phoneNumber}</span>
          </p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-rose-600/10 border border-rose-600 text-rose-600 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* نموذج التحقق */}
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* حقول إدخال OTP */}
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-12 h-12 bg-charcoal-card border border-charcoal-border rounded-lg text-center text-beige-snow font-bold text-lg focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all disabled:opacity-50"
                autoComplete="off"
              />
            ))}
          </div>

          {/* زر التحقق */}
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full bg-gold-primary hover:bg-gold-hover text-charcoal-deep font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            تفعيل الحساب
          </button>
        </form>

        {/* إعادة الإرسال */}
        <div className="text-center mt-6">
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={isLoading}
              className="text-gold-primary hover:text-gold-hover font-semibold transition-colors disabled:opacity-50"
            >
              إعادة إرسال الكود
            </button>
          ) : (
            <p className="text-beige-gray text-sm">
              لم تتلقَ الكود؟ يمكنك إعادة الطلب خلال{' '}
              <span className="text-gold-primary font-semibold">{timeLeft}s</span>
            </p>
          )}
        </div>

        {/* معلومات إضافية */}
        <div className="bg-charcoal-card border border-charcoal-border rounded-lg p-4 mt-8 text-center">
          <p className="text-beige-gray text-sm">
            رقم خاطئ؟{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-gold-primary hover:text-gold-hover font-semibold transition-colors"
            >
              تغيير الرقم
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
