-- ==========================================
-- ملف تهيئة قاعدة بيانات سوبابيس (Supabase Schema Init)
-- مشروع: منصة زهراء أكتوبر الجديدة
-- ==========================================

-- تفعيل ملحق UUID لإنشاء المعرفات الفريدة
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. إنشاء الأنواع المخصصة (Enums)
-- ==========================================

CREATE TYPE public.user_role AS ENUM ('admin', 'broker', 'business_owner', 'normal_user');
CREATE TYPE public.property_type AS ENUM ('apartment', 'villa', 'land', 'commercial', 'building');
CREATE TYPE public.transaction_type AS ENUM ('sale', 'rent');
CREATE TYPE public.property_status AS ENUM ('active', 'sold', 'rented', 'inactive');
CREATE TYPE public.business_category AS ENUM ('medical', 'grocery', 'restaurant', 'cafe', 'profession', 'other');
CREATE TYPE public.order_status AS ENUM ('pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE public.complaint_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE public.subscription_plan AS ENUM ('free', 'premium_broker', 'featured_business');
CREATE TYPE public.payment_status AS ENUM ('pending', 'successful', 'failed');

-- ==========================================
-- 2. إنشاء الجداول (13 جدولاً)
-- ==========================================

-- 1. جدول المستخدمين (users) - يرتبط بمصادقة سوبابيس
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role public.user_role NOT NULL DEFAULT 'normal_user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول الوسطاء العقاريين (brokers)
CREATE TABLE public.brokers (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    company_name VARCHAR(150),
    license_number VARCHAR(100) UNIQUE,
    bio TEXT,
    verified_by_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول العقارات (properties)
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(15, 2) NOT NULL CHECK (price >= 0),
    area_sqm DECIMAL(8, 2) NOT NULL CHECK (area_sqm > 0),
    bedrooms INT CHECK (bedrooms >= 0),
    bathrooms INT CHECK (bathrooms >= 0),
    type public.property_type NOT NULL,
    transaction public.transaction_type NOT NULL,
    status public.property_status NOT NULL DEFAULT 'active',
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_link TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES public.brokers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول صور العقارات (property_images)
CREATE TABLE public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول تقييمات الوسطاء (broker_reviews)
CREATE TABLE public.broker_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID NOT NULL REFERENCES public.brokers(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_broker_reviewer UNIQUE (broker_id, reviewer_id)
);

-- 6. جدول الأعمال والخدمات المحلية (businesses)
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category public.business_category NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    whatsapp_link TEXT,
    address TEXT NOT NULL,
    location_lat DECIMAL(9, 6),
    location_lng DECIMAL(9, 6),
    working_hours JSONB,
    logo_url TEXT,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. قوائم المنتجات والمنيو (business_menus)
CREATE TABLE public.business_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. طلبات الطعام والدليفري (food_orders)
CREATE TABLE public.food_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status public.order_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول المفضلة (favorites)
CREATE TABLE public.favorites (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id)
);

-- 10. جدول الشكاوى والبلاغات (complaints)
CREATE TABLE public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    status public.complaint_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. جدول الاشتراكات (subscriptions)
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan public.subscription_plan NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. جدول المدفوعات (payments)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) DEFAULT 'EGP',
    status public.payment_status NOT NULL DEFAULT 'pending',
    transaction_ref VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. جدول الإشعارات (notifications)
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. إنشاء الفهارس لتحسين السرعة والأداء (Indexes)
-- ==========================================

CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_type_trans ON public.properties(type, transaction);
CREATE INDEX idx_properties_status ON public.properties(status) WHERE status = 'active';
CREATE INDEX idx_properties_coords ON public.properties(location_lat, location_lng);
CREATE INDEX idx_businesses_coords ON public.businesses(location_lat, location_lng);
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_property_images_prop ON public.property_images(property_id);
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_business_menus_biz ON public.business_menus(business_id);
CREATE INDEX idx_food_orders_biz ON public.food_orders(business_id);
CREATE INDEX idx_complaints_status ON public.complaints(status);

-- ==========================================
-- 4. إعداد RLS وتفعيل سياسات الحماية
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- سياسات المستخدمين (Users Policies)
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow users to update their profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- سياسات الوسطاء (Brokers Policies)
CREATE POLICY "Allow public read brokers" ON public.brokers FOR SELECT USING (true);
CREATE POLICY "Allow brokers to manage their data" ON public.brokers FOR ALL USING (auth.uid() = id);

-- سياسات العقارات (Properties Policies)
CREATE POLICY "Allow public read active properties" ON public.properties FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);
CREATE POLICY "Allow auth users to insert properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Allow owners to update properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Allow owners to delete properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id);

-- سياسات صور العقارات
CREATE POLICY "Allow public read property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Allow auth users to manage images" ON public.property_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_id AND owner_id = auth.uid()
  )
);

-- سياسات المراجعات والتقييمات
CREATE POLICY "Allow public read reviews" ON public.broker_reviews FOR SELECT USING (true);
CREATE POLICY "Allow reviewer to manage reviews" ON public.broker_reviews FOR ALL USING (auth.uid() = reviewer_id);

-- سياسات المحلات والأعمال التجارية
CREATE POLICY "Allow public read businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow owners to manage businesses" ON public.businesses FOR ALL USING (auth.uid() = owner_id);

-- سياسات منيو المنتجات
CREATE POLICY "Allow public read menus" ON public.business_menus FOR SELECT USING (true);
CREATE POLICY "Allow business owners to manage menus" ON public.business_menus FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  )
);

-- سياسات طلبات الطعام
CREATE POLICY "Allow customers or owners to read orders" ON public.food_orders FOR SELECT USING (
  auth.uid() IN (SELECT id FROM public.users WHERE phone = customer_phone)
  OR EXISTS (
    SELECT 1 FROM public.businesses b 
    WHERE b.id = business_id AND b.owner_id = auth.uid()
  )
);
CREATE POLICY "Allow anyone to place orders" ON public.food_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow business owners to update orders" ON public.food_orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.businesses b 
    WHERE b.id = business_id AND b.owner_id = auth.uid()
  )
);

-- سياسات المفضلة
CREATE POLICY "Allow users to manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- سياسات الشكاوى
CREATE POLICY "Allow users to read own complaints" ON public.complaints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow auth users to file complaints" ON public.complaints FOR INSERT WITH CHECK (auth.uid() = user_id);

-- سياسات الاشتراكات والمدفوعات والإشعارات
CREATE POLICY "Allow users to view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to view own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- 5. دوال ومحفزات المزامنة والتقييمات (Triggers)
-- ==========================================

-- دالة مزامنة مستخدمي نظام المصادقة مع جدول المستخدمين العام
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, email, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, 'بدون هاتف'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'normal_user'::public.user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- محفز بعد عملية التسجيل
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- دالة تحديث التقييم التلقائي للوسيط عند إضافة مراجعة
CREATE OR REPLACE FUNCTION public.update_broker_average_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- يتم تحديث التقييم هنا أو الاحتفاظ به ديناميكياً
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_added
  AFTER INSERT OR UPDATE ON public.broker_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_broker_average_rating();

-- ==========================================
-- 6. دوال البحث المتقدم والـ RPC
-- ==========================================

-- دالة البحث المتقدم والفلترة للعقارات
CREATE OR REPLACE FUNCTION public.search_properties(
  p_type public.property_type DEFAULT NULL,
  p_transaction public.transaction_type DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_min_area DECIMAL DEFAULT NULL,
  p_bedrooms INT DEFAULT NULL,
  p_query TEXT DEFAULT NULL
)
RETURNS SETOF public.properties AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.properties
  WHERE status = 'active'
    AND (p_type IS NULL OR type = p_type)
    AND (p_transaction IS NULL OR transaction = p_transaction)
    AND (p_min_price IS NULL OR price >= p_min_price)
    AND (p_max_price IS NULL OR price <= p_max_price)
    AND (p_min_area IS NULL OR area_sqm >= p_min_area)
    AND (p_bedrooms IS NULL OR bedrooms = p_bedrooms)
    AND (
      p_query IS NULL 
      OR title ILIKE '%' || p_query || '%' 
      OR description ILIKE '%' || p_query || '%' 
      OR address ILIKE '%' || p_query || '%'
    )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة ترميز URL (URL Encoding) لدعم اللغة العربية في الروابط
CREATE OR REPLACE FUNCTION public.urlencode(str text) 
RETURNS text AS $$
DECLARE
  rec record;
  char text;
  hex text;
  result text := '';
BEGIN
  FOR i IN 1..length(str) LOOP
    char := substr(str, i, 1);
    IF char ~ '[a-zA-Z0-9_.~-]' THEN
      result := result || char;
    ELSE
      hex := encode(convert_to(char, 'UTF8'), 'hex');
      FOR j IN 1..length(hex)/2 LOOP
        result := result || '%' || upper(substr(hex, (j-1)*2+1, 2));
      END LOOP;
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- دالة توليد روابط واتساب الذكية
CREATE OR REPLACE FUNCTION public.get_whatsapp_link(
  phone_num TEXT,
  item_title TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_message TEXT;
  v_clean_phone TEXT;
BEGIN
  v_clean_phone := REGEXP_REPLACE(phone_num, '\D', '', 'g');
  
  IF LENGTH(v_clean_phone) = 11 AND LEFT(v_clean_phone, 1) = '0' THEN
    v_clean_phone := '20' || SUBSTRING(v_clean_phone FROM 2);
  END IF;

  v_message := 'مرحباً، أود الاستفسار بخصوص الإعلان: ' || item_title || ' المعروض على منصة زهراء أكتوبر.';
  
  RETURN 'https://wa.me/' || v_clean_phone || '?text=' || public.urlencode(v_message);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- 7. تهيئة التخزين والسياسات (Supabase Storage)
-- ==========================================

-- إنشاء الحاويات الافتراضية
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('properties', 'properties', true),
  ('logos', 'logos', true),
  ('menu-items', 'menu-items', true)
ON CONFLICT (id) DO NOTHING;

-- سياسات تخزين الصور
CREATE POLICY "Allow public read storage images" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('properties', 'logos', 'menu-items'));

CREATE POLICY "Allow authenticated users to upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id IN ('properties', 'logos', 'menu-items') 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to delete their own images" 
ON storage.objects FOR DELETE 
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
