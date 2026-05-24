export default function MetricCard({ title, value, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex items-start gap-4 transition-colors">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass} dark:bg-opacity-10`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-wider mb-1 truncate">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-dark-text leading-none">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 dark:text-dark-text-muted mt-1.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
