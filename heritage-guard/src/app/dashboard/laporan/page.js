"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useScanStore from "@/store/useScanStore";
import ReportHeader from "@/components/laporan/ReportHeader";
import ReportBody from "@/components/laporan/ReportBody";
import ReportActions from "@/components/laporan/ReportActions";

export default function LaporanPage() {
  const router = useRouter();
  const { scanStatus, imagePreview, detections, assetMeta } = useScanStore();
  const [reportId] = useState(() => `HG-${Date.now().toString(36).toUpperCase()}`);

  useEffect(() => {
    if (scanStatus !== "success") {
      router.replace("/dashboard/upload");
    }
  }, [scanStatus, router]);

  if (scanStatus !== "success") return null;

  return (
    <main className="pb-20 print:pb-0">
      <ReportActions />
      <div id="report-content" className="space-y-8">
        <ReportHeader assetMeta={assetMeta} reportId={reportId} />
        <ReportBody imagePreview={imagePreview} detections={detections} />
      </div>
    </main>
  );
}
