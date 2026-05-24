"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { ShieldAlert, UserCheck, Search, Users, Loader2 } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || session.user.user_metadata?.role !== 'admin') {
          router.replace("/dashboard");
          return;
        }

        setIsAdmin(true);

        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || "Gagal memuat data pengguna");

        setUsers(result.data || []);
      } catch (error) {
        console.error("User management load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [router]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      u.full_name?.toLowerCase().includes(q) || 
      u.email?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  if (!isAdmin || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 transition-colors">
        <Loader2 className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 dark:text-dark-text-muted text-sm font-medium">Memuat database pengguna...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 transition-colors">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight">Manajemen Pengguna</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest border border-primary/20">
              Admin Only
            </span>
          </div>
          <p className="text-gray-500 dark:text-dark-text-muted text-sm max-w-2xl">
            Kelola akses, verifikasi peran, dan pantau aktivitas pengguna HeritageGuard.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 dark:text-dark-text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Cari user (nama/email)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border focus:border-primary focus:ring-4 focus:ring-blue-100 dark:focus:ring-primary/10 rounded-2xl py-3 pl-10 pr-6 text-sm w-full md:w-80 transition-all outline-none font-medium shadow-sm dark:text-dark-text dark:placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Pengguna" 
          value={users.length} 
          subLabel="Terdaftar di sistem"
          color="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatsCard 
          icon={<UserCheck className="text-green-600" />} 
          label="Tenaga Ahli" 
          value={users.filter(u => u.role === 'ahli').length} 
          subLabel="Tervalidasi"
          color="bg-green-50 dark:bg-green-500/10"
        />
        <StatsCard 
          icon={<ShieldAlert className="text-amber-600" />} 
          label="Administrator" 
          value={users.filter(u => u.role === 'admin').length} 
          subLabel="Pengelola Sistem"
          color="bg-amber-50 dark:bg-amber-500/10"
        />
      </div>

      <UserTable data={filteredUsers} />
    </div>
  );
}

function StatsCard({ icon, label, value, subLabel, color }) {
  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex items-center gap-5 transition-colors">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900 dark:text-dark-text">{value}</span>
          <span className="text-[11px] text-gray-500 dark:text-dark-text-muted font-bold uppercase">{subLabel}</span>
        </div>
      </div>
    </div>
  );
}

function UserTable({ data }) {
  const roleDisplay = {
    'admin': 'Administrator',
    'pemerintah': 'Pemerintah',
    'swasta': 'Swasta',
    'ahli': 'Tenaga Ahli'
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-dark-border">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Pengguna</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Role / Instansi</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Tanggal Daftar</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-gray-400 dark:text-dark-text-muted font-medium italic">
                  Belum ada data pengguna ditemukan.
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-dark-text leading-tight">{user.full_name || 'No Name'}</span>
                        <span className="text-[11px] text-gray-500 dark:text-dark-text-muted font-medium leading-none">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-700 dark:text-dark-text-muted">{roleDisplay[user.role] || user.role}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500 dark:text-dark-text-muted font-medium">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                        • AKTIF
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider transition-colors">
                      Edit Akses
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
