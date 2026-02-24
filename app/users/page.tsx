import DashboardLayout from '@/components/dashboard-layout';
import prisma from '@/lib/prisma';
import { Users as UsersIcon, UserPlus, Mail, Shield, MoreVertical, Search, Filter } from 'lucide-react';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q ? {
      OR: [
        { name: { contains: q } },
        { email: { contains: q } },
      ],
    } : {},
    orderBy: { name: 'asc' },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Manajemen Pengguna</h1>
            <p className="text-sm text-gray-500">Kelola akses dan peran pengguna dalam sistem</p>
          </div>
          <button className="flex items-center gap-2 bg-audit-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-audit-accent/90 transition-all shadow-lg shadow-audit-accent/20">
            <UserPlus className="w-5 h-5" />
            Tambah Pengguna
          </button>
        </div>

        {/* Filters */}
        <form className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="Cari pengguna berdasarkan nama atau email..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
            />
          </div>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" />
            Cari
          </button>
        </form>

        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Peran</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                    Tidak ada pengguna ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-audit-primary/5 flex items-center justify-center text-audit-primary font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-audit-accent" />
                        <span className="text-xs font-bold text-gray-600">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded uppercase">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

