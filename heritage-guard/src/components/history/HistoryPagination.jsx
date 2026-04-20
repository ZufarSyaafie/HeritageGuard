import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HistoryPagination({ 
  currentPage, 
  totalPages, 
  totalEntries, 
  startIndex, 
  endIndex,
  onPageChange 
}) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
      <p className="text-sm text-gray-500 font-medium">
        Menampilkan <span className="text-gray-900 font-bold">{totalEntries > 0 ? startIndex + 1 : 0}</span> - <span className="text-gray-900 font-bold">{Math.min(endIndex, totalEntries)}</span> dari <span className="text-gray-900 font-bold">{totalEntries}</span> entri
      </p>

      <nav className="flex items-center gap-2">
        <PageNavButton 
          icon={<ChevronLeft size={20} />} 
          label="Prev" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((number) => (
            <PageNumber 
              key={number}
              number={number} 
              active={currentPage === number}
              onClick={() => onPageChange(number)}
            />
          ))}
        </div>

        <PageNavButton 
          icon={<ChevronRight size={20} />} 
          label="Next" 
          isRight 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </nav>
    </div>
  );
}

function PageNumber({ number, active, onClick }) {
  return (
    <button 
      onClick={onClick}
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

function PageNavButton({ icon, label, isRight, disabled, onClick }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors group ${
        isRight ? 'flex-row-reverse' : ''
      } ${
        disabled 
        ? 'text-gray-200 cursor-not-allowed' 
        : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      <span className={`${!disabled && 'group-hover:scale-110'} transition-transform`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
