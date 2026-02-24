'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createFinding } from '@/lib/actions';
import { AlertCircle, ArrowLeft, FileText, ShieldAlert, Target, User } from 'lucide-react';

export default function NewFindingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    condition: '',
    criteria: '',
    cause: '',
    impact: '',
    recommendation: '',
    severity: 'MEDIUM',
    projectId: 'clx_project_123', // Mock
    auditeeId: 'clx_auditee_456', // Mock
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createFinding(formData);
    setLoading(false);
    if (result.success) {
      router.push('/findings');
    } else {
      alert(result.error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-audit-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div>
          <h1 className="text-2xl font-bold text-audit-primary">Input Temuan Audit Baru</h1>
          <p className="text-sm text-gray-500">Dokumentasikan temuan audit dengan detail kondisi, kriteria, dan rekomendasi</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Judul Temuan</label>
                <input 
                  required
                  type="text" 
                  placeholder="Contoh: Kurangnya Review Akses Bulanan"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tingkat Keparahan</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                >
                  <option value="LOW">LOW (Rendah)</option>
                  <option value="MEDIUM">MEDIUM (Sedang)</option>
                  <option value="HIGH">HIGH (Tinggi)</option>
                  <option value="CRITICAL">CRITICAL (Kritis)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kondisi (Condition)</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Apa yang ditemukan saat ini?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kriteria (Criteria)</label>
              <textarea 
                required
                rows={3}
                placeholder="Apa standar atau kebijakan yang seharusnya?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.criteria}
                onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Penyebab (Cause)</label>
              <textarea 
                required
                rows={3}
                placeholder="Mengapa hal ini terjadi?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.cause}
                onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dampak (Impact)</label>
              <textarea 
                required
                rows={3}
                placeholder="Apa risiko atau konsekuensi dari temuan ini?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rekomendasi</label>
              <textarea 
                required
                rows={3}
                placeholder="Apa langkah perbaikan yang disarankan?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-audit-accent/20 outline-none transition-all"
                value={formData.recommendation}
                onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-audit-danger text-white font-bold rounded-xl shadow-lg shadow-audit-danger/20 hover:bg-audit-danger/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              {loading ? 'Menyimpan...' : 'Simpan Temuan Audit'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
