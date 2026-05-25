# HeritageGuard

Platform deteksi kerusakan bangunan cagar budaya berbasis AI. Pengguna mengunggah foto bangunan, sistem menjalankan inferensi YOLOv12, menghitung health score, lalu menyimpan laporan lengkap di cloud.

**Produksi:** https://heritageguard.azurewebsites.net

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend & Backend | Next.js 16 (App Router) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Object Storage | Cloudflare R2 |
| Model AI | YOLOv12 via Hugging Face Spaces |
| Container Registry | Azure Container Registry |
| Hosting | Azure App Service |
| CI/CD | GitHub Actions |

---

## Arsitektur

```
src/
├── app/
│   ├── api/                  # Route handlers (server-only)
│   │   ├── inference/        # Pipeline ML utama
│   │   ├── me/               # Profil & role user
│   │   ├── admin/            # Endpoint admin
│   │   └── dashboard/        # Data dashboard
│   ├── login/ register/      # Halaman autentikasi
│   └── dashboard/            # Halaman aplikasi (upload, history, reports, profile, admin)
├── components/               # React client components
├── lib/server/               # Modul server-only (jangan import di client)
│   ├── supabase.js           # Admin & anon Supabase client
│   ├── r2.js                 # Cloudflare R2 client
│   └── inference.js          # Normalisasi output ML & kalkulasi health score
├── utils/
│   └── supabase.js           # Browser Supabase client
├── store/
│   └── useScanStore.js       # Zustand state untuk upload workflow
└── api/                      # Client-side API service layer
```

### Pipeline Inferensi (`POST /api/inference`)

```
1. Validasi multipart form (Zod) — file gambar + metadata
2. Autentikasi via Bearer token
3. POST gambar ke Hugging Face Spaces
4. normalizeDetections()     — normalisasi variasi format output ML
5. buildDetectionSummaries() — agregasi per kategori kerusakan
6. calculateHealthScore()    — skor 0–100 dari jumlah & confidence deteksi
7. Upload gambar + laporan JSON ke Cloudflare R2
8. Insert ke INSPECTIONS, DETECTIONS, ANALYSIS_SUMMARIES
9. Return hasil + signed URL ke client
```

### Skema Database

```
USERS ──┐
        ├──→ INSPECTIONS ──→ DETECTIONS
ASSETS ─┘         │
                  └──→ ANALYSIS_SUMMARIES
AI_MODELS ────────┘
```

---

## Menjalankan Lokal

### Prasyarat

- Node.js 22+
- Akun Supabase
- Akun Cloudflare R2
- Hugging Face Spaces aktif dengan model YOLOv12

### Setup

```bash
# 1. Clone repo
git clone https://github.com/ZufarSyaafie/heritage-guard.git
cd heritage-guard

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env.local
# Isi semua nilai di .env.local

# 4. Jalankan dev server
npm run dev
```

Buka http://localhost:3000

### Perintah

```bash
npm run dev    # Dev server (localhost:3000)
npm run build  # Production build
npm start      # Jalankan production build
npm run lint   # ESLint
```

---

## Environment Variables

Buat file `.env.local` di root project:

```env
# Supabase (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (server-only)
NEXT_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2 (server-only)
NEXT_R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
NEXT_R2_ACCESS_KEY_ID=your-access-key-id
NEXT_R2_SECRET_ACCESS_KEY=your-secret-access-key
NEXT_R2_BUCKET=your-bucket-name
NEXT_R2_PUBLIC_BASE_URL=https://your-public-domain (opsional)

# Hugging Face (server-only)
NEXT_HF_INFERENCE_URL=https://mhfzalfrs-heritageguard.hf.space/predict

# URL aplikasi (browser-safe)
NEXT_PUBLIC_HERITAGEGUARD_API_URL=http://localhost:3000
```

> `NEXT_PUBLIC_*` aman di browser. `NEXT_*` tanpa `PUBLIC` hanya ada di server, tidak pernah ter-bundle ke JavaScript frontend.

---

## Menjalankan dengan Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --build-arg NEXT_PUBLIC_HERITAGEGUARD_API_URL=https://heritageguard.azurewebsites.net \
  -t heritageguard:local .

docker run -p 3000:3000 \
  -e NEXT_SUPABASE_SERVICE_ROLE_KEY=... \
  -e NEXT_R2_ENDPOINT=... \
  -e NEXT_R2_ACCESS_KEY_ID=... \
  -e NEXT_R2_SECRET_ACCESS_KEY=... \
  -e NEXT_R2_BUCKET=... \
  -e NEXT_HF_INFERENCE_URL=... \
  heritageguard:local
```

Dockerfile menggunakan multi-stage build (`deps` → `builder` → `runner`) dengan base image `node:22-alpine`. Output Next.js standalone — tidak perlu `npm install` saat runtime. Container berjalan sebagai non-root user.

---

## Deployment ke Azure

Deployment otomatis via GitHub Actions setiap push ke branch `main-azure`.

### Alur CI/CD

```
Push ke main-azure
       │
       ▼
GitHub Actions
       ├── Login ke Azure Container Registry (heritageguardacr.azurecr.io)
       ├── docker build (inject secrets sebagai build args)
       ├── docker push → heritageguardacr.azurecr.io/heritageguard:latest
       └── az webapp restart → heritageguard (resource group: heritageguard-rg)
```

### GitHub Secrets yang Diperlukan

| Secret | Keterangan |
|---|---|
| `ACR_USERNAME` | Username Azure Container Registry |
| `ACR_PASSWORD` | Password Azure Container Registry |
| `AZURE_CREDENTIALS` | JSON credentials dari `az ad sp create-for-rbac` |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

> Secret server-only seperti `NEXT_SUPABASE_SERVICE_ROLE_KEY` dan kunci R2 dikonfigurasi langsung di **Azure App Service → Configuration → Application settings**, bukan di GitHub Secrets.

### Cek Status Deployment

```bash
# Via Azure CLI
az webapp show \
  --name heritageguard \
  --resource-group heritageguard-rg \
  --query "{state:state, url:defaultHostName}"

# Live logs
az webapp log tail --name heritageguard --resource-group heritageguard-rg
```

Atau buka **portal.azure.com** → cari resource group `heritageguard-rg`.

---

## Fitur Keamanan

| Mekanisme | Detail |
|---|---|
| Magic byte validation | Cegah file berbahaya yang disamarkan sebagai gambar |
| Rate limiting | 5 request/menit per user di endpoint inferensi |
| Bearer token auth | Semua API route memverifikasi token via Supabase |
| Role-based access | `role === 'admin'` diperiksa dari DB di setiap admin endpoint |
| Security headers | HSTS, X-Frame-Options, X-Content-Type-Options, CSP, dll. |
| Signed URL R2 | URL gambar expired 15 menit, tidak bisa di-share permanen |
| Server/client separation | Kunci sensitif hanya ada di `lib/server/`, tidak pernah ter-bundle ke browser |
| File size limit | Maksimal 10 MB per upload |
| HuggingFace timeout | AbortSignal timeout 60 detik |

---

## Kategori Kerusakan & Health Score

Model mendeteksi tiga kategori kerusakan:

| Kelas | Deskripsi |
|---|---|
| **Crack** | Retakan pada dinding atau struktur |
| **Spalling** | Pengelupasan lapisan permukaan |
| **Moisture** | Tanda kelembaban atau rembesan air |

**Formula Health Score (0–100):**

```
Health Score = 100 - severityPenalty - confidencePenalty

severityPenalty   = min(25, jumlah_deteksi × 4)
confidencePenalty = round(rata_rata_confidence × 45)
```

| Confidence | Status |
|---|---|
| ≥ 0.85 | Critical |
| ≥ 0.65 | High |
| ≥ 0.40 | Moderate |
| < 0.40 | Low |
