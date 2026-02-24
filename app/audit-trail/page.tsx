import DashboardLayout from '@/components/dashboard-layout';
import prisma from '@/lib/prisma';
import { 
  History, 
  Search, 
  Download, 
  User, 
  Database, 
  Activity,
  ShieldAlert,
  Plus,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AuditTrailPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; action?: string }>;
}) {
  const { q, action } = await searchParams;

  const logs = await prisma.auditLog.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { details: { contains: q } },
            { action: { contains: q } },
            { entity: { contains: q } },
            { entityId: { contains: q } },
          ],
        } : {},
        action && action !== 'Semua Tindakan' ? { action: { contains: action } } : {},
      ],
    },
    include: {
      user: true,
    },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Jejak Audit</h1>
            <p className="text-sm text-gray-500">Catatan permanen dari semua aktivitas sistem dan perubahan data</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" />
              Ekspor Log
            </button>
            <div className="px-4 py-2 bg-audit-primary/5 border border-audit-primary/10 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-audit-primary" />
              <span className="text-xs font-bold text-audit-primary uppercase tracking-wider">Integritas Terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <form className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="Cari berdasarkan pengguna, tindakan, atau entitas..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              Terapkan
            </button>
            <select 
              name="action"
              defaultValue={action}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none"
            >
              <option>Semua Tindakan</option>
              <option value="CREATE">Buat</option>
              <option value="UPDATE">Perbarui</option>
              <option value="DELETE">Hapus</option>
              <option value="LOGIN">Masuk</option>
            </select>
          </div>
        </form>

        {/* Timeline View */}
        <div className="glass-card p-8">
          <div className="space-y-8">
            {logs.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 font-medium">Tidak ada log ditemukan</p>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={log.id} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-audit-accent/10 group-hover:text-audit-accent transition-colors">
                      {log.action.includes('CREATE') ? <Plus className="w-5 h-5" /> : 
                       log.action.includes('UPDATE') ? <Activity className="w-5 h-5" /> : 
                       log.action.includes('LOGIN') ? <User className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                    </div>
                    {idx !== logs.length - 1 && (
                      <div className="w-px h-full bg-gray-100 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{log.user?.name || 'Sistem'}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-black text-gray-500 uppercase tracking-wider">
                          {log.action.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Database className="w-3 h-3" />
                        {log.entity}: {log.entityId}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Activity className="w-3 h-3" />
                        IP: {log.ipAddress || '-'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {logs.length > 0 && (
            <button className="w-full mt-4 py-3 text-sm font-bold text-gray-400 hover:text-audit-primary transition-colors border-t border-gray-50">
              Muat Lebih Banyak Riwayat
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

