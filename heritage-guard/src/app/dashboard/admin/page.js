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
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    recentInspections: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || session.user.user_metadata?.role !== 'admin') {
          router.replace("/dashboard");
          return;
        }

        setIsAdmin(true);

        const response = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || "Gagal memuat data admin");

        const s = result.data;
        setStats({
          totalUsers: s.totalUsers,
          totalInspections: s.totalInspections,
          criticalIssues: s.criticalIssues,
          safeAssets: s.safeAssets,
          weeklyActivity: s.weeklyActivity,
          recentInspections: s.recentInspections || [],
        });
      } catch (error) {
        console.error("Admin load error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  if (!isAdmin || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 transition-colors">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-dark-text-muted text-sm font-medium">Memuat data monitoring global...</p>
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
      subtitle: "Butuh perhatian segera",
    },
    {
      title: "Aset Aman",
      value: stats.safeAssets.toString(),
      icon: CheckCircle,
      colorClass: "bg-green-50 text-green-600",
      subtitle: "Kondisi baik",
    },
  ];

  const maxActivity = Math.max(...stats.weeklyActivity, 1);

  return (
    <div className="space-y-8 pb-12 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight">Admin Monitoring Panel</h1>
          <span className="px-2 py-0.5 bg-gray-900 dark:bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest">
            Pusat Kendali
          </span>
        </div>
        <p className="text-gray-500 dark:text-dark-text-muted text-sm max-w-2xl leading-relaxed">
          Pantau performa sistem, aktivitas pengguna, dan statistik deteksi kerusakan cagar budaya secara nasional.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">Aktivitas Inspeksi Global</h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-muted">Tren monitoring 7 hari terakhir</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                LIHAT LAPORAN LENGKAP <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div className="h-64 flex items-end gap-4 px-2">
              {stats.weeklyActivity.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div 
                    className="w-full bg-blue-500 dark:bg-primary/60 rounded-t-xl transition-all hover:bg-blue-600 dark:hover:bg-primary cursor-pointer" 
                    style={{ height: `${Math.max(5, (val / maxActivity) * 100)}%` }}
                  />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-muted uppercase">H-{6-i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Global Inspections List */}
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-50 dark:border-dark-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Aktivitas Terbaru Seluruh Pengguna</h3>
              <span className="px-3 py-1 bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-dark-text-muted text-[10px] font-bold rounded-full uppercase tracking-wider">Live Feed</span>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-dark-border">
              {stats.recentInspections && stats.recentInspections.length > 0 ? (
                stats.recentInspections.map((item) => (
                  <div key={item.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-dark-bg/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                        {(item.USERS?.full_name || item.USERS?.email || "UI").substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-dark-text">{item.USERS?.full_name || item.USERS?.email || "Unknown User"}</p>
                        <p className="text-[11px] text-gray-500 dark:text-dark-text-muted font-medium">
                          Melakukan scan pada <span className="text-primary font-bold">{item.ASSETS?.name || "Aset"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900 dark:text-dark-text">
                        {item.inspection_date ? new Date(item.inspection_date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "--:--"} WIB
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-dark-text-muted">
                        {item.inspection_date ? new Date(item.inspection_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : "-"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-gray-400 dark:text-dark-text-muted italic text-sm">
                  Belum ada aktivitas inspeksi global yang ditemukan.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-8 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col gap-6 transition-colors h-fit">
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">Status Sistem</h3>
          
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
            status="Active" 
            icon={<BarChart3 size={16} className="text-blue-500" />} 
          />
          
          <div className="mt-auto p-4 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-dark-border transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={16} className="text-gray-400 dark:text-dark-text-muted" />
              <span className="text-xs font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Sync Terakhir</span>
            </div>
            <p className="text-sm font-bold text-gray-900 dark:text-dark-text">Baru saja</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemStatusItem({ label, status, icon }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-dark-bg/50 rounded-2xl border border-gray-100 dark:border-dark-border transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold text-gray-700 dark:text-dark-text-muted">{label}</span>
      </div>
      <span className="text-xs font-black text-gray-900 dark:text-dark-text uppercase tracking-widest">{status}</span>
    </div>
  );
}
