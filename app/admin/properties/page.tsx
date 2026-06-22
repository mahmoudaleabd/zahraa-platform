'use client';

import { useState, useEffect } from 'react';
import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
  PendingProperty,
} from '@/services/adminService';
import {
  Check,
  X,
  Eye,
  Building2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; propertyId: string; reason: string }>({
    open: false,
    propertyId: '',
    reason: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProperties();
  }, [currentPage]);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, count, error } = await getPendingProperties(currentPage, itemsPerPage);

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    const { error } = await approveProperty(id);

    if (error) {
      console.error('Error approving property:', error);
      alert('حدث خطأ أثناء الموافقة على العقار');
    } else {
      alert('تمت الموافقة على العقار بنجاح');
      fetchProperties();
    }
  };

  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      alert('يرجى إدخال سبب الرفض');
      return;
    }

    const { error } = await rejectProperty(rejectModal.propertyId, rejectModal.reason);

    if (error) {
      console.error('Error rejecting property:', error);
      alert('حدث خطأ أثناء رفض العقار');
    } else {
      alert('تم رفض العقار بنجاح');
      setRejectModal({ open: false, propertyId: '', reason: '' });
      fetchProperties();
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const statusLabels = {
    pending: 'قيد الانتظار',
    approved: 'مقبول',
    rejected: 'مرفوض',
  };

  const statusColors = {
    pending: 'bg-[#a69584] text-[#0e0c0a]',
    approved: 'bg-[#dfba7a] text-[#0e0c0a]',
    rejected: 'bg-[#e11d48] text-[#0e0c0a]',
  };

  return (
    <div className="p-8">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-[#f2e8df] text-3xl font-bold mb-2">إدارة العقارات</h1>
        <p className="text-[#a69584]">مراجعة ونشر العقارات المعلقة</p>
      </div>

      {/* جدول العقارات */}
      <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#a69584]">جاري التحميل...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Building2 className="w-16 h-16 text-[#a69584] mb-4" />
            <div className="text-[#a69584] text-lg mb-2">لا توجد عقارات معلقة</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0e0c0a] border-b border-[#2d2722]">
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      العنوان
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      المعلن
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      السعر
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      الحالة
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      تاريخ الإضافة
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-[#2d2722] hover:bg-[#0e0c0a]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-[#f2e8df] font-semibold">{property.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#a69584]">{property.user_name || 'غير معروف'}</div>
                        <div className="text-[#a69584] text-xs">{property.user_phone || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#dfba7a] font-bold">
                          {property.price.toLocaleString('ar-EG')} ج.م
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            statusColors[property.status]
                          }`}
                        >
                          {statusLabels[property.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#a69584] text-sm">
                          {new Date(property.created_at).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/properties/${property.id}`}
                            target="_blank"
                            className="p-2 bg-[#0e0c0a] border border-[#2d2722] rounded-lg text-[#a69584] hover:border-[#dfba7a] hover:text-[#dfba7a] transition-all"
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {property.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(property.id)}
                                className="p-2 bg-[#dfba7a] rounded-lg text-[#0e0c0a] hover:bg-[#cda767] transition-all"
                                title="موافقة"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setRejectModal({
                                    open: true,
                                    propertyId: property.id,
                                    reason: '',
                                  })
                                }
                                className="p-2 bg-[#e11d48] rounded-lg text-[#0e0c0a] hover:bg-[#be123c] transition-all"
                                title="رفض"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* الترقيم */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-[#2d2722]">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#dfba7a] transition-colors"
                >
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#dfba7a] text-[#0e0c0a]'
                        : 'bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] hover:border-[#dfba7a]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#dfba7a] transition-colors"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* نافذة رفض العقار */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e11d48]/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#e11d48]" />
              </div>
              <h2 className="text-[#f2e8df] text-xl font-bold">رفض العقار</h2>
            </div>

            <div className="mb-4">
              <label className="block text-[#a69584] text-sm font-semibold mb-2">
                سبب الرفض
              </label>
              <textarea
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal({ ...rejectModal, reason: e.target.value })
                }
                placeholder="اكتب سبب رفض العقار..."
                className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] placeholder-[#a69584] focus:border-[#dfba7a] focus:outline-none transition-colors resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 bg-[#e11d48] hover:bg-[#be123c] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all"
              >
                تأكيد الرفض
              </button>
              <button
                onClick={() => setRejectModal({ open: false, propertyId: '', reason: '' })}
                className="flex-1 bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] font-bold py-2.5 rounded-lg hover:border-[#dfba7a] transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
