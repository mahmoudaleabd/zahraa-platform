import { supabase } from '@/lib/supabase';

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
  broker_id?: string;
  business_id?: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
  user_name?: string;
  user_phone?: string;
}

/**
 * إضافة تقييم لوسيط
 */
export async function addBrokerReview(
  data: Omit<BrokerReview, 'id' | 'created_at'>
): Promise<{ error: any }> {
  const { error } = await supabase.from('broker_reviews').insert({
    ...data,
    created_at: new Date().toISOString(),
  });

  return { error };
}

/**
 * جلب تقييمات وسيط
 */
export async function getBrokerReviews(
  brokerId: string
): Promise<{ data: ReviewWithUser[]; error: any }> {
  const { data, error } = await supabase
    .from('broker_reviews')
    .select(`
      *,
      users!broker_reviews_user_id_fkey (
        name,
        phone
      )
    `)
    .eq('broker_id', brokerId)
    .order('created_at', { ascending: false });

  const reviews = data?.map((review: any) => ({
    ...review,
    user_name: review.users?.name,
    user_phone: review.users?.phone,
  })) || [];

  return {
    data: reviews,
    error,
  };
}

/**
 * حساب متوسط تقييم وسيط
 */
export async function getBrokerAverageRating(
  brokerId: string
): Promise<{ average: number; count: number; error: any }> {
  const { data, error } = await supabase
    .from('broker_reviews')
    .select('rating')
    .eq('broker_id', brokerId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0, error };
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / data.length;

  return {
    average: Math.round(average * 10) / 10,
    count: data.length,
    error: null,
  };
}

/**
 * إضافة تقييم لعمل
 */
export async function addBusinessReview(
  data: Omit<BusinessReview, 'id' | 'created_at'>
): Promise<{ error: any }> {
  const { error } = await supabase.from('business_reviews').insert({
    ...data,
    created_at: new Date().toISOString(),
  });

  return { error };
}

/**
 * جلب تقييمات عمل
 */
export async function getBusinessReviews(
  businessId: string
): Promise<{ data: ReviewWithUser[]; error: any }> {
  const { data, error } = await supabase
    .from('business_reviews')
    .select(`
      *,
      users!business_reviews_user_id_fkey (
        name,
        phone
      )
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  const reviews = data?.map((review: any) => ({
    ...review,
    user_name: review.users?.name,
    user_phone: review.users?.phone,
  })) || [];

  return {
    data: reviews,
    error,
  };
}

/**
 * حساب متوسط تقييم عمل
 */
export async function getBusinessAverageRating(
  businessId: string
): Promise<{ average: number; count: number; error: any }> {
  const { data, error } = await supabase
    .from('business_reviews')
    .select('rating')
    .eq('business_id', businessId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0, error };
  }

  const sum = data.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / data.length;

  return {
    average: Math.round(average * 10) / 10,
    count: data.length,
    error: null,
  };
}

/**
 * التحقق من أن المستخدم قيم بالفعل
 */
export async function hasUserReviewedBroker(
  userId: string,
  brokerId: string
): Promise<{ hasReviewed: boolean; error: any }> {
  const { data, error } = await supabase
    .from('broker_reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('broker_id', brokerId)
    .single();

  return {
    hasReviewed: !!data,
    error,
  };
}

export async function hasUserReviewedBusiness(
  userId: string,
  businessId: string
): Promise<{ hasReviewed: boolean; error: any }> {
  const { data, error } = await supabase
    .from('business_reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', businessId)
    .single();

  return {
    hasReviewed: !!data,
    error,
  };
}
