"use client";

import { useEffect, useRef } from "react";

const COLOR_MAP = {
  crack:    "#ef4444",
  spalling: "#eab308",
  moisture: "#3b82f6",
};

function normalizeBox(detection) {
  const bbox = detection?.bbox;

  if (bbox && typeof bbox === "object" && !Array.isArray(bbox)) {
    const x1 = Number(bbox.x ?? bbox.left ?? 0);
    const y1 = Number(bbox.y ?? bbox.top ?? 0);
    const width = Number(bbox.width ?? bbox.w ?? 0);
    const height = Number(bbox.height ?? bbox.h ?? 0);

    return {
      x1,
      y1,
      x2: x1 + width,
      y2: y1 + height,
    };
  }

  return {
    x1: Number(detection?.x1 ?? bbox?.[0] ?? 0),
    y1: Number(detection?.y1 ?? bbox?.[1] ?? 0),
    x2: Number(detection?.x2 ?? bbox?.[2] ?? 0),
    y2: Number(detection?.y2 ?? bbox?.[3] ?? 0),
  };
}

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

      detections.forEach((detection) => {
        const { x1, y1, x2, y2 } = normalizeBox(detection);
        const { label, confidence } = detection;
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
