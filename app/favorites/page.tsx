'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/shared/PropertyCard';
import { getFavorites, removeFavorite } from '@/services/favoritesService';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await getFavorites(userId);

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      // استخراج العقارات من البيانات
      const properties = data.map((fav: any) => fav.properties).filter(Boolean);
      setFavorites(properties);
    }
    setLoading(false);
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!userId) return;

    const { error } = await removeFavorite(userId, propertyId);

    if (error) {
      console.error('Error removing favorite:', error);
      alert('حدث خطأ أثناء إزالة العقار من المفضلة');
    } else {
      fetchFavorites();
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a69584] mb-4">يجب تسجيل الدخول لعرض المفضلة</p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg font-bold transition-all"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0c0a]">
      {/* الهيدر */}
      <div className="bg-[#1a1613] border-b border-[#2d2722]">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#a69584] hover:text-[#dfba7a] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للرئيسية
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#dfba7a] fill-current" />
            <h1 className="text-[#f2e8df] text-3xl font-bold">المفضلة</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#a69584]">جاري التحميل...</div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-12 text-center">
            <Heart className="w-16 h-16 text-[#a69584] mx-auto mb-4" />
            <div className="text-[#a69584] text-lg mb-2">لا توجد عقارات مفضلة</div>
            <p className="text-[#a69584] text-sm mb-6">
              أضف عقارات إلى مفضلتك لتظهر هنا
            </p>
            <Link
              href="/properties"
              className="inline-block px-6 py-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg font-bold transition-all"
            >
              تصفح العقارات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => handleRemoveFavorite(property.id)}
                  className="absolute top-2 left-2 w-8 h-8 bg-[#e11d48] hover:bg-[#be123c] rounded-full flex items-center justify-center text-[#0e0c0a] transition-all z-10"
                  title="إزالة من المفضلة"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
