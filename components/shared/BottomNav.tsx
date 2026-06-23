'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'الرئيسية', href: '/', icon: '🏠' },
    { name: 'العقارات', href: '/properties', icon: '🏢' },
    { name: 'البحث', href: '/search', icon: '🔍' },
    { name: 'الطوارئ', href: '/emergency', icon: '🚨' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#1a1613] border-t border-[#2d2722] flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xs font-bold transition-all ${
              isActive ? 'text-[#dfba7a]' : 'text-[#a69584] hover:text-[#dfba7a]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}