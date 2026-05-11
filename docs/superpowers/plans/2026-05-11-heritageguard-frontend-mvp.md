# HeritageGuard Frontend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete HeritageGuard frontend MVP — 8 routes with real YOLOv8 API integration, Zustand state, recharts dashboard, Canvas bounding-box overlay, auto-generated PDF-ready report, and profile page.

**Architecture:** Next.js App Router with Tailwind CSS v4 (existing). A single Zustand store (`useScanStore`) bridges the Upload page and Report Generator. The Upload page POSTs to the HuggingFace Space API using `FormData`, then renders detections on a `<canvas>` element. The Report Generator reads the store and uses `window.print()` + print CSS for PDF export.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Zustand, recharts, Lucide React. No test framework — verification via `npm run dev` visual check and `npm run build`.

---

## File Map

### New files
```
heritage-guard/src/store/useScanStore.js
heritage-guard/src/components/upload/ScanCanvas.jsx
heritage-guard/src/components/dashboard/MetricCard.jsx
heritage-guard/src/components/dashboard/DamageChart.jsx
heritage-guard/src/components/laporan/ReportHeader.jsx
heritage-guard/src/components/laporan/ReportBody.jsx
heritage-guard/src/components/laporan/ReportActions.jsx
heritage-guard/src/components/profil/ProfilAvatar.jsx
heritage-guard/src/components/profil/ProfilForm.jsx
heritage-guard/src/app/dashboard/laporan/page.js
heritage-guard/src/app/dashboard/profil/page.js
```

### Modified files
```
heritage-guard/package.json                       + zustand, recharts
heritage-guard/src/components/auth/RegisterForm.jsx   + role <select>
heritage-guard/src/components/Sidebar.jsx             + Profil nav item
heritage-guard/src/app/dashboard/page.js              + MetricCard row + DamageChart
heritage-guard/src/components/upload/UploadZone.jsx   rewrite: real API + Zustand
heritage-guard/src/app/dashboard/upload/page.js       minor: import ScanCanvas
heritage-guard/src/app/globals.css                    + @media print rules
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `heritage-guard/package.json`

- [ ] **Step 1: Install zustand and recharts**

```bash
cd heritage-guard
npm install zustand recharts
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Verify installed**

```bash
node -e "require('zustand'); require('recharts'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/package.json heritage-guard/package-lock.json
git commit -m "chore: install zustand and recharts"
```

---

## Task 2: Zustand Store

**Files:**
- Create: `heritage-guard/src/store/useScanStore.js`

- [ ] **Step 1: Create the store file**

```javascript
// heritage-guard/src/store/useScanStore.js
import { create } from 'zustand';

const useScanStore = create((set) => ({
  scanStatus: 'idle',      // 'idle' | 'uploading' | 'success' | 'error'
  imageFile: null,         // File object
  imagePreview: null,      // base64 data URL string
  detections: [],          // [{ label, confidence, x1, y1, x2, y2 }]
  assetMeta: {
    buildingName: '',
    location: '',
    inspectedAt: '',
  },
  errorMsg: null,

  setImage: (file, preview) => set({ imageFile: file, imagePreview: preview }),
  setMeta: (meta) => set({ assetMeta: meta }),
  startScan: () => set({ scanStatus: 'uploading', errorMsg: null, detections: [] }),
  setScanSuccess: (detections) => set({ scanStatus: 'success', detections }),
  setScanError: (msg) => set({ scanStatus: 'error', errorMsg: msg }),
  resetScan: () => set({
    scanStatus: 'idle',
    imageFile: null,
    imagePreview: null,
    detections: [],
    assetMeta: { buildingName: '', location: '', inspectedAt: '' },
    errorMsg: null,
  }),
}));

export default useScanStore;
```

- [ ] **Step 2: Verify no import errors — start dev server**

```bash
cd heritage-guard && npm run dev
```

Navigate to `http://localhost:3000`. No console errors. Stop server.

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/src/store/useScanStore.js
git commit -m "feat: add useScanStore Zustand store for scan state"
```

---

## Task 3: RegisterForm — Role Select

**Files:**
- Modify: `heritage-guard/src/components/auth/RegisterForm.jsx`

- [ ] **Step 1: Add role state and select field**

Replace the full file content:

```jsx
// heritage-guard/src/components/auth/RegisterForm.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { AuthInput } from "./LoginForm";

const ROLES = [
  { value: "", label: "Pilih Peran Anda" },
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta", label: "Lembaga Swasta / Yayasan Museum" },
  { value: "ahli", label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)" },
];

export default function RegisterForm() {
  const [role, setRole] = useState("");

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-5">
        <AuthInput
          label="Nama Lengkap"
          type="text"
          placeholder="Arch. Hendrawan"
          icon={<User size={20} />}
        />
        <AuthInput
          label="Email Kerja"
          type="email"
          placeholder="nama@heritage.id"
          icon={<Mail size={20} />}
        />

        {/* Role Select */}
        <div className="space-y-2">
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
            Peran / Institusi
          </label>
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
              <Briefcase size={20} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-2xl py-4 pl-14 pr-6 text-sm outline-none transition-all font-bold appearance-none text-gray-700"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} disabled={r.value === ""}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AuthInput
          label="Kata Sandi"
          type="password"
          placeholder="Minimal 8 karakter"
          icon={<Lock size={20} />}
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
        <ShieldCheck className="text-primary shrink-0" size={20} />
        <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
          Dengan mendaftar, Anda menyetujui{" "}
          <span className="font-bold underline">Ketentuan Layanan</span> dan{" "}
          <span className="font-bold underline">Kebijakan Privasi</span> HeritageGuard.
        </p>
      </div>

      <button className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(38,75,221,0.3)] hover:bg-blue-700 transition-all active:scale-[0.98] group">
        <span>Buat Akun Gratis</span>
        <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <div className="pt-6 border-t border-gray-50 text-center">
        <p className="text-gray-500 font-medium text-sm">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline inline-flex items-center gap-1 group"
          >
            Masuk di sini
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/register`. Confirm role select appears between Email and Password fields with 3 options.

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/src/components/auth/RegisterForm.jsx
git commit -m "feat: add role select to registration form"
```

---

## Task 4: MetricCard Component

**Files:**
- Create: `heritage-guard/src/components/dashboard/MetricCard.jsx`

- [ ] **Step 1: Create MetricCard**

```jsx
// heritage-guard/src/components/dashboard/MetricCard.jsx
export default function MetricCard({ title, value, icon: Icon, colorClass, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 truncate">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-1.5 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add heritage-guard/src/components/dashboard/MetricCard.jsx
git commit -m "feat: add MetricCard component"
```

---

## Task 5: DamageChart Component

**Files:**
- Create: `heritage-guard/src/components/dashboard/DamageChart.jsx`

- [ ] **Step 1: Create DamageChart**

```jsx
// heritage-guard/src/components/dashboard/DamageChart.jsx
"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const MOCK_DATA = [
  { month: "Jan", crack: 8,  spalling: 4,  moisture: 6  },
  { month: "Feb", crack: 12, spalling: 7,  moisture: 9  },
  { month: "Mar", crack: 7,  spalling: 5,  moisture: 11 },
  { month: "Apr", crack: 15, spalling: 9,  moisture: 8  },
  { month: "Mei", crack: 10, spalling: 6,  moisture: 14 },
  { month: "Jun", crack: 18, spalling: 11, moisture: 10 },
];

export default function DamageChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Tren Deteksi Kerusakan</h3>
        <p className="text-xs text-gray-400 mt-1 font-medium">6 bulan terakhir — jumlah deteksi per kategori</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={MOCK_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gCrack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gSpalling" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#eab308" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#eab308" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gMoisture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
              fontSize: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
          />
          <Area type="monotone" dataKey="crack"    name="Crack"    stroke="#ef4444" strokeWidth={2} fill="url(#gCrack)"    dot={false} />
          <Area type="monotone" dataKey="spalling" name="Spalling" stroke="#eab308" strokeWidth={2} fill="url(#gSpalling)" dot={false} />
          <Area type="monotone" dataKey="moisture" name="Moisture" stroke="#3b82f6" strokeWidth={2} fill="url(#gMoisture)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add heritage-guard/src/components/dashboard/DamageChart.jsx
git commit -m "feat: add DamageChart recharts component"
```

---

## Task 6: Dashboard Page — MetricCards + DamageChart

**Files:**
- Modify: `heritage-guard/src/app/dashboard/page.js`

- [ ] **Step 1: Replace dashboard page**

```jsx
// heritage-guard/src/app/dashboard/page.js
import DamageDetection from "@/components/dashboard/DamageDetection";
import AnalysisSummary from "@/components/dashboard/AnalysisSummary";
import HealthScore from "@/components/dashboard/HealthScore";
import AssetInfo from "@/components/dashboard/AssetInfo";
import ActionCards from "@/components/dashboard/ActionCards";
import MetricCard from "@/components/dashboard/MetricCard";
import DamageChart from "@/components/dashboard/DamageChart";
import { Building2, ScanLine, AlertTriangle, CheckCircle } from "lucide-react";

const METRICS = [
  {
    title: "Total Aset Terpantau",
    value: "142",
    icon: Building2,
    colorClass: "bg-blue-50 text-blue-600",
    subtitle: "Aktif dimonitor",
  },
  {
    title: "Inspeksi Bulan Ini",
    value: "38",
    icon: ScanLine,
    colorClass: "bg-purple-50 text-purple-600",
    subtitle: "Sejak 1 Mei 2026",
  },
  {
    title: "Tingkat Kritis",
    value: "12",
    icon: AlertTriangle,
    colorClass: "bg-red-50 text-red-600",
    subtitle: "Butuh perhatian segera",
  },
  {
    title: "Tingkat Aman",
    value: "118",
    icon: CheckCircle,
    colorClass: "bg-green-50 text-green-600",
    subtitle: "Kondisi terpantau baik",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          HeritageGuard AI Dashboard
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
          Visualisasi deteksi anomali struktural menggunakan computer vision YOLOv8 untuk preservasi situs cagar budaya.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Damage Trend Chart */}
      <DamageChart />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <DamageDetection />
        </div>
        <div className="flex flex-col gap-8">
          <AnalysisSummary />
          <HealthScore />
          <AssetInfo />
        </div>
      </div>

      {/* Bottom Row */}
      <ActionCards />
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/dashboard`. Confirm 4 metric cards appear in a row, area chart below them, then the existing detection grid below that.

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/src/app/dashboard/page.js
git commit -m "feat: add MetricCard row and DamageChart to dashboard"
```

---

## Task 7: Sidebar — Add Profil Nav Item

**Files:**
- Modify: `heritage-guard/src/components/Sidebar.jsx`

- [ ] **Step 1: Add Profil to navItems**

In `Sidebar.jsx`, find the `navItems` array and replace it:

```jsx
import {
  LayoutDashboard,
  UploadCloud,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from 'lucide-react';

// inside Sidebar component:
const navItems = [
  { name: 'Dashboard',        path: '/dashboard',          icon: LayoutDashboard },
  { name: 'Upload Citra',     path: '/dashboard/upload',   icon: UploadCloud     },
  { name: 'Histori Inspeksi', path: '/dashboard/histori',  icon: History         },
  { name: 'Profil',           path: '/dashboard/profil',   icon: UserCircle      },
];
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/dashboard`. Sidebar shows 4 nav items including Profil with UserCircle icon. Active state highlights correctly when navigating.

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/src/components/Sidebar.jsx
git commit -m "feat: add Profil nav item to sidebar"
```

---

## Task 8: ScanCanvas Component

**Files:**
- Create: `heritage-guard/src/components/upload/ScanCanvas.jsx`

- [ ] **Step 1: Create ScanCanvas**

```jsx
// heritage-guard/src/components/upload/ScanCanvas.jsx
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
        const color = COLOR_MAP[label?.toLowerCase()] ?? "#ffffff";
        const w = x2 - x1;
        const h = y2 - y1;

        // Bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth   = lineWidth;
        ctx.strokeRect(x1, y1, w, h);

        // Label badge background
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        const pct     = Math.round((confidence ?? 0) * 100);
        const text    = `${label} ${pct}%`;
        const tw      = ctx.measureText(text).width;
        const pad     = 6;
        const badgeH  = fontSize + pad * 2;

        ctx.fillStyle = color;
        ctx.fillRect(x1, y1 - badgeH, tw + pad * 2, badgeH);

        // Label text
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
```

- [ ] **Step 2: Commit**

```bash
git add heritage-guard/src/components/upload/ScanCanvas.jsx
git commit -m "feat: add ScanCanvas with Canvas API bounding box overlay"
```

---

## Task 9: UploadZone — Real API + Zustand Integration

**Files:**
- Modify: `heritage-guard/src/components/upload/UploadZone.jsx`

- [ ] **Step 1: Replace UploadZone with full rewrite**

```jsx
// heritage-guard/src/components/upload/UploadZone.jsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud, FileImage, X, CheckCircle2,
  AlertCircle, Loader2, Building2, MapPin, ArrowRight,
} from "lucide-react";
import useScanStore from "@/store/useScanStore";
import ScanCanvas from "./ScanCanvas";

const API_URL = "https://mhfzalfrs-heritageguard.hf.space/predict";

// Normalize various YOLO FastAPI response shapes into
// [{ label, confidence, x1, y1, x2, y2 }]
function normalizeDetections(data) {
  if (Array.isArray(data)) {
    return data.map((d) => ({
      label:      d.label ?? d.class ?? d.name ?? "unknown",
      confidence: d.confidence ?? d.score ?? 0,
      x1: d.x1 ?? d.bbox?.[0] ?? 0,
      y1: d.y1 ?? d.bbox?.[1] ?? 0,
      x2: d.x2 ?? d.bbox?.[2] ?? 0,
      y2: d.y2 ?? d.bbox?.[3] ?? 0,
    }));
  }
  const list = data.detections ?? data.predictions ?? data.results ?? [];
  return normalizeDetections(list);
}

function Badge({ text }) {
  return (
    <span className="px-5 py-2 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 shadow-sm">
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

  const COLOR = { crack: "bg-red-100 text-red-700", spalling: "bg-yellow-100 text-yellow-700", moisture: "bg-blue-100 text-blue-700" };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(counts).map(([label, count]) => (
        <span key={label} className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${COLOR[label] ?? "bg-gray-100 text-gray-600"}`}>
          {count}× {label}
        </span>
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
    scanStatus, imageFile, imagePreview, detections, errorMsg,
    setImage, setMeta, startScan, setScanSuccess, setScanError, resetScan,
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

  const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true);  };
  const onDragLeave = ()  => setIsDragging(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!imageFile || !buildingName.trim() || !location.trim()) return;
    setMeta({ buildingName: buildingName.trim(), location: location.trim(), inspectedAt: new Date().toISOString() });
    startScan();
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      const res = await fetch(API_URL, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setScanSuccess(normalizeDetections(data));
    } catch (err) {
      console.error("Scan error:", err);
      setScanError("Server tidak dapat dijangkau. Coba beberapa saat lagi.");
    }
  };

  // ── UPLOADING STATE ──────────────────────────────────────────────────────────
  if (scanStatus === "uploading") {
    return (
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 aspect-[4/3] flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gray-200" />
          <div className="space-y-2 w-48 text-center">
            <div className="h-3 bg-gray-200 rounded-full" />
            <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 text-primary font-bold">
          <Loader2 size={20} className="animate-spin" />
          <span>Model YOLOv8 sedang menganalisis citra…</span>
        </div>
      </section>
    );
  }

  // ── SUCCESS STATE ────────────────────────────────────────────────────────────
  if (scanStatus === "success") {
    return (
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="font-bold text-gray-900">Analisis Selesai</span>
          </div>
          <button onClick={resetScan} className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Scan Ulang
          </button>
        </div>

        <ScanCanvas imagePreview={imagePreview} detections={detections} />

        {detections.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-2">Tidak ada kerusakan terdeteksi pada citra ini.</p>
        ) : (
          <DetectionChips detections={detections} />
        )}

        <button
          onClick={() => router.push("/dashboard/laporan")}
          className="w-full py-5 px-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200/50 group"
        >
          <span className="text-lg">Lihat Laporan Lengkap</span>
          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    );
  }

  // ── ERROR STATE ──────────────────────────────────────────────────────────────
  if (scanStatus === "error") {
    return (
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
        <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4 items-start">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold text-red-700 text-sm">Gagal Menganalisis</p>
            <p className="text-red-600 text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
        <button
          onClick={() => useScanStore.getState().setScanError(null) || useScanStore.setState({ scanStatus: "idle" })}
          className="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Coba Lagi
        </button>
      </section>
    );
  }

  // ── IDLE STATE ───────────────────────────────────────────────────────────────
  return (
    <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !imagePreview && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden ${
          imagePreview
            ? "cursor-default border-gray-200 bg-white"
            : isDragging
            ? "border-primary bg-blue-50/50 scale-[0.99] cursor-copy"
            : "border-gray-200 bg-gray-50/30 hover:border-primary/40 hover:bg-blue-50/30 cursor-pointer"
        }`}
      >
        {imagePreview ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); resetScan(); setBuildingName(""); setLocation(""); }}
                className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
              <CheckCircle2 size={16} className="text-green-500" />
              {imageFile?.name}
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {imageFile ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : ""}
            </span>
          </div>
        ) : (
          <>
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${isDragging ? "bg-primary text-white scale-110 rotate-12" : "bg-blue-50 text-primary"}`}>
              {isDragging ? <FileImage size={48} /> : <UploadCloud size={48} />}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
              {isDragging ? "Lepaskan untuk Upload" : "Tarik & Lepas Citra"}
            </h3>
            <p className="text-gray-500 mb-10 text-center max-w-sm font-medium">
              Seret foto bangunan ke area ini atau{" "}
              <span className="text-primary font-bold">telusuri file</span> dari komputer Anda.
            </p>
            <div className="flex gap-4">
              <Badge text="JPG" />
              <Badge text="PNG" />
              <Badge text="MAX 10MB" />
            </div>
          </>
        )}
      </div>

      {/* Meta Inputs — appear after image selected */}
      {imagePreview && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Nama Bangunan
            </label>
            <div className="relative">
              <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="Candi Borobudur — Sektor B"
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Lokasi / Area
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Magelang, Jawa Tengah"
                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all font-semibold placeholder:font-normal placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={imagePreview ? handleSubmit : () => fileInputRef.current?.click()}
        disabled={imagePreview && (!buildingName.trim() || !location.trim())}
        className={`w-full py-5 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl ${
          imagePreview
            ? buildingName.trim() && location.trim()
              ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200/50"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            : "bg-primary text-white hover:bg-blue-700 shadow-blue-200/50"
        }`}
      >
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
        <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <AlertCircle size={13} />
          Isi Nama Bangunan dan Lokasi sebelum memulai analisis
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify idle → upload flow in browser**

```bash
npm run dev
```

Navigate to `http://localhost:3000/dashboard/upload`.
- Drop an image → preview appears, buildingName + location inputs appear
- Leave inputs empty → button stays gray/disabled
- Fill inputs → button turns green
- Click → loading skeleton appears, then API call fires (check Network tab)

- [ ] **Step 3: Commit**

```bash
git add heritage-guard/src/components/upload/UploadZone.jsx
git commit -m "feat: rewrite UploadZone with real HuggingFace API + Zustand state"
```

---

## Task 10: Report Generator

**Files:**
- Create: `heritage-guard/src/components/laporan/ReportHeader.jsx`
- Create: `heritage-guard/src/components/laporan/ReportBody.jsx`
- Create: `heritage-guard/src/components/laporan/ReportActions.jsx`
- Create: `heritage-guard/src/app/dashboard/laporan/page.js`

- [ ] **Step 1: Create ReportHeader**

```jsx
// heritage-guard/src/components/laporan/ReportHeader.jsx
import Logo from "@/components/Logo";

function pad(n) { return String(n).padStart(2, "0"); }

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function ReportHeader({ assetMeta, reportId }) {
  const printDate = formatDate(new Date().toISOString());

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 print:rounded-none print:border-0 print:p-0">
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100">
        <Logo size={40} showText href={null} />
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. Laporan</p>
          <p className="text-sm font-black text-gray-900 mt-0.5">{reportId}</p>
          <p className="text-[11px] text-gray-400 mt-1">Dicetak: {printDate}</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">
          Dokumen Teknis Resmi
        </p>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          LAPORAN INSPEKSI TEKNIS
        </h1>
        <p className="text-sm text-gray-500 mt-1">Deteksi Kerusakan Cagar Budaya — HeritageGuard AI</p>
      </div>

      <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden text-sm">
        {[
          ["Nama Bangunan",   assetMeta.buildingName || "-"],
          ["Lokasi",          assetMeta.location     || "-"],
          ["Tanggal Inspeksi",formatDate(assetMeta.inspectedAt)],
          ["Nama Inspektor",  "Arch. Hendrawan (mock)"],
        ].map(([label, value], i) => (
          <div key={label} className={`flex flex-col gap-1 p-4 ${i % 2 === 0 ? "bg-gray-50/60" : "bg-white"} border-b border-gray-100 last:border-0`}>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="font-bold text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ReportBody**

```jsx
// heritage-guard/src/components/laporan/ReportBody.jsx
"use client";

import ScanCanvas from "@/components/upload/ScanCanvas";

const COLOR = {
  crack:    { bar: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50"    },
  spalling: { bar: "bg-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
  moisture: { bar: "bg-blue-500",   text: "text-blue-600",   bg: "bg-blue-50"   },
};

const REKOMENDASI = {
  crack:    "Diperlukan injeksi epoxy pada retakan struktural dalam waktu 48 jam. Lakukan pemantauan berkala setiap 7 hari untuk memastikan retakan tidak meluas.",
  spalling: "Pengelupasan beton memerlukan patching dengan mortar repair khusus heritage. Bersihkan area spalling, aplikasikan bonding agent, dan tambal dengan mortar sebelum dilakukan pengecatan ulang.",
  moisture: "Infiltrasi kelembapan memerlukan aplikasi waterproofing membrane pada permukaan eksterior. Identifikasi sumber kebocoran dan perbaiki sealant pada sambungan struktur.",
};

export default function ReportBody({ imagePreview, detections }) {
  const labelCounts = detections.reduce((acc, d) => {
    const k = d.label?.toLowerCase() ?? "unknown";
    if (!acc[k]) acc[k] = { count: 0, maxConf: 0 };
    acc[k].count++;
    acc[k].maxConf = Math.max(acc[k].maxConf, d.confidence ?? 0);
    return acc;
  }, {});

  const detectedLabels = Object.keys(labelCounts);

  return (
    <div className="space-y-8">
      {/* Detection Image */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 print:border-0">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
          Visualisasi Deteksi
        </h2>
        <ScanCanvas imagePreview={imagePreview} detections={detections} />
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm" /><span>Crack</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm" /><span>Spalling</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm" /><span>Moisture</span></div>
        </div>
      </div>

      {/* Detection Summary Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden print:border-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ringkasan Deteksi</h2>
        </div>
        {detections.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 text-center">Tidak ada kerusakan terdeteksi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Jenis Kerusakan", "Jumlah Deteksi", "Confidence Maks.", "Tingkat"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {detectedLabels.map((label) => {
                const { count, maxConf } = labelCounts[label];
                const c = COLOR[label] ?? { text: "text-gray-600", bg: "bg-gray-50" };
                const pct = Math.round(maxConf * 100);
                const level = pct >= 90 ? "Kritis" : pct >= 70 ? "Menengah" : "Rendah";
                return (
                  <tr key={label} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-bold text-gray-900 capitalize">{label}</td>
                    <td className="px-6 py-4 text-gray-600">{count}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{pct}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${c.bg} ${c.text}`}>{level}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Damage Bars */}
      {detectedLabels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 print:border-0">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Analisis Tingkat Kerusakan</h2>
          <div className="space-y-6">
            {detectedLabels.map((label) => {
              const pct = Math.round(labelCounts[label].maxConf * 100);
              const c = COLOR[label] ?? { bar: "bg-gray-400", text: "text-gray-600" };
              return (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider capitalize">{label}</span>
                    <span className={`text-xs font-bold ${c.text}`}>{pct >= 90 ? "Critical" : pct >= 70 ? "Moderate" : "Low"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {detectedLabels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 print:border-0">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Rekomendasi Tindakan</h2>
          <div className="space-y-4">
            {detectedLabels.map((label) => {
              const c = COLOR[label] ?? { bg: "bg-gray-50", text: "text-gray-700" };
              return (
                <div key={label} className={`p-5 rounded-xl ${c.bg} border border-opacity-20`}>
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 capitalize ${c.text}`}>{label}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{REKOMENDASI[label] ?? "Lakukan evaluasi lebih lanjut oleh insinyur konservasi."}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create ReportActions**

```jsx
// heritage-guard/src/components/laporan/ReportActions.jsx
"use client";

import { Printer, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import useScanStore from "@/store/useScanStore";

export default function ReportActions() {
  const router = useRouter();
  const resetScan = useScanStore((s) => s.resetScan);

  const handleNewScan = () => {
    resetScan();
    router.push("/dashboard/upload");
  };

  return (
    <div className="flex items-center gap-4 mb-6 print:hidden">
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
      >
        <Printer size={18} />
        Cetak / Ekspor PDF
      </button>
      <button
        onClick={handleNewScan}
        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
      >
        <RotateCcw size={18} />
        Scan Baru
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Create the laporan page**

```jsx
// heritage-guard/src/app/dashboard/laporan/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useScanStore from "@/store/useScanStore";
import ReportHeader from "@/components/laporan/ReportHeader";
import ReportBody from "@/components/laporan/ReportBody";
import ReportActions from "@/components/laporan/ReportActions";

export default function LaporanPage() {
  const router = useRouter();
  const { scanStatus, imagePreview, detections, assetMeta } = useScanStore();

  const reportId = `HG-${Date.now().toString(36).toUpperCase()}`;

  useEffect(() => {
    if (scanStatus !== "success") {
      router.replace("/dashboard/upload");
    }
  }, [scanStatus, router]);

  if (scanStatus !== "success") return null;

  return (
    <main className="pb-20 print:pb-0">
      <ReportActions />
      <div id="report-content" className="space-y-8">
        <ReportHeader assetMeta={assetMeta} reportId={reportId} />
        <ReportBody imagePreview={imagePreview} detections={detections} />
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Verify full scan → report flow**

```bash
npm run dev
```

1. Go to `/dashboard/upload`, drop an image, fill building name + location
2. Click Mulai Analisis — see loading skeleton
3. After API responds — see canvas with bounding boxes
4. Click "Lihat Laporan Lengkap" — navigates to `/dashboard/laporan`
5. Report shows: header with asset info, detection image, summary table, bars, recommendations
6. "Cetak / Ekspor PDF" triggers browser print dialog
7. "Scan Baru" resets and navigates back to upload

- [ ] **Step 6: Commit**

```bash
git add heritage-guard/src/components/laporan/ heritage-guard/src/app/dashboard/laporan/
git commit -m "feat: add Report Generator page with print CSS export"
```

---

## Task 11: Profile Page

**Files:**
- Create: `heritage-guard/src/components/profil/ProfilAvatar.jsx`
- Create: `heritage-guard/src/components/profil/ProfilForm.jsx`
- Create: `heritage-guard/src/app/dashboard/profil/page.js`

- [ ] **Step 1: Create ProfilAvatar**

```jsx
// heritage-guard/src/components/profil/ProfilAvatar.jsx
"use client";

const ROLES = {
  pemerintah: "Instansi Pemerintah",
  swasta:     "Lembaga Swasta / Yayasan",
  ahli:       "Tenaga Ahli Konservasi",
};

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilAvatar({ name, role }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
        {getInitials(name || "User")}
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900">{name || "—"}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-primary text-xs font-bold rounded-full">
          {ROLES[role] ?? "Pengguna"}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ProfilForm**

```jsx
// heritage-guard/src/components/profil/ProfilForm.jsx
"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ROLES = [
  { value: "pemerintah", label: "Instansi Pemerintah (BPK / Dinas Kebudayaan)" },
  { value: "swasta",     label: "Lembaga Swasta / Yayasan Museum"              },
  { value: "ahli",       label: "Tenaga Ahli (Arsitek / Insinyur Konservasi)"  },
];

function FormField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-blue-100/50 rounded-xl py-3.5 px-4 text-sm outline-none transition-all font-semibold";

export default function ProfilForm({ onNameChange }) {
  const [form, setForm] = useState({
    name:         "Arch. Hendrawan",
    email:        "hendrawan@heritage.id",
    institusi:    "Balai Pelestarian Kebudayaan Wilayah X",
    role:         "ahli",
  });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved]       = useState(false);
  const [pwError, setPwError]   = useState("");

  const handleSave = () => {
    setSaved(true);
    onNameChange?.(form.name);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordSave = () => {
    if (!passwords.current) { setPwError("Masukkan kata sandi saat ini."); return; }
    if (passwords.next.length < 8) { setPwError("Kata sandi baru minimal 8 karakter."); return; }
    if (passwords.next !== passwords.confirm) { setPwError("Konfirmasi kata sandi tidak cocok."); return; }
    setPwError("");
    setPasswords({ current: "", next: "", confirm: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Informasi Akun</h3>

        <FormField label="Nama Lengkap">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </FormField>
        <FormField label="Email">
          <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Institusi">
          <input className={inputCls} value={form.institusi} onChange={(e) => setForm({ ...form, institusi: e.target.value })} />
        </FormField>
        <FormField label="Peran">
          <select
            className={`${inputCls} appearance-none`}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </FormField>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">
            Simpan Perubahan
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-bold">
              <CheckCircle2 size={16} />
              Tersimpan!
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Ubah Kata Sandi</h3>

        <FormField label="Kata Sandi Saat Ini">
          <input className={inputCls} type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
        </FormField>
        <FormField label="Kata Sandi Baru">
          <input className={inputCls} type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
        </FormField>
        <FormField label="Konfirmasi Kata Sandi Baru">
          <input className={inputCls} type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
        </FormField>

        {pwError && <p className="text-sm text-red-500 font-medium">{pwError}</p>}

        <button onClick={handlePasswordSave} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-700 transition-all active:scale-95">
          Perbarui Kata Sandi
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create profil page**

```jsx
// heritage-guard/src/app/dashboard/profil/page.js
"use client";

import { useState } from "react";
import ProfilAvatar from "@/components/profil/ProfilAvatar";
import ProfilForm from "@/components/profil/ProfilForm";

export default function ProfilPage() {
  const [name, setName] = useState("Arch. Hendrawan");

  return (
    <div className="max-w-2xl space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profil Saya</h1>
        <p className="text-gray-500 text-sm">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <ProfilAvatar name={name} role="ahli" />
      </div>

      <ProfilForm onNameChange={setName} />
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

Navigate to `http://localhost:3000/dashboard/profil`.
- Avatar with initials appears
- Edit form pre-filled
- Change a name field → click Save → "Tersimpan!" toast appears
- Password mismatch → shows error message

- [ ] **Step 5: Commit**

```bash
git add heritage-guard/src/components/profil/ heritage-guard/src/app/dashboard/profil/
git commit -m "feat: add Profile page with edit form and password change"
```

---

## Task 12: Print CSS

**Files:**
- Modify: `heritage-guard/src/app/globals.css`

- [ ] **Step 1: Append print rules at end of globals.css**

```css
/* Add to end of heritage-guard/src/app/globals.css */

@media print {
  @page {
    size: A4 portrait;
    margin: 20mm;
  }

  /* Hide chrome */
  aside,
  header,
  nav,
  .print\:hidden {
    display: none !important;
  }

  /* Full-width report */
  body {
    background: white !important;
  }

  main {
    padding: 0 !important;
    overflow: visible !important;
  }

  /* Ensure report content fills width */
  #report-content {
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Prevent page breaks inside cards */
  .bg-white {
    break-inside: avoid;
  }

  /* Force colors to print */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

- [ ] **Step 2: Verify print layout**

```bash
npm run dev
```

1. Navigate to `/dashboard/laporan` (after completing a scan)
2. Press `Ctrl+P` (or click Cetak / Ekspor PDF)
3. In print preview: sidebar and top header should be hidden, report content fills full width in A4 format

- [ ] **Step 3: Final build check**

```bash
cd heritage-guard && npm run build
```

Expected: build completes with no errors. Warnings about large bundle size are acceptable.

- [ ] **Step 4: Commit**

```bash
git add heritage-guard/src/app/globals.css
git commit -m "feat: add print CSS for A4 PDF export from report page"
```

---

## Self-Review Checklist

| Spec requirement | Task |
|---|---|
| Zustand store with all 6 actions | Task 2 |
| Register role select (3 options) | Task 3 |
| MetricCard ×4 on dashboard | Tasks 4, 6 |
| recharts AreaChart on dashboard | Tasks 5, 6 |
| Sidebar Profil nav item | Task 7 |
| ScanCanvas with Canvas API | Task 8 |
| UploadZone: drag-drop + meta inputs | Task 9 |
| UploadZone: real HuggingFace API POST | Task 9 |
| Loading skeleton during scan | Task 9 |
| Detection chips after success | Task 9 |
| Error state with retry | Task 9 |
| Empty detection message | Task 9 |
| Report redirects if no scan | Task 10 |
| Report: header + asset info table | Task 10 |
| Report: ScanCanvas render | Task 10 |
| Report: summary table + bars | Task 10 |
| Report: recommendations per label | Task 10 |
| Report: window.print() | Task 10 |
| Profile: avatar + initials | Task 11 |
| Profile: edit form | Task 11 |
| Profile: password change validation | Task 11 |
| Print CSS A4 / hide sidebar | Task 12 |
| npm run build passes | Task 12 |
