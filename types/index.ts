// أنواع المستخدمين
export type UserRole = 'user' | 'broker' | 'admin' | 'business_owner';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_verified?: boolean;
  created_at: string;
}

// أنواع العقارات
export type PropertyType = 'apartment' | 'villa' | 'land' | 'commercial' | 'office' | 'building';
export type TransactionType = 'sale' | 'rent';

export interface Property {
  id?: string;
  title: string;
  description: string;
  type: PropertyType;
  transaction_type: TransactionType;
  price: number;
  area: number;
  rooms?: number;
  bathrooms?: number;
  floor?: number;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  broker_id: string;
  broker_name?: string;
  broker_phone?: string;
  broker_company?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

// أنواع الأعمال
export type BusinessCategory = 'restaurant' | 'cafe' | 'shop' | 'service' | 'other';

export interface Business {
  id?: string;
  name: string;
  description: string;
  category: BusinessCategory;
  address: string;
  city: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  logo?: string;
  latitude?: number;
  longitude?: number;
  owner_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface MenuItem {
  id?: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  created_at?: string;
}

export interface BusinessWithMenu extends Business {
  menu_items?: MenuItem[];
}

// أنواع التقييمات
export interface BrokerReview {
  id?: string;
  broker_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface BusinessReview {
  id?: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export interface ReviewWithUser {
  id?: string;
  rating: number;
  comment?: string;
  created_at?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  broker_id?: string;
  business_id?: string;
}

// أنواع المفضلة
export interface Favorite {
  id?: string;
  user_id: string;
  property_id: string;
  created_at?: string;
}

export interface FavoriteWithProperty extends Favorite {
  property?: Property;
}

// أنواع الشكاوى
export type ComplaintTarget = 'property' | 'business' | 'user';
export type ComplaintStatus = 'open' | 'resolved';

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  reporter_id: string;
  target_type: ComplaintTarget;
  target_id: string;
  status: ComplaintStatus;
  created_at?: string;
}

// أنواع الإشعارات
export type NotificationType = 'property_approved' | 'property_rejected' | 'business_approved' | 'business_rejected' | 'complaint_resolved';

export interface Notification {
  id?: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at?: string;
}

// أنواع السلة
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  business_id: string;
}
