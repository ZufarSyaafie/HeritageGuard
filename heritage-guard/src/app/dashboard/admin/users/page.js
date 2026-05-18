"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { ShieldAlert, UserCheck, Search, Users } from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.user_metadata?.role !== 'admin') {
        router.replace("/dashboard");
        return;
      }

      setIsAdmin(true);

      // Fetch users dari tabel public.users
      // Catatan: Pastikan RLS di Supabase mengizinkan admin melihat data ini
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setUsers(data);
      }
      setLoading(false);
    };

    checkAdminAndFetchUsers();
  }, [router]);

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manajemen Pengguna</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-widest border border-primary/20">
              Admin Only
            </span>
          </div>
          <p className="text-gray-500 text-sm max-w-2xl">
            Kelola akses, verifikasi peran, dan pantau aktivitas pengguna HeritageGuard.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Cari user (nama/email)..." 
            className="bg-white border border-gray-200 focus:border-primary focus:ring-4 focus:ring-blue-100 rounded-2xl py-3 pl-10 pr-6 text-sm w-full md:w-80 transition-all outline-none font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Pengguna" 
          value={users.length} 
          subLabel="Terdaftar di sistem"
          color="bg-blue-50"
        />
        <StatsCard 
          icon={<UserCheck className="text-green-600" />} 
          label="Tenaga Ahli" 
          value={users.filter(u => u.role === 'ahli').length} 
          subLabel="Tervalidasi"
          color="bg-green-50"
        />
        <StatsCard 
          icon={<ShieldAlert className="text-amber-600" />} 
          label="Menunggu Validasi" 
          value={0} 
          subLabel="Akun baru"
          color="bg-amber-50"
        />
      </div>

      <UserTable data={users} />
    </div>
  );
}

function StatsCard({ icon, label, value, subLabel, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-gray-900">{value}</span>
          <span className="text-[11px] text-gray-500 font-bold uppercase">{subLabel}</span>
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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Pengguna</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Role / Instansi</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tanggal Daftar</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-gray-400 font-medium">
                  Belum ada data pengguna ditemukan.
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm">
                        {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-tight">{user.full_name || 'No Name'}</span>
                        <span className="text-[11px] text-gray-500 font-medium leading-none">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-gray-700">{roleDisplay[user.role] || user.role}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase bg-green-50 text-green-600 border border-green-100">
                        • AKTIF
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">
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
