"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { 
  Users, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  TrendingUp,
  Activity
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInspections: 0,
    criticalIssues: 0,
    safeAssets: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.user_metadata?.role !== 'admin') {
        router.replace("/dashboard");
        return;
      }

      setIsAdmin(true);

      // Fetch Real Statistics
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      // Simulasi fetch inspeksi (Ganti dengan tabel 'inspections' jika sudah ada)
      // const { count: inspectionCount } = await supabase.from('inspections').select('*', { count: 'exact', head: true });
      
      // Data Mock untuk demo monitoring sementara jika tabel inspeksi belum di-query
      setStats({
        totalUsers: userCount || 0,
        totalInspections: 248, // Mock sementara
        criticalIssues: 12,    // Mock sementara
        safeAssets: 184,      // Mock sementara
        recentUsers: [],
      });
      
      setLoading(false);
    };

    fetchAdminStats();
  }, [router]);

  if (!isAdmin || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const ADMIN_METRICS = [
    {
      title: "Total Pengguna",
      value: stats.totalUsers.toString(),
      icon: Users,
      colorClass: "bg-blue-50 text-blue-600",
      subtitle: "Terdaftar aktif",
    },
    {
      title: "Total Inspeksi",
      value: stats.totalInspections.toString(),
      icon: Activity,
      colorClass: "bg-purple-50 text-purple-600",
      subtitle: "Seluruh pengguna",
    },
    {
      title: "Isu Kritis Global",
      value: stats.criticalIssues.toString(),
      icon: AlertTriangle,
      colorClass: "bg-red-50 text-red-600",
      subtitle: "Butuh validasi pusat",
    },
    {
      title: "Aset Aman",
      value: stats.safeAssets.toString(),
      icon: CheckCircle,
      colorClass: "bg-green-50 text-green-600",
      subtitle: "Kondisi baik",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Monitoring Panel</h1>
          <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-bold rounded uppercase tracking-widest">
            Pusat Kendali
          </span>
        </div>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
          Pantau performa sistem, aktivitas pengguna, dan statistik deteksi kerusakan cagar budaya secara nasional.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Aktivitas Inspeksi Global</h3>
              <p className="text-sm text-gray-500">Tren monitoring 7 hari terakhir</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
              LIHAT LAPORAN LENGKAP <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="h-64 flex items-end gap-4 px-2">
            {[40, 70, 45, 90, 65, 80, 55].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className="w-full bg-blue-500 rounded-t-xl transition-all hover:bg-blue-600 cursor-pointer" 
                  style={{ height: `${val}%` }}
                />
                <span className="text-[10px] font-bold text-gray-400 uppercase">H-{7-i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6">
          <h3 className="text-xl font-bold text-gray-900">Status Sistem</h3>
          
          <SystemStatusItem 
            label="Database Connection" 
            status="Stable" 
            icon={<TrendingUp size={16} className="text-green-500" />} 
          />
          <SystemStatusItem 
            label="YOLOv12 API" 
            status="Online" 
            icon={<Activity size={16} className="text-green-500" />} 
          />
          <SystemStatusItem 
            label="Storage Usage" 
            status="42%" 
            icon={<BarChart3 size={16} className="text-blue-500" />} 
          />
          
          <div className="mt-auto p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sync Terakhir</span>
            </div>
            <p className="text-sm font-bold text-gray-900">Baru saja</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemStatusItem({ label, status, icon }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold text-gray-700">{label}</span>
      </div>
      <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{status}</span>
    </div>
  );
}
