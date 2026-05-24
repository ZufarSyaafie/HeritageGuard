"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useScanStore from "@/store/useScanStore";
import ReportHeader from "@/components/laporan/ReportHeader";
import ReportBody from "@/components/laporan/ReportBody";
import ReportActions from "@/components/laporan/ReportActions";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function LaporanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inspectionId = searchParams.get("id");
  
  const { scanStatus, imagePreview, detections, assetMeta } = useScanStore();
  
  const [historyData, setHistoryData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }

        // Always fetch current user for fresh reports
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (inspectionId) {
          const response = await fetch(`/api/history/detail?id=${inspectionId}`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          }); 
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Gagal memuat laporan");
          setHistoryData(result.data);
        }
      } catch (err) {
        console.error("Report init error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, [inspectionId, router]);

  useEffect(() => {
    if (!loading && historyData && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
        const newUrl = window.location.pathname + (inspectionId ? `?id=${inspectionId}` : "");
        window.history.replaceState({}, "", newUrl);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, historyData, searchParams, inspectionId]);

  // Determine which data to show
  const activeData = useMemo(() => {
    if (inspectionId && historyData) {
      console.log("[Laporan Page] Mapping historyData:", historyData);
      
      // Robustly extract user info (handle object or array)
      const userObj = Array.isArray(historyData.USERS) ? historyData.USERS[0] : historyData.USERS;
      const inspector = userObj?.full_name || userObj?.email || "Unknown Inspector";
      
      return {
        id: historyData.id,
        image: historyData.image_url,
        detections: (historyData.DETECTIONS || []).map(d => ({
          label: d.type,
          confidence: d.confidence_score,
          bbox: { x: d.bbox_x, y: d.bbox_y, width: d.bbox_width, height: d.bbox_height }
        })),
        meta: {
          buildingName: historyData.ASSETS?.name,
          location: historyData.ASSETS?.location,
          inspectedAt: historyData.inspection_date,
          inspectorName: inspector
        }
      };
    }
    
    return {
      id: `HG-${Date.now().toString(36).toUpperCase()}`,
      image: imagePreview,
      detections: detections,
      meta: {
        ...assetMeta,
        inspectorName: currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0] || "Inspector"
      }
    };
  }, [inspectionId, historyData, imagePreview, detections, assetMeta, currentUser]);

  // Redirect if no data and not loading
  useEffect(() => {
    if (!loading && !inspectionId && scanStatus !== "success") {
      router.replace("/dashboard/upload");
    }
  }, [loading, inspectionId, scanStatus, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Memuat laporan analisis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-md">
          <p className="font-bold">Gagal Memuat Laporan</p>
          <p className="text-sm">{error}</p>
        </div>
        <button onClick={() => router.back()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm">Kembali</button>
      </div>
    );
  }

  const isDataAvailable = inspectionId ? !!historyData : scanStatus === "success";
  if (!isDataAvailable) return null;

  return (
    <main className="pb-20 print:p-0 print:pb-0">
      <ReportActions />
      <div id="report-content" className="space-y-8 print:space-y-4">
        <ReportHeader assetMeta={activeData.meta} reportId={activeData.id} />
        <ReportBody imagePreview={activeData.image} detections={activeData.detections} />
      </div>
    </main>
  );
}
