"use client";

import { Sun } from 'lucide-react';

export default function AssetInfo() {
  const details = [
    { label: "Lokasi Struktur", value: "Pilar Utama Sektor B, Candi Borobudur" },
    { label: "Waktu Inspeksi", value: "14 Okt 2024, 09:15 WIB" },
    { label: "Kamera / Sensor", value: "Sony Alpha A7R IV - 61MP" },
    { label: "Kondisi Cuaca", value: "Cerah, 29°C", icon: Sun },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informasi Aset</h3>
      
      <div className="space-y-5">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-start gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <span className="text-xs font-semibold text-gray-500 min-w-24">{detail.label}</span>
            <div className="flex items-center gap-2 text-right">
              {detail.icon && <detail.icon className="w-4 h-4 text-yellow-500" />}
              <span className="text-xs font-bold text-gray-900 leading-relaxed">{detail.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}