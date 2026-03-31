"use client";

import { BarChart3 } from 'lucide-react';

export default function HealthScore() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary shadow-sm">
          <BarChart3 size={24} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Health Score</span>
          <div className="flex items-baseline gap-1">
            <h4 className="text-3xl font-extrabold text-gray-900 tracking-tight">64</h4>
            <span className="text-lg font-bold text-gray-400">/ 100</span>
          </div>
        </div>
      </div>
      
      <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-95 text-sm uppercase tracking-wide">
        Generate Automated Report
      </button>
    </div>
  );
}