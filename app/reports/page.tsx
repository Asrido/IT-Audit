import DashboardLayout from '@/components/dashboard-layout';
import { FileText, Download, Filter, Search } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-audit-primary">Laporan Audit</h1>
            <p className="text-sm text-gray-500">Hasilkan dan unduh laporan audit komprehensif</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Laporan Ringkasan Eksekutif', desc: 'Ringkasan tingkat tinggi untuk manajemen.' },
            { title: 'Laporan Temuan Detail', desc: 'Daftar lengkap temuan dengan rekomendasi.' },
            { title: 'Laporan Status Kepatuhan', desc: 'Analisis kepatuhan terhadap standar (ISO/COBIT).' },
          ].map((report) => (
            <div key={report.title} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-audit-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="text-audit-accent w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-audit-primary mb-2">{report.title}</h3>
                <p className="text-sm text-gray-500 mb-6">{report.desc}</p>
              </div>
              <button className="w-full py-3 bg-gray-50 hover:bg-audit-accent hover:text-white text-audit-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Unduh PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
