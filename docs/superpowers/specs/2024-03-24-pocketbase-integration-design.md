# Spesifikasi Integrasi PocketBase Backend & Docker

## 1. Arsitektur Infrastruktur (Docker)
- **Docker Compose (`docker-compose.yml`)**: Akan menjalankan dua servis:
  1. `pocketbase`: Menjalankan *binary* PocketBase menggunakan base image Alpine. Port diekspos ke `8090`. Data disimpan secara persisten menggunakan Docker volume (`./pb_data:/pb/pb_data`).
  2. `frontend`: Menjalankan aplikasi Next.js. Port diekspos ke `3000`. Mengakses PocketBase secara internal melalui *Docker network*.
- **Environment Variables**:
  - `NEXT_PUBLIC_PB_URL`: URL publik (misal: `http://127.0.0.1:8090`) untuk *client-side fetching* (Dashboard Admin).
  - `INTERNAL_PB_URL`: URL internal Docker (misal: `http://pocketbase:8090`) untuk *server-side fetching* (Halaman Publik).

## 2. Skema Database (PocketBase Migrations)
Akan dibuat file migrasi otomatis (berbasis JSON/JS) di folder `pb_migrations` yang akan di-mount ke *container* PocketBase.
### A. Collection: `categories`
- `name` (Text, Required)
- `slug` (Text, Required, Unique)
### B. Collection: `products`
- `name` (Text, Required)
- `slug` (Text, Required, Unique)
- `category` (Relation ke `categories`, Required)
- `price` (Number, Required)
- `description` (Editor / Rich Text - di-store sebagai HTML string)
- `image` (File, max 1 image, allowed types: png, jpg, jpeg, webp)
- `shopee_url` (URL, Optional)
- `is_active` (Bool, Default: `True`)

## 3. Strategi Integrasi Frontend
### A. PocketBase Client Setup
- Instalasi `pocketbase` npm SDK.
- Membuat file *singleton* client `lib/pocketbase.ts` untuk memfasilitasi *fetching*.
### B. Halaman Publik (Server-Side Fetching)
- Mengganti import dari `mock-data.ts` ke fungsi fetch asinkron yang memanggil PocketBase API.
- Halaman yang terpengaruh: `app/(public)/kategori/[slug]/page.tsx` dan `app/(public)/produk/[slug]/page.tsx`.
- Memperbarui file konfigurasi `next.config.ts` pada `images.remotePatterns` agar `next/image` diizinkan merender gambar dari domain PocketBase (`127.0.0.1` / URL production nantinya).
### C. Dashboard Admin (Client-Side Auth & CRUD)
- Mengubah `AdminContext` (`lib/admin-context.tsx`) agar tidak lagi menggunakan data tiruan lokal, melainkan berkomunikasi langsung dengan instans `PocketBase.authStore` dan API CRUD.
- **Login:** Menggunakan `pb.admins.authWithPassword()`.
- **Produk Form (`FormData` API):** Karena produk memiliki *File/Image upload*, pengiriman data form harus dikonversi menggunakan `FormData` bawaan browser agar mendukung *multipart/form-data*.
- **Manajemen Gambar:** URL gambar akan dikonstruksi menggunakan struktur standar PocketBase: `http://127.0.0.1:8090/api/files/{collectionId}/{recordId}/{filename}`.

## 4. Keamanan & Aksesibilitas
- Collection `categories` dan `products` akan diset API Rule-nya menjadi:
  - `List/View`: *Public* (kosong/`""` di aturan PocketBase) agar Next.js bisa mengambil data tanpa login.
  - `Create/Update/Delete`: *Admins Only* (hanya bisa dilakukan lewat dashboard admin yang memiliki token valid).