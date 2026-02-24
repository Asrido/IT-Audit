import DashboardLayout from '@/components/dashboard-layout';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // In a real app, we'd fetch from DB. For now, mock or try to fetch.
  // const project = await prisma.auditProject.findUnique({
  //   where: { id },
  //   include: { checklists: { include: { control: true } }, findings: true }
  // });

  // Mock data for demonstration if DB is empty or for specific demo IDs
  const project = {
    id,
    title: 'ISO 27001:2022 Internal Audit',
    status: 'IN_PROGRESS',
    scope: 'Seluruh infrastruktur IT dan operasional data center.',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    checklists: [
      { id: '1', control: { code: 'A.5.1', name: 'Kebijakan Keamanan Informasi' }, status: 'COMPLIANT', notes: 'Kebijakan sudah diperbarui Jan 2024.' },
      { id: '2', control: { code: 'A.5.15', name: 'Kontrol Akses' }, status: 'PARTIAL', notes: 'Review akses belum dilakukan secara rutin.' },
      { id: '3', control: { code: 'A.8.10', name: 'Penghapusan Informasi' }, status: 'NON_COMPLIANT', notes: 'Prosedur penghapusan data belum formal.' },
    ],
    findings: [
      { id: 'F-2024-001', title: 'Kurangnya Proses Review Akses Formal', severity: 'HIGH' }
    ]
  };

  if (!project) notFound();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Project Header */}
        <div className="glass-card p-8 bg-audit-primary text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-audit-accent rounded-full text-[10px] font-black uppercase tracking-widest">
                {project.status.replace('_', ' ')}
              </span>
              <span className="text-white/50 text-xs font-mono">{project.id}</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Ruang Lingkup</p>
                <p className="text-sm text-white/80">{project.scope}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Periode</p>
                <p className="text-sm text-white/80">{project.startDate} — {project.endDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Kemajuan</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-audit-success w-2/3"></div>
                  </div>
                  <span className="text-sm font-bold">65%</span>
                </div>
              </div>
            </div>
          </div>
          <ShieldCheck className="absolute -bottom-8 -right-8 w-64 h-64 text-white/5 -rotate-12" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Execution Checklist */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-audit-primary">Daftar Periksa Audit</h3>
              <button className="text-sm font-bold text-audit-accent hover:underline">Lihat Semua Kontrol</button>
            </div>
            
            <div className="space-y-4">
              {project.checklists.map((item) => (
                <div key={item.id} className="glass-card p-6 hover:border-audit-accent/20 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono font-bold text-audit-accent bg-audit-accent/5 px-2 py-0.5 rounded">
                          {item.control.code}
                        </span>
                        <h4 className="font-bold text-gray-900">{item.control.name}</h4>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.notes}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-audit-accent transition-colors">
                          <FileText className="w-3 h-3" />
                          Bukti (2)
                        </button>
                        <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-audit-accent transition-colors">
                          <MessageSquare className="w-3 h-3" />
                          Catatan
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                        item.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-600' :
                        item.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                      )}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Findings & Actions */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-audit-primary">Temuan (1)</h3>
                <button className="p-2 bg-audit-danger/10 text-audit-danger rounded-lg hover:bg-audit-danger/20 transition-colors">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {project.findings.map((finding) => (
                  <div key={finding.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-audit-danger">{finding.id}</span>
                      <span className="text-[10px] font-bold text-audit-danger uppercase tracking-widest">{finding.severity}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-3">{finding.title}</p>
                    <button className="w-full py-2 text-xs font-bold text-audit-accent hover:bg-audit-accent/5 rounded-lg transition-colors flex items-center justify-center gap-2">
                      Detail Temuan
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 bg-audit-accent text-white">
              <h3 className="text-lg font-bold mb-4">Laporan Akhir</h3>
              <p className="text-sm text-white/70 mb-6">Hasilkan draf laporan audit berdasarkan hasil pelaksanaan saat ini.</p>
              <button className="w-full py-4 bg-white text-audit-accent font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                <FileText className="w-5 h-5" />
                Draf Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
