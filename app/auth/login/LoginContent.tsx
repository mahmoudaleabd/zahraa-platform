'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setStep('otp');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(redirect);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1613] border border-[#2d2722] rounded-2xl p-8">
        <h1 className="text-[#f2e8df] text-3xl font-bold text-center mb-2">
          مرحباً بك في زهراء أكتوبر
        </h1>
        <p className="text-[#a69584] text-center mb-8">
          {step === 'phone' ? 'سجل دخولك برقم هاتفك' : 'أدخل رمز التحقق المرسل إليك'}
        </p>

        {error && (
          <div className="bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-6">
              <label className="block text-[#a69584] text-sm font-semibold mb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 01012345678"
                className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-6">
              <label className="block text-[#a69584] text-sm font-semibold mb-2">
                رمز التحقق
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="أدخل الرمز المكون من 6 أرقام"
                className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحقق...' : 'تأكيد'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full mt-3 text-[#a69584] text-sm hover:text-[#dfba7a] transition-colors"
            >
              تغيير رقم الهاتف
            </button>
          </form>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2d2722]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1a1613] text-[#a69584]">أو</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-[#2d2722] hover:border-[#dfba7a] text-[#f2e8df] font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          <span>الدخول عبر Google</span>
        </button>

        <div className="text-center mt-6 text-[#a69584] text-sm">
          ليس لديك حساب؟{' '}
          <a href="/auth/register" className="text-[#dfba7a] hover:underline">
            إنشاء حساب جديد
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginContent() {
  return (
    <Suspense fallback={<div className="text-center text-[#a69584] p-8">جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}
