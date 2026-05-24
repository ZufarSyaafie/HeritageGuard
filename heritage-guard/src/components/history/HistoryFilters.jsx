"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Filter, Check } from 'lucide-react';

export default function HistoryFilters({ onFilterChange, onSearchChange }) {
  const timeOptions = ['Semua Waktu', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'];
  const statusOptions = ['Semua Status', 'Kritis', 'Menengah', 'Aman'];
  const sortOptions = ['Terbaru', 'Terlama', 'Lokasi A-Z', 'Lokasi Z-A'];

  return (
    <section className="bg-white dark:bg-dark-surface p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm mb-8 transition-colors">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID Inspeksi atau Lokasi..." 
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-medium dark:text-dark-text dark:placeholder:text-gray-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <SelectFilter 
            label="Bulan Ini" 
            options={timeOptions} 
            onChange={(val) => onFilterChange('time', val)}
          />
          <SelectFilter 
            label="Semua Status" 
            options={statusOptions} 
            onChange={(val) => onFilterChange('status', val)}
          />
          
          <SelectFilter 
            icon={<Filter size={20} />} 
            options={sortOptions} 
            isIconOnly 
            align="right"
            onChange={(val) => onFilterChange('sort', val)}
          />
        </div>
      </div>
    </section>
  );
}

function SelectFilter({ label, icon, options = [], isIconOnly = false, align = 'left', onChange }) {
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

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 border rounded-2xl flex items-center justify-center transition-all shadow-sm group ${
          isIconOnly ? 'w-14 px-0' : 'px-6 gap-4 min-w-[180px] justify-between'
        } ${
          isOpen 
          ? 'bg-white dark:bg-dark-surface border-primary text-primary ring-4 ring-blue-50 dark:ring-primary/10' 
          : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-dark-border text-gray-500 dark:text-dark-text-muted hover:bg-white dark:hover:bg-dark-surface hover:border-gray-200 dark:hover:border-dark-border hover:text-primary'
        }`}
      >
        {isIconOnly ? (
          icon
        ) : (
          <>
            <span className={`text-sm font-bold ${isOpen ? 'text-primary' : 'text-gray-700 dark:text-dark-text'}`}>{selected}</span>
            <ChevronDown 
              size={18} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400 group-hover:text-primary'}`} 
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-[calc(100%+8px)] ${align === 'right' ? 'right-0' : 'left-0'} min-w-[220px] bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl py-2 z-50 transition-all duration-200 origin-top ${
          isOpen 
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        {isIconOnly && (
          <div className="px-5 py-2 mb-1 border-b border-gray-50 dark:border-dark-border">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-muted">Urutkan Berdasarkan</span>
          </div>
        )}
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
              selected === option && !isIconOnly
              ? 'bg-blue-50 dark:bg-primary/10 text-primary' 
              : 'text-gray-600 dark:text-dark-text-muted hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-dark-text'
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
