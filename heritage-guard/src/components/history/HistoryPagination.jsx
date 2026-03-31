import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoryPagination() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
      <p className="text-sm text-gray-500 font-medium">
        Menampilkan <span className="text-gray-900 font-bold">4</span> dari <span className="text-gray-900 font-bold">48</span> entri
      </p>

      <nav className="flex items-center gap-2">
        <PageNavButton icon={<ChevronLeft size={20} />} label="Prev" />
        
        <div className="flex items-center gap-1 mx-2">
          <PageNumber number="1" active />
          <PageNumber number="2" />
          <PageNumber number="3" />
        </div>

        <PageNavButton icon={<ChevronRight size={20} />} label="Next" isRight />
      </nav>
    </div>
  );
}

function PageNumber({ number, active }) {
  return (
    <button 
      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
        active 
        ? 'bg-primary text-white shadow-lg shadow-blue-500/20 active:scale-95' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {number}
    </button>
  );
}

function PageNavButton({ icon, label, isRight }) {
  return (
    <button className={`flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors group ${isRight ? 'flex-row-reverse' : ''}`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
