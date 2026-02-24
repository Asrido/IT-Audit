'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  AlertCircle, 
  Settings, 
  History, 
  Users,
  ShieldCheck,
  LogOut,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const navItems = [
  { name: 'Dasbor', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Proyek Audit', href: '/projects', icon: ClipboardCheck },
  { name: 'Temuan', href: '/findings', icon: AlertCircle },
  { name: 'Laporan', href: '/reports', icon: FileText },
  { name: 'Data Master', href: '/master-data', icon: ShieldCheck },
  { name: 'Jejak Audit', href: '/audit-trail', icon: History },
  { name: 'Pengguna', href: '/users', icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      {/* Sidebar */}
      <aside className="w-72 bg-audit-primary text-white flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-audit-accent rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">AuditPro</h1>
            <span className="text-[10px] uppercase tracking-widest opacity-60">IT Governance</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  isActive ? "active" : "text-white/70 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/50")} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute left-0 w-1 h-8 bg-audit-accent rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-audit-accent/20 border border-white/20 flex items-center justify-center overflow-hidden relative">
              <Image 
                src="https://picsum.photos/seed/auditor/100/100" 
                alt="User" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">John Auditor</p>
              <p className="text-[10px] text-white/50 uppercase tracking-wider">Auditor Senior</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-audit-primary">
              {navItems.find(item => pathname.startsWith(item.href))?.name || 'Ringkasan'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-audit-primary transition-colors relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-audit-danger rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status Sistem</p>
                <p className="text-sm font-bold text-audit-success flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 bg-audit-success rounded-full animate-pulse"></span>
                  Operasional
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
