"use client";

export default function AssetInfo({ asset, inspection }) {
  if (!asset && !inspection) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex flex-col h-full transition-colors">
        <h3 className="text-sm font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-widest mb-6">Informasi Aset</h3>
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-gray-400 dark:text-dark-text-muted text-xs italic">Belum ada informasi aset terdeteksi</p>
        </div>
      </div>
    );
  }

  const details = [
    { 
      label: "Lokasi Struktur", 
      value: asset ? `${asset.name}, ${asset.location}` : "Unknown Asset" 
    },
    { 
      label: "Waktu Inspeksi", 
      value: inspection?.inspection_date 
        ? new Date(inspection.inspection_date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + " WIB"
        : "-" 
    },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex flex-col gap-6 transition-colors">
      <h3 className="text-sm font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Informasi Aset</h3>
      
      <div className="space-y-5">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-start gap-4 border-b border-gray-50 dark:border-dark-border pb-4 last:border-0 last:pb-0">
            <span className="text-xs font-semibold text-gray-500 dark:text-dark-text-muted min-w-[100px]">{detail.label}</span>
            <div className="flex items-center gap-2 text-right">
              <span className="text-xs font-bold text-gray-900 dark:text-dark-text leading-relaxed">{detail.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
