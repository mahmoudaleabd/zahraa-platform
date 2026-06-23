import './globals.css';
import { Cairo } from 'next/font/google';
import type { Metadata } from 'next';
import BottomNav from '@/components/shared/BottomNav';
import { AuthProvider } from '@/components/AuthProvider';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'زهراء أكتوبر الجديدة',
  description: 'سوق العقارات ودليل الخدمات المحلي',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-[#0e0c0a] text-[#f2e8df] antialiased pb-16`}>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
