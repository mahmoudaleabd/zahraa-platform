'use client';

import { useState, useEffect } from 'react';
import { getStats, getRecentNotifications } from '@/services/adminService';
import {
  Users,
  Building2,
  AlertTriangle,
  Store,
  TrendingUp,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [statsResult, notificationsResult] = await Promise.all([
      getStats(),
      getRecentNotifications(5),
    ]);

    if (statsResult.data) {
      setStats(statsResult.data);
    }
    if (notificationsResult.data) {
      setNotifications(notificationsResult.data);
    }
    setLoading(false);
  };

  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const maxUsers = Math.max(...(stats?.weekly_users || [1]));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#a69584]">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-[#f2e8df] text-3xl font-bold mb-2">لوحة المعلومات</h1>
        <p className="text-[#a69584]">نظرة عامة على إحصائيات المنصة</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 hover:border-[#dfba7a]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#dfba7a]/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-[#dfba7a]" />
            </div>
            <span className="text-[#a69584] text-sm">إجمالي</span>
          </div>
          <div className="text-[#f2e8df] text-3xl font-bold mb-1">
            {stats?.total_users || 0}
          </div>
          <div className="text-[#a69584] text-sm">المستخدمين</div>
        </div>

        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 hover:border-[#dfba7a]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#dfba7a]/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#dfba7a]" />
            </div>
            <span className="text-[#a69584] text-sm">قيد المراجعة</span>
          </div>
          <div className="text-[#f2e8df] text-3xl font-bold mb-1">
            {stats?.pending_properties || 0}
          </div>
          <div className="text-[#a69584] text-sm">العقارات المعلقة</div>
        </div>

        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 hover:border-[#dfba7a]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#e11d48]/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#e11d48]" />
            </div>
            <span className="text-[#a69584] text-sm">نشطة</span>
          </div>
          <div className="text-[#f2e8df] text-3xl font-bold mb-1">
            {stats?.active_complaints || 0}
          </div>
          <div className="text-[#a69584] text-sm">الشكاوى</div>
        </div>

        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 hover:border-[#dfba7a]/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#dfba7a]/10 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-[#dfba7a]" />
            </div>
            <span className="text-[#a69584] text-sm">مسجلة</span>
          </div>
          <div className="text-[#f2e8df] text-3xl font-bold mb-1">
            {stats?.registered_businesses || 0}
          </div>
          <div className="text-[#a69584] text-sm">الأعمال</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* رسم بياني للمستخدمين الأسبوعيين */}
        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#f2e8df] text-xl font-bold mb-1">تفاعل المستخدمين</h2>
              <p className="text-[#a69584] text-sm">المستخدمون الجدد خلال الأسبوع</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#dfba7a]" />
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {stats?.weekly_users?.map((count: number, index: number) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-[#dfba7a] rounded-t transition-all hover:bg-[#cda767]"
                  style={{
                    height: `${(count / maxUsers) * 100}%`,
                    minHeight: count > 0 ? '20px' : '0',
                  }}
                />
                <span className="text-[#a69584] text-xs">{days[index]}</span>
                <span className="text-[#f2e8df] text-sm font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* آخر الإشعارات */}
        <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#f2e8df] text-xl font-bold mb-1">آخر الإشعارات</h2>
              <p className="text-[#a69584] text-sm">التحديثات العاجلة</p>
            </div>
            <Bell className="w-5 h-5 text-[#dfba7a]" />
          </div>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-[#a69584]">
                لا توجد إشعارات جديدة
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 bg-[#0e0c0a] rounded-lg border border-[#2d2722] hover:border-[#dfba7a]/50 transition-all"
                >
                  <div className="w-8 h-8 bg-[#dfba7a]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-[#dfba7a]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#f2e8df] text-sm font-semibold mb-1">
                      {notification.title}
                    </p>
                    <p className="text-[#a69584] text-xs line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  <span className="text-[#a69584] text-xs">
                    {new Date(notification.created_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              href="/admin/notifications"
              className="block mt-4 text-center text-[#dfba7a] text-sm hover:underline"
            >
              عرض جميع الإشعارات
            </Link>
          )}
        </div>
      </div>

      {/* روابط سريعة */}
      <div className="mt-8">
        <h2 className="text-[#f2e8df] text-xl font-bold mb-4">روابط سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/properties"
            className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-4 hover:border-[#dfba7a]/50 transition-all flex items-center gap-4"
          >
            <Building2 className="w-8 h-8 text-[#dfba7a]" />
            <div>
              <div className="text-[#f2e8df] font-bold">العقارات المعلقة</div>
              <div className="text-[#a69584] text-sm">مراجعة ونشر العقارات</div>
            </div>
          </Link>

          <Link
            href="/admin/complaints"
            className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-4 hover:border-[#dfba7a]/50 transition-all flex items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8 text-[#e11d48]" />
            <div>
              <div className="text-[#f2e8df] font-bold">الشكاوى</div>
              <div className="text-[#a69584] text-sm">معالجة البلاغات</div>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-4 hover:border-[#dfba7a]/50 transition-all flex items-center gap-4"
          >
            <Users className="w-8 h-8 text-[#dfba7a]" />
            <div>
              <div className="text-[#f2e8df] font-bold">المستخدمون</div>
              <div className="text-[#a69584] text-sm">إدارة الصلاحيات</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
