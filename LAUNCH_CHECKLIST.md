# قائمة تحقق الإطلاق (Launch Checklist)

## 📋 متطلبات ما قبل الإطلاق

### متغيرات البيئة
- [ ] جميع متغيرات البيئة مضبوطة في Vercel:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (اختياري)
  - [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` (رقم دعم واتساب)

### قاعدة البيانات (Supabase)
- [ ] سياسات RLS (Row Level Security) مفعلة على جميع الجداول:
  - [ ] `users` table
  - [ ] `properties` table
  - [ ] `businesses` table
  - [ ] `menu_items` table
  - [ ] `favorites` table
  - [ ] `broker_reviews` table
  - [ ] `business_reviews` table
  - [ ] `complaints` table
  - [ ] `notifications` table

### Storage Buckets
- [ ] Storage Buckets منشأة في Supabase:
  - [ ] `property-images` bucket
  - [ ] `business-logos` bucket
  - [ ] `menu-images` bucket
- [ ] سياسات الوصول (Policies) مفعلة لكل bucket:
  - [ ] سياسة القراءة العامة للصور
  - [ ] سياسة الكتابة للمستخدمين المصادقين فقط
  - [ ] حجم الملف محدود (مثلاً: 5MB)
  - [ ] أنواع الملفات المسموحة (jpg, jpeg, png, webp)

### SEO والأداء
- [ ] SEO Metadata مضبوط في جميع الصفحات:
  - [ ] الصفحة الرئيسية
  - [ ] صفحة العقارات
  - [ ] صفحة تفاصيل العقار
  - [ ] صفحة الأعمال
  - [ ] صفحة تفاصيل العمل
  - [ ] صفحة المفضلة
  - [ ] صفحة لوحة التحكم
- [ ] Meta tags مضبوطة (title, description, keywords)
- [ ] Open Graph tags مضبوطة للمشاركة على السوشيال ميديا
- [ ] Sitemap.xml مولد
- [ ] Robots.txt مضبوط

### التحليلات والتتبع
- [ ] Google Analytics مضاف (اختياري):
  - [ ] GA4 Tracking ID مضاف في `.env.local`
  - [ ] Google Analytics script مضاف في `layout.tsx`
- [ ] Facebook Pixel مضاف (اختياري):
  - [ ] Pixel ID مضاف في `.env.local`
  - [ ] Facebook Pixel script مضاف في `layout.tsx`

### التواصل والدعم
- [ ] رقم دعم واتساب مضبوط:
  - [ ] في الهيدر
  - [ ] في الفوتر
  - [ ] في صفحة التواصل
- [ ] نموذج التواصل يعمل بشكل صحيح
- [ ] صفحة "اتصل بنا" منشأة

### الصفحات القانونية
- [ ] سياسة الخصوصية منشأة:
  - [ ] `/privacy-policy` page
  - [ ] روابط في الفوتر
- [ ] شروط الاستخدام منشأة:
  - [ ] `/terms-of-service` page
  - [ ] روابط في الفوتر
- [ ] سياسة ملفات تعريف الارتباط (Cookies Policy) (اختياري)

## 🧪 الاختبار

### اختبار الوظائف
- [ ] تسجيل الدخول يعمل بشكل صحيح
- [ ] تسجيل الخروج يعمل بشكل صحيح
- [ ] إنشاء حساب جديد يعمل
- [ ] إضافة عقار جديد يعمل
- [ ] رفع صور العقار يعمل
- [ ] البحث والفلترة تعمل
- [ ] إضافة عمل جديد يعمل
- [ ] رفع شعار العمل يعمل
- [ ] إضافة منيو للعمل يعمل
- [ ] إضافة للسلة يعمل
- [ ] إرسال طلب عبر واتساب يعمل
- [ ] إضافة للمفضلة يعمل
- [ ] إزالة من المفضلة يعمل
- [ ] إضافة تقييم يعمل
- [ ] إرسال شكوى يعمل

### اختبار الأجهزة
- [ ] الموقع يعمل على الهواتف (Mobile):
  - [ ] iOS Safari
  - [ ] Android Chrome
- [ ] الموقع يعمل على الحواسيب (Desktop):
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] الموقع يعمل على الأجهزة اللوحية (Tablet):
  - [ ] iPad
  - [ ] Android Tablet

### اختبار الأداء
- [ ] Lighthouse Score > 90:
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO
- [ ] وقت التحميل < 3 ثواني
- [ ] الصور مضغوطة ومحسنة

### اختبار الأمان
- [ ] HTTPS يعمل
- [ ] سياسات CSP تعمل بشكل صحيح
- [ ] لا توجد ثغرات XSS
- [ ] لا توجد ثغرات CSRF
- [ ] البيانات الحساسة محمية

## 🚀 ما بعد الإطلاق

### المراقبة
- [ ] Vercel Analytics مفعّل
- [ ] Supabase Logs مراقبة
- [ ] Error tracking (مثل Sentry) مضاف (اختياري)

### النسخ الاحتياطية
- [ ] نسخ احتياطية تلقائية لقاعدة البيانات مفعلة في Supabase
- [ ] نسخ احتياطية للصور في Storage

### الدعم
- [ ] قنوات الدعم جاهزة:
  - [ ] واتساب
  - [ ] إيميل
  - [ ] نموذج التواصل
- [ ] خطة الطوارئ جاهزة (انظر `EMERGENCY_PLAN.md`)

## ✅ التوقيع النهائي

- [ ] جميع العناصر في هذه القائمة مكتملة
- [ ] الموافقة النهائية من الفريق
- [ ] الإطلاق الرسمي
