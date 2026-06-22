# دليل تشغيل منصة زهراء أكتوبر الجديدة (Next.js + Supabase)

مرحباً بك! هذا الملف يحتوي على دليل مبسط خطوة بخطوة لمساعدتك في إعداد وتشغيل موقع "زهراء أكتوبر الجديدة" على جهازك المحلي. تم تصميم هذا الدليل ليكون واضحاً وسهلاً حتى لو لم تكن مبرمجاً محترفاً.

---

## 📋 المتطلبات الأساسية

قبل البدء، يرجى التأكد من تثبيت البرامج التالية على جهازك:
1. **Node.js** (إصدار 18 أو أحدث) - لتشغيل خادم الويب: [تحميل Node.js](https://nodejs.org)
2. **Docker Desktop** - لتشغيل قاعدة البيانات محلياً (اختياري، في حال رغبتك بالتشغيل المحلي بالكامل): [تحميل Docker](https://www.docker.com/products/docker-desktop/)
3. **محرر أكواد** - مثل VS Code لتعديل الملفات إذا رغبت: [تحميل VS Code](https://code.visualstudio.com)

---

## 🚀 الخطوة 1: تثبيت مكتبات المشروع (Dependencies)

1. افتح نافذة محطة الأوامر (Terminal) أو الـ PowerShell في مجلد المشروع الرئيسي.
2. اكتب الأمر التالي لتثبيت كل المكتبات المطلوبة دفعة واحدة:
   ```bash
   npm install
   ```
   *سيقوم هذا الأمر بقراءة ملف `package.json` وتنزيل كافة التبعيات مثل (Next.js, TailwindCSS, Supabase, Zustand).*

---

## 🗄️ الخطوة 2: تشغيل قاعدة البيانات محلياً (Docker)

إذا كنت تريد تشغيل قاعدة البيانات على جهازك مباشرة دون الحاجة لحساب سحابي، يمكنك استخدام Docker.

### الطريقة الأولى: استخدام سوبابيس المحلي (Supabase CLI) - *موصى به*
1. قم بتهيئة سوبابيس في المجلد:
   ```bash
   npx supabase init
   ```
2. قم بتشغيل سوبابيس محلياً (يتطلب تشغيل Docker Desktop):
   ```bash
   npx supabase start
   ```
   *سيقوم هذا الأمر بتحميل حاويات سوبابيس وتشغيلها. في النهاية، ستحصل على روابط الـ Studio و مفاتيح الـ API.*

### الطريقة الثانية: تشغيل قاعدة بيانات Postgres + pgAdmin سريعة
إذا كنت تفضل استخدام حاوية PostgreSQL تقليدية، قم بإنشاء ملف باسم `docker-compose.yml` في المجلد الرئيسي بالبيانات التالية:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: zahraa_october_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_secure_password
      POSTGRES_DB: zahraa_october
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
ثم قم بتشغيلها عبر الأمر:
```bash
docker-compose up -d
```

---

## ⚡ الخطوة 3: تطبيق ملف SQL على قاعدة البيانات

لتجهيز الجداول والسياسات والدوال في قاعدة البيانات:
1. إذا كنت تستخدم **موقع Supabase السحابي** أو **سوبابيس المحلي**:
   - افتح لوحة التحكم الخاصة بمشروعك (سواء السحابية أو المحلية على الرابط `http://localhost:54323`).
   - اذهب إلى قسم **SQL Editor** من القائمة الجانبية.
   - انقر على **New Query** (استعلام جديد).
   - افتح ملف [init_schema.sql](file:///d:/800%20fada%20web/Zahraa%20New%20October%20Website/supabase/init_schema.sql) المتواجد في مجلد `supabase` بالمشروع، واقفل محتواه بالكامل وقم بلصقه في محرر SQL.
   - انقر على زر **Run** في أسفل الصفحة.

*الآن أصبحت الجداول الـ 13، والفهارس، وحاويات الصور (Buckets)، والسياسات الأمنية RLS جاهزة تماماً.*

---

## ⚙️ الخطوة 4: إعداد ملف متغيرات البيئة (Environment Variables)

1. في المجلد الرئيسي للمشروع، ابحث عن ملف يسمى `.env.local.example`.
2. قم بنسخ هذا الملف وتغيير اسمه إلى `.env.local`.
3. افتح الملف وقم بتغيير القيم بالروابط والمفاتيح الخاصة بمشروعك:
   - `NEXT_PUBLIC_SUPABASE_URL`: رابط مشروع سوبابيس الخاص بك.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: مفتاح الوصول العام (Anon Key).

---

## 💻 الخطوة 5: تشغيل المشروع في بيئة التطوير

لتشغيل الموقع وتصفحه على متصفحك:
1. اكتب الأمر التالي في محطة الأوامر:
   ```bash
   npm run dev
   ```
2. افتح المتصفح واذهب إلى الرابط:
   ```
   http://localhost:3000
   ```

*مبروك! الموقع الآن يعمل في بيئة التطوير المحلية ويطبق ألوان "الذهبي الفحمي" الفخمة مع دعم كامل للاتجاه العربي RTL.*

---

## 🛠️ الأوامر السريعة المتاحة

- `npm run dev` - تشغيل خادم التطوير المحلي.
- `npm run build` - بناء نسخة الإنتاج وفحص الأخطاء البرمجية.
- `npm run start` - تشغيل نسخة الإنتاج التي تم بناؤها.
- `npm run lint` - فحص كود المشروع والتأكد من خلوه من الأخطاء التنسيقية.
- `npm run type-check` - فحص أنواع TypeScript للتأكد من عدم وجود أخطاء.

---

## 🚀 النشر على Vercel

### الخطوة 1: إعداد GitHub Secrets

1. اذهب إلى مستودع GitHub الخاص بالمشروع.
2. انتقل إلى **Settings** > **Secrets and variables** > **Actions**.
3. أضف الأسرار التالية:
   - `VERCEL_TOKEN` - رمز الوصول لـ Vercel (من [Vercel Settings](https://vercel.com/account/tokens))
   - `VERCEL_ORG_ID` - معرف المؤسسة في Vercel
   - `VERCEL_PROJECT_ID` - معرف المشروع في Vercel
   - `NEXT_PUBLIC_SUPABASE_URL` - رابط مشروع Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - مفتاح الوصول العام لـ Supabase

### الخطوة 2: ربط المشروع بـ Vercel

1. سجل الدخول إلى [Vercel](https://vercel.com).
2. اضغط على **Add New** > **Project**.
3. اربط مستودع GitHub الخاص بالمشروع.
4. سيقوم Vercel تلقائياً بقراءة إعدادات `vercel.json`.

### الخطوة 3: إعداد متغيرات البيئة في Vercel

1. في إعدادات المشروع في Vercel، اذهب إلى **Settings** > **Environment Variables**.
2. أضف المتغيرات التالية:
   - `NEXT_PUBLIC_SUPABASE_URL` - رابط مشروع Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - مفتاح الوصول العام لـ Supabase
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - مفتاح Google Maps API (اختياري)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` - رقم دعم واتساب (اختياري)

### الخطوة 4: النشر التلقائي عبر GitHub Actions

بعد دمج الكود في فرع `main`، سيقوم GitHub Actions تلقائياً بـ:
1. فحص الكود (lint)
2. فحص أنواع TypeScript (type-check)
3. بناء المشروع (build)
4. النشر على Vercel

يمكنك مراقبة عملية النشر في تبويب **Actions** في GitHub.

### الخطوة 5: النشر اليدوي

للنشر يدوياً:
```bash
npm run build
vercel --prod
```

---

## 📊 إدارة قاعدة البيانات في الإنتاج

### النسخ الاحتياطية

Supabase توفر نسخ احتياطية تلقائية يومية. للوصول إليها:
1. اذهب إلى لوحة تحكم Supabase.
2. انتقل إلى **Database** > **Backups**.
3. يمكنك تنزيل أو استعادة النسخ الاحتياطية من هناك.

### مراقبة الأداء

1. اذهب إلى **Database** > **Performance** في Supabase.
2. راقب استعلامات البطيئة واستهلاك الموارد.
3. استخدم **Logs** لتتبع الأخطاء والنشاط.

### إدارة المستخدمين

1. اذهب إلى **Authentication** > **Users** في Supabase.
2. يمكنك إدارة المستخدمين، إعادة تعيين كلمات المرور، وحظر الحسابات.

---

## 🆘 خطة الطوارئ

للحصول على خطة الطوارئ الكاملة، راجع ملف `EMERGENCY_PLAN.md`.

### استعادة النسخة الاحتياطية

1. اذهب إلى Supabase Dashboard.
2. انتقل إلى **Database** > **Backups**.
3. اختر النسخة الاحتياطية المراد استعادتها.
4. اضغط على **Restore**.

### التواصل مع الدعم الفني

- **واتساب**: [رقم الدعم]
- **إيميل**: [إيميل الدعم]

---

## ✅ قائمة تحقق الإطلاق

للتأكد من جاهزية الموقع للإطلاق، راجع ملف `LAUNCH_CHECKLIST.md`.
