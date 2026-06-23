import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'منصة زهراء أكتوبر الجديدة | عقارات ودليل خدمات متكامل',
  description: 'البوابة الرقمية الرسمية والوجهة الأولى الشاملة لسكان ومستثمري مدينة زهراء أكتوبر الجديدة. عقارات للبيع والإيجار، دليل خدمات، صيدليات، مطاعم، طوارئ ومواصلات.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <body className="bg-charcoal-deep text-beige-snow min-h-screen antialiased selection:bg-gold-primary selection:text-charcoal-deep">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
import './globals.css';
import { Cairo } from 'next/font/google';
import BottomNav from '@/components/shared/BottomNav';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700'] });

export const metadata = {
  title: 'زهراء أكتوبر الجديدة',
  description: 'سوق العقارات ودليل الخدمات المحلي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-[#0e0c0a] text-[#f2e8df] antialiased pb-16`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
