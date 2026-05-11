"use client";

export default function AnalysisSummary() {
  const data = [
    { label: "CRACK INTEGRITY", value: 98, status: "Critical", color: "bg-red-500", textColor: "text-red-600" },
    { label: "SPALLING AREA", value: 87, status: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "MOISTURE DEPTH", value: 91, status: "High", color: "bg-blue-500", textColor: "text-blue-600" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-tight">Analisis Deteksi</h3>
      <div className="space-y-8">
        {data.map((item) => (
          <div key={item.label} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">{item.label}</span>
              <span className={`text-xs font-bold ${item.textColor}`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}