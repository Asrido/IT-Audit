import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const activeAuditsCount = await prisma.auditProject.count({
    where: { status: 'IN_PROGRESS' }
  });
  
  const openFindingsCount = await prisma.finding.count();
  
  const recentProjects = await prisma.auditProject.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      auditor: true,
      _count: {
        select: { findings: true }
      }
    }
  });

  const recentLogs = await prisma.auditLog.findMany({
    take: 4,
    orderBy: { timestamp: 'desc' },
    include: { user: true }
  });

  const stats = [
    { 
      name: 'Audit Aktif', 
      value: activeAuditsCount.toString(), 
      change: '+2', 
      trend: 'up', 
      icon: ClipboardCheck,
      color: 'text-audit-accent',
      bg: 'bg-audit-accent/10',
      href: '/projects'
    },
    { 
      name: 'Temuan Terbuka', 
      value: openFindingsCount.toString(), 
      change: '-5', 
      trend: 'down', 
      icon: AlertCircle,
      color: 'text-audit-danger',
      bg: 'bg-audit-danger/10',
      href: '/findings'
    },
    { 
      name: 'Skor Kepatuhan', 
      value: '84%', 
      change: '+4%', 
      trend: 'up', 
      icon: CheckCircle2,
      color: 'text-audit-success',
      bg: 'bg-audit-success/10',
      href: '/master-data'
    },
    { 
      name: 'Rata-rata Resolusi', 
      value: '14h', 
      change: '-2h', 
      trend: 'down', 
      icon: Clock,
      color: 'text-audit-warning',
      bg: 'bg-audit-warning/10',
      href: '/audit-trail'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href} className="glass-card p-6 flex items-start justify-between hover:shadow-md transition-all group">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-audit-primary group-hover:text-audit-accent transition-colors">{stat.value}</h3>
                  <span className={cn(
                    "text-xs font-bold flex items-center gap-0.5",
                    stat.trend === 'up' ? "text-audit-success" : "text-audit-danger"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={cn("p-3 rounded-xl transition-colors", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-audit-primary">Tren Kepatuhan</h3>
                  <p className="text-sm text-gray-500">Skor kepatuhan bulanan di semua domain</p>
                </div>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-audit-accent/20">
                  <option>6 Bulan Terakhir</option>
                  <option>Tahun Terakhir</option>
                </select>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="h-[300px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 font-medium">Grafik Visualisasi Kepatuhan</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-audit-primary mb-6">Proyek Audit Terbaru</h3>
              <div className="space-y-4">
                {recentProjects.length === 0 ? (
                  <p className="text-center py-10 text-gray-400">Belum ada proyek audit</p>
                ) : (
                  recentProjects.map((project, i) => (
                    <Link 
                      key={project.id} 
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-audit-primary/5 flex items-center justify-center text-audit-primary font-bold">
                        0{i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-audit-accent transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Tenggat: {new Date(project.endDate).toLocaleDateString('id-ID')} • Auditor: {project.auditor.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <div 
                            className="h-full bg-audit-accent rounded-full" 
                            style={{ width: project.status === 'COMPLETED' ? '100%' : project.status === 'IN_PROGRESS' ? '65%' : '0%' }}
                          ></div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {project.status === 'COMPLETED' ? '100% Selesai' : project.status === 'IN_PROGRESS' ? '65% Selesai' : '0% Selesai'}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-lg font-bold text-audit-primary mb-6">Aktivitas Terbaru</h3>
              <div className="space-y-6">
                {recentLogs.length === 0 ? (
                  <p className="text-center py-10 text-gray-400 text-sm">Belum ada aktivitas</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-2 h-2 bg-audit-accent rounded-full mt-1.5"></div>
                        <div className="absolute top-4 left-1 w-px h-full bg-gray-100"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-bold">{log.user?.name || 'Sistem'}</span> {log.action.replace('_', ' ').toLowerCase()}
                        </p>
                        <p className="text-xs text-audit-accent font-medium mt-0.5">{log.entity}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                          {new Date(log.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link 
                href="/audit-trail"
                className="w-full mt-8 py-3 text-sm font-bold text-audit-accent hover:bg-audit-accent/5 rounded-xl transition-colors flex items-center justify-center"
              >
                Lihat Semua Aktivitas
              </Link>
            </div>

            <div className="glass-card p-8 bg-audit-primary text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Kesiapan Audit</h3>
                <p className="text-sm text-white/70 mb-6">Skor Anda saat ini berdasarkan kontrol aktif dan bukti.</p>
                <div className="text-4xl font-black mb-2">A+</div>
                <div className="text-xs font-bold text-audit-success uppercase tracking-widest">Posisi Sangat Baik</div>
              </div>
              <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

