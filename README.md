# HeritageGuard

Platform berbasis website yang mengintegrasikan model AI untuk menyediakan sarana pemantauan otomasi dan pelaporan kerusakan cagar budaya yang cepat, akurat, dan terintegrasi.

**Produksi:** https://heritageguard.azurewebsites.net  
**Dokumentasi:** https://zufarsyaafie.github.io/HeritageGuard

---

## Latar Belakang

Bangunan cagar budaya rentan terhadap deteriorasi akibat faktor fisik, mekanis, kimiawi, dan biologis. Inspeksi visual manual menghasilkan penilaian yang tidak konsisten, sementara sensor modern mahal dan tidak fleksibel untuk pemantauan rutin. HeritageGuard hadir sebagai solusi: platform web yang mengintegrasikan model YOLO untuk deteksi kerusakan otomatis dari foto bangunan secara real-time.

---

## Tim

| Nama | NIM | Peran |
|---|---|---|
| Muhammad Khaira Rahmadya Nauval | 23/521078/TK/57466 | Project Manager |
| Muhammad Hafidz Al Farisi | 23/519650/TK/57256 | Cloud Engineer |
| Muhammad Zufar Syaafi' | 23/517479/TK/56923 | AI Engineer |

**Kelompok:** Sidat Sawah

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| Upload & Scan | Unggah foto bangunan, proses inferensi AI berjalan otomatis |
| Deteksi Otomatis | Identifikasi dan lokalisasi kerusakan (crack, spalling, moisture) dengan bounding box |
| Health Score | Skor kondisi bangunan 0–100 berdasarkan jumlah dan tingkat kepercayaan deteksi |
| Laporan Otomatis | Konversi hasil deteksi menjadi laporan teknis formal |
| Riwayat Inspeksi | Pantau deteriorasi bangunan dari waktu ke waktu |
| Dashboard Admin | Monitoring seluruh aset dan statistik inspeksi |

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

## Struktur Repository

```
HeritageGuard/
├── heritage-guard/          # Aplikasi Next.js (source utama)
│   ├── src/
│   │   ├── app/api/         # Route handlers (server-side)
│   │   ├── components/      # React components
│   │   ├── lib/server/      # Modul server-only
│   │   └── store/           # Zustand client state
│   ├── Dockerfile
│   ├── .github/workflows/   # GitHub Actions CI/CD
│   └── README.md            # Dokumentasi teknis lengkap
└── docs/                    # Dokumentasi GitHub Pages (Jekyll)
    ├── modul1.md            # Perumusan masalah & lean canvas
    ├── modul2.md            # SDLC, ERD, wireframe
    └── asset/               # Gambar dokumentasi
```

---

## Mulai Cepat

```bash
cd heritage-guard
npm install
cp .env.example .env.local   # isi semua environment variables
npm run dev                  # buka http://localhost:3000
```

Lihat [`heritage-guard/README.md`](heritage-guard/README.md) untuk panduan lengkap setup, environment variables, Docker, dan deployment Azure.

---

## Kategori Kerusakan

| Kelas | Deskripsi |
|---|---|
| **Crack** | Retakan pada dinding atau struktur |
| **Spalling** | Pengelupasan lapisan permukaan |
| **Moisture** | Tanda kelembaban atau rembesan air |

---

## Deployment

Deployment otomatis via GitHub Actions setiap push ke branch `main-azure`:

```
Push ke main-azure
    → Build Docker image
    → Push ke Azure Container Registry (heritageguardacr.azurecr.io)
    → Restart Azure App Service (heritageguard.azurewebsites.net)
```

---

*HeritageGuard — Melindungi Warisan Budaya dengan Teknologi*
