'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Business } from '@/services/businessService';
import { Phone, MessageCircle, MapPin, Star, Building2 } from 'lucide-react';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const {
    id,
    name,
    description,
    category,
    logo,
    phone,
    address,
    featured,
  } = business;

  const categoryLabels = {
    medical: 'طبي',
    grocery: 'تموين',
    restaurant: 'مطاعم',
    cafe: 'كافيهات',
    craftsman: 'حرفيون',
    other: 'أخرى',
  };

  const whatsappMessage = encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${name}`);
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

  return (
    <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl overflow-hidden hover:-translate-y-[2px] hover:border-[#dfba7a]/50 hover:shadow-[0_0_20px_rgba(223,186,122,0.15)] transition-all duration-300 group">
      {/* الشعار */}
      <Link href={`/businesses/${id}`}>
        <div className="relative h-40 w-full bg-[#0e0c0a] flex items-center justify-center p-6">
          {logo ? (
            <Image
              src={logo}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Building2 className="w-20 h-20 text-[#a69584]" />
          )}
          {/* شارة مميز */}
          {featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-[#dfba7a] text-[#0e0c0a] rounded-full text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              مميز
            </div>
          )}
        </div>
      </Link>

      {/* تفاصيل العمل */}
      <div className="p-4">
        {/* التصنيف */}
        <div className="mb-2">
          <span className="text-[#dfba7a] text-xs font-semibold">
            {categoryLabels[category]}
          </span>
        </div>

        {/* الاسم */}
        <Link href={`/businesses/${id}`}>
          <h3 className="text-[#f2e8df] text-lg font-bold mb-2 line-clamp-1 hover:text-[#dfba7a] transition-colors">
            {name}
          </h3>
        </Link>

        {/* الوصف */}
        <p className="text-[#a69584] text-sm mb-3 line-clamp-2">
          {description}
        </p>

        {/* العنوان */}
        <div className="flex items-start gap-2 text-[#a69584] text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* أزرار التواصل */}
        <div className="flex gap-2 pt-3 border-t border-[#2d2722]/60">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] text-sm font-bold py-2.5 rounded-lg transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            واتساب
          </a>
          <a
            href={`tel:${phone}`}
            className="flex-1 flex items-center justify-center gap-2 border border-[#dfba7a] text-[#dfba7a] hover:bg-[#dfba7a]/10 text-sm font-bold py-2.5 rounded-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            اتصال
          </a>
        </div>
      </div>
    </div>
  );
}
