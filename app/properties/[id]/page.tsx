'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPropertyById, Property } from '@/services/propertyService';
import { addFavorite, removeFavorite, isFavorite as checkIsFavorite } from '@/services/favoritesService';
import { submitComplaint } from '@/services/complaintService';
import { supabase } from '@/lib/supabase';
import {
  Phone,
  MessageCircle,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Building2,
  User,
  Calendar,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [complaintModal, setComplaintModal] = useState({ open: false, loading: false });

  useEffect(() => {
    fetchProperty();
    fetchUserId();
  }, [id]);

  useEffect(() => {
    if (userId && property) {
      checkFavorite();
    }
  }, [userId, property]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const checkFavorite = async () => {
    if (!userId) return;
    const { isFavorite: fav } = await checkIsFavorite(userId, id);
    setIsFavorite(fav);
  };

  const fetchProperty = async () => {
    setLoading(true);
    const { data, error } = await getPropertyById(id);

    if (error) {
      console.error('Error fetching property:', error);
    } else {
      setProperty(data);
    }
    setLoading(false);
  };

  const handlePreviousImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (property && property.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFavorite = async () => {
    if (!userId) {
      alert('يجب تسجيل الدخول لإضافة العقار للمفضلة');
      return;
    }

    if (isFavorite) {
      const { error } = await removeFavorite(userId, id);
      if (error) {
        console.error('Error removing favorite:', error);
        alert('حدث خطأ أثناء إزالة العقار من المفضلة');
      } else {
        setIsFavorite(false);
      }
    } else {
      const { error } = await addFavorite(userId, id);
      if (error) {
        console.error('Error adding favorite:', error);
        alert('حدث خطأ أثناء إضافة العقار للمفضلة');
      } else {
        setIsFavorite(true);
      }
    }
  };

  const handleComplaintSubmit = async (data: { title: string; description: string }) => {
    if (!userId) {
      alert('يجب تسجيل الدخول لتقديم شكوى');
      return;
    }

    setComplaintModal({ ...complaintModal, loading: true });
    const { error } = await submitComplaint({
      title: data.title,
      description: data.description,
      reporter_id: userId,
      target_type: 'property',
      target_id: id,
    });

    if (error) {
      console.error('Error submitting complaint:', error);
      alert('حدث خطأ أثناء إرسال الشكوى');
    } else {
      alert('تم إرسال الشكوى بنجاح');
      setComplaintModal({ open: false, loading: false });
    }
  };

  const shareProperty = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
        <div className="text-[#a69584] text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
        <div className="text-[#a69584] text-lg">العقار غير موجود</div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    area,
    rooms,
    bathrooms,
    type,
    transaction_type,
    location,
    latitude,
    longitude,
    images,
    broker_name,
    broker_company,
    broker_phone,
    created_at,
  } = property;

  const propertyImages = images && images.length > 0 ? images : ['/placeholder-property.jpg'];
  const currentImage = propertyImages[currentImageIndex];
  const whatsappMessage = encodeURIComponent(`مرحباً، أريد الاستفسار عن العقار: ${title}`);
  const whatsappUrl = `https://wa.me/${broker_phone || ''}?text=${whatsappMessage}`;

  const typeLabels = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    commercial: 'تجاري',
    building: 'عمارة',
  };

  const transactionLabels = {
    sale: 'للبيع',
    rent: 'للإيجار',
  };

  // Google Maps static image (or use dynamic map with Leaflet)
  const mapImageUrl = latitude && longitude
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:0xdfba7a%7C${latitude},${longitude}&key=YOUR_API_KEY`
    : null;

  return (
    <div className="min-h-screen bg-[#0e0c0a]">
      {/* معرض الصور */}
      <div className="relative h-[50vh] md:h-[60vh] bg-[#1a1613]">
        <Image
          src={currentImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        {/* أزرار التنقل بين الصور */}
        {propertyImages.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0e0c0a]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#f2e8df] hover:bg-[#dfba7a] hover:text-[#0e0c0a] transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0e0c0a]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#f2e8df] hover:bg-[#dfba7a] hover:text-[#0e0c0a] transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* شارات المعلومات */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              transaction_type === 'sale'
                ? 'bg-[#dfba7a] text-[#0e0c0a]'
                : 'bg-[#a69584] text-[#0e0c0a]'
            }`}
          >
            {transactionLabels[transaction_type]}
          </div>
          <div className="px-4 py-2 rounded-full bg-[#0e0c0a]/80 backdrop-blur-sm text-[#dfba7a] text-sm font-bold border border-[#dfba7a]/30">
            {typeLabels[type]}
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-[#dfba7a] text-[#0e0c0a]'
                : 'bg-[#0e0c0a]/80 backdrop-blur-sm text-[#f2e8df] hover:bg-[#dfba7a] hover:text-[#0e0c0a]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={shareProperty}
            className="w-10 h-10 bg-[#0e0c0a]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#f2e8df] hover:bg-[#dfba7a] hover:text-[#0e0c0a] transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setComplaintModal({ ...complaintModal, open: true })}
            className="w-10 h-10 bg-[#0e0c0a]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#e11d48] hover:bg-[#e11d48] hover:text-[#0e0c0a] transition-all"
            title="الإبلاغ عن مخالفة"
          >
            <AlertTriangle className="w-5 h-5" />
          </button>
        </div>

        {/* مؤشر الصور */}
        {propertyImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {propertyImages.map((_, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-[#dfba7a] w-6' : 'bg-[#a69584]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* العنوان والسعر */}
            <div>
              <h1 className="text-[#f2e8df] text-3xl font-bold mb-4">{title}</h1>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[#dfba7a] text-4xl font-bold font-price">
                  {price.toLocaleString('ar-EG')}
                </span>
                <span className="text-[#a69584] text-lg">
                  {transaction_type === 'sale' ? 'جنيه' : 'جنيه / شهرياً'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#a69584]">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{location}</span>
              </div>
            </div>

            {/* المواصفات */}
            <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
              <h2 className="text-[#f2e8df] text-xl font-bold mb-4">المواصفات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[#0e0c0a] rounded-lg">
                  <Maximize className="w-6 h-6 text-[#dfba7a]" />
                  <div>
                    <div className="text-[#f2e8df] text-xl font-bold">{area}م²</div>
                    <div className="text-[#a69584] text-sm">المساحة</div>
                  </div>
                </div>
                {rooms > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-[#0e0c0a] rounded-lg">
                    <Bed className="w-6 h-6 text-[#dfba7a]" />
                    <div>
                      <div className="text-[#f2e8df] text-xl font-bold">{rooms}</div>
                      <div className="text-[#a69584] text-sm">غرف نوم</div>
                    </div>
                  </div>
                )}
                {bathrooms > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-[#0e0c0a] rounded-lg">
                    <Bath className="w-6 h-6 text-[#dfba7a]" />
                    <div>
                      <div className="text-[#f2e8df] text-xl font-bold">{bathrooms}</div>
                      <div className="text-[#a69584] text-sm">حمام</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-[#0e0c0a] rounded-lg">
                  <Building2 className="w-6 h-6 text-[#dfba7a]" />
                  <div>
                    <div className="text-[#f2e8df] text-xl font-bold">{typeLabels[type]}</div>
                    <div className="text-[#a69584] text-sm">النوع</div>
                  </div>
                </div>
              </div>
            </div>

            {/* الوصف */}
            <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
              <h2 className="text-[#f2e8df] text-xl font-bold mb-4">الوصف</h2>
              <p className="text-[#a69584] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* الموقع */}
            {(latitude && longitude) && (
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
                <h2 className="text-[#f2e8df] text-xl font-bold mb-4">الموقع</h2>
                <div className="relative h-64 bg-[#0e0c0a] rounded-lg overflow-hidden">
                  {mapImageUrl ? (
                    <Image
                      src={mapImageUrl}
                      alt="الموقع على الخريطة"
                      fill
                      className="object-cover"
                      sizes="100%"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#a69584]">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-2" />
                        <p>{location}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#dfba7a] hover:underline mt-2 inline-block"
                        >
                          عرض على Google Maps
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* معرض الصور المصغر */}
            {propertyImages.length > 1 && (
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
                <h2 className="text-[#f2e8df] text-xl font-bold mb-4">الصور</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {propertyImages.map((image, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-[#dfba7a]'
                          : 'border-transparent hover:border-[#dfba7a]/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${title} - صورة ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 25vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* معلومات الوسيط */}
            {(broker_name || broker_company) && (
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 sticky top-4">
                <h2 className="text-[#f2e8df] text-xl font-bold mb-4">معلومات الوسيط</h2>
                <div className="space-y-4">
                  {broker_name && (
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#dfba7a]" />
                      <div>
                        <div className="text-[#a69584] text-sm">الاسم</div>
                        <div className="text-[#f2e8df] font-semibold">{broker_name}</div>
                      </div>
                    </div>
                  )}
                  {broker_company && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#dfba7a]" />
                      <div>
                        <div className="text-[#a69584] text-sm">الشركة</div>
                        <div className="text-[#f2e8df] font-semibold">{broker_company}</div>
                      </div>
                    </div>
                  )}
                  {created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#dfba7a]" />
                      <div>
                        <div className="text-[#a69584] text-sm">تاريخ الإضافة</div>
                        <div className="text-[#f2e8df] font-semibold">
                          {new Date(created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* أزرار التواصل */}
                {broker_phone && (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-[#2d2722]/60">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-3 rounded-lg transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      واتساب
                    </a>
                    <a
                      href={`tel:${broker_phone}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-[#dfba7a] text-[#dfba7a] hover:bg-[#dfba7a]/10 font-bold py-3 rounded-lg transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      اتصال
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* زر العودة */}
            <Link
              href="/properties"
              className="block w-full text-center py-3 bg-[#1a1613] border border-[#2d2722] text-[#f2e8df] rounded-lg hover:border-[#dfba7a] hover:text-[#dfba7a] transition-all"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>
      </div>

      {/* نافذة الشكوى */}
      {complaintModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e11d48]/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#e11d48]" />
                </div>
                <h2 className="text-[#f2e8df] text-xl font-bold">الإبلاغ عن مخالفة</h2>
              </div>
              <button
                onClick={() => setComplaintModal({ ...complaintModal, open: false })}
                className="w-8 h-8 bg-[#0e0c0a] border border-[#2d2722] rounded-lg flex items-center justify-center text-[#a69584] hover:border-[#dfba7a] hover:text-[#dfba7a] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[#a69584] text-sm font-semibold mb-2">
                  عنوان الشكوى *
                </label>
                <input
                  type="text"
                  placeholder="مثال: معلومات غير صحيحة"
                  className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#a69584] text-sm font-semibold mb-2">
                  تفاصيل الشكوى *
                </label>
                <textarea
                  placeholder="اكتب تفاصيل الشكوى بالتفصيل..."
                  className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>

              <div className="bg-[#e11d48]/10 border border-[#e11d48]/30 rounded-lg p-3">
                <p className="text-[#e11d48] text-xs">
                  ⚠️ تقديم شكوى كاذبة قد يؤدي إلى إيقاف حسابك
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setComplaintModal({ ...complaintModal, open: false })}
                  className="flex-1 bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] font-bold py-2.5 rounded-lg hover:border-[#dfba7a] transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => alert('سيتم تنفيذ هذه الميزة بعد ربطها بالخدمة')}
                  className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all"
                >
                  إرسال الشكوى
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
