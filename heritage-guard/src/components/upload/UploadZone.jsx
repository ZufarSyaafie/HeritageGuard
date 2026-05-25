"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileImage,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/utils/supabase";
import useScanStore from "@/store/useScanStore";
import ScanCanvas from "./ScanCanvas";

const API_BASE = process.env.NEXT_PUBLIC_HERITAGEGUARD_API_URL || "";
const API_URL = `${API_BASE}/api/inference`;

const DETECTION_THEME = {
  crack: {
    swatch: "bg-red-500",
    chip: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
    label: "Crack",
  },
  spalling: {
    swatch: "bg-yellow-500",
    chip: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    label: "Spalling",
  },
  moisture: {
    swatch: "bg-blue-500",
    chip: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
    label: "Moisture",
  },
};

function normalizeDetections(data) {
  if (Array.isArray(data)) {
    return data.map((d) => ({
      label: d.label ?? d.className ?? d.class_name ?? d.class ?? d.name ?? "unknown",
      confidence: d.confidence ?? d.score ?? 0,
      x1: d.x1 ?? d.bbox?.x ?? d.bbox?.[0] ?? 0,
      y1: d.y1 ?? d.bbox?.y ?? d.bbox?.[1] ?? 0,
      x2:
        d.x2 ??
        (d.bbox?.x != null && d.bbox?.width != null ? d.bbox.x + d.bbox.width : undefined) ??
        d.bbox?.[2] ??
        0,
      y2:
        d.y2 ??
        (d.bbox?.y != null && d.bbox?.height != null ? d.bbox.y + d.bbox.height : undefined) ??
        d.bbox?.[3] ??
        0,
    }));
  }
  const list = data.detections ?? data.predictions ?? data.results ?? [];
  return normalizeDetections(list);
}

function Badge({ text }) {
  return (
    <span className="px-5 py-2 bg-white dark:bg-dark-surface text-gray-400 dark:text-dark-text-muted text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-dark-border shadow-sm transition-colors">
      {text}
    </span>
  );
}

function DetectionChips({ detections }) {
  const counts = detections.reduce((acc, d) => {
    const key = d.label?.toLowerCase() ?? "unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(counts).map(([label, count]) => (
        <span
          key={label}
          className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${DETECTION_THEME[label]?.chip ?? "bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-dark-text-muted"}`}
        >
          {count}× {label}
        </span>
      ))}
    </div>
  );
}

function DetectionLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-600 dark:text-dark-text-muted transition-colors">
      {Object.entries(DETECTION_THEME).map(([key, item]) => (
        <div key={key} className="flex items-center gap-2">
          <div className={`w-3 h-3 ${item.swatch} rounded-sm`} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function UploadZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [location, setLocation] = useState("");
  const fileInputRef = useRef(null);

  const {
    scanStatus,
    imageFile,
    imagePreview,
    detections,
    errorMsg,
    setImage,
    setMeta,
    startScan,
    setScanSuccess,
    setScanError,
    resetScan,
  } = useScanStore();

  const handleFile = (selectedFile) => {
    if (!selectedFile?.type.startsWith("image/")) {
      alert("Hanya file citra (JPG, PNG) yang diizinkan.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(selectedFile, reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!imageFile || !buildingName.trim() || !location.trim()) return;
    setMeta({
      buildingName: buildingName.trim(),
      location: location.trim(),
      inspectedAt: new Date().toISOString(),
    });
    startScan();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("asset_name", buildingName.trim());
      fd.append("asset_location", location.trim());

      const headers = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(API_URL, { 
        method: "POST", 
        body: fd,
        headers: headers
      });
      
      if (!res.ok) {
        let backendMessage = "";
        try {
          const payload = await res.json();
          backendMessage = payload?.error || "";
        } catch {
          backendMessage = "";
        }

        throw new Error(backendMessage || `HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const normalized = normalizeDetections(data);
      setScanSuccess(normalized);
    } catch (err) {
      console.error("Scan error:", err);
      setScanError(err?.message || "Server tidak dapat dijangkau. Coba beberapa saat lagi.");
    }
  };

  const handleRetry = () => {
    useScanStore.setState({ scanStatus: "idle", errorMsg: null });
  };

	// UPLOADING
	if (scanStatus === "uploading") {
		return (
			<section className="bg-white dark:bg-dark-surface rounded-3xl p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors">
				<div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg aspect-4/3 flex flex-col items-center justify-center gap-4 animate-pulse">
					<div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-dark-surface" />
					<div className="space-y-2 w-48 text-center">
						<div className="h-3 bg-gray-200 dark:bg-dark-surface rounded-full" />
						<div className="h-3 bg-gray-200 dark:bg-dark-surface rounded-full w-3/4 mx-auto" />
					</div>
				</div>
				<div className="mt-6 flex items-center justify-center gap-3 text-primary font-bold">
					<Loader2 size={20} className="animate-spin" />
					<span>Model YOLOv12 sedang menganalisis citra…</span>
				</div>
			</section>
		);
	}

  if (scanStatus === "success") {
    return (
      <section className="bg-white dark:bg-dark-surface rounded-3xl p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="font-bold text-gray-900 dark:text-dark-text">Analisis Selesai</span>
          </div>
          <button onClick={resetScan} className="text-xs text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:hover:text-dark-text font-medium transition-colors">
            Scan Ulang
          </button>
        </div>

        <ScanCanvas imagePreview={imagePreview} detections={detections} />

        <DetectionLegend />

        {detections.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-dark-text-muted text-center py-2">Tidak ada kerusakan terdeteksi pada citra ini.</p>
        ) : (
          <DetectionChips detections={detections} />
        )}

        <button
          onClick={() => router.push("/dashboard/laporan")}
          className="w-full py-5 px-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200/50 dark:shadow-none group"
        >
          <span className="text-lg">Lihat Laporan Lengkap</span>
          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    );
  }

  if (scanStatus === "error") {
    return (
      <section className="bg-white dark:bg-dark-surface rounded-3xl p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 transition-colors">
        <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20 flex gap-4 items-start">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">Gagal Menganalisis</p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
        <button onClick={handleRetry} className="w-full py-4 px-6 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-dark-text rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-dark-card transition-all">
          Coba Lagi
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-dark-surface rounded-3xl p-8 border border-gray-100 dark:border-dark-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 transition-colors">
      <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} accept="image/*" className="hidden" />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden ${
          imagePreview
            ? "cursor-default border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface"
            : isDragging
            ? "border-primary bg-blue-50/50 dark:bg-primary/10 scale-[0.99] cursor-copy"
            : "border-gray-200 dark:border-dark-border bg-gray-50/30 dark:bg-dark-bg/30 hover:border-primary/40 hover:bg-blue-50/30 dark:hover:bg-primary/5 cursor-pointer"
        }`}
      >
        {imagePreview ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-white dark:border-dark-card shadow-xl">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetScan();
                  setBuildingName("");
                  setLocation("");
                }}
                className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-dark-text">
              <CheckCircle2 size={16} className="text-green-500" />
              {imageFile?.name}
            </div>
            <span className="text-xs text-gray-400 dark:text-dark-text-muted mt-1">{imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
          </div>
        ) : (
          <>
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
              isDragging ? "bg-primary text-white scale-110 rotate-12" : "bg-blue-50 dark:bg-primary/10 text-primary"
            }`}>
              {isDragging ? <FileImage size={48} /> : <UploadCloud size={48} />}
            </div>

            <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text mb-3 tracking-tight">{isDragging ? "Lepaskan untuk Upload" : "Tarik & Lepas Citra"}</h3>
            <p className="text-gray-500 dark:text-dark-text-muted mb-10 text-center max-w-sm font-medium">Seret foto bangunan ke area ini atau <span className="text-primary font-bold">telusuri file</span> dari komputer Anda.</p>

            <div className="flex gap-4">
              <Badge text="JPG" />
              <Badge text="PNG" />
              <Badge text="MAX 10MB" />
            </div>
          </>
        )}
      </div>

      {imagePreview && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest ml-1 transition-colors">Nama Bangunan</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted" />
              <input type="text" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} placeholder="Candi Borobudur — Sektor B" className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-300 dark:text-dark-text dark:placeholder:text-gray-600" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 dark:text-dark-text-muted uppercase tracking-widest ml-1 transition-colors">Lokasi / Area</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted" />
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Magelang, Jawa Tengah" className="w-full bg-gray-50 dark:bg-dark-bg border border-transparent dark:border-dark-border focus:bg-white dark:focus:bg-dark-surface focus:border-gray-200 dark:focus:border-primary focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-primary/10 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-300 dark:text-dark-text dark:placeholder:text-gray-600" />
            </div>
          </div>
        </div>
      )}

      <button onClick={imagePreview ? handleSubmit : () => fileInputRef.current?.click()} disabled={!!(imagePreview && (!buildingName.trim() || !location.trim()))} className={`w-full py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${imagePreview ? buildingName.trim() && location.trim() ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200/50 dark:shadow-none" : "bg-gray-200 dark:bg-dark-bg text-gray-400 dark:text-dark-text-muted cursor-not-allowed shadow-none" : "bg-primary text-white hover:bg-blue-700 shadow-blue-200/50 dark:shadow-none"}`}>
        {imagePreview ? (
          <>
            <CheckCircle2 size={22} />
            <span className="text-lg">Mulai Analisis Kerusakan</span>
          </>
        ) : (
          <>
            <UploadCloud size={22} />
            <span className="text-lg">Pilih Citra Bangunan</span>
          </>
        )}
      </button>

      {imagePreview && (!buildingName.trim() || !location.trim()) && (
        <p className="text-center text-xs text-gray-400 dark:text-dark-text-muted flex items-center justify-center gap-1.5 transition-colors"><AlertCircle size={13} /> Isi Nama Bangunan dan Lokasi sebelum memulai analisis</p>
      )}
    </section>
  );
}
