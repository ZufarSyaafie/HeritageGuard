"use client";

import { useState, useRef, useEffect } from 'react';
import { Download, Calendar, X, FileSpreadsheet } from 'lucide-react';

export default function HistoryHeader({ onExport }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleConfirmExport = () => {
    onExport(startDate, endDate);
    setIsModalOpen(false);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 transition-colors">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-dark-text tracking-tight leading-none transition-colors">
          Histori Inspeksi
        </h1>
        <p className="text-lg text-gray-500 dark:text-dark-text-muted max-w-2xl leading-relaxed font-medium transition-colors">
          Daftar riwayat pemantauan dan hasil deteksi kerusakan aset cagar budaya menggunakan pemrosesan AI tingkat tinggi.
        </p>
      </div>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group shrink-0"
      >
        <Download size={22} className="group-hover:translate-y-[1px] transition-transform" />
        <span>Ekspor Laporan (CSV)</span>
      </button>

      {/* Export Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-dark-surface w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-dark-border"
          >
            {/* Modal Header */}
            <div className="bg-primary p-8 text-white relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <FileSpreadsheet size={32} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Ekspor Data CSV</h2>
              <p className="text-blue-100 text-sm font-medium mt-1">Pilih rentang waktu laporan yang ingin diunduh.</p>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-muted px-1">Dari Tanggal</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 dark:text-dark-text outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-muted px-1">Hingga Tanggal</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-700 dark:text-dark-text outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-primary/5 p-4 rounded-2xl border border-blue-100/50 dark:border-primary/20 flex gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-primary/20 text-primary rounded-lg flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <p className="text-[11px] text-primary/80 dark:text-primary font-semibold leading-relaxed">
                  Tip: Kosongkan kedua tanggal untuk mengekspor seluruh data yang tampil di tabel saat ini.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={handleConfirmExport}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <Download size={20} />
                  <span>Unduh Sekarang</span>
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 text-sm font-bold text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
