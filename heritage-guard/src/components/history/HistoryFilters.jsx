"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Filter, Check, X } from 'lucide-react';

export default function HistoryFilters() {
  const timeOptions = ['Semua Waktu', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'];
  const statusOptions = ['Semua Status', 'Kritis', 'Menengah', 'Aman'];
  const sortOptions = ['Terbaru', 'Terlama', 'Lokasi A-Z', 'Lokasi Z-A'];

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
          <SelectFilter 
            label="Bulan Ini" 
            options={timeOptions} 
          />
          <SelectFilter 
            label="Semua Status" 
            options={statusOptions} 
          />
          
          <SelectFilter 
            icon={<Filter size={20} />} 
            options={sortOptions} 
            isIconOnly 
            align="right"
          />
        </div>
      </div>
    </section>
  );
}

function SelectFilter({ label, icon, options = [], isIconOnly = false, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label || options[0]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 border rounded-2xl flex items-center justify-center transition-all shadow-sm group ${
          isIconOnly ? 'w-14 px-0' : 'px-6 gap-4 min-w-[180px] justify-between'
        } ${
          isOpen 
          ? 'bg-white border-primary text-primary ring-4 ring-blue-50' 
          : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-gray-200 hover:text-primary'
        }`}
      >
        {isIconOnly ? (
          icon
        ) : (
          <>
            <span className={`text-sm font-bold ${isOpen ? 'text-primary' : 'text-gray-700'}`}>{selected}</span>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400 group-hover:text-primary'}`} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+8px)] ${align === 'right' ? 'right-0' : 'left-0'} min-w-[220px] bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 transition-all duration-200 origin-top ${
          isOpen 
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        {isIconOnly && (
          <div className="px-5 py-2 mb-1 border-b border-gray-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Urutkan Berdasarkan</span>
          </div>
        )}
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              if (!isIconOnly) setSelected(option);
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
              selected === option && !isIconOnly
              ? 'bg-blue-50 text-primary' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {option}
            {selected === option && !isIconOnly && <Check size={16} className="text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
