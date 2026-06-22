import { supabase } from '@/lib/supabase';

export interface Favorite {
  id?: string;
  user_id: string;
  property_id: string;
  created_at?: string;
}

/**
 * إضافة عقار للمفضلة
 */
export async function addFavorite(
  userId: string,
  propertyId: string
): Promise<{ error: any }> {
  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    property_id: propertyId,
    created_at: new Date().toISOString(),
  });

  return { error };
}

/**
 * إزالة عقار من المفضلة
 */
export async function removeFavorite(
  userId: string,
  propertyId: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  return { error };
}

/**
 * جلب قائمة العقارات المفضلة للمستخدم
 */
export async function getFavorites(
  userId: string
): Promise<{ data: Favorite[]; error: any }> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      properties (
        id,
        title,
        price,
        area,
        rooms,
        bathrooms,
        type,
        transaction_type,
        location,
        images,
        broker_phone
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return {
    data: data as Favorite[] || [],
    error,
  };
}

/**
 * التحقق من أن العقار مفضل للمستخدم
 */
export async function isFavorite(
  userId: string,
  propertyId: string
): Promise<{ isFavorite: boolean; error: any }> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single();

  return {
    isFavorite: !!data,
    error,
  };
}
