# Dupa Aroma Kemakmuran - Website & Katalog

Website profil usaha dan katalog produk eksklusif dengan tema Nusantara Tradisional Premium. Proyek ini dibangun menggunakan Next.js (App Router), **Drizzle ORM** untuk database PostgreSQL (Supabase), dan Supabase Cloud untuk Auth & Storage. Desain bernuansa Maroon dan Emas yang dikelola secara mandiri oleh admin.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI, Radix UI
- **Animasi:** GSAP (ScrollTrigger & ScrollSmoother)
- **Database:** PostgreSQL (Supabase) via **Drizzle ORM**
- **Auth & Storage:** Supabase (`@supabase/ssr` untuk Auth, `supabase.storage` untuk file)
- **Deploy/Infrastruktur:** Docker & Docker Compose (untuk frontend)

## 📁 Struktur Direktori

```
aroma-kemakmuran/
├── frontend/             # Next.js Application
│   ├── app/              # Next.js App Router (Public & Admin Pages)
│   ├── components/       # Reusable UI Components (Shadcn, dsb)
│   ├── lib/
│   │   ├── db/           # Drizzle ORM: schema, client, actions
│   │   ├── supabase/     # Supabase clients (client, server, middleware)
│   │   └── actions/      # Server Actions (categories, products)
│   ├── public/           # Static assets
│   ├── scripts/          # Skrip pendukung (seed, create-admin)
│   └── ...               # Konfigurasi Next.js, Tailwind, Drizzle
└── docker-compose.yml    # Konfigurasi containerized apps (Frontend)
```

## 🛠️ Prasyarat (Prerequisites)

- Akun Supabase (untuk Database, Storage, dan Auth)
- [Docker](https://docs.docker.com/engine/install/) dan [Docker Compose](https://docs.docker.com/compose/install/) (Jika menggunakan Docker)
- Node.js & npm (Untuk menjalankan frontend secara lokal tanpa Docker)

## ⚙️ Persiapan Supabase

1. Buat proyek baru di [Supabase](https://supabase.com).
2. Dapatkan kredensial proyek dari **Project Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` / `publishable` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. Dapatkan **Database Connection String** dari **Project Settings > Database > Connection String** (mode Transaction/Pooler):
   - Format: `postgresql://postgres.[ref]:[password]@[host]:6543/postgres`
   - Masukkan ke `DATABASE_URL` di `.env.local`
4. Buat file `.env.local` di direktori `frontend/` (lihat `.env.example`).
5. **Tabel database dibuat otomatis via Drizzle** — tidak perlu menjalankan SQL manual:
   ```bash
   cd frontend
   npm run db:push
   ```
6. Buat kredensial admin (Email/Password):
   ```bash
   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 npm run create-admin
   ```
   Atau buat manual via Supabase Dashboard → Authentication → Users → Add User.

## 🚦 Cara Menjalankan (Development)

### 1. Menjalankan secara Lokal (Node.js)

```bash
cd frontend
npm install
npm run db:push    # Sinkronkan schema Drizzle ke database
npm run seed       # Isi data awal (opsional)
npm run dev
```

Website dapat diakses pada [http://localhost:3000](http://localhost:3000).

### 2. Menjalankan Aplikasi dengan Docker

```bash
docker-compose up -d --build
```

Setelah berjalan:
- **Frontend Website:** [http://localhost:2200](http://localhost:2200)

### 3. Perintah Database Berguna

```bash
cd frontend

# Push schema ke database (setelah ubah lib/db/schema.ts)
npm run db:push

# Buka Drizzle Studio (GUI database)
npm run db:studio

# Seed data awal
npm run seed

# Buat user admin
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=password123 npm run create-admin
```

## 🔐 Environment Variables (`frontend/.env.local`)

```env
# Supabase (Auth & Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx

# Database (Drizzle ORM - direct PostgreSQL connection)
DATABASE_URL=postgresql://postgres.your-ref:password@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## 📝 Catatan Penting

- **Drizzle ORM** menangani semua query database (CRUD kategori, produk) via Server Actions di `lib/actions/`.
- **Supabase JS Client** (`@supabase/ssr`) hanya dipakai untuk **Authentication** (login, session, middleware) dan **Storage** (upload/delete file produk).
- Schema database single-source-of-truth ada di `lib/db/schema.ts`. Perubahan schema → `npm run db:push`.
- RLS policies di Supabase tetap berlaku untuk keamanan tambahan.