import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.'
  );
}

/**
 * عميل Supabase للاستخدام في Client Components فقط.
 *
 * يستخدم createBrowserClient من @supabase/ssr (وليس createClient من supabase-js)
 * لضمان قراءة ملفات تعريف الارتباط (cookies) المكتوبة من جانب الخادم بشكل صحيح،
 * خاصةً بعد تبادل كود OAuth في route handler.
 *
 * ✅ يعمل مع: Client Components, Zustand store, صفحات المصادقة
 * ❌ لا يُستخدم في: Server Components, Route Handlers, Middleware
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
