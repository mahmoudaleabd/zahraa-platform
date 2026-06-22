'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBusinessById, BusinessWithMenu } from '@/services/businessService';
import { getBusinessReviews, getBusinessAverageRating, addBusinessReview } from '@/services/reviewService';
import { submitComplaint } from '@/services/complaintService';
import { useCartStore } from '@/store/useCartStore';
import MenuItemComponent from '@/components/features/MenuItem';
import RatingStars from '@/components/features/RatingStars';
import ReviewForm from '@/components/features/ReviewForm';
import { supabase } from '@/lib/supabase';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Building2,
  ShoppingCart,
  ChevronLeft,
  Star,
  Share2,
  AlertTriangle,
  X,
} from 'lucide-react';

export default function BusinessDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [business, setBusiness] = useState<BusinessWithMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [userId, setUserId] = useState<string | null>(null);

  const { items, totalPrice, totalItems, clearCart } = useCartStore();

  useEffect(() => {
    fetchBusiness();
    fetchUserId();
  }, [id]);

  useEffect(() => {
    if (business) {
      fetchReviews();
    }
  }, [business]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }
  };

  const fetchReviews = async () => {
    const [reviewsResult, ratingResult] = await Promise.all([
      getBusinessReviews(id),
      getBusinessAverageRating(id),
    ]);

    if (reviewsResult.data) {
      setReviews(reviewsResult.data);
    }
    if (ratingResult) {
      setAverageRating(ratingResult);
    }
  };

  const fetchBusiness = async () => {
    setLoading(true);
    const { data, error } = await getBusinessById(id);

    if (error) {
      console.error('Error fetching business:', error);
    } else {
      setBusiness(data);
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!userId) {
      alert('يجب تسجيل الدخول لإضافة تقييم');
      return;
    }

    const { error } = await addBusinessReview({
      business_id: id,
      user_id: userId,
      rating,
      comment,
    });

    if (error) {
      console.error('Error adding review:', error);
      alert('حدث خطأ أثناء إضافة التقييم');
    } else {
      alert('تم إضافة التقييم بنجاح');
      setShowReviewForm(false);
      fetchReviews();
    }
  };

  const handleComplaintSubmit = async (data: { title: string; description: string }) => {
    if (!userId) {
      alert('يجب تسجيل الدخول لتقديم شكوى');
      return;
    }

    const { error } = await submitComplaint({
      title: data.title,
      description: data.description,
      reporter_id: userId,
      target_type: 'business',
      target_id: id,
    });

    if (error) {
      console.error('Error submitting complaint:', error);
      alert('حدث خطأ أثناء إرسال الشكوى');
    } else {
      alert('تم إرسال الشكوى بنجاح');
      setShowComplaintModal(false);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: business?.name,
          text: business?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const categoryLabels = {
    medical: 'طبي',
    grocery: 'تموين',
    restaurant: 'مطاعم',
    cafe: 'كافيهات',
    craftsman: 'حرفيون',
    other: 'أخرى',
  };

  // تجميع المنيو حسب التصنيف
  const menuByCategory = business?.menu_items?.reduce((acc, item) => {
    const category = item.category || 'أخرى';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof business.menu_items>) || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
        <div className="text-[#a69584] text-lg">جاري التحميل...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
        <div className="text-[#a69584] text-lg">العمل غير موجود</div>
      </div>
    );
  }

  const {
    name,
    description,
    category,
    logo,
    phone,
    address,
    location,
    latitude,
    longitude,
    working_hours,
    website,
    featured,
  } = business;

  const whatsappMessage = encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${name}`);
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

  const mapImageUrl = latitude && longitude
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:0xdfba7a%7C${latitude},${longitude}&key=YOUR_API_KEY`
    : null;

  const isRestaurant = category === 'restaurant' || category === 'cafe';

  return (
    <div className="min-h-screen bg-[#0e0c0a] pb-24">
      {/* الهيدر */}
      <div className="bg-[#1a1613] border-b border-[#2d2722]">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/businesses"
            className="inline-flex items-center gap-2 text-[#a69584] hover:text-[#dfba7a] mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            العودة للقائمة
          </Link>

          <div className="flex items-start gap-6">
            {/* الشعار */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-[#0e0c0a] rounded-xl overflow-hidden border border-[#2d2722]">
              {logo ? (
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Building2 className="w-12 h-12 text-[#a69584]" />
                </div>
              )}
            </div>

            {/* المعلومات الأساسية */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-[#f2e8df] text-2xl font-bold mb-1">{name}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-[#dfba7a] text-sm font-semibold">
                      {categoryLabels[category]}
                    </span>
                    {featured && (
                      <div className="flex items-center gap-1 text-[#dfba7a] text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        مميز
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-[#0e0c0a] border border-[#2d2722] rounded-lg flex items-center justify-center text-[#a69584] hover:border-[#dfba7a] hover:text-[#dfba7a] transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[#a69584] text-sm mb-4 line-clamp-2">{description}</p>

              {/* معلومات الاتصال */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-[#a69584]">
                  <Phone className="w-4 h-4" />
                  <span>{phone}</span>
                </div>
                {working_hours && (
                  <div className="flex items-center gap-2 text-[#a69584]">
                    <Clock className="w-4 h-4" />
                    <span>{working_hours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-8">
            {/* الموقع */}
            <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
              <h2 className="text-[#f2e8df] text-xl font-bold mb-4">الموقع</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[#dfba7a] flex-shrink-0 mt-0.5" />
                <span className="text-[#a69584]">{address}</span>
              </div>
              {(latitude && longitude) && (
                <div className="relative h-48 bg-[#0e0c0a] rounded-lg overflow-hidden">
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
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#dfba7a] hover:underline"
                      >
                        عرض على Google Maps
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* المنيو (للمطاعم والكافيهات) */}
            {isRestaurant && Object.keys(menuByCategory).length > 0 && (
              <div className="space-y-6">
                <h2 className="text-[#f2e8df] text-2xl font-bold">المنيو</h2>
                {Object.entries(menuByCategory).map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <h3 className="text-[#dfba7a] text-lg font-bold mb-4">{categoryName}</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <MenuItemComponent
                          key={item.id}
                          item={item}
                          businessId={id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* قسم التقييمات */}
            <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#f2e8df] text-2xl font-bold">التقييمات</h2>
                <RatingStars rating={averageRating.average} count={averageRating.count} />
              </div>

              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all mb-4"
                >
                  إضافة تقييم
                </button>
              ) : (
                <div className="mb-4">
                  <ReviewForm
                    onSubmit={handleReviewSubmit}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-[#a69584]">
                    لا توجد تقييمات بعد
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-[#0e0c0a] border border-[#2d2722] rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#dfba7a]/10 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-[#dfba7a]" />
                          </div>
                          <span className="text-[#f2e8df] font-semibold">
                            {review.user_name || 'مستخدم'}
                          </span>
                        </div>
                        <RatingStars rating={review.rating} showCount={false} size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-[#a69584] text-sm">{review.comment}</p>
                      )}
                      <div className="text-[#a69584] text-xs mt-2">
                        {new Date(review.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* معلومات إضافية */}
            {website && (
              <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6">
                <h2 className="text-[#f2e8df] text-xl font-bold mb-4">الموقع الإلكتروني</h2>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#dfba7a] hover:underline"
                >
                  {website}
                </a>
              </div>
            )}
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* أزرار التواصل */}
            <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#f2e8df] text-xl font-bold">تواصل معنا</h2>
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="flex items-center gap-2 text-[#e11d48] hover:text-[#be123c] text-sm transition-colors"
                  title="الإبلاغ عن مخالفة"
                >
                  <AlertTriangle className="w-4 h-4" />
                  إبلاغ
                </button>
              </div>
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-3 rounded-lg transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  واتساب
                </a>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2 w-full border border-[#dfba7a] text-[#dfba7a] hover:bg-[#dfba7a]/10 font-bold py-3 rounded-lg transition-all"
                >
                  <Phone className="w-5 h-5" />
                  اتصال
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* سلة المشتريات العائمة */}
      {isRestaurant && totalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#1a1613] border border-[#2d2722] rounded-xl shadow-2xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#dfba7a]" />
                <span className="text-[#f2e8df] font-bold">السلة</span>
                <span className="bg-[#dfba7a] text-[#0e0c0a] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems()}
                </span>
              </div>
              <button
                onClick={() => setShowCart(!showCart)}
                className="text-[#a69584] hover:text-[#dfba7a] text-sm"
              >
                {showCart ? 'إخفاء' : 'عرض'}
              </button>
            </div>

            {showCart && (
              <>
                <div className="max-h-48 overflow-y-auto space-y-2 mb-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-[#0e0c0a] rounded-lg p-2"
                    >
                      <div className="flex-1">
                        <div className="text-[#f2e8df] text-sm font-semibold">
                          {item.name}
                        </div>
                        <div className="text-[#a69584] text-xs">
                          {item.price.toLocaleString('ar-EG')} ج.م × {item.quantity}
                        </div>
                      </div>
                      <div className="text-[#dfba7a] font-bold text-sm">
                        {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#2d2722]/60">
                  <div className="text-[#f2e8df] font-bold">
                    المجموع: {totalPrice().toLocaleString('ar-EG')} ج.م
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={clearCart}
                      className="px-3 py-1.5 text-[#a69584] hover:text-[#e11d48] text-sm transition-colors"
                    >
                      إفراغ
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg text-sm font-bold transition-all"
                    >
                      طلب عبر واتساب
                    </a>
                  </div>
                </div>
              </>
            )}

            {!showCart && (
              <div className="flex items-center justify-between">
                <div className="text-[#f2e8df] font-bold">
                  المجموع: {totalPrice().toLocaleString('ar-EG')} ج.م
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg text-sm font-bold transition-all"
                >
                  إتمام الطلب
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نافذة الشكوى */}
      {showComplaintModal && (
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
                onClick={() => setShowComplaintModal(false)}
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
                  onClick={() => setShowComplaintModal(false)}
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
