# نظام المصادقة الكامل - دليل التثبيت والاستخدام

## 📋 الملفات المُنشأة

### 1. **Supabase Client Setup**
- `lib/supabase/client.ts` - تهيئة عميل Supabase للمتصفح
- `lib/supabase/server.ts` - تهيئة عميل Supabase للخادم

### 2. **State Management**
- `store/useAuthStore.ts` - متجر Zustand مع Persist middleware

### 3. **صفحات المصادقة**
- `app/auth/login/page.tsx` - صفحة تسجيل الدخول برقم الهاتف
- `app/auth/verify/page.tsx` - صفحة التحقق من OTP
- `app/auth/callback/page.tsx` - معالج رد الاتصال Google OAuth

### 4. **الصفحات المحمية**
- `app/dashboard/page.tsx` - لوحة التحكم الرئيسية
- `app/admin/page.tsx` - لوحة التحكم الإدارية

### 5. **Components**
- `components/AuthProvider.tsx` - مزود المصادقة الذي يتحقق من الجلسة

### 6. **Middleware & Security**
- `middleware.ts` - حماية المسارات وإعادة التوجيه

### 7. **Database**
- `supabase/sync_users.sql` - Trigger لمزامنة المستخدمين

---

## 🚀 خطوات التثبيت

### 1. إعداد متغيرات البيئة

قم بإنشاء ملف `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

احصل على هذه المفاتيح من لوحة تحكم Supabase:
- انتقل إلى `Project Settings → API`
- انسخ `URL` و `anon key`
- انسخ `service_role key`

### 2. تثبيت Supabase CLI وتهيئة قاعدة البيانات

```bash
npm install -g supabase
supabase link --project-id your-project-id
supabase db push
```

### 3. تشغيل SQL Trigger

قم بتشغيل الكود الموجود في `supabase/sync_users.sql` في SQL Editor في لوحة تحكم Supabase:

- انتقل إلى `SQL Editor` في لوحة تحكم Supabase
- انسخ محتوى `supabase/sync_users.sql`
- اضغط `Run`

### 4. إعداد المصادقة برقم الهاتف (Phone OTP)

في لوحة تحكم Supabase:
1. انتقل إلى `Authentication → Providers`
2. فعّل `Phone`
3. اختر مزود الخدمة (مثل Twilio)
4. أدخل بيانات الاعتماد الخاصة بك

### 5. إعداد Google OAuth

في لوحة تحكم Supabase:
1. انتقل إلى `Authentication → Providers`
2. فعّل `Google`
3. أدخل Google OAuth credentials
4. أضف `http://localhost:3000/auth/callback` و `https://yourdomain.com/auth/callback` كـ Redirect URLs

### 6. تثبيت Dependencies

تأكد من أن جميع المكتبات مثبتة:

```bash
npm install @supabase/supabase-js zustand
```

---

## 📱 الميزات الرئيسية

### ✅ تسجيل الدخول برقم الهاتف (OTP)
- إدخال رقم الهاتف المصري
- إرسال كود OTP سداسي الأرقام
- تحقق من الكود وتسجيل الدخول
- دعم إعادة الإرسال بعداد تنازلي

### ✅ تسجيل الدخول عبر Google
- OAuth عبر Google
- ربط تلقائي بـ Supabase
- إنشاء حساب تلقائي

### ✅ إدارة الجلسات الآمنة
- تخزين الـ token في Zustand مع Persist
- التحقق من الجلسة عند تحميل التطبيق
- تسجيل خروج آمن

### ✅ حماية المسارات
- Middleware يحمي `/dashboard` و `/admin`
- إعادة توجيه تلقائية للمستخدمين غير المسجلين
- منع المستخدمين المسجلين من الوصول إلى صفحات المصادقة

### ✅ تجربة المستخدم
- واجهة RTL عربية 100%
- تصميم ذهبي فحمي فاخر
- معالجة الأخطاء الشاملة
- رسائل واضحة وسهلة الفهم

---

## 🔄 تدفق المصادقة

### تسجيل الدخول برقم الهاتف:
```
صفحة تسجيل الدخول
    ↓
إدخال رقم الهاتف
    ↓
إرسال OTP عبر Supabase
    ↓
صفحة التحقق
    ↓
إدخال كود OTP
    ↓
التحقق من الكود
    ↓
حفظ البيانات في Zustand
    ↓
إعادة توجيه إلى Dashboard
```

### تسجيل الدخول عبر Google:
```
صفحة تسجيل الدخول
    ↓
اضغط على زر Google
    ↓
إعادة التوجيه إلى Google
    ↓
التحقق من البيانات
    ↓
إعادة التوجيه إلى /auth/callback
    ↓
حفظ الجلسة
    ↓
إعادة توجيه إلى Dashboard
```

---

## 🛠️ استخدام Auth Store

### الحصول على بيانات المستخدم الحالي

```tsx
import { useAuthStore } from '@/store/useAuthStore';

export default function MyComponent() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <div>جاري التحميل...</div>;

  return <div>مرحباً {user?.user_metadata?.name}</div>;
}
```

### تسجيل الخروج

```tsx
const { logout } = useAuthStore();

const handleLogout = async () => {
  await logout();
  // سيتم حذف جميع بيانات المستخدم والـ token
};
```

### الوصول إلى Supabase Client

```tsx
import { supabase } from '@/lib/supabase/client';

// مثال: جلب البيانات
const { data, error } = await supabase
  .from('users')
  .select('*');
```

---

## 📊 جدول المستخدمين (Database Schema)

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

يتم ملء هذا الجدول تلقائياً عند تسجيل مستخدم جديد من خلال الـ Trigger.

---

## 🔐 Row Level Security (RLS)

- كل مستخدم يمكنه عرض بيانته الخاصة فقط
- كل مستخدم يمكنه تعديل بيانته الخاصة فقط
- الـ Service Role يمكنه الوصول إلى جميع البيانات

---

## 🐛 حل مشاكل شائعة

### مشكلة: "خطأ في تسجيل الدخول عبر Google"
**الحل:**
1. تأكد من إدخال Google OAuth credentials بشكل صحيح
2. تأكد من إضافة Redirect URLs في إعدادات Google و Supabase
3. تأكد من أن `NEXT_PUBLIC_SUPABASE_URL` صحيح

### مشكلة: "لم يتم استلام كود OTP"
**الحل:**
1. تأكد من تفعيل Phone OTP في Supabase
2. تأكد من إعدادات Twilio أو خدمة SMS أخرى
3. تحقق من صيغة رقم الهاتف (يجب أن يكون مصرياً: +20...)

### مشكلة: "الجلسة لا تستمر بعد إعادة التحميل"
**الحل:**
1. تأكد من أن Zustand persist middleware يعمل
2. تحقق من أن localStorage غير معطل في المتصفح
3. تأكد من أن `checkSession()` يتم استدعاؤه في `AuthProvider`

---

## 📦 الملفات الإضافية المُنصح بها

يمكنك إضافة:
- صفحة تسجيل جديد (`app/auth/register/page.tsx`)
- صفحة استعادة كلمة المرور (`app/auth/forgot-password/page.tsx`)
- صفحة ملف المستخدم (`app/profile/page.tsx`)

---

## 🎨 تخصيص التصميم

تم استخدام التصميم الذهبي الفحمي من `tailwind.config.ts`:
- `charcoal-deep`: #0e0c0a (خلفية رئيسية)
- `charcoal-card`: #1a1613 (خلفية البطاقات)
- `gold-primary`: #dfba7a (لون ذهبي رئيسي)
- `beige-snow`: #f2e8df (نصوص رئيسية)

---

## 📞 الدعم والمساعدة

للحصول على المزيد من المعلومات:
- [توثيق Supabase Auth](https://supabase.com/docs/guides/auth)
- [توثيق Zustand](https://zustand-demo.vercel.app/)
- [توثيق Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
