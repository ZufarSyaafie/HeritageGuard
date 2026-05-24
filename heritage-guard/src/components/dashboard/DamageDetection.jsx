"use client";

import { useState } from "react";
import { Maximize2, ZoomIn, Layers, Scan } from "lucide-react";

export default function DamageDetection({ inspection, detections = [] }) {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showLayers, setShowLayers] = useState(true);

  const onImageLoad = (e) => {
    setNaturalSize({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  const toggleMaximize = () => {
    if (!document.fullscreenElement) {
      document.getElementById('detection-viewport')?.requestFullscreen();
      setIsMaximized(true);
    } else {
      document.exitFullscreen();
      setIsMaximized(false);
    }
  };

  if (!inspection) {
    return (
      <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col h-full min-h-[400px] items-center justify-center p-12 text-center transition-colors">
        <div className="w-16 h-16 bg-gray-50 dark:bg-dark-bg rounded-2xl flex items-center justify-center mb-4">
          <Scan className="text-gray-300 dark:text-dark-text-muted" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text mb-1">Belum Ada Hasil Deteksi</h3>
        <p className="text-gray-400 dark:text-dark-text-muted text-xs max-w-xs leading-relaxed">
          Unggah citra aset di menu Upload untuk melihat analisis AI YOLOv12 di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col h-full transition-colors">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
            Hasil Deteksi Kerusakan
          </h2>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 dark:bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider border border-blue-100 dark:border-primary/20">
            YOLOv12X_MODEL_V2
          </span>
          <span className="px-3 py-1 bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-dark-text-muted text-[10px] font-bold rounded uppercase tracking-wider border border-gray-100 dark:border-dark-border">
            REF: {inspection.id.slice(0, 8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="px-6 pb-6 relative flex-1">
        <div 
          id="detection-viewport"
          className="relative rounded-lg overflow-hidden border border-gray-100 dark:border-dark-border bg-gray-900 aspect-[4/3] cursor-crosshair"
        >
          <img 
            src={inspection.image_url} 
            alt="Detection Source" 
            className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? "scale-150" : "scale-100"}`}
            onLoad={onImageLoad}
          />

          {/* Bounding Boxes */}
          {showLayers && (
            <div className="absolute inset-0 pointer-events-none">
              {detections.map((det, idx) => (
                <DetectionBox 
                  key={idx} 
                  det={det} 
                  naturalSize={naturalSize}
                  color={idx % 2 === 0 ? "border-red-500" : "border-orange-500"}
                  bg={idx % 2 === 0 ? "bg-red-500" : "bg-orange-500"}
                />
              ))}
            </div>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
            <button 
              onClick={toggleMaximize}
              title="Maximize"
              className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center shadow-md transition-all ${isMaximized ? "bg-primary text-white border-primary" : "bg-white/90 dark:bg-dark-card/90 border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-white dark:hover:bg-dark-card"}`}
            >
              <Maximize2 size={18} />
            </button>
            <button 
              onClick={() => setIsZoomed(!isZoomed)}
              title="Toggle Zoom"
              className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center shadow-md transition-all ${isZoomed ? "bg-primary text-white border-primary" : "bg-white/90 dark:bg-dark-card/90 border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-white dark:hover:bg-dark-card"}`}
            >
              <ZoomIn size={18} />
            </button>
            <button 
              onClick={() => setShowLayers(!showLayers)}
              title="Toggle AI Layers"
              className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center shadow-md transition-all ${showLayers ? "bg-primary text-white border-primary" : "bg-white/90 dark:bg-dark-card/90 border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-white dark:hover:bg-dark-card"}`}
            >
              <Layers size={18} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-6 text-xs font-semibold text-gray-600 dark:text-dark-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Struktural Crack (Major)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
            <span>Concrete Spalling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <span>Moisture Ingress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetectionBox({ det, naturalSize, color, bg }) {
  if (!naturalSize.width) return null;

  const isNormalized = det.bbox_x <= 1.1 && det.bbox_width <= 1.1;
  
  const style = {
    left: isNormalized ? `${det.bbox_x * 100}%` : `${(det.bbox_x / naturalSize.width) * 100}%`,
    top: isNormalized ? `${det.bbox_y * 100}%` : `${(det.bbox_y / naturalSize.height) * 100}%`,
    width: isNormalized ? `${det.bbox_width * 100}%` : `${(det.bbox_width / naturalSize.width) * 100}%`,
    height: isNormalized ? `${det.bbox_height * 100}%` : `${(det.bbox_height / naturalSize.height) * 100}%`,
  };

  return (
    <div 
      className={`absolute border-2 ${color} rounded-lg`}
      style={style}
    >
      <div className={`absolute -top-6 left-0 ${bg} text-white text-[9px] font-black px-2 py-0.5 rounded-t uppercase whitespace-nowrap`}>
        {det.type} {Math.round(det.confidence_score * 100)}%
      </div>
    </div>
  );
}
