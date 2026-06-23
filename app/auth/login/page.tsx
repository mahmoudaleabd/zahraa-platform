// app/auth/login/page.tsx
import { Suspense } from 'react';
import LoginContent from './LoginContent';

// منع التوليد الثابت للصفحة
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-[#a69584] p-8">جاري التحميل...</div>}>
      <LoginContent />
    </Suspense>
  );
}
