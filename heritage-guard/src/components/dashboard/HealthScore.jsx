"use client";

import { BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HealthScore({ score = 0, inspectionId }) {
  const router = useRouter();
  const displayScore = score === null || score === undefined ? 0 : Math.round(score);

  const handleGenerateReport = () => {
    if (inspectionId) {
      router.push(`/dashboard/laporan?id=${inspectionId}&print=true`);
    }
  };
  
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex flex-col gap-6 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
          <BarChart3 size={24} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Health Score</span>
          <div className="flex items-baseline gap-1">
            <h4 className="text-3xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight">{displayScore}</h4>
            <span className="text-lg font-bold text-gray-400 dark:text-dark-text-muted">/ 100</span>
          </div>
        </div>
      </div>
      
      <button 
        disabled={!inspectionId}
        onClick={handleGenerateReport}
        className={`w-full font-bold py-3.5 rounded-xl transition-all text-sm uppercase tracking-wide active:scale-95 ${
          !inspectionId 
          ? "bg-gray-100 dark:bg-dark-bg text-gray-400 dark:text-dark-text-muted cursor-not-allowed" 
          : "bg-primary hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none"
        }`}
      >
        Generate Automated Report
      </button>
    </div>
  );
}
