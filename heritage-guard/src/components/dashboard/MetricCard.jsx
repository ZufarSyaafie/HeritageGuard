export default function MetricCard({ title, value, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
