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
