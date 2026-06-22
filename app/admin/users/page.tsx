'use client';

import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, verifyBroker, User } from '@/services/adminService';
import { Shield, ShieldCheck, User as UserIcon, Phone, Mail, Calendar, Check } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [roleModal, setRoleModal] = useState<{ open: boolean; userId: string; role: User['role'] }>({
    open: false,
    userId: '',
    role: 'normal_user',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, count, error } = await getUsers(currentPage, itemsPerPage);

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
      setTotalCount(count);
    }
    setLoading(false);
  };

  const handleRoleChange = async () => {
    const { error } = await updateUserRole(roleModal.userId, roleModal.role);

    if (error) {
      console.error('Error updating user role:', error);
      alert('حدث خطأ أثناء تحديث دور المستخدم');
    } else {
      alert('تم تحديث دور المستخدم بنجاح');
      setRoleModal({ open: false, userId: '', role: 'normal_user' });
      fetchUsers();
    }
  };

  const handleVerify = async (userId: string) => {
    const { error } = await verifyBroker(userId);

    if (error) {
      console.error('Error verifying broker:', error);
      alert('حدث خطأ أثناء توثيق الوسيط');
    } else {
      alert('تم توثيق الوسيط بنجاح');
      fetchUsers();
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const roleLabels = {
    normal_user: 'مستخدم عادي',
    broker: 'وسيط',
    business_owner: 'صاحب عمل',
    admin: 'مدير',
  };

  const roleColors = {
    normal_user: 'bg-[#a69584] text-[#0e0c0a]',
    broker: 'bg-[#dfba7a] text-[#0e0c0a]',
    business_owner: 'bg-[#cda767] text-[#0e0c0a]',
    admin: 'bg-[#e11d48] text-[#0e0c0a]',
  };

  return (
    <div className="p-8">
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="text-[#f2e8df] text-3xl font-bold mb-2">إدارة المستخدمين</h1>
        <p className="text-[#a69584]">إدارة الصلاحيات والأدوار</p>
      </div>

      {/* جدول المستخدمين */}
      <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-[#a69584]">جاري التحميل...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <UserIcon className="w-16 h-16 text-[#a69584] mb-4" />
            <div className="text-[#a69584] text-lg mb-2">لا يوجد مستخدمين</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0e0c0a] border-b border-[#2d2722]">
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      الاسم
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      رقم الهاتف
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      البريد الإلكتروني
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      الدور
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      حالة التحقق
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      تاريخ التسجيل
                    </th>
                    <th className="text-right px-6 py-4 text-[#a69584] font-semibold text-sm">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#2d2722] hover:bg-[#0e0c0a]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#dfba7a]/10 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-[#dfba7a]" />
                          </div>
                          <div className="text-[#f2e8df] font-semibold">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#a69584]">
                          <Phone className="w-4 h-4" />
                          <span>{user.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.email ? (
                          <div className="flex items-center gap-2 text-[#a69584]">
                            <Mail className="w-4 h-4" />
                            <span className="line-clamp-1">{user.email}</span>
                          </div>
                        ) : (
                          <span className="text-[#a69584]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            roleColors[user.role]
                          }`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.verified ? (
                          <div className="flex items-center gap-2 text-[#dfba7a]">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-sm font-semibold">موثق</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#a69584]">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">غير موثق</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#a69584] text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setRoleModal({
                                open: true,
                                userId: user.id,
                                role: user.role,
                              })
                            }
                            className="px-3 py-1.5 bg-[#0e0c0a] border border-[#2d2722] rounded-lg text-[#a69584] text-xs font-bold hover:border-[#dfba7a] hover:text-[#dfba7a] transition-all"
                          >
                            تغيير الدور
                          </button>
                          {user.role === 'broker' && !user.verified && (
                            <button
                              onClick={() => handleVerify(user.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#dfba7a] rounded-lg text-[#0e0c0a] text-xs font-bold hover:bg-[#cda767] transition-all"
                            >
                              <Check className="w-3 h-3" />
                              توثيق
                            </button>
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

      {/* نافذة تغيير الدور */}
      {roleModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1613] border border-[#2d2722] rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#dfba7a]/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#dfba7a]" />
              </div>
              <h2 className="text-[#f2e8df] text-xl font-bold">تغيير دور المستخدم</h2>
            </div>

            <div className="mb-4">
              <label className="block text-[#a69584] text-sm font-semibold mb-2">
                الدور الجديد
              </label>
              <select
                value={roleModal.role}
                onChange={(e) =>
                  setRoleModal({ ...roleModal, role: e.target.value as User['role'] })
                }
                className="w-full bg-[#0e0c0a] border border-[#2d2722] rounded-lg px-4 py-3 text-[#f2e8df] focus:border-[#dfba7a] focus:outline-none transition-colors"
              >
                <option value="normal_user">مستخدم عادي</option>
                <option value="broker">وسيط</option>
                <option value="business_owner">صاحب عمل</option>
                <option value="admin">مدير</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRoleChange}
                className="flex-1 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] font-bold py-2.5 rounded-lg transition-all"
              >
                تأكيد التغيير
              </button>
              <button
                onClick={() => setRoleModal({ open: false, userId: '', role: 'normal_user' })}
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
