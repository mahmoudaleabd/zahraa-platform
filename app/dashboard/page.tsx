'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut, Settings, User } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isInitialized, logout } = useAuthStore();

  // إعادة التوجيه إذا لم يكن المستخدم مسجل دخول
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth/login');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-deep">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-beige-snow">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-charcoal-deep">
      {/* شريط التنقل العلوي */}
      <nav className="bg-charcoal-card border-b border-charcoal-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-beige-snow">زهراء أكتوبر</h1>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-beige-gray hover:text-gold-primary transition-colors"
              title="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-beige-gray hover:text-rose-600 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* بطاقة ملف المستخدم */}
        <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-primary to-gold-hover rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-charcoal-deep" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-beige-snow mb-1">
                أهلاً وسهلاً
              </h2>
              <p className="text-beige-gray">
                {user.phone ? `📱 ${user.phone}` : ''}
                {user.email && user.phone && ' • '}
                {user.email ? `📧 ${user.email}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* شبكة المحتوى */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* بطاقة العقارات */}
          <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-6 hover:border-gold-primary/50 transition-all">
            <div className="w-12 h-12 bg-gold-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-bold text-beige-snow mb-2">العقارات</h3>
            <p className="text-beige-gray text-sm mb-4">
              استكشف أفضل العقارات المتاحة في زهراء أكتوبر
            </p>
            <button className="text-gold-primary hover:text-gold-hover font-semibold text-sm transition-colors">
              استكشاف →
            </button>
          </div>

          {/* بطاقة الخدمات */}
          <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-6 hover:border-gold-primary/50 transition-all">
            <div className="w-12 h-12 bg-gold-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛠️</span>
            </div>
            <h3 className="text-lg font-bold text-beige-snow mb-2">الخدمات</h3>
            <p className="text-beige-gray text-sm mb-4">
              اكتشف جميع الخدمات المتاحة من الصيدليات والمطاعم
            </p>
            <button className="text-gold-primary hover:text-gold-hover font-semibold text-sm transition-colors">
              استكشاف →
            </button>
          </div>

          {/* بطاقة الملف الشخصي */}
          <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-6 hover:border-gold-primary/50 transition-all">
            <div className="w-12 h-12 bg-gold-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-lg font-bold text-beige-snow mb-2">الملف الشخصي</h3>
            <p className="text-beige-gray text-sm mb-4">
              أدر إعدادات حسابك وبيانات ملفك الشخصي
            </p>
            <button className="text-gold-primary hover:text-gold-hover font-semibold text-sm transition-colors">
              تعديل →
            </button>
          </div>
        </div>

        {/* قسم المعلومات */}
        <div className="mt-8 bg-charcoal-card border border-charcoal-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-beige-snow mb-4">معلومات الحساب</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-beige-gray text-sm mb-1">معرّف المستخدم</p>
              <p className="text-beige-snow font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <p className="text-beige-gray text-sm mb-1">نوع المصادقة</p>
              <p className="text-beige-snow">
                {user.phone ? '📱 رقم الهاتف' : '🔐 Google'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
