'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/shared/PropertyCard';
import { getProperties, PropertyFilters, Property } from '@/services/propertyService';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // فلاتر البحث
  const [filters, setFilters] = useState<PropertyFilters>({
    type: undefined,
    transaction_type: undefined,
    min_price: undefined,
    max_price: undefined,
    min_area: undefined,
    max_area: undefined,
    min_rooms: undefined,
    max_rooms: undefined,
    search: '',
  });

  const itemsPerPage = 12;

  // جلب العقارات عند تغيير الفلاتر أو الصفحة
  useEffect(() => {
    fetchProperties();
  }, [filters, currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, count, error } = await getProperties(filters, {
      page: currentPage,
      limit: itemsPerPage,
    });

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلاتر
  };

  const clearFilters = () => {
    setFilters({
      type: undefined,
      transaction_type: undefined,
      min_price: undefined,
      max_price: undefined,
      min_area: undefined,
      max_area: undefined,
      min_rooms: undefined,
      max_rooms: undefined,
      search: '',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#0e0c0a]">
      {/* الهيدر */}
      <div className="bg-[#1a1613] border-b border-[#2d2722]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-[#f2e8df] text-3xl font-bold mb-4">سوق العقارات</h1>
          
          {/* شريط البحث */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a69584] w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن عقار..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg pr-10 pl-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg font-bold transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">الفلاتر</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#0e0c0a] rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* الشريط الجانبي للفلاتر */}
          {showFilters && (
            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[#f2e8df] text-lg font-bold">الفلاتر</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-[#dfba7a] text-sm hover:underline"
                    >
                      مسح الكل
                    </button>
                  )}
                </div>

                {/* نوع العقار */}
                <div className="mb-6">
                  <label className="block text-[#a69584] text-sm font-semibold mb-3">
                    نوع العقار
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'apartment', label: 'شقة' },
                      { value: 'villa', label: 'فيلا' },
                      { value: 'land', label: 'أرض' },
                      { value: 'commercial', label: 'تجاري' },
                      { value: 'building', label: 'عمارة' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="type"
                          value={option.value}
                          checked={filters.type === option.value}
                          onChange={(e) =>
                            handleFilterChange(
                              'type',
                              e.target.checked ? option.value : undefined
                            )
                          }
                          className="w-4 h-4 accent-[#dfba7a]"
                        />
                        <span className="text-[#f2e8df] group-hover:text-[#dfba7a] transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* نوع المعاملة */}
                <div className="mb-6">
                  <label className="block text-[#a69584] text-sm font-semibold mb-3">
                    نوع المعاملة
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'sale', label: 'بيع' },
                      { value: 'rent', label: 'إيجار' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleFilterChange(
                            'transaction_type',
                            filters.transaction_type === option.value
                              ? undefined
                              : option.value
                          )
                        }
                        className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                          filters.transaction_type === option.value
                            ? 'bg-[#dfba7a] text-[#0e0c0a]'
                            : 'bg-[#0e0c0a] border border-[#2d2722] text-[#a69584] hover:border-[#dfba7a]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* نطاق السعر */}
                <div className="mb-6">
                  <label className="block text-[#a69584] text-sm font-semibold mb-3">
                    نطاق السعر (جنيه)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="من"
                        value={filters.min_price || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'min_price',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="إلى"
                        value={filters.max_price || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'max_price',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* نطاق المساحة */}
                <div className="mb-6">
                  <label className="block text-[#a69584] text-sm font-semibold mb-3">
                    نطاق المساحة (متر مربع)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="من"
                        value={filters.min_area || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'min_area',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="إلى"
                        value={filters.max_area || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'max_area',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* عدد الغرف */}
                <div className="mb-6">
                  <label className="block text-[#a69584] text-sm font-semibold mb-3">
                    عدد الغرف
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="من"
                        value={filters.min_rooms || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'min_rooms',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="إلى"
                        value={filters.max_rooms || ''}
                        onChange={(e) =>
                          handleFilterChange(
                            'max_rooms',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-3 py-2 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* شبكة العقارات */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-[#a69584]">جاري التحميل...</div>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-12 text-center">
                <div className="text-[#a69584] text-lg mb-4">لا توجد عقارات مطابقة للفلاتر</div>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg font-bold transition-colors"
                >
                  مسح الفلاتر
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* الترقيم */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-[#1a1613] border border-[#2d2722] text-[#f2e8df] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#dfba7a] transition-colors"
                    >
                      السابق
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                          currentPage === page
                            ? 'bg-[#dfba7a] text-[#0e0c0a]'
                            : 'bg-[#1a1613] border border-[#2d2722] text-[#f2e8df] hover:border-[#dfba7a]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-[#1a1613] border border-[#2d2722] text-[#f2e8df] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#dfba7a] transition-colors"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
