import { supabase } from '@/lib/supabase';

export interface AdminStats {
  total_users: number;
  pending_properties: number;
  active_complaints: number;
  registered_businesses: number;
  weekly_users: number[];
}

export interface PendingProperty {
  id: string;
  title: string;
  price: number;
  user_id: string;
  user_name?: string;
  user_phone?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  reporter_id: string;
  reporter_name?: string;
  reporter_phone?: string;
  target_type: 'property' | 'business' | 'user';
  target_id: string;
  status: 'open' | 'resolved';
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'normal_user' | 'broker' | 'business_owner' | 'admin';
  verified: boolean;
  created_at: string;
}

/**
 * جلب إحصائيات لوحة التحكم
 */
export async function getStats(): Promise<{ data: AdminStats | null; error: any }> {
  try {
    // جلب إجمالي المستخدمين
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // جلب العقارات المعلقة
    const { count: pendingProperties } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // جلب الشكاوى النشطة
    const { count: activeComplaints } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    // جلب الأعمال المسجلة
    const { count: registeredBusinesses } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true });

    // جلب المستخدمين الأسبوعيين (آخر 7 أيام)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: weeklyUsersData } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    const weeklyUsers = [0, 0, 0, 0, 0, 0, 0];
    weeklyUsersData?.forEach((user) => {
      const dayOfWeek = new Date(user.created_at).getDay();
      weeklyUsers[dayOfWeek]++;
    });

    const stats: AdminStats = {
      total_users: totalUsers || 0,
      pending_properties: pendingProperties || 0,
      active_complaints: activeComplaints || 0,
      registered_businesses: registeredBusinesses || 0,
      weekly_users: weeklyUsers,
    };

    return { data: stats, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * جلب العقارات المعلقة
 */
export async function getPendingProperties(
  page: number = 1,
  limit: number = 10
): Promise<{ data: PendingProperty[]; count: number; error: any }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('properties')
    .select(`
      *,
      users!properties_created_by_fkey (
        name,
        phone
      )
    `, { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(from, to);

  const properties = data?.map((prop: any) => ({
    id: prop.id,
    title: prop.title,
    price: prop.price,
    user_id: prop.created_by,
    user_name: prop.users?.name,
    user_phone: prop.users?.phone,
    created_at: prop.created_at,
    status: prop.status,
  })) || [];

  return {
    data: properties,
    count: count || 0,
    error,
  };
}

/**
 * الموافقة على عقار
 */
export async function approveProperty(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('properties')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', id);

  return { error };
}

/**
 * رفض عقار
 */
export async function rejectProperty(
  id: string,
  reason: string
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('properties')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return { error };
}

/**
 * جلب الشكاوى
 */
export async function getComplaints(
  page: number = 1,
  limit: number = 10
): Promise<{ data: Complaint[]; count: number; error: any }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('complaints')
    .select(`
      *,
      users!complaints_reporter_id_fkey (
        name,
        phone
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const complaints = data?.map((comp: any) => ({
    id: comp.id,
    title: comp.title,
    description: comp.description,
    reporter_id: comp.reporter_id,
    reporter_name: comp.users?.name,
    reporter_phone: comp.users?.phone,
    target_type: comp.target_type,
    target_id: comp.target_id,
    status: comp.status,
    created_at: comp.created_at,
  })) || [];

  return {
    data: complaints,
    count: count || 0,
    error,
  };
}

/**
 * حل شكوى
 */
export async function resolveComplaint(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('complaints')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id);

  return { error };
}

/**
 * جلب المستخدمين
 */
export async function getUsers(
  page: number = 1,
  limit: number = 10
): Promise<{ data: User[]; count: number; error: any }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  return {
    data: data as User[] || [],
    count: count || 0,
    error,
  };
}

/**
 * تحديث دور المستخدم
 */
export async function updateUserRole(
  userId: string,
  role: User['role']
): Promise<{ error: any }> {
  const { error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { error };
}

/**
 * توثيق وسيط
 */
export async function verifyBroker(userId: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('users')
    .update({ verified: true, updated_at: new Date().toISOString() })
    .eq('id', userId);

  return { error };
}

/**
 * جلب آخر الإشعارات
 */
export async function getRecentNotifications(
  limit: number = 5
): Promise<{ data: any[]; error: any }> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    data: data || [],
    error,
  };
}
