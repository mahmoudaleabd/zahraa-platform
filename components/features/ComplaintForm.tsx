'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ComplaintFormProps {
  targetId: string;
  targetType: 'property' | 'business';
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ComplaintForm({
  targetId,
  targetType,
  onSubmit,
  onCancel,
  isLoading,
}: ComplaintFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    onSubmit({ title, description });
  };

  const targetTypeLabels = {
    property: 'عقار',
    business: 'عمل',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* معلومات المستهدف */}
      <div className="bg-[#0e0c0a] border border-[#2d2722] rounded-lg p-4">
        <div className="flex items-center gap-2 text-[#a69584] text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>
            الإبلاغ عن {targetTypeLabels[targetType]} (ID: {targetId})
          </span>
        </div>
      </div>

      {/* العنوان */}
      <div>
        <label className="block text-[#a69584] text-sm font-semibold mb-2">
          عنوان الشكوى *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: معلومات غير صحيحة"
          className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors"
          disabled={isLoading}
          required
        />
      </div>

      {/* الوصف */}
      <div>
        <label className="block text-[#a69584] text-sm font-semibold mb-2">
          تفاصيل الشكوى *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="اكتب تفاصيل الشكوى بالتفصيل..."
          className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors resize-none"
          rows={5}
          disabled={isLoading}
          required
        />
      </div>

      {/* تنبيه */}
      <div className="bg-[#e11d48]/10 border border-[#e11d48]/30 rounded-lg p-3">
        <p className="text-[#e11d48] text-xs">
          ⚠️ تقديم شكوى كاذبة قد يؤدي إلى إيقاف حسابك
        </p>
      </div>

      {/* أزرار الإجراء */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال الشكوى'}
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
