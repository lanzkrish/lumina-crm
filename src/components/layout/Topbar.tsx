'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Topbar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Format pathname for title
  const title = pathname === '/dashboard' 
    ? 'Dashboard Overview' 
    : pathname.split('/')[1]?.charAt(0).toUpperCase() + pathname.split('/')[1]?.slice(1) || 'Dashboard Overview';

  return (
    <header className="flex justify-between items-center px-8 h-20 w-full bg-surface/70 backdrop-blur-xl border-b border-white/10 shadow-sm shadow-primary/5 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Menu className="text-primary cursor-pointer w-6 h-6" />
        </div>
        <h2 className="text-[24px] font-medium text-primary tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center px-4 py-2 bg-surface-container rounded-full border border-outline-variant/20">
          <Search className="text-outline w-[18px] h-[18px] mr-2" />
          <input 
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-[14px] font-medium w-48 placeholder:text-outline" 
            placeholder="Search studio records..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 p-2 rounded-lg transition-colors active:scale-95">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-[14px] font-medium text-primary leading-tight">{user?.name || 'User'}</p>
            <p className="text-[12px] font-semibold text-on-surface-variant opacity-60 capitalize">{user?.role || 'Role'}</p>
          </div>
        </div>
        
        <button 
          onClick={() => logout()}
          className="text-on-surface-variant hover:text-primary transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
