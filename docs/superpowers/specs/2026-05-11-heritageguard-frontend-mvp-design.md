# HeritageGuard Frontend MVP — Design Spec

**Date:** 2026-05-11  
**Status:** Approved  
**Scope:** heritage-guard Next.js app (App Router, Tailwind CSS v4)

---

## 1. Tech Stack

| Layer      | Choice                        | Reason                                                              |
| ---------- | ----------------------------- | ------------------------------------------------------------------- |
| Framework  | Next.js App Router (existing) | already configured                                                  |
| Styling    | Tailwind CSS v4 (existing)    | keep — no migration                                                 |
| Icons      | Lucide React (existing)       | keep                                                                |
| State      | Zustand (new)                 | scan result shared between Upload and Report pages                  |
| Charts     | recharts (new)                | dashboard trend chart, CSS-only insufficient                        |
| shadcn/ui  | NOT installed via CLI         | Tailwind v4 incompatibility; inline component patterns used instead |
| PDF export | `window.print()` + print CSS  | zero deps, sufficient for government reports                        |

---

## 2. Zustand Store

**File:** `src/store/useScanStore.js`

```js
{
  scanStatus:   'idle' | 'uploading' | 'success' | 'error',
  imageFile:    File | null,
  imagePreview: string | null,   // base64 data URL
  detections:   Detection[],     // from API response
  assetMeta:    { buildingName, location, inspectedAt },
  errorMsg:     string | null,

  // actions
  setImage, setMeta, startScan, setScanSuccess, setScanError, resetScan
}
```

**Detection shape (API response expected):**

```js
{ label: 'crack' | 'spalling' | 'moisture', confidence: number, x1, y1, x2, y2 }
```

Color map: `crack` → red (`#ef4444`), `spalling` → yellow (`#eab308`), `moisture` → blue (`#3b82f6`)

---

## 3. Pages

### 3.1 Landing Page `/` — no change

Existing hero, features, audience sections stay as-is. No pricing section.

### 3.2 Login `/login` — no change

### 3.3 Register `/register`

**Change:** Add role `<select>` field to `RegisterForm.jsx`.

Options:

- Instansi Pemerintah (BPK / Dinas Kebudayaan)
- Lembaga Swasta / Yayasan Museum
- Tenaga Ahli (Arsitek / Insinyur Konservasi)

Field sits between email and password. Stored in form state only (no backend).

### 3.4 Dashboard `/dashboard`

**Additions above existing layout:**

**MetricCard row (4 cards):**

- Total Aset Terpantau: 142
- Inspeksi Bulan Ini: 38
- Tingkat Kritis: 12
- Tingkat Aman: 118

**DamageChart** — recharts `AreaChart`, 6-month mock data, shows scan count per month by damage type. Placed below MetricCard row, above existing grid.

Existing DamageDetection / AnalysisSummary / HealthScore / AssetInfo / ActionCards grid unchanged.

### 3.5 Upload & Scan `/dashboard/upload` — CORE

**Flow:**

```
1. User drops/selects image → preview shown
2. User fills: buildingName, location (required before submit)
3. "Mulai Analisis" button
4. setStatus('uploading') → loading skeleton pulse over image area
5. POST FormData{file} to https://mhfzalfrs-heritageguard.hf.space/predict
6. On success: parse detections → store in Zustand → draw on <canvas> → setStatus('success')
7. "Lihat Laporan Lengkap" button appears → navigate to /dashboard/laporan
8. On error: inline error message → setStatus('error') → allow retry
```

**ScanCanvas component** (`src/components/upload/ScanCanvas.jsx`):

- Receives `imagePreview` (base64) + `detections` array
- Draws image onto `<canvas>` using `drawImage`
- Iterates detections: stroke colored rect + label text badge
- Canvas sized to match image natural aspect ratio, max-width 100%

**Loading skeleton:** pulsing gray rectangle replacing image area, with spinner icon centered. `animate-pulse` Tailwind class.

**CORS:** HuggingFace Spaces endpoint should allow CORS. If blocked, surface error message: "Server tidak dapat dijangkau. Coba beberapa saat lagi."

### 3.6 Historical Log `/dashboard/histori` — no change

Already complete: search, filter, sort, pagination, CSV export.

### 3.7 Report Generator `/dashboard/laporan` — NEW

Reads exclusively from Zustand store. If `scanStatus !== 'success'`, redirect to `/dashboard/upload`.

**Report sections:**

1. **Header** — HeritageGuard logo, "LAPORAN INSPEKSI TEKNIS", report ID (`HG-{timestamp}`), print date
2. **Asset info table** — Nama Bangunan, Lokasi, Tanggal Inspeksi, Nama Inspektor (mock)
3. **Detection image** — re-render ScanCanvas with detections overlaid
4. **Detection summary table** — Label, Confidence (%), Count per label
5. **Damage analysis bars** — reuse AnalysisSummary visual pattern
6. **Rekomendasi** — static text blocks keyed to detected labels:
   - `crack` → "Diperlukan injeksi epoxy pada retakan struktural..."
   - `spalling` → "Pengelupasan beton memerlukan patching dengan mortar..."
   - `moisture` → "Infiltrasi kelembapan memerlukan waterproofing..."
7. **Action buttons** — "Cetak / Ekspor PDF" (`window.print()`) + "Scan Baru" (resetScan → /dashboard/upload)

**Print CSS** (`@media print`):

- Hide: Sidebar, Header, action buttons, browser chrome
- Show: report content full-width
- Page size: A4 portrait
- Force white background

### 3.8 Profile `/dashboard/profil` — NEW

Mock only, no backend.

**Sections:**

- Avatar (initials-based, colored circle) + name + role badge
- Edit form: Nama Lengkap, Email, Institusi, Role (select)
- Change password: Current, New, Confirm (validation: match check only)
- Save button → success toast (mock)

---

## 4. Navigation Updates

**Sidebar** gains two new nav items:

```
Profil  →  /dashboard/profil   (UserCircle icon)
```

Ordering:

1. Dashboard
2. Upload Citra
3. Histori Inspeksi
4. Profil
5. Logout (bottom, unchanged)

---

## 5. New Files

```
src/store/useScanStore.js

src/components/upload/ScanCanvas.jsx
src/components/dashboard/MetricCard.jsx
src/components/dashboard/DamageChart.jsx
src/components/laporan/ReportHeader.jsx
src/components/laporan/ReportBody.jsx
src/components/laporan/ReportActions.jsx
src/components/profil/ProfilForm.jsx
src/components/profil/ProfilAvatar.jsx

src/app/dashboard/laporan/page.js
src/app/dashboard/profil/page.js
```

---

## 6. Modified Files

```
heritage-guard/package.json                          # + zustand, recharts
src/components/auth/RegisterForm.jsx                 # + role select field
src/app/dashboard/page.js                            # + MetricCards + DamageChart
src/components/Sidebar.jsx                           # + Profil nav item
src/app/dashboard/upload/page.js                     # orchestration rewrite
src/components/upload/UploadZone.jsx                 # real API + store integration
src/app/globals.css                                  # + print CSS
```

---

## 7. Error Handling

| Scenario                         | Behavior                                                             |
| -------------------------------- | -------------------------------------------------------------------- |
| File > 10MB                      | Reject at drop, alert (existing)                                     |
| Non-image file                   | Reject at drop, alert (existing)                                     |
| API timeout / network error      | Inline error below canvas, retry button                              |
| API returns empty detections     | Show canvas with no boxes + "Tidak ada kerusakan terdeteksi" message |
| Report page visited without scan | Redirect to /dashboard/upload                                        |
| HuggingFace cold start (slow)    | Loading state handles; no special timeout                            |

---

## 8. Out of Scope (MVP)

- Real authentication / session management
- Backend storage of scan results
- Multi-image batch scanning
- User settings persistence
- Mobile sidebar (hamburger menu)
