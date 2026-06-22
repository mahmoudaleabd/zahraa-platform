'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ReviewForm({ onSubmit, onCancel, isLoading }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('يرجى اختيار تقييم');
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* تقييم النجوم */}
      <div>
        <label className="block text-[#a69584] text-sm font-semibold mb-2">
          التقييم
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
              disabled={isLoading}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-[#dfba7a] text-[#dfba7a]'
                    : 'text-[#2d2722]'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* حقل التعليق */}
      <div>
        <label className="block text-[#a69584] text-sm font-semibold mb-2">
          التعليق (اختياري)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="اكتب تجربتك مع هذا الوسيط/العمل..."
          className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors resize-none"
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* أزرار الإجراء */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || rating === 0}
          className="flex-1 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] font-bold py-2.5 rounded-lg hover:border-[#dfba7a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
