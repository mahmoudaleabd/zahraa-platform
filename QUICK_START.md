# 🚀 نظام المصادقة - دليل التشغيل السريع

## ✅ قائمة الملفات المُنشأة

### مجلدات
```
lib/supabase/          - تهيئة Supabase
store/                 - Zustand store (موجود)
components/            - مكونات React
app/auth/              - صفحات المصادقة
app/dashboard/         - لوحة التحكم
app/admin/             - لوحة الإدارة
supabase/              - ملفات قاعدة البيانات
```

### الملفات الأساسية
- ✅ `lib/supabase/client.ts` - عميل للمتصفح
- ✅ `lib/supabase/server.ts` - عميل للخادم
- ✅ `lib/auth.utils.ts` - دوال مساعدة
- ✅ `store/useAuthStore.ts` - متجر الحالة
- ✅ `components/AuthProvider.tsx` - مزود المصادقة

### صفحات المصادقة
- ✅ `app/auth/login/page.tsx` - صفحة تسجيل الدخول
- ✅ `app/auth/verify/page.tsx` - صفحة التحقق من OTP
- ✅ `app/auth/register/page.tsx` - صفحة التسجيل
- ✅ `app/auth/callback/page.tsx` - معالج Google OAuth

### صفحات التطبيق
- ✅ `app/page.tsx` - الصفحة الرئيسية (محدثة)
- ✅ `app/dashboard/page.tsx` - لوحة التحكم
- ✅ `app/admin/page.tsx` - لوحة الإدارة
- ✅ `app/layout.tsx` - التخطيط الرئيسي (محدث)

### الحماية
- ✅ `middleware.ts` - حماية المسارات
- ✅ `supabase/sync_users.sql` - مزامنة المستخدمين

---

## 🔧 خطوات التشغيل

### 1️⃣ تثبيت المكتبات المطلوبة

تأكد من تثبيت جميع المكتبات:

```bash
npm install
```

المكتبات المطلوبة:
- `@supabase/supabase-js` - عميل Supabase
- `zustand` - إدارة الحالة
- `next` - إطار العمل
- `react` - مكتبة React

### 2️⃣ إعداد متغيرات البيئة

تم إنشاء ملف `.env.local.example`، قم بـ:

```bash
# نسخ الملف
cp .env.local.example .env.local

# تحرير الملف وإضافة البيانات
```

أضف البيانات الصحيحة:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

احصل على هذه البيانات من:
- 🔗 [لوحة تحكم Supabase](https://supabase.com/dashboard)
- Settings → API → Copy the keys

### 3️⃣ إعداد Supabase

#### أ) فعّل Phone OTP

1. انتقل إلى **Authentication → Providers**
2. ابحث عن **Phone** وفعّله
3. اختر مزود الخدمة (مثل Twilio)
4. أدخل بيانات اعتماد Twilio

#### ب) فعّل Google OAuth

1. انتقل إلى **Authentication → Providers**
2. ابحث عن **Google** وفعّله
3. أدخل Google OAuth Credentials (Client ID و Secret)
4. أضف Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

#### ج) تشغيل SQL Trigger

1. انتقل إلى **SQL Editor**
2. انسخ محتوى `supabase/sync_users.sql`
3. الصقه في SQL Editor
4. اضغط **Run**

### 4️⃣ تشغيل التطبيق

```bash
npm run dev
```

افتح المتصفح على `http://localhost:3000`

---

## 🗺️ خريطة المسارات

### المسارات العامة (بدون تسجيل دخول)
- `/` - الصفحة الرئيسية
- `/auth/login` - تسجيل الدخول
- `/auth/register` - التسجيل
- `/auth/verify` - التحقق من OTP
- `/auth/callback` - معالج Google

### المسارات المحمية (تتطلب تسجيل دخول)
- `/dashboard` - لوحة التحكم الرئيسية
- `/admin` - لوحة التحكم الإدارية

---

## 📱 تسارع الاختبار

### اختبار تسجيل الدخول برقم الهاتف

1. افتح `http://localhost:3000/auth/login`
2. أدخل رقم هاتف مصري صحيح: `201012345678` أو `+20 10 1234 5678`
3. اضغط "إرسال كود التفعيل"
4. سيتم إرسال كود OTP (في بيئة الاختبار قد تكون قيمة وهمية)
5. قم بإدخال الكود في صفحة التحقق
6. سيتم توجيهك إلى `/dashboard`

### اختبار تسجيل الدخول عبر Google

1. اضغط زر "الدخول عبر Google"
2. قم بتسجيل الدخول إلى حساب Google
3. سيتم إعادة توجيهك إلى `/auth/callback`
4. ثم يتم توجيهك إلى `/dashboard`

### اختبار الحماية

1. حاول الوصول إلى `http://localhost:3000/dashboard` بدون تسجيل دخول
2. سيتم إعادة توجيهك تلقائياً إلى `/auth/login`

---

## 🎨 التخصيص

### الألوان المستخدمة

من `tailwind.config.ts`:

```typescript
charcoal: {
  deep: '#0e0c0a',      // الخلفية الرئيسية
  card: '#1a1613',      // خلفية البطاقات
  border: '#2d2722',    // الحدود
}
gold: {
  primary: '#dfba7a',   // اللون الذهبي الرئيسي
  hover: '#cda767',     // الـ Hover
}
beige: {
  snow: '#f2e8df',      // النصوص الرئيسية
  gray: '#a69584',      // النصوص الثانوية
}
```

### تغيير الرسائل والنصوص

جميع الرسائل موجودة في الصفحات:
- `app/auth/login/page.tsx`
- `app/auth/verify/page.tsx`
- `app/auth/register/page.tsx`

---

## 🐛 استكشاف الأخطاء

### خطأ: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**السبب:** متغيرات البيئة غير معرفة

**الحل:**
1. تأكد من إنشاء `.env.local`
2. تحقق من أن متغيرات البيئة صحيحة
3. أعد تشغيل `npm run dev`

### خطأ: "Phone OTP is not enabled"
**السبب:** Phone OTP غير مفعّل في Supabase

**الحل:**
1. انتقل إلى Supabase → Authentication → Providers
2. فعّل Phone
3. أضف بيانات اعتماد Twilio

### خطأ: "Failed to verify OTP"
**السبب:** الكود المدخل غير صحيح

**الحل:**
1. تأكد من إدخال الكود الصحيح بالكامل
2. تأكد من عدم انتهاء صلاحية الكود (عادة 10 دقائق)
3. اطلب إعادة إرسال الكود

### الجلسة لا تستمر بعد إعادة تحميل الصفحة
**السبب:** localStorage معطل أو قد يكون هناك مشكلة في Zustand

**الحل:**
1. امسح localStorage: `localStorage.clear()`
2. أعد تحميل الصفحة
3. سجّل الدخول مرة أخرى

---

## 📚 المراجع

- [توثيق Supabase](https://supabase.com/docs)
- [توثيق Zustand](https://zustand-demo.vercel.app/)
- [توثيق Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎯 الخطوات التالية المقترحة

بعد التشغيل الناجح، يمكنك:

1. **إضافة صفحة "نسيت كلمة المرور"**
   - `app/auth/forgot-password/page.tsx`

2. **إضافة صفحة ملف المستخدم**
   - `app/profile/page.tsx`
   - تحديث البيانات الشخصية

3. **إضافة صور الملف الشخصي**
   - تحميل الصور إلى Supabase Storage

4. **إضافة إشعارات**
   - استخدام مكتبة مثل `react-hot-toast`

5. **إضافة تحقق من البريد الإلكتروني**
   - Email verification على التسجيل

6. **إضافة Two-Factor Authentication (2FA)**
   - تفعيل إضافي للأمان

---

## ✨ نصائح للإنتاج

### قبل الإطلاق:

1. ✅ تحديث جميع متغيرات البيئة بـ production values
2. ✅ تفعيل HTTPS على النطاق الخاص بك
3. ✅ تحديث Redirect URLs في Google OAuth
4. ✅ تفعيل RLS على جميع الجداول
5. ✅ إضافة سياسات الأمان (CORS, CSP)
6. ✅ اختبار جميع المسارات والميزات
7. ✅ إضافة رصد الأخطاء (مثل Sentry)
8. ✅ إضافة تحليلات (مثل Google Analytics)

---

**تم إنشاء نظام المصادقة بنجاح! 🎉**

للمزيد من التفاصيل، راجع `AUTH_SETUP_GUIDE.md`
