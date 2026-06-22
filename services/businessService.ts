import { supabase } from '@/lib/supabase';

export interface Business {
  id?: string;
  name: string;
  description: string;
  category: 'medical' | 'grocery' | 'restaurant' | 'cafe' | 'craftsman' | 'other';
  logo?: string;
  phone: string;
  address: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  working_hours?: string;
  website?: string;
  featured?: boolean;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id?: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  available?: boolean;
  created_at?: string;
}

export interface BusinessWithMenu extends Business {
  menu_items?: MenuItem[];
}

/**
 * جلب الأعمال حسب التصنيف
 */
export async function getBusinesses(
  category?: Business['category'],
  featured: boolean = false
): Promise<{ data: Business[]; error: any }> {
  let query = supabase
    .from('businesses')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  if (featured) {
    query = query.eq('featured', true);
  }

  const { data, error } = await query;

  return {
    data: data as Business[] || [],
    error,
  };
}

/**
 * البحث في الأعمال
 */
export async function searchBusinesses(
  searchTerm: string
): Promise<{ data: Business[]; error: any }> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  return {
    data: data as Business[] || [],
    error,
  };
}

/**
 * جلب عمل واحد بالمعرف مع المنيو
 */
export async function getBusinessById(id: string): Promise<{ data: BusinessWithMenu | null; error: any }> {
  const { data: businessData, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (businessError) {
    return { data: null, error: businessError };
  }

  // جلب المنيو إذا كان مطعم أو كافيه
  let menuItems: MenuItem[] = [];
  if (businessData.category === 'restaurant' || businessData.category === 'cafe') {
    const { data: menuData, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('business_id', id)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (!menuError) {
      menuItems = menuData as MenuItem[] || [];
    }
  }

  return {
    data: {
      ...businessData,
      menu_items: menuItems,
    } as BusinessWithMenu,
    error: null,
  };
}

/**
 * إنشاء عمل جديد
 */
export async function createBusiness(
  business: Business,
  userId?: string
): Promise<{ data: Business | null; error: any }> {
  const businessData = {
    ...business,
    owner_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert(businessData)
    .select()
    .single();

  return {
    data: data as Business | null,
    error,
  };
}

/**
 * تحديث عمل موجود
 */
export async function updateBusiness(
  id: string,
  business: Partial<Business>
): Promise<{ data: Business | null; error: any }> {
  const businessData = {
    ...business,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('businesses')
    .update(businessData)
    .eq('id', id)
    .select()
    .single();

  return {
    data: data as Business | null,
    error,
  };
}

/**
 * حذف عمل
 */
export async function deleteBusiness(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * إضافة صنف للمنيو
 */
export async function addMenuItem(
  menuItem: MenuItem
): Promise<{ data: MenuItem | null; error: any }> {
  const menuItemData = {
    ...menuItem,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('menu_items')
    .insert(menuItemData)
    .select()
    .single();

  return {
    data: data as MenuItem | null,
    error,
  };
}

/**
 * تحديث صنف في المنيو
 */
export async function updateMenuItem(
  id: string,
  menuItem: Partial<MenuItem>
): Promise<{ data: MenuItem | null; error: any }> {
  const { data, error } = await supabase
    .from('menu_items')
    .update(menuItem)
    .eq('id', id)
    .select()
    .single();

  return {
    data: data as MenuItem | null,
    error,
  };
}

/**
 * حذف صنف من المنيو
 */
export async function deleteMenuItem(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  return { error };
}

/**
 * رفع شعار العمل
 */
export async function uploadBusinessLogo(
  file: File,
  businessId: string
): Promise<{ data: string | null; error: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/logo.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('business-logos')
      .upload(fileName, file);

    if (error) {
      return { data: null, error };
    }

    const { data: publicUrlData } = supabase.storage
      .from('business-logos')
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
  };
}

/**
 * رفع صورة صنف المنيو
 */
export async function uploadMenuItemImage(
  file: File,
  businessId: string,
  menuItemId: string
): Promise<{ data: string | null; error: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${businessId}/menu/${menuItemId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file);

    if (error) {
      return { data: null, error };
    }

    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
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
  };
}
