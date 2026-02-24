import DashboardLayout from '@/components/dashboard-layout';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User as UserIcon,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  PLANNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  REVIEW: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const projects = await prisma.auditProject.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
        } : {},
        status && status !== 'Semua Status' ? { status } : {},
      ],
    },
    include: {
      auditor: true,
      auditee: true,
      _count: {
        select: { findings: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Proyek Audit</h1>
            <p className="text-sm text-gray-500">Kelola dan pantau semua penugasan audit TI</p>
          </div>
          <Link href="/projects/new" className="flex items-center gap-2 bg-audit-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-audit-accent/90 transition-all shadow-lg shadow-audit-accent/20">
            <Plus className="w-5 h-5" />
            Proyek Baru
          </Link>
        </div>

        {/* Filters */}
        <form className="glass-card p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="Cari proyek..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <Filter className="w-4 h-4" />
              Terapkan
            </button>
            <select 
              name="status"
              defaultValue={status}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 outline-none"
            >
              <option>Semua Status</option>
              <option value="PLANNED">Direncanakan</option>
              <option value="IN_PROGRESS">Sedang Berjalan</option>
              <option value="COMPLETED">Selesai</option>
            </select>
          </div>
        </form>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full py-20 text-center glass-card">
              <p className="text-gray-400 font-medium">Tidak ada proyek ditemukan</p>
            </div>
          ) : (
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="glass-card p-6 hover:shadow-md transition-all group cursor-pointer border-transparent hover:border-audit-accent/20">
                <div className="flex items-start justify-between mb-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider",
                    statusColors[project.status as keyof typeof statusColors]
                  )}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-audit-primary mb-4 group-hover:text-audit-accent transition-colors">
                  {project.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>{project.auditor.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(project.startDate).toLocaleDateString('id-ID')} - {new Date(project.endDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span>{project._count.findings} Temuan Teridentifikasi</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kemajuan</span>
                    <span className="text-xs font-bold text-audit-primary">
                      {project.status === 'COMPLETED' ? '100%' : project.status === 'IN_PROGRESS' ? '65%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        project.status === 'COMPLETED' ? "bg-audit-success" : "bg-audit-accent"
                      )}
                      style={{ width: project.status === 'COMPLETED' ? '100%' : project.status === 'IN_PROGRESS' ? '65%' : '0%' }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

