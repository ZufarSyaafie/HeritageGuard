"use client";

import { useEffect, useState } from "react";
import DamageDetection from "@/components/dashboard/DamageDetection";
import AnalysisSummary from "@/components/dashboard/AnalysisSummary";
import HealthScore from "@/components/dashboard/HealthScore";
import AssetInfo from "@/components/dashboard/AssetInfo";
import ActionCards from "@/components/dashboard/ActionCards";
import MetricCard from "@/components/dashboard/MetricCard";
import DamageChart from "@/components/dashboard/DamageChart";
import { Building2, ScanLine, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase";
import { getDashboardData } from "@/api/dashboard";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    {
      title: "Total Aset Terpantau",
      value: "0",
      icon: Building2,
      colorClass: "bg-blue-50 text-blue-600",
      subtitle: "Aktif dimonitor",
    },
    {
      title: "Inspeksi Bulan Ini",
      value: "0",
      icon: ScanLine,
      colorClass: "bg-purple-50 text-purple-600",
      subtitle: `Sejak ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
    },
    {
      title: "Tingkat Kritis",
      value: "0",
      icon: AlertTriangle,
      colorClass: "bg-red-50 text-red-600",
      subtitle: "Butuh perhatian segera",
    },
    {
      title: "Tingkat Aman",
      value: "0",
      icon: CheckCircle,
      colorClass: "bg-green-50 text-green-600",
      subtitle: "Kondisi terpantau baik",
    },
  ]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat dashboard");
        }

        const dashboardData = result.data;
        setData(dashboardData);

        if (dashboardData.stats) {
          setMetrics([
            {
              title: "Total Aset Terpantau",
              value: dashboardData.stats.totalAssets.toString(),
              icon: Building2,
              colorClass: "bg-blue-50 text-blue-600",
              subtitle: "Aktif dimonitor",
            },
            {
              title: "Inspeksi Bulan Ini",
              value: dashboardData.stats.inspectionsThisMonth.toString(),
              icon: ScanLine,
              colorClass: "bg-purple-50 text-purple-600",
              subtitle: `Sejak ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`,
            },
            {
              title: "Tingkat Kritis",
              value: dashboardData.stats.criticalCount.toString(),
              icon: AlertTriangle,
              colorClass: "bg-red-50 text-red-600",
              subtitle: "Butuh perhatian segera",
            },
            {
              title: "Tingkat Aman",
              value: dashboardData.stats.safeCount.toString(),
              icon: CheckCircle,
              colorClass: "bg-green-50 text-green-600",
              subtitle: "Kondisi terpantau baik",
            },
          ]);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 transition-colors">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight">
          HeritageGuard AI Dashboard
        </h1>
        <p className="text-gray-500 dark:text-dark-text-muted text-sm max-w-2xl leading-relaxed">
          Visualisasi deteksi anomali struktural menggunakan computer vision
          YOLOv12 untuk preservasi situs cagar budaya.
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <DamageChart data={data?.trendData} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <DamageDetection inspection={data?.inspection} detections={data?.detections} />
        </div>
        <div className="flex flex-col gap-8">
          <AnalysisSummary summaries={data?.summaries} />
          <HealthScore score={data?.inspection?.overall_health_score} inspectionId={data?.inspection?.id} />
          <AssetInfo asset={data?.asset} inspection={data?.inspection} />
        </div>
      </div>

      <ActionCards />
    </div>
  );
}
