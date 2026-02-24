import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  ChevronRight,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

const severityStyles = {
  LOW: 'bg-blue-50 text-blue-700 border-blue-100',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-100',
  CRITICAL: 'bg-red-50 text-red-700 border-red-100',
};

const statusIcons = {
  OPEN: AlertTriangle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
  CLOSED: CheckCircle,
  OVERDUE: AlertTriangle,
};

export default async function FindingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; severity?: string }>;
}) {
  const { q, severity } = await searchParams;

  const findings = await prisma.finding.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { title: { contains: q } },
            { condition: { contains: q } },
            { findingNumber: { contains: q } },
          ],
        } : {},
        severity && severity !== 'Semua Keparahan' ? { severity } : {},
      ],
    },
    include: {
      project: true,
      auditor: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Summary stats
  const totalFindings = await prisma.finding.count();
  const criticalHigh = await prisma.finding.count({
    where: { severity: { in: ['CRITICAL', 'HIGH'] } },
  });
  // Note: ActionPlan status is used for "In Progress" and "Resolved" in a real app
  // For now we'll mock these summary numbers based on finding severity or just use counts
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Temuan Audit</h1>
            <p className="text-sm text-gray-500">Pantau dan kelola semua isu audit yang teridentifikasi</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" />
              Ekspor
            </button>
            <Link href="/findings/new" className="flex items-center gap-2 px-6 py-2 bg-audit-danger text-white rounded-xl text-sm font-bold hover:bg-audit-danger/90 transition-all shadow-lg shadow-audit-danger/20">
              <Plus className="w-4 h-4" />
              Tambah Temuan
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Temuan', value: totalFindings.toString(), color: 'text-audit-primary' },
            { label: 'Kritis/Tinggi', value: criticalHigh.toString(), color: 'text-audit-danger' },
            { label: 'Sedang Berjalan', value: '0', color: 'text-audit-warning' },
            { label: 'Terselesaikan', value: '0', color: 'text-audit-success' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className={cn("text-3xl font-black", item.color)}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <form className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="Cari temuan..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              Terapkan
            </button>
            <select 
              name="severity"
              defaultValue={severity}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none"
            >
              <option>Semua Keparahan</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </form>

        {/* Findings Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Temuan</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tingkat Keparahan</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auditor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {findings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">
                      Tidak ada temuan ditemukan
                    </td>
                  </tr>
                ) : (
                  findings.map((finding) => {
                    return (
                      <tr key={finding.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-audit-accent">{finding.findingNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-audit-accent transition-colors">
                              {finding.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{finding.project.title}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border",
                            severityStyles[finding.severity as keyof typeof severityStyles]
                          )}>
                            {finding.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {finding.auditor.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(finding.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-audit-accent transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">Menampilkan {findings.length} dari {totalFindings} temuan</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

