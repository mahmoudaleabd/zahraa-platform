'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { Phone, Mail, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { checkSession } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');

  // تنسيق رقم الهاتف
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
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

  // التحقق من صحة البيانات
  const isValidForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('الرجاء إدخال الاسم');
      return false;
    }
    if (!formData.phone || formatPhoneNumber(formData.phone).length !== 12) {
      setError('الرجاء إدخال رقم هاتف مصري صحيح');
      return false;
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('البريد الإلكتروني غير صحيح');
      return false;
    }
    return true;
  };

  // معالجة التسجيل
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidForm()) return;

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      // محاولة إرسال OTP
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        phone: `+${formattedPhone}`,
        options: {
          shouldCreateUser: true,
          data: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'فشل التسجيل');
        setIsLoading(false);
        return;
      }

      // حفظ بيانات التسجيل المؤقتة
      sessionStorage.setItem('pendingPhone', formattedPhone);
      sessionStorage.setItem('pendingName', formData.name);
      sessionStorage.setItem('pendingEmail', formData.email);

      // الانتقال إلى صفحة التحقق
      setTimeout(() => {
        router.push('/auth/verify');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-deep px-4">
      <div className="w-full max-w-md">
        {/* زر العودة */}
        <button
          onClick={() => router.push('/auth/login')}
          className="flex items-center gap-2 text-gold-primary hover:text-gold-hover mb-8 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span>عودة إلى تسجيل الدخول</span>
        </button>

        {/* الرأس */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-beige-snow mb-2">إنشاء حساب جديد</h1>
          <p className="text-beige-gray">
            انضم إلى منصة زهراء أكتوبر واستمتع بجميع الخدمات
          </p>
        </div>

        {/* رسالة الخطأ */}
        {error && (
          <div className="bg-rose-600/10 border border-rose-600 text-rose-600 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* نموذج التسجيل */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* الاسم */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-beige-snow mb-2">
              الاسم الكامل
            </label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-primary" />
              <input
                id="name"
                type="text"
                placeholder="محمد علي"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                className="w-full bg-charcoal-card border border-charcoal-border rounded-lg py-3 pr-12 pl-4 text-beige-snow placeholder-beige-gray focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* البريد الإلكتروني (اختياري) */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-beige-snow mb-2">
              البريد الإلكتروني <span className="text-beige-gray">(اختياري)</span>
            </label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-primary" />
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                className="w-full bg-charcoal-card border border-charcoal-border rounded-lg py-3 pr-12 pl-4 text-beige-snow placeholder-beige-gray focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* رقم الهاتف */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-beige-snow mb-2">
              رقم الهاتف المحمول
            </label>
            <div className="relative">
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gold-primary" />
              <input
                id="phone"
                type="tel"
                placeholder="+20 10 xxxx xxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
                className="w-full bg-charcoal-card border border-charcoal-border rounded-lg py-3 pr-12 pl-4 text-beige-snow placeholder-beige-gray focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-beige-gray mt-2">
              يتم إرسال كود تفعيل سداسي إلى هاتفك
            </p>
          </div>

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.phone}
            className="w-full bg-gold-primary hover:bg-gold-hover text-charcoal-deep font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            إنشاء الحساب
          </button>

          {/* رابط تسجيل الدخول */}
          <p className="text-center text-beige-gray text-sm">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-gold-primary hover:text-gold-hover transition-colors font-semibold"
            >
              تسجيل الدخول
            </button>
          </p>
        </form>

        {/* ملاحظات القانونية */}
        <div className="mt-8 bg-charcoal-card border border-charcoal-border rounded-lg p-4 text-center">
          <p className="text-beige-gray text-xs">
            بإنشاء حساب، فأنت توافق على
            <br />
            <a href="#" className="text-gold-primary hover:underline">شروط الخدمة</a> و
            <a href="#" className="text-gold-primary hover:underline"> سياسة الخصوصية</a>
          </p>
        </div>
      </div>
    </div>
  );
}
