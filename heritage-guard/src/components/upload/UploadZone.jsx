"use client";

import { useState, useRef } from 'react';
import { UploadCloud, FileImage, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadZone() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File terlalu besar! Maksimal 10MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("Hanya file citra (JPG, PNG) yang diizinkan.");
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const onFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    } else {
      // Logic upload ke server/API YOLOv8 simulasi
      console.log("Uploading file:", file);
      alert(`Menganalisis citra: ${file.name}...\nModel YOLOv8 sedang memproses deteksi kerusakan.`);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 lg:p-16 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
          isDragging 
          ? 'border-primary bg-blue-50/50 scale-[0.99]' 
          : 'border-gray-200 bg-gray-50/30 hover:border-primary/40 hover:bg-blue-50/30'
        }`}
      >
        {preview ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative group/preview mb-6">
              <div className="w-64 h-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={removeFile}
                className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="font-bold text-gray-900">{file.name}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • Siap dianalisis
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
              isDragging ? 'bg-primary text-white scale-110 rotate-12' : 'bg-blue-50 text-primary'
            }`}>
              {isDragging ? <FileImage size={48} /> : <UploadCloud size={48} />}
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
              {isDragging ? 'Lepaskan untuk Upload' : 'Tarik & Lepas Citra'}
            </h3>
            <p className="text-gray-500 mb-10 text-center max-w-sm font-medium">
              Seret foto bangunan ke area ini atau <span className="text-primary font-bold">telusuri file</span> dari komputer Anda.
            </p>

            <div className="flex gap-4">
              <Badge text="JPG" />
              <Badge text="PNG" />
              <Badge text="MAX 10MB" />
            </div>
          </>
        )}

        {/* Highlight overlay for dragging */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none flex items-center justify-center">
            <div className="absolute inset-4 border-4 border-primary/20 border-dashed rounded-[2rem] animate-pulse" />
          </div>
        )}
      </div>

      <button 
        onClick={handleUploadClick}
        disabled={isDragging}
        className={`w-full mt-8 py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] group shadow-xl ${
          file 
          ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200/50' 
          : 'bg-primary text-white hover:bg-blue-700 shadow-blue-200/50'
        }`}
      >
        {file ? (
          <>
            <CheckCircle2 size={24} />
            <span className="text-lg">Mulai Analisis Kerusakan</span>
          </>
        ) : (
          <>
            <UploadCloud size={24} className="group-hover:translate-y-[-2px] transition-transform" />
            <span className="text-lg">Pilih Citra Bangunan</span>
          </>
        )}
      </button>

      {file && (
        <p className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5 font-medium">
          <AlertCircle size={14} />
          Klik tombol di atas untuk memproses citra dengan YOLOv8 Heritage Model
        </p>
      )}
    </section>
  );
}

function Badge({ text }) {
  return (
    <span className="px-5 py-2 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 shadow-sm">
      {text}
    </span>
  );
}
