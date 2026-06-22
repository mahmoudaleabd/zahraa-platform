'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  Building2,
  AlertTriangle,
  Users,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // التحقق من صلاحية المستخدم
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // التحقق من دور المستخدم (يجب أن يكون admin)
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!userData || userData.role !== 'admin') {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const menuItems = [
    {
      href: '/admin',
      icon: LayoutDashboard,
      label: 'لوحة المعلومات',
    },
    {
      href: '/admin/users',
      icon: Users,
      label: 'المستخدمون',
    },
    {
      href: '/admin/properties',
      icon: Building2,
      label: 'العقارات المعلقة',
    },
    {
      href: '/admin/complaints',
      icon: AlertTriangle,
      label: 'الشكاوى',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'إعدادات النظام',
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#0e0c0a]">
      {/* القائمة الجانبية */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-[#1a1613] border-l border-[#2d2722] z-50">
        {/* الشعار */}
        <div className="p-6 border-b border-[#2d2722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#dfba7a] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#0e0c0a]" />
            </div>
            <div>
              <h1 className="text-[#f2e8df] font-bold text-lg">لوحة التحكم</h1>
              <p className="text-[#a69584] text-xs">إدارة المنصة</p>
            </div>
          </div>
        </div>

        {/* عناصر القائمة */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#dfba7a] text-[#0e0c0a]'
                    : 'text-[#a69584] hover:bg-[#0e0c0a] hover:text-[#dfba7a]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2d2722]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[#a69584] hover:bg-[#0e0c0a] hover:text-[#e11d48] transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="mr-64">
        {children}
      </main>
    </div>
  );
}
