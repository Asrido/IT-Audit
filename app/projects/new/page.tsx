'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/lib/actions';
import { Calendar, User, FileText, Target, ArrowLeft } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scope: '',
    startDate: '',
    endDate: '',
    auditorId: 'clx1234567890', // Mock IDs for now
    auditeeId: 'clx0987654321',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createProject(formData);
    setLoading(false);
    if (result.success) {
      router.push('/projects');
    } else {
      alert(result.error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-audit-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Proyek
        </button>

        <div>
          <h1 className="text-2xl font-bold text-audit-primary">Buat Proyek Audit Baru</h1>
          <p className="text-sm text-gray-500">Isi detail di bawah ini untuk merencanakan audit baru</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Judul Proyek</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                required
                type="text" 
                placeholder="Contoh: Audit Keamanan Jaringan Q3"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deskripsi</label>
            <textarea 
              rows={3}
              placeholder="Jelaskan tujuan audit ini..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ruang Lingkup (Scope)</label>
            <div className="relative">
              <Target className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea 
                required
                rows={3}
                placeholder="Sebutkan sistem atau departemen yang diaudit..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal Mulai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tanggal Selesai</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  required
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-audit-accent text-white font-bold rounded-xl shadow-lg shadow-audit-accent/20 hover:bg-audit-accent/90 transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Proyek Audit'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
