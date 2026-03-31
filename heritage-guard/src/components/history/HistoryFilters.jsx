import { Search, ChevronDown, Filter } from 'lucide-react';

export default function HistoryFilters() {
  return (
    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID Inspeksi atau Lokasi..." 
            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <SelectFilter label="Bulan Ini" />
          <SelectFilter label="Semua Status" />
          
          <button className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-white hover:border-gray-200 hover:text-primary transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

function SelectFilter({ label }) {
  return (
    <button className="h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4 text-sm font-bold text-gray-700 hover:bg-white hover:border-gray-200 transition-all shadow-sm group min-w-[160px] justify-between">
      <span>{label}</span>
      <ChevronDown size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
    </button>
  );
}
