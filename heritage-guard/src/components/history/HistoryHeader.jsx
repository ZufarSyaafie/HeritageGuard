import { Download } from 'lucide-react';

export default function HistoryHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-[#1a1c1c] tracking-tight leading-none">
          Histori Inspeksi
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
          Daftar riwayat pemantauan dan hasil deteksi kerusakan aset cagar budaya menggunakan pemrosesan AI tingkat tinggi.
        </p>
      </div>
      
      <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group shrink-0">
        <Download size={22} className="group-hover:translate-y-[1px] transition-transform" />
        <span>Ekspor Laporan (CSV)</span>
      </button>
    </header>
  );
}
