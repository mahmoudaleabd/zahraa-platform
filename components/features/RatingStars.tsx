'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function RatingStars({
  rating,
  count,
  size = 'md',
  showCount = true,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {/* النجوم الكاملة */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeClasses[size]} fill-[#dfba7a] text-[#dfba7a]`}
          />
        ))}

        {/* النصف نجمة */}
        {hasHalfStar && (
          <div className={`relative ${sizeClasses[size]}`}>
            <Star className="fill-[#2d2722] text-[#2d2722]" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ direction: 'rtl' }}
            >
              <Star className="fill-[#dfba7a] text-[#dfba7a]" />
            </div>
          </div>
        )}

        {/* النجوم الفارغة */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeClasses[size]} fill-[#2d2722] text-[#2d2722]`}
          />
        ))}
      </div>

      {/* عدد التقييمات */}
      {showCount && count !== undefined && (
        <span className="text-[#a69584] text-sm">
          ({count.toLocaleString('ar-EG')})
        </span>
      )}

      {/* التقييم الرقمي */}
      {rating > 0 && (
        <span className="text-[#dfba7a] font-bold text-sm">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
