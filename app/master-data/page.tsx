import DashboardLayout from '@/components/dashboard-layout';
import prisma from '@/lib/prisma';
import { ShieldCheck, Book, Layers, CheckSquare } from 'lucide-react';

export default async function MasterDataPage() {
  const standardsCount = await prisma.auditStandard.count();
  const domainsCount = await prisma.domain.count();
  const controlsCount = await prisma.control.count();
  
  const standards = await prisma.auditStandard.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Data Master</h1>
            <p className="text-sm text-gray-500">Kelola standar audit, domain, dan kontrol</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Standar Audit', count: standardsCount.toString(), icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'Domain', count: domainsCount.toString(), icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
            { title: 'Kontrol', count: controlsCount.toString(), icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'Framework Kustom', count: '0', icon: Book, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((item) => (
            <div key={item.title} className="glass-card p-6">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className={`${item.color} w-6 h-6`} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
              <p className="text-2xl font-black text-audit-primary">{item.count}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-bold text-audit-primary mb-6">Standar Aktif</h3>
          <div className="space-y-4">
            {standards.length === 0 ? (
              <p className="text-center py-10 text-gray-400">Belum ada standar audit</p>
            ) : (
              standards.map((standard) => (
                <div key={standard.id} className="p-4 border border-gray-100 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{standard.name}</h4>
                    <p className="text-xs text-gray-500">{standard.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-audit-success/10 text-audit-success text-[10px] font-bold rounded-full uppercase">Aktif</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

