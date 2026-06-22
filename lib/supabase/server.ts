import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.');
}

/**
 * يُنشئ عميل Supabase مُدرك للكوكيز للاستخدام في:
 * - Server Components
 * - Route Handlers (app/auth/callback/route.ts)
 * - Server Actions
 *
 * يستخدم الـ anon key مع cookie adapter من @supabase/ssr
 * حتى يتمكن من قراءة/كتابة الجلسة في ملفات تعريف الارتباط (cookies).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll يُرمى في Server Components لأن الاستجابة تكون قد أُرسلت بالفعل.
          // هذا متوقع ويمكن تجاهله بأمان — الكتابة الفعلية تتم في Route Handlers فقط.
        }
      },
    },
  });
}

/**
 * دالة مساعدة للتحقق من وجود مستخدم نشط في Server Components.
 * تعيد null إذا لم تكن هناك جلسة صالحة.
 */
export async function getServerUser() {
  const supabase = await createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}
