"use client";

import { useEffect, useState } from "react";
import ProfilAvatar from "@/components/profil/ProfilAvatar";
import ProfilForm from "@/components/profil/ProfilForm";
import { supabase } from "@/utils/supabase";

export default function ProfilPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const rawRole = user?.user_metadata?.role || 'ahli';
  
  const roleDisplay = {
    'admin': 'Administrator',
    'pemerintah': 'Instansi Pemerintah',
    'swasta': 'Lembaga Swasta',
    'ahli': 'Tenaga Ahli'
  };

  const profileRole = roleDisplay[rawRole] || rawRole;

  return (
    <div className="max-w-2xl space-y-8 pb-12 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight">Profil Saya</h1>
          <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase tracking-widest">
            {profileRole}
          </span>
        </div>
        <p className="text-gray-500 dark:text-dark-text-muted text-sm">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-sm p-8 transition-colors">
        <ProfilAvatar name={fullName} role={profileRole} />
      </div>

      <ProfilForm initialUser={user} />
    </div>
  );
}
