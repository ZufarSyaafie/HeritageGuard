"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const role = user?.user_metadata?.role || 'user';

  const navItems = [
    { name: 'Dashboard',        path: '/dashboard',          icon: LayoutDashboard },
    { name: 'Upload Citra',     path: '/dashboard/upload',   icon: UploadCloud     },
    { name: 'Histori Inspeksi', path: '/dashboard/histori',  icon: History         },
    // Menu khusus admin
    ...(role === 'admin' ? [
      { name: 'Monitoring Global', path: '/dashboard/admin',       icon: LayoutDashboard },
      { name: 'Manajemen User',    path: '/dashboard/admin/users', icon: ShieldCheck },
    ] : []),
    { name: 'Profil',           path: '/dashboard/profil',   icon: UserCircle      },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err.message);
    }
  };

  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 relative`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all z-50 text-gray-400 hover:text-gray-600 group"
      >
        {isOpen ? (
          <ChevronLeft size={24} strokeWidth={2} className="group-hover:-translate-x-0.3 transition-transform" />
        ) : (
          <ChevronRight size={24} strokeWidth={2} className="group-hover:translate-x-0.3 transition-transform" />
        )}
      </button>

      <div className="p-6">
        <Logo
          size={isOpen ? 36 : 40}
          showText={isOpen}
          href="/dashboard"
          className={!isOpen ? "justify-center" : ""}
        />
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group ${
                isActive
                  ? 'bg-blue-50 text-primary font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isOpen && <span className="text-sm">{item.name}</span>}
              {isActive && (
                <div className="absolute right-0 top-1 bottom-1 w-1 bg-primary rounded-l-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={20} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
