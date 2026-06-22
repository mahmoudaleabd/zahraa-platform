import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// المسارات المحمية: تتطلب تسجيل دخول
const protectedRoutes = ['/dashboard', '/admin', '/profile', '/settings'];

// مسارات المصادقة: يُعاد توجيه المستخدم المسجل منها إلى الرئيسية
// ⚠️ /auth/callback مستبعد عمداً — يجب أن يصل إليه route handler بلا عائق
const authOnlyRoutes = ['/auth/login', '/auth/verify', '/auth/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ تجاوز المعالجة كلياً لمسار الاستدعاء — route.ts يتولى ذلك بالكامل
  if (pathname === '/auth/callback') {
    return NextResponse.next();
  }

  // نُنشئ استجابة قابلة للتعديل لتمرير الكوكيز المحدَّثة
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // كتابة الكوكيز في كل من الطلب والاستجابة لضمان مزامنتها
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ⚠️ مهم: getUser() يُحدِّث الجلسة تلقائياً إذا انتهت صلاحية الـ access_token
  // يجب استدعاؤه قبل أي redirect لضمان دقة حالة المستخدم
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthOnly = authOnlyRoutes.some((route) => pathname.startsWith(route));

  // مسار محمي + لا يوجد مستخدم → إعادة التوجيه لصفحة الدخول
  if (isProtected && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // مسار المصادقة + المستخدم مسجل دخوله بالفعل → إعادة إلى لوحة التحكم
  if (isAuthOnly && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ⚠️ مهم: إعادة supabaseResponse وليس NextResponse.next() مباشرة
  // لضمان نقل الكوكيز المحدَّثة (token refresh) إلى المتصفح
  return supabaseResponse;
}

// تطبيق الـ middleware على جميع المسارات عدا الملفات الثابتة والـ API
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|workbox.*\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
