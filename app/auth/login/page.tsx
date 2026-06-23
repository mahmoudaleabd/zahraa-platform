// app/auth/login/page.tsx
export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';

const LoginContent = dynamic(() => import('./LoginContent'), { ssr: false });

export default function LoginPage() {
  return <LoginContent />;
}
