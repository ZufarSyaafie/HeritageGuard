"use client";

export default function MetricCard({ title, value, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-900 tracking-tight">{value}</span>
        </div>
        {subtitle && (
          <p className="text-[11px] text-gray-500 font-bold uppercase mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
