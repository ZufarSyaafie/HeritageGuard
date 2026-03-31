import DamageDetection from "@/components/dashboard/DamageDetection";
import AnalysisSummary from "@/components/dashboard/AnalysisSummary";
import HealthScore from "@/components/dashboard/HealthScore";
import AssetInfo from "@/components/dashboard/AssetInfo";
import ActionCards from "@/components/dashboard/ActionCards";
import { Share2, FileDown } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            HeritageGuard AI Dashboard
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
            Visualisasi deteksi anomali struktural menggunakan computer vision YOLOv8 untuk preservasi situs cagar budaya.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all shadow-sm active:scale-95 text-sm">
            <Share2 size={18} />
            Bagikan
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm">
            <FileDown size={18} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Deteksi */}
        <div className="xl:col-span-2">
          <DamageDetection />
        </div>

        {/* Right Column: Analisis & Info */}
        <div className="flex flex-col gap-8">
          <AnalysisSummary />
          <HealthScore />
          <AssetInfo />
        </div>
      </div>

      {/* Bottom Row: Actions */}
      <ActionCards />
    </div>
  );
}