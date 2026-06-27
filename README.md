# Dupa Aroma Kemakmuran - Website & Katalog

Website profil usaha dan katalog produk eksklusif dengan tema Nusantara Tradisional Premium. Proyek ini dibangun menggunakan Next.js (App Router) dan Supabase Cloud (BaaS) dengan desain bernuansa Maroon dan Emas yang dikelola secara mandiri oleh admin.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI, Radix UI
- **Animasi:** GSAP (ScrollTrigger & ScrollSmoother)
- **Backend/Database:** Supabase (PostgreSQL, Storage, Auth)
- **Deploy/Infrastruktur:** Docker & Docker Compose (untuk frontend)

## 📁 Struktur Direktori

```
aroma-kemakmuran/
├── frontend/             # Next.js Application
│   ├── app/              # Next.js App Router (Public & Admin Pages)
│   ├── components/       # Reusable UI Components (Shadcn, dsb)
│   ├── lib/              # Utility functions, Supabase clients (client, server, middleware)
│   ├── public/           # Static assets
│   ├── scripts/          # Skrip pendukung (misal: seed.ts)
│   └── ...               # Konfigurasi Next.js, Tailwind, dll
└── docker-compose.yml    # Konfigurasi containerized apps (Frontend)
```

## 🛠️ Prasyarat (Prerequisites)

- Akun Supabase (untuk Database, Storage, dan Auth)
- [Docker](https://docs.docker.com/engine/install/) dan [Docker Compose](https://docs.docker.com/compose/install/) (Jika menggunakan Docker)
- Node.js & npm (Untuk menjalankan frontend secara lokal tanpa Docker)

## ⚙️ Persiapan Supabase

1. Buat proyek baru di [Supabase](https://supabase.com).
2. Dapatkan kredensial proyek (`Project URL` dan `anon` / `service_role` key) dari **Project Settings > API**.
3. Buat file `.env` di direktori `frontend/` (lihat `.env.example`).
4. Jalankan skema SQL yang dibutuhkan pada Supabase SQL Editor:

   ```sql
   -- 1. Create Tables
   CREATE TABLE public.categories (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       name TEXT NOT NULL,
       slug TEXT NOT NULL UNIQUE
   );

   CREATE TABLE public.products (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       name TEXT NOT NULL,
       slug TEXT NOT NULL UNIQUE,
       category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT,
       price NUMERIC NOT NULL DEFAULT 0,
       description TEXT,
       image TEXT[] DEFAULT '{}',
       video TEXT[] DEFAULT '{}',
       shopee_url TEXT,
       is_active BOOLEAN DEFAULT true
   );

   -- 2. Create Storage Bucket
   INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true);

   -- 3. Row Level Security (RLS)
   ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
   CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
   CREATE POLICY "Public can view product-media" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');

   CREATE POLICY "Admins full access categories" ON public.categories FOR ALL TO authenticated USING (true);
   CREATE POLICY "Admins full access products" ON public.products FOR ALL TO authenticated USING (true);
   CREATE POLICY "Admins full access product-media" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'product-media');
   ```

5. Buat kredensial admin (Email/Password) melalui Supabase Dashboard (Auth > Users).

## 🚦 Cara Menjalankan (Development)

### 1. Menjalankan secara Lokal (Node.js)

Masuk ke folder `frontend`, instal dependensi, lalu jalankan development server:

```bash
cd frontend
npm install
npm run dev
```

Website dapat diakses pada [http://localhost:3000](http://localhost:3000).

### 2. Menjalankan Aplikasi dengan Docker

Jalankan perintah ini di root direktori proyek:

```bash
docker-compose up -d --build
```

Setelah berjalan:
- **Frontend Website:** [http://localhost:2200](http://localhost:2200)

### 3. Seeding Database (Data Awal)

Anda dapat mengisi Supabase dengan data awal (kategori dan contoh produk) dengan menjalankan skrip *seed* dari folder `frontend`:

```bash
cd frontend
npm run seed
```

*(Pastikan `.env` telah dikonfigurasi dengan `NEXT_PUBLIC_SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`)*
