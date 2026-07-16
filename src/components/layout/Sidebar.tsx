'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Plus,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { X } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Quotations', href: '/quotations', icon: FileText },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Blueprint', href: '/blueprints', icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 flex flex-col h-full w-64 
        bg-surface/95 dark:bg-inverse-surface/95 backdrop-blur-3xl 
        border-r border-white/20 dark:border-outline-variant/10 
        shadow-2xl shadow-primary/4 py-8 space-y-2 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="md:hidden absolute top-4 right-4">
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-on-surface-variant hover:text-primary bg-surface-variant/50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      {/* Header / Logo */}
      <div className="px-6 mb-8">
        <h1 className="text-[24px] font-medium text-primary tracking-tighter">Arjun Films</h1>
        <p className="text-on-surface-variant text-[14px] font-medium opacity-70">Premium Photography</p>
      </div>

      {/* CTA */}
      <div className="px-4 mb-6">
        <Link href="/quotations" className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          <span className="text-[14px] font-medium">Add Quotation</span>
        </Link>
      </div>

      {/* Main Tabs */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg mx-2 my-1 px-4 py-3 cursor-pointer group transition-all ${
                isActive 
                  ? 'bg-primary text-on-primary' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/50'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <span className="text-[14px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Tabs */}
      <div className="pt-6 border-t border-white/10 mx-2">
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3 text-on-surface-variant hover:text-destructive hover:bg-error-container/20 mx-2 my-1 rounded-lg px-4 py-3 cursor-pointer group transition-all"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          <span className="text-[14px] font-medium">Log Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
