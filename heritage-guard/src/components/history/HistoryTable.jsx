"use client";

import { Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryTable({ data = [] }) {
  const router = useRouter();

  const handleViewDetail = (id) => {
    // Navigasi ke halaman detail (simulasi)
    console.log(`Navigating to detail: ${id}`);
    alert(`Membuka detail untuk Inspeksi: ${id}`);
    // router.push(`/dashboard/histori/${id}`);
  };

  const handleDownloadPDF = (id) => {
    // Simulasi download PDF
    console.log(`Downloading PDF for: ${id}`);
    alert(`Menyiapkan unduhan PDF untuk ID: ${id}...\nLaporan sedang diproses.`);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-20 text-center">
        <p className="text-gray-400 font-medium">Tidak ada data histori ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">ID Inspeksi</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Citra</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Lokasi Aset</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tanggal</th>
              <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Tingkat Kerusakan</th>
              <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-sm font-extrabold text-primary tracking-tight">{row.id}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <img src={row.image} alt={row.location} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight mb-0.5">{row.location}</span>
                    <span className="text-[11px] text-gray-500 font-medium leading-none">{row.subLocation}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-gray-600 font-medium">{row.date}</span>
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
                      onClick={() => handleViewDetail(row.id)}
                    />
                    <ActionButton 
                      icon={<FileText size={18} />} 
                      title="Unduh PDF" 
                      onClick={() => handleDownloadPDF(row.id)}
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
      className="p-2.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all outline-none"
      title={title}
    >
      {icon}
    </button>
  );
}
