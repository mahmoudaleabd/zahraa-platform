import { supabase } from '@/lib/supabase';

export interface Complaint {
  id?: string;
  title: string;
  description: string;
  reporter_id: string;
  target_type: 'property' | 'business' | 'user';
  target_id: string;
  status: 'open' | 'resolved';
  created_at?: string;
}

/**
 * إرسال شكوى أو بلاغ
 */
export async function submitComplaint(
  data: Omit<Complaint, 'id' | 'status' | 'created_at'>
): Promise<{ error: any }> {
  const { error } = await supabase.from('complaints').insert({
    ...data,
    status: 'open',
    created_at: new Date().toISOString(),
  });

  return { error };
}

/**
 * جلب شكاوى المستخدم
 */
export async function getUserComplaints(
  userId: string
): Promise<{ data: Complaint[]; error: any }> {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false });

  return {
    data: data as Complaint[] || [],
    error,
  };
}

/**
 * جلب شكوى بالمعرف
 */
export async function getComplaintById(
  id: string
): Promise<{ data: Complaint | null; error: any }> {
  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .eq('id', id)
    .single();

  return {
    data: data as Complaint | null,
    error,
  };
}
