"use client";

import { Search, Bell, Settings, FolderOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const getBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Dashboard';
    
    const lastPath = paths[paths.length - 1];
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 w-full shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-sm">
        <FolderOpen size={16} className="text-gray-400" />
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-bold tracking-tight">
          {getBreadcrumb()}
        </span>
      </div>
      
      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Cari inspeksi..." 
            className="bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-blue-100 rounded-lg py-2 pl-10 pr-4 text-sm w-64 transition-all outline-none"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-gray-600 transition-colors">
            <Bell size={20} />
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 leading-none">Arch. Hendrawan</span>
            <span className="text-[11px] text-gray-500 mt-1 leading-none">Super Admin</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
            <img 
              src="https://ui-avatars.com/api/?name=Arch+Hendrawan&background=264bdd&color=fff" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}