"use client";

import { useEffect, useRef } from "react";

const COLOR_MAP = {
  crack:    "#ef4444",
  spalling: "#eab308",
  moisture: "#3b82f6",
};

export default function ScanCanvas({ imagePreview, detections = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imagePreview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const lineWidth = Math.max(2, img.naturalWidth / 300);
      const fontSize  = Math.max(13, img.naturalWidth / 60);

      detections.forEach(({ label, confidence, x1, y1, x2, y2 }) => {
        const color = COLOR_MAP[label?.toLowerCase()] ?? "#6366f1";
        const w = x2 - x1;
        const h = y2 - y1;

        ctx.strokeStyle = color;
        ctx.lineWidth   = lineWidth;
        ctx.strokeRect(x1, y1, w, h);

        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const pct    = Math.round((confidence ?? 0) * 100);
        const text   = `${label} ${pct}%`;
        const tw     = ctx.measureText(text).width;
        const pad    = 6;
        const badgeH = fontSize + pad * 2;

        ctx.fillStyle = color;
        ctx.fillRect(x1, y1 - badgeH, tw + pad * 2, badgeH);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, x1 + pad, y1 - pad);
      });
    };

    img.src = imagePreview;
  }, [imagePreview, detections]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl border border-gray-100 shadow-sm"
    />
  );
}
