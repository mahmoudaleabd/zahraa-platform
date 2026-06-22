'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/services/propertyService';
import { Phone, MessageCircle, MapPin, Bed, Bath, Maximize } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    price,
    area,
    rooms,
    bathrooms,
    type,
    transaction_type,
    location,
    images,
    broker_phone,
  } = property;

  const firstImage = images && images.length > 0 ? images[0] : '/placeholder-property.jpg';
  const whatsappMessage = encodeURIComponent(`مرحباً، أريد الاستفسار عن العقار: ${title}`);
  const whatsappUrl = `https://wa.me/${broker_phone || ''}?text=${whatsappMessage}`;

  const typeLabels = {
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    commercial: 'تجاري',
    building: 'عمارة',
  };

  const transactionLabels = {
    sale: 'للبيع',
    rent: 'للإيجار',
  };

  return (
    <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl overflow-hidden hover:-translate-y-[2px] hover:border-[#dfba7a]/50 hover:shadow-[0_0_20px_rgba(223,186,122,0.15)] transition-all duration-300 group">
      {/* صورة العقار */}
      <Link href={`/properties/${id}`}>
        <div className="relative h-48 w-full overflow-hidden bg-[#0e0c0a]">
          <Image
            src={firstImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* شارة نوع المعاملة */}
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
              transaction_type === 'sale'
                ? 'bg-[#dfba7a] text-[#0e0c0a]'
                : 'bg-[#a69584] text-[#0e0c0a]'
            }`}
          >
            {transactionLabels[transaction_type]}
          </div>
          {/* شارة نوع العقار */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0e0c0a]/80 backdrop-blur-sm text-[#dfba7a] text-xs font-bold border border-[#dfba7a]/30">
            {typeLabels[type]}
          </div>
        </div>
      </Link>

      {/* تفاصيل العقار */}
      <div className="p-4">
        <Link href={`/properties/${id}`}>
          <h3 className="text-[#f2e8df] text-lg font-bold mb-2 line-clamp-2 hover:text-[#dfba7a] transition-colors">
            {title}
          </h3>
        </Link>

        {/* السعر */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#dfba7a] text-2xl font-bold font-price">
            {price.toLocaleString('ar-EG')}
          </span>
          <span className="text-[#a69584] text-sm">
            {transaction_type === 'sale' ? 'جنيه' : 'جنيه / شهرياً'}
          </span>
        </div>

        {/* الموقع */}
        <div className="flex items-center gap-2 text-[#a69584] text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* المواصفات */}
        <div className="flex items-center gap-4 text-[#a69584] text-sm mb-4">
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{area}م²</span>
          </div>
          {rooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{rooms}</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{bathrooms}</span>
            </div>
          )}
        </div>

        {/* أزرار التواصل */}
        <div className="flex gap-2 pt-3 border-t border-[#2d2722]/60">
          {broker_phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] text-sm font-bold py-2.5 rounded-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              واتساب
            </a>
          )}
          {broker_phone && (
            <a
              href={`tel:${broker_phone}`}
              className="flex-1 flex items-center justify-center gap-2 border border-[#dfba7a] text-[#dfba7a] hover:bg-[#dfba7a]/10 text-sm font-bold py-2.5 rounded-lg transition-all"
            >
              <Phone className="w-4 h-4" />
              اتصال
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
