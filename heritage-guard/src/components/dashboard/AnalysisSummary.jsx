"use client";

export default function AnalysisSummary({ summaries = [] }) {
  const getColors = (status) => {
    const s = status?.toLowerCase();
    if (s === 'critical' || s === 'kritis') return { color: "bg-red-500", textColor: "text-red-500", bg: "bg-red-500/10" };
    if (s === 'moderate' || s === 'menengah' || s === 'high') return { color: "bg-yellow-500", textColor: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { color: "bg-blue-500", textColor: "text-blue-500", bg: "bg-blue-500/10" };
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-6 uppercase tracking-tight">Analisis Deteksi</h3>
      
      {summaries.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-400 dark:text-dark-text-muted text-sm italic">Belum ada data analisis</p>
        </div>
      ) : (
        <div className="space-y-8">
          {summaries.map((item, idx) => {
            const { color, textColor, bg } = getColors(item.status);
            return (
              <div key={item.id || idx} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-dark-text-muted tracking-wider uppercase">{item.category}</span>
                  <span className={`text-xs font-bold ${textColor}`}>{item.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-dark-text w-8 text-right">{item.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
