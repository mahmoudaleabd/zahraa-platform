import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export interface Property {
  id?: string;
  title: string;
  description: string;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  type: 'apartment' | 'villa' | 'land' | 'commercial' | 'building';
  transaction_type: 'sale' | 'rent';
  location: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  broker_name?: string;
  broker_company?: string;
  broker_phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFilters {
  type?: Property['type'];
  transaction_type?: Property['transaction_type'];
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  min_rooms?: number;
  max_rooms?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * جلب العقارات مع الفلترة والترقيم
 */
export async function getProperties(
  filters: PropertyFilters = {},
  pagination: PaginationParams = {}
): Promise<{ data: Property[]; count: number; error: any }> {
  const { page = 1, limit = 12 } = pagination;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // تطبيق الفلاتر
  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type);
  }

  if (filters.min_price !== undefined) {
    query = query.gte('price', filters.min_price);
  }

  if (filters.max_price !== undefined) {
    query = query.lte('price', filters.max_price);
  }

  if (filters.min_area !== undefined) {
    query = query.gte('area', filters.min_area);
  }

  if (filters.max_area !== undefined) {
    query = query.lte('area', filters.max_area);
  }

  if (filters.min_rooms !== undefined) {
    query = query.gte('rooms', filters.min_rooms);
  }

  if (filters.max_rooms !== undefined) {
    query = query.lte('rooms', filters.max_rooms);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query.range(from, to);

  return {
    data: data as Property[] || [],
    count: count || 0,
    error,
  };
}

/**
 * جلب عقار واحد بالمعرف
 */
export async function getPropertyById(id: string): Promise<{ data: Property | null; error: any }> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  return {
    data: data as Property | null,
    error,
  };
}

/**
 * إنشاء عقار جديد
 */
export async function createProperty(
  property: Property,
  userId?: string
): Promise<{ data: Property | null; error: any }> {
  const propertyData = {
    ...property,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();

  return {
    data: data as Property | null,
    error,
  };
}

/**
 * تحديث عقار موجود
 */
export async function updateProperty(
  id: string,
  property: Partial<Property>
): Promise<{ data: Property | null; error: any }> {
  const propertyData = {
    ...property,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  return {
    data: data as Property | null,
    error,
  };
}

/**
 * حذف عقار
 */
export async function deleteProperty(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * ضغط الصورة قبل الرفع
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile as File;
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
}

/**
 * رفع صورة إلى Supabase Storage
 */
export async function uploadImage(
  file: File,
  propertyId: string
): Promise<{ data: string | null; error: any }> {
  try {
    // ضغط الصورة
    const compressedFile = await compressImage(file);

    // إنشاء اسم فريد للملف
    const fileExt = compressedFile.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

    // رفع الملف
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, compressedFile);

    if (error) {
      return { data: null, error };
    }

    // الحصول على URL العام
    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return {
      data: publicUrlData.publicUrl,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}

/**
 * حذف صورة من Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<{ error: any }> {
  try {
    // استخراج اسم الملف من URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/property-images/');
    const fileName = pathParts[1];

    if (!fileName) {
      return { error: new Error('Invalid image URL') };
    }

    const { error } = await supabase.storage
      .from('property-images')
      .remove([fileName]);

    return { error };
  } catch (error) {
    return { error };
  }
}

/**
 * البحث المتقدم باستخدام RPC
 */
export async function searchProperties(
  filters: PropertyFilters,
  pagination: PaginationParams = {}
): Promise<{ data: Property[]; count: number; error: any }> {
  const { page = 1, limit = 12 } = pagination;

  try {
    const { data, error } = await supabase.rpc('search_properties', {
      p_type: filters.type || null,
      p_transaction_type: filters.transaction_type || null,
      p_min_price: filters.min_price || null,
      p_max_price: filters.max_price || null,
      p_min_area: filters.min_area || null,
      p_max_area: filters.max_area || null,
      p_min_rooms: filters.min_rooms || null,
      p_max_rooms: filters.max_rooms || null,
      p_search: filters.search || null,
      p_page: page,
      p_limit: limit,
    });

    return {
      data: (data as Property[]) || [],
      count: data?.length || 0,
      error,
    };
  } catch (error) {
    // إذا لم تكن الدالة RPC موجودة، نستخدم الطريقة العادية
    return getProperties(filters, pagination);
  }
}
