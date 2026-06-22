'use client';

import { useState, useEffect } from 'react';
import BusinessCard from '@/components/shared/BusinessCard';
import { getBusinesses, searchBusinesses, Business } from '@/services/businessService';
import { Search, Stethoscope, ShoppingBag, Utensils, Coffee, Wrench, Grid3x3 } from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Business['category'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'الكل', icon: Grid3x3 },
    { id: 'medical', label: 'طبي', icon: Stethoscope },
    { id: 'grocery', label: 'تموين', icon: ShoppingBag },
    { id: 'restaurant', label: 'مطاعم', icon: Utensils },
    { id: 'cafe', label: 'كافيهات', icon: Coffee },
    { id: 'craftsman', label: 'حرفيون', icon: Wrench },
    { id: 'other', label: 'أخرى', icon: Grid3x3 },
  ] as const;

  useEffect(() => {
    fetchBusinesses();
  }, [activeCategory, searchTerm]);

  const fetchBusinesses = async () => {
    setLoading(true);
    let result;

    if (searchTerm) {
      result = await searchBusinesses(searchTerm);
    } else if (activeCategory === 'all') {
      result = await getBusinesses();
    } else {
      result = await getBusinesses(activeCategory);
    }

    if (result.error) {
      console.error('Error fetching businesses:', result.error);
    } else {
      setBusinesses(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0e0c0a]">
      {/* الهيدر */}
      <div className="bg-[#1a1613] border-b border-[#2d2722]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-[#f2e8df] text-3xl font-bold mb-4">دليل الخدمات والأعمال</h1>
          
          {/* شريط البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a69584] w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن خدمة أو عمل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg pr-10 pl-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* تبويبات التصنيفات */}
        <div className="mb-8">
          <div className="flex p-1 bg-black border border-[#dfba7a] rounded-full max-w-2xl mx-auto overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id as any);
                    setSearchTerm('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-[#dfba7a] text-[#0e0c0a]'
                      : 'text-[#dfba7a] hover:bg-[#dfba7a]/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* شبكة الأعمال */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#a69584]">جاري التحميل...</div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-12 text-center">
            <div className="text-[#a69584] text-lg mb-4">لا توجد أعمال مطابقة</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
