"use client";

import { useEffect, useState, useRef } from 'react';
import { Search, Settings, FolderOpen, Sun, Moon, LogOut, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });
  const dropdownRef = useRef(null);

  // 1. Initial Load
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Continuous Sync with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean);
    if (paths.length === 0) return 'Dashboard';

    const lastPath = paths[paths.length - 1];
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1).replace(/-/g, ' ');
  };

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const rawRole = user?.user_metadata?.role || 'User';

  const roleDisplay = {
    'admin': 'Administrator',
    'pemerintah': 'Instansi Pemerintah',
    'swasta': 'Lembaga Swasta',
    'ahli': 'Tenaga Ahli'
  };

  const authRole = roleDisplay[rawRole] || rawRole;
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=264bdd&color=fff`;

  return (
    <header className="h-16 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border flex items-center justify-between px-8 w-full shrink-0 transition-colors">
      <div className="flex items-center gap-3 text-sm">
        <FolderOpen size={16} className="text-gray-400 dark:text-dark-text-muted" />
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 dark:text-dark-text font-bold tracking-tight">
          {getBreadcrumb()}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-400">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`hover:text-gray-600 dark:hover:text-dark-text transition-colors ${isSettingsOpen ? 'text-primary' : ''}`}
            >
              <Settings size={20} />
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border py-2 z-[100] animate-in fade-in zoom-in duration-150">
                <div className="px-4 py-2 border-b border-gray-50 dark:border-dark-border mb-2">
                  <p className="text-[10px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Pengaturan</p>
                </div>

                <button 
                  onClick={toggleTheme}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-bold text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-border'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </button>

                <button 
                  onClick={() => { router.push('/dashboard/profil'); setIsSettingsOpen(false); }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                >
                  <User size={16} />
                  <span>Edit Profil</span>
                </button>

                <div className="my-2 border-t border-gray-50 dark:border-dark-border" />

                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-dark-border">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 dark:text-dark-text leading-none">{fullName}</span>
            <span className="text-[11px] text-gray-500 dark:text-dark-text-muted mt-1 leading-none uppercase tracking-wider">{authRole}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-bg overflow-hidden border border-gray-100 dark:border-dark-border">
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
