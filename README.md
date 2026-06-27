# Dupa Aroma Kemakmuran - Website & Katalog

Website profil usaha dan katalog produk eksklusif dengan tema Nusantara Tradisional Premium. Proyek ini dibangun menggunakan Next.js (App Router) dan PocketBase (BaaS) dengan desain bernuansa Maroon dan Emas yang dikelola secara mandiri oleh admin.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI, Radix UI
- **Animasi:** GSAP (ScrollTrigger & ScrollSmoother)
- **Backend/Database:** PocketBase (SQLite)
- **Deploy/Infrastruktur:** Docker & Docker Compose

## 📁 Struktur Direktori

```
aroma-kemakmuran/
├── frontend/             # Next.js Application
│   ├── app/              # Next.js App Router (Public & Admin Pages)
│   ├── components/       # Reusable UI Components (Shadcn, dsb)
│   ├── lib/              # Utility functions, PocketBase client, utils
│   ├── public/           # Static assets
│   ├── scripts/          # Skrip pendukung (misal: seed.ts)
│   └── ...               # Konfigurasi Next.js, Tailwind, dll
├── pocketbase/           # Docker configuration for PocketBase
├── pb_data/              # Data SQLite PocketBase (ter-generate saat runtime)
├── pb_migrations/        # File migrasi skema database PocketBase
└── docker-compose.yml    # Konfigurasi containerized apps
```

## 🛠️ Prasyarat (Prerequisites)

- [Docker](https://docs.docker.com/engine/install/) dan [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js & npm (Opsional: Jika ingin menjalankan frontend secara lokal tanpa Docker)

## 🚦 Cara Menjalankan (Development)

### 1. Menjalankan Aplikasi dengan Docker (Rekomendasi)

Jalankan perintah ini di root direktori proyek untuk me-*build* dan menjalankan PocketBase beserta Frontend secara bersamaan di *background* (`-d`):

```bash
docker-compose up -d --build
```

Setelah berjalan:
- **Frontend Website:** [http://localhost:2200](http://localhost:2200)
- **PocketBase Admin UI:** [http://localhost:8090/_/](http://localhost:8090/_/)

*Catatan: Port dapat disesuaikan pada file `docker-compose.yml`.*

### 2. Seeding Database (Data Awal)

Setelah container berjalan, Anda bisa mengisi PocketBase dengan data awal (kategori dan contoh produk) dengan menjalankan skrip *seed* langsung dari dalam container frontend:

```bash
docker exec -e NEXT_PUBLIC_PB_URL=http://pocketbase:8090 -it aroma-kemakmuran-frontend-1 npm run seed
```

*(Ganti `aroma-kemakmuran-frontend-1` dengan nama container frontend Anda jika berbeda).*

### 3. Mematikan Aplikasi (Teardown)

Untuk menghentikan semua layanan:

```bash
docker-compose down
```

## 🔐 Kredensial Default PocketBase

Saat pertama kali membuka Dashboard Admin PocketBase (`http://localhost:8090/_/`), Anda akan diminta membuat akun Admin. Jika Anda menjalankan seed, pastikan kredensial admin Anda sudah sama dengan file `.env` di folder `frontend` (Default `admin@example.com` / `password123`).

## 🎨 Design System & Requirements

Informasi lebih detail mengenai struktur spesifikasi, desain sistem, palet warna, tipografi, serta struktur database dapat dilihat pada dokumen berikut:
- [`PRD.md`](./PRD.md) - Detail fitur dan spesifikasi aplikasi.
- [`DESIGN.md`](./DESIGN.md) - Detail desain sistem (warna, animasi, font).
