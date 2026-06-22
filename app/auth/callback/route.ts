import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * مسار استقبال الرجوع من Google OAuth (PKCE flow).
 *
 * ترتيب الأحداث:
 * 1. المستخدم يضغط "الدخول عبر Google" → تُعيد Supabase توجيهه إلى Google.
 * 2. Google تُعيد التوجيه إلى هذا المسار مع ?code=...
 * 3. نُبادل الكود بجلسة كاملة عبر exchangeCodeForSession().
 * 4. تُكتب ملفات تعريف الارتباط (cookies) تلقائياً في استجابة الإعادة.
 * 5. نُعيد التوجيه إلى "/" — والمستخدم الآن مُسجَّل دخوله.
 *
 * ⚠️ ضبط مطلوب في Supabase Dashboard:
 *   Authentication → URL Configuration → Redirect URLs:
 *   أضف: http://localhost:3000/auth/callback  (للتطوير)
 *         https://your-domain.com/auth/callback (للإنتاج)
 *
 * ⚠️ ضبط مطلوب في Google Cloud Console:
 *   APIs & Services → Credentials → OAuth 2.0 Client → Authorized redirect URIs:
 *   أضف: https://<project-ref>.supabase.co/auth/v1/callback
 *        (ليس رابط تطبيقك — هذا رابط Supabase الداخلي)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // يمكن تمرير وجهة إعادة التوجيه بعد الدخول (اختياري)
  const redirectTo = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // نجح تبادل الكود — الجلسة مكتوبة في الكوكيز الآن
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      } else if (forwardedHost) {
        // في بيئة الإنتاج خلف proxy (مثل Vercel)
        return NextResponse.redirect(`https://${forwardedHost}${redirectTo}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }
    }

    console.error('[auth/callback] exchangeCodeForSession failed:', error.message);
  }

  // الكود مفقود أو فشل التبادل — إعادة التوجيه مع رسالة خطأ
  return NextResponse.redirect(
    `${origin}/auth/login?error=oauth_failed&message=${encodeURIComponent('فشل تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.')}`
  );
}
