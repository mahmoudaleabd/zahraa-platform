'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  return (
    <div>
      {/* محتوى صفحة تسجيل الدخول الحالي */}
      <h1>تسجيل الدخول</h1>
      <p>سيتم إعادة التوجيه إلى: {redirect}</p>
    </div>
  );
}

export default function LoginContent() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <LoginForm />
    </Suspense>
  );
}