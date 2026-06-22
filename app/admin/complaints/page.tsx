'use client';

import { useState, useEffect } from 'react';
import { getComplaints, resolveComplaint, Complaint } from '@/services/adminService';
import { Check, AlertTriangle, User, Clock, Building2, Store } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchComplaints();
  }, [currentPage]);

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, count, error } = await getComplaints(currentPage, itemsPerPage);

    if (error) {
      console.error('Error fetching complaints:', error);
    } else {
      setComplaints(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handleResolve = async (id: string) => {
    const { error } = await resolveComplaint(id);

    if (error) {
      console.error('Error resolving complaint:', error);
      alert('حدث خطأ أثناء حل الشكوى');
    } else {
      alert('تم حل الشكوى بنجاح');
      fetchComplaints();
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const statusLabels = {
    open: 'مفتوحة',
    resolved: 'محلولة',
  };

  const statusColors = {
    open: 'bg-[#e11d48] text-[#0e0c0a]',
    resolved: 'bg-[#dfba7a] text-[#0e0c0a]',
  };

  const targetTypeLabels = {
    property: 'عقار',
    business: 'عمل',
    user: 'مستخدم',
  };

  const targetTypeIcons = {
    property: Building2,
    business: Store,
    user: User,
  };

  return (
    <div className="p-8">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-[#f2e8df] text-3xl font-bold mb-2">إدارة الشكاوى</h1>
        <p className="text-[#a69584]">معالجة البلاغات والشكاوى الواردة</p>
      </div>

      {/* جدول الشكاوى */}
      <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#a69584]">جاري التحميل...</div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-16 h-16 text-[#a69584] mb-4" />
            <div className="text-[#a69584] text-lg mb-2">لا توجد شكاوى</div>
          </div>
        ) : (
          <>
            <div className="space-y-4 p-6">
              {complaints.map((complaint) => {
                const TargetIcon = targetTypeIcons[complaint.target_type];
                return (
                  <div
                    key={complaint.id}
                    className="bg-[#0e0c0a] border border-[#2d2722] rounded-xl p-6 hover:border-[#dfba7a]/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[#dfba7a]/10 rounded-lg flex items-center justify-center">
                            <TargetIcon className="w-5 h-5 text-[#dfba7a]" />
                          </div>
                          <div>
                            <h3 className="text-[#f2e8df] font-bold text-lg">
                              {complaint.title}
                            </h3>
                            <div className="flex items-center gap-2 text-[#a69584] text-sm">
                              <span>{targetTypeLabels[complaint.target_type]}</span>
                              <span>•</span>
                              <span>ID: {complaint.target_id}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[#a69584] mb-4 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-[#a69584]">
                            <User className="w-4 h-4" />
                            <span>{complaint.reporter_name || 'غير معروف'}</span>
                          </div>
                          {complaint.reporter_phone && (
                            <div className="flex items-center gap-2 text-[#a69584]">
                              <span>{complaint.reporter_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[#a69584]">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(complaint.created_at).toLocaleDateString('ar-EG')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            statusColors[complaint.status]
                          }`}
                        >
                          {statusLabels[complaint.status]}
                        </span>

                        {complaint.status === 'open' && (
                          <button
                            onClick={() => handleResolve(complaint.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg font-bold transition-all"
                          >
                            <Check className="w-4 h-4" />
                            تم الحل
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
    </div>
  );
}
