"use client";

import { UploadCloud } from 'lucide-react';

export default function UploadZone() {
  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div 
        className="border-2 border-dashed border-gray-200 rounded-2xl p-12 lg:p-20 flex flex-col items-center justify-center transition-all hover:border-primary/40 group cursor-pointer bg-gray-50/30 hover:bg-blue-50/30"
      >
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <UploadCloud size={40} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Drag & Drop citra bangunan ke sini
        </h3>
        <p className="text-gray-500 mb-8 text-center">
          atau klik untuk mencari file (JPG, PNG, max 10MB)
        </p>

        <div className="flex gap-4">
          <Badge text="JPG" />
          <Badge text="PNG" />
          <Badge text="MAX 10MB" />
        </div>
      </div>

      <button className="w-full mt-8 bg-primary text-white py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group">
        <UploadCloud size={24} className="group-hover:translate-y-[-2px] transition-transform" />
        <span className="text-lg">Upload Citra</span>
      </button>
    </section>
  );
}

function Badge({ text }) {
  return (
    <span className="px-4 py-1.5 bg-white text-gray-400 text-[11px] font-extrabold uppercase tracking-widest rounded-lg border border-gray-100 shadow-sm">
      {text}
    </span>
  );
}
