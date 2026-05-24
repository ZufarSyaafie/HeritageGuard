"use client";

import ScanCanvas from "@/components/upload/ScanCanvas";

const COLOR = {
  crack:    { bar: "bg-red-500",    text: "text-red-600 dark:text-red-400",    bg: "bg-red-50 dark:bg-red-500/10"    },
  spalling: { bar: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  moisture: { bar: "bg-blue-500",   text: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-50 dark:bg-blue-500/10"   },
};

const REKOMENDASI = {
  crack:    "Diperlukan injeksi epoxy pada retakan struktural dalam waktu 48 jam. Lakukan pemantauan berkala setiap 7 hari untuk memastikan retakan tidak meluas.",
  spalling: "Pengelupasan beton memerlukan patching dengan mortar repair khusus heritage. Bersihkan area spalling, aplikasikan bonding agent, dan tambal dengan mortar sebelum dilakukan pengecatan ulang.",
  moisture: "Infiltrasi kelembapan memerlukan aplikasi waterproofing membrane pada permukaan eksterior. Identifikasi sumber kebocoran dan perbaiki sealant pada sambungan struktur.",
};

export default function ReportBody({ imagePreview, detections }) {
  const labelCounts = detections.reduce((acc, d) => {
    const k = d.label?.toLowerCase() ?? "unknown";
    if (!acc[k]) acc[k] = { count: 0, maxConf: 0 };
    acc[k].count++;
    acc[k].maxConf = Math.max(acc[k].maxConf, d.confidence ?? 0);
    return acc;
  }, {});

  const detectedLabels = Object.keys(labelCounts);

  return (
    <div className="space-y-8 transition-colors">
      {/* Detection Image */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-6 print:border-0">
        <h2 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest mb-4">
          Visualisasi Deteksi
        </h2>
        <ScanCanvas imagePreview={imagePreview} detections={detections} />
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-600 dark:text-dark-text-muted">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm" /><span>Crack</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm" /><span>Spalling</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm" /><span>Moisture</span></div>
        </div>
      </div>

      {/* Detection Summary Table */}
      <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden print:border-0">
        <div className="p-6 border-b border-gray-100 dark:border-dark-border">
          <h2 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest">Ringkasan Deteksi</h2>
        </div>
        {detections.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 dark:text-dark-text-muted text-center italic">Tidak ada kerusakan terdeteksi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-dark-bg/50">
              <tr>
                {["Jenis Kerusakan", "Jumlah Deteksi", "Confidence Maks.", "Tingkat"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
              {detectedLabels.map((label) => {
                const { count, maxConf } = labelCounts[label];
                const c = COLOR[label] ?? { text: "text-gray-600 dark:text-dark-text-muted", bg: "bg-gray-50 dark:bg-dark-bg" };
                const pct = Math.round(maxConf * 100);
                const level = pct >= 90 ? "Kritis" : pct >= 70 ? "Menengah" : "Rendah";
                return (
                  <tr key={label} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/30">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-dark-text capitalize">{label}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-dark-text-muted">{count}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-dark-text">{pct}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${c.bg} ${c.text}`}>{level}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Damage Bars */}
      {detectedLabels.length > 0 && (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-6 print:border-0">
          <h2 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest mb-6">Analisis Tingkat Kerusakan</h2>
          <div className="space-y-6">
            {detectedLabels.map((label) => {
              const pct = Math.round(labelCounts[label].maxConf * 100);
              const c = COLOR[label] ?? { bar: "bg-gray-400", text: "text-gray-600 dark:text-dark-text-muted" };
              return (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider capitalize">{label}</span>
                    <span className={`text-xs font-bold ${c.text}`}>{pct >= 90 ? "Critical" : pct >= 70 ? "Moderate" : "Low"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-dark-text w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {detectedLabels.length > 0 && (
        <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-6 print:border-0">
          <h2 className="text-sm font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest mb-6">Rekomendasi Tindakan</h2>
          <div className="space-y-4">
            {detectedLabels.map((label) => {
              const c = COLOR[label] ?? { bg: "bg-gray-50 dark:bg-dark-bg", text: "text-gray-700 dark:text-dark-text" };
              return (
                <div key={label} className={`p-5 rounded-xl ${c.bg}`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 capitalize ${c.text}`}>{label}</p>
                  <p className="text-sm text-gray-700 dark:text-dark-text-muted leading-relaxed">
                    {REKOMENDASI[label] ?? "Lakukan evaluasi lebih lanjut oleh insinyur konservasi."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
