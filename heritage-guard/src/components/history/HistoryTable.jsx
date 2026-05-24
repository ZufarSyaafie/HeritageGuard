"use client";

import { Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryTable({ data = [] }) {
  const router = useRouter();

  const handleViewDetail = (row) => {
    if (row.realId) {
      router.push(`/dashboard/laporan?id=${row.realId}`);
    } else {
      alert("Data detail laporan belum tersedia untuk inspeksi ini.");
    }
  };

  const handleDownloadPDF = async (row) => {
    if (row.realId) {
      router.push(`/dashboard/laporan?id=${row.realId}&print=true`);
    } else {
      alert("Berkas laporan tidak ditemukan.");
    }
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm p-20 text-center transition-colors">
        <p className="text-gray-400 dark:text-dark-text-muted font-medium">Tidak ada data histori ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-dark-border">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">ID Inspeksi</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Citra</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Lokasi Aset</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest text-center">Tingkat Kerusakan</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {data.map((row) => (
              <tr key={row.realId || row.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-sm font-extrabold text-primary tracking-tight">{row.id}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm group-hover:scale-105 transition-transform duration-300 bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
                    <img 
                      src={row.image} 
                      alt={row.location} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Gagal memuat gambar untuk ID: ${row.id}`, row.image);
                        e.target.src = "/next.svg";
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-dark-text leading-tight mb-0.5">{row.location}</span>
                    <span className="text-[11px] text-gray-500 dark:text-dark-text-muted font-medium leading-none">{row.subLocation}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-600 dark:text-dark-text-muted font-medium">{row.date}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${row.statusColor}`}>
                      • {row.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <ActionButton 
                      icon={<Eye size={18} />} 
                      title="Lihat Detail" 
                      onClick={() => handleViewDetail(row)}
                    />
                    <ActionButton 
                      icon={<FileText size={18} />} 
                      title="Unduh PDF" 
                      onClick={() => handleDownloadPDF(row)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({ icon, title, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="p-2.5 text-gray-400 dark:text-dark-text-muted hover:text-primary dark:hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 rounded-xl transition-all outline-none"
      title={title}
    >
      {icon}
    </button>
  );
}
