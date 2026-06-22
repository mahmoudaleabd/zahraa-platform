'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Building2, 
  Search, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Activity, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  Utensils,
  ShoppingBag,
  Wrench,
  AlertCircle
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'properties' | 'services' | 'doctors'>('properties');

  return (
    <main className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen flex flex-col gap-6">
      {/* 1. شريط الإشعارات المتحرك */}
      <div className="bg-[#dfba7a]/15 border border-[#dfba7a]/30 rounded-xl p-3 flex items-center gap-2 smooth-transition gold-glow">
        <AlertCircle className="w-5 h-5 text-gold-primary shrink-0" />
        <p className="text-xs text-beige-snow font-medium leading-relaxed">
          خصومات حصرية للمحلات التجارية والعيادات المشتركة حديثاً بالمدينة!
        </p>
      </div>

      {/* 2. هيدر الترحيب وشعار المنصة */}
      <div className="text-center">
        <h1 className="font-hero text-3xl font-extrabold text-beige-snow tracking-wide mb-1">
          زهراء أكتوبر <span className="text-gold-primary font-price">الجديدة</span>
        </h1>
        <p className="text-xs text-beige-gray">دليلك العقاري والخدمي الأول بقلب المدينة</p>
      </div>

      {/* زر تسجيل الدخول/الملف الشخصي */}
      {isInitialized && (
        <div className="flex justify-center">
          {user ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-gold-primary hover:bg-gold-hover text-charcoal-deep font-semibold rounded-full transition-all text-sm"
            >
              لوحة التحكم
            </button>
          ) : (
            <button
              onClick={() => router.push('/auth/login')}
              className="px-6 py-2 bg-gold-primary hover:bg-gold-hover text-charcoal-deep font-semibold rounded-full transition-all text-sm"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      )}

      {/* 3. شريط التبويبات الدائرية */}
      <div className="flex p-1 bg-black border border-charcoal-border rounded-full max-w-sm mx-auto w-full">
        <button 
          onClick={() => setActiveTab('properties')}
          className={`w-1/3 py-2 text-center text-xs font-bold rounded-full transition-all smooth-transition ${
            activeTab === 'properties' 
              ? 'bg-gold-primary text-charcoal-deep shadow-md' 
              : 'text-beige-gray hover:text-gold-primary hover:bg-gold-primary/5'
          }`}
        >
          العقارات
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`w-1/3 py-2 text-center text-xs font-bold rounded-full transition-all smooth-transition ${
            activeTab === 'services' 
              ? 'bg-gold-primary text-charcoal-deep shadow-md' 
              : 'text-beige-gray hover:text-gold-primary hover:bg-gold-primary/5'
          }`}
        >
          الخدمات
        </button>
        <button 
          onClick={() => setActiveTab('doctors')}
          className={`w-1/3 py-2 text-center text-xs font-bold rounded-full transition-all smooth-transition ${
            activeTab === 'doctors' 
              ? 'bg-gold-primary text-charcoal-deep shadow-md' 
              : 'text-beige-gray hover:text-gold-primary hover:bg-gold-primary/5'
          }`}
        >
          الأطباء
        </button>
      </div>

      {activeTab === 'properties' && (
        <>
          {/* 4. شاشة أسعار العقارات اليومية بالمنطقة */}
          <div className="bg-charcoal-card border border-charcoal-border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-beige-snow flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-gold-primary" />
                متوسط الأسعار اليوم بالمدينة
              </span>
              <span className="text-[10px] text-beige-gray">تحديث: يونيو 2026</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0e0c0a] border border-charcoal-border/50 rounded-xl p-3 text-center">
                <span className="text-[10px] text-beige-gray block mb-1">متوسط متر البيع</span>
                <span className="text-lg font-bold text-gold-primary font-price">12,400 <span className="text-[10px] text-beige-snow">ج.م</span></span>
              </div>
              <div className="bg-[#0e0c0a] border border-charcoal-border/50 rounded-xl p-3 text-center">
                <span className="text-[10px] text-beige-gray block mb-1">متوسط الإيجار الشهري</span>
                <span className="text-lg font-bold text-gold-primary font-price">5,500 <span className="text-[10px] text-beige-snow">ج.م</span></span>
              </div>
            </div>
          </div>

          {/* 5. شريط البحث والفلترة */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="ابحث عن شقة، أرض، أو محلات..." 
              className="w-full bg-charcoal-card border border-charcoal-border rounded-xl py-3 pr-10 pl-12 text-xs text-beige-snow placeholder:text-beige-gray/50 focus:outline-none focus:border-gold-primary smooth-transition"
            />
            <Search className="w-4 h-4 text-beige-gray/70 absolute right-3 top-3.5" />
            <button className="absolute left-2 top-2 bg-charcoal-deep border border-charcoal-border hover:border-gold-primary p-1.5 rounded-lg smooth-transition">
              <SlidersHorizontal className="w-4 h-4 text-gold-primary" />
            </button>
          </div>

          {/* 6. قائمة العقارات المتاحة حديثاً */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-sm font-bold text-beige-snow">أحدث العقارات المضافة</h2>
              <button className="text-xs text-gold-primary hover:text-gold-hover font-semibold flex items-center">
                عرض الكل <ChevronRight className="w-3 h-3 rotate-180" />
              </button>
            </div>

            {/* بطاقة عقار 1 */}
            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col gap-3 hover:border-gold-primary/40 smooth-transition gold-glow-hover">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-[#dfba7a]/10 text-gold-primary text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block">شقة للإيجار</span>
                  <h3 className="text-sm font-bold text-beige-snow">شقة 120م - المربع ب - تشطيب لوكس</h3>
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold text-gold-primary font-price block leading-none">6,000</span>
                  <span className="text-[9px] text-beige-gray">جنيه / شهرياً</span>
                </div>
              </div>
              
              <div className="flex gap-4 text-[11px] text-beige-gray border-y border-charcoal-border/30 py-2">
                <span>🛏️ 3 غرف</span>
                <span>🚿 2 حمام</span>
                <span>📐 120 متر مربع</span>
              </div>
              
              <div className="flex gap-2">
                <a href="https://wa.me/201000000000?text=استفسار" className="w-1/2 bg-gold-primary hover:bg-gold-hover text-charcoal-deep text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all smooth-transition">
                  <MessageSquare className="w-3.5 h-3.5" /> واتساب
                </a>
                <a href="tel:201000000000" className="w-1/2 border border-gold-primary text-gold-primary hover:bg-gold-primary/5 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all smooth-transition">
                  <Phone className="w-3.5 h-3.5" /> اتصال مباشر
                </a>
              </div>
            </div>

            {/* بطاقة عقار 2 */}
            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col gap-3 hover:border-gold-primary/40 smooth-transition gold-glow-hover">
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-[#dfba7a]/10 text-gold-primary text-[10px] font-bold px-2 py-0.5 rounded-md mb-1.5 inline-block">شقة للبيع</span>
                  <h3 className="text-sm font-bold text-beige-snow">شقة 140م كاش - المربع ج - نصف تشطيب</h3>
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold text-gold-primary font-price block leading-none">1,350,000</span>
                  <span className="text-[9px] text-beige-gray">جنيه مصري</span>
                </div>
              </div>
              
              <div className="flex gap-4 text-[11px] text-beige-gray border-y border-charcoal-border/30 py-2">
                <span>🛏️ 3 غرف</span>
                <span>🚿 2 حمام</span>
                <span>📐 140 متر مربع</span>
              </div>
              
              <div className="flex gap-2">
                <a href="https://wa.me/201000000000?text=استفسار" className="w-1/2 bg-gold-primary hover:bg-gold-hover text-charcoal-deep text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all smooth-transition">
                  <MessageSquare className="w-3.5 h-3.5" /> واتساب
                </a>
                <a href="tel:201000000000" className="w-1/2 border border-gold-primary text-gold-primary hover:bg-gold-primary/5 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all smooth-transition">
                  <Phone className="w-3.5 h-3.5" /> اتصال مباشر
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'services' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-gold-primary/50 smooth-transition cursor-pointer">
              <div className="bg-gold-primary/10 p-3 rounded-full text-gold-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-beige-snow">سوبر ماركت وتموين</span>
              <span className="text-[10px] text-beige-gray">15 نشاط تجاري</span>
            </div>

            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-gold-primary/50 smooth-transition cursor-pointer">
              <div className="bg-gold-primary/10 p-3 rounded-full text-gold-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-beige-snow">مطاعم وكافيهات</span>
              <span className="text-[10px] text-beige-gray">22 مطعم وكافيه</span>
            </div>

            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-gold-primary/50 smooth-transition cursor-pointer">
              <div className="bg-gold-primary/10 p-3 rounded-full text-gold-primary">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-beige-snow">صيانة وحرفيين</span>
              <span className="text-[10px] text-beige-gray">12 فني معتمد</span>
            </div>

            <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-gold-primary/50 smooth-transition cursor-pointer">
              <div className="bg-gold-primary/10 p-3 rounded-full text-gold-primary">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-beige-snow">صيدليات وطوارئ</span>
              <span className="text-[10px] text-beige-gray">8 صيدليات</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="flex flex-col gap-3">
          <div className="bg-charcoal-card border border-charcoal-border rounded-xl p-4 flex gap-4 hover:border-gold-primary/50 smooth-transition">
            <div className="bg-gold-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-gold-primary shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-beige-snow">د. محمد أحمد - عيادة الأطفال</h3>
              <p className="text-[10px] text-beige-gray mb-2">مول أكتوبر سنتر - المربع أ</p>
              <div className="flex gap-2">
                <a href="tel:20100000000" className="text-[10px] bg-gold-primary text-charcoal-deep font-bold px-3 py-1 rounded-md transition-colors hover:bg-gold-hover">اتصال</a>
                <a href="https://wa.me/20100000000" className="text-[10px] border border-gold-primary text-gold-primary font-bold px-3 py-1 rounded-md transition-colors hover:bg-gold-primary/10">حجز واتساب</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. هيدر سفلي للتنقل المخصص للموبايل */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-charcoal-card border-t border-charcoal-border flex justify-around items-center z-50 max-w-md mx-auto">
        <button className="flex flex-col items-center justify-center text-gold-primary">
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center justify-center text-beige-gray hover:text-gold-primary smooth-transition">
          <SlidersHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">العقارات</span>
        </button>
        <button className="flex flex-col items-center justify-center text-beige-gray hover:text-gold-primary smooth-transition">
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">البحث</span>
        </button>
        <button className="flex flex-col items-center justify-center text-beige-gray hover:text-gold-primary smooth-transition">
          <Phone className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-bold">الطوارئ</span>
        </button>
      </div>
    </main>
  );
}
