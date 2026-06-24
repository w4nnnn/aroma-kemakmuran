# 📄 Product Requirements Document (PRD) — Revisi Final

## 1. Ringkasan Proyek
* **Nama Proyek:** Website & Katalog Dupa Aroma Kemakmuran
* **Platform:** Web Application (Responsive Desktop & Mobile)
* **Tujuan Utama:** Membangun website profil usaha sekaligus katalog produk (*catalog mode*) yang dikelola secara mandiri oleh klien melalui Custom Admin Dashboard. Transaksi diarahkan ke Shopee dan WhatsApp.

---

## 2. Arsitektur & Teknologi (Tech Stack)
* **Framework:** Next.js (App Router)
* **Styling & UI Components:** Tailwind CSS + Shadcn UI + GSAP (dengan plugin ScrollTrigger & ScrollSmoother untuk efek scroll yang halus dan interaktif).
* **Tema Visual (Nusantara Tradisional Premium):**
  * **Latar Belakang (Background):** Maroon / merah marun tua (`#5C0612` / `#3A030A`) untuk menciptakan suasana mewah, intim, sakral, dan eksklusif.
  * **Aksen (Accent) & Ornamen:** Emas (`#D4AF37` / `#C5A85C`) untuk border tipis, ikon dekoratif, divider, ornamen visual, dan teks utama.
  * **Teks & Konten:** Menggunakan kombinasi warna emas, krem lembut (`#F5F2EB`), dan putih gading (`#FDFBF7`) untuk memastikan kontras yang baik di atas latar belakang maroon.
  * **Tipografi:** Font Serif (*Playfair Display*) untuk heading, Sans-serif (*Inter*/*Montserrat*) untuk teks body.
* **BaaS (Backend as a Service):** PocketBase (Database, Admin Auth, & File Storage)
* **Rich Text Editor:** TipTap (diintegrasikan dengan form admin)
* **Deployment / Infrastructure:** Docker & Docker Compose

---

## 3. Struktur Database (Rancangan Collections PocketBase)

### A. Collection: `categories`
* `id` (Otomatis)
* `name` (Text) — Contoh: *Dupa, Garam Ruqyah, Ruwatan*
* `slug` (Text, Unique) — Contoh: *dupa, garam-ruqyah*

### B. Collection: `products`
* `id` (Otomatis)
* `name` (Text)
* `slug` (Text, Unique)
* `category` (Relation -> `categories`)
* `price` (Number)
* `description` (Rich Text - HTML string dari TipTap)
* `image` (File - minimal 1, multiple allowed)
* `shopee_url` (URL - Opsional)
* `is_active` (Bool - Default: `True` untuk status stok)

---

## 4. Fitur & Kebutuhan Fungsional (Functional Requirements)

### A. Sisi Pengguna (Public Web)
* **Halaman Utama (Home):** UI elegan bertema Nusantara tradisional premium dengan latar belakang Maroon gelap. Halaman utama ini mengikuti tata letak section sesuai `referensi.jpeg` yang diadaptasikan ke tema gelap (dark theme):
  * **Section 1: Profil (Tentang Kami):** Judul "Profil" dengan aksen pembatas ornamen emas di sebelah kiri. Teks pengantar tentang asal-usul dupa herbal premium yang terinspirasi dari budaya Nusantara, berdampingan dengan visual dupa dalam wadah premium dan bahan alami (rempah/kayu manis).
  * **Section 2: Deskripsi Produk:** Judul "Deskripsi Produk" berdampingan dengan gambar kemasan fisik produk "Dupa Aroma Kemakmuran" (Herbal Premium isi 30 Stick).
  * **Section 3: Manfaat Produk:** Grid 5 kolom berisi ikon berwarna emas dengan penjelasan singkat:
    1. *Pengharum Ruangan Alami*
    2. *Mendukung Relaksasi dan Meditasi*
    3. *Menambah Kesan Khidmat*
    4. *Energi Positif*
    5. *Aroma Pilihan* (madu, sandalwood, oud)
  * **Section 4: Nilai Budaya:** Judul "Nilai Budaya" dengan teks pembuka. Baris berisi 4 kartu berbingkai lingkaran emas dengan gambar lingkaran di dalamnya:
    1. *Tradisi Dupa* (dilengkapi poin-poin manfaat & simbol penyucian)
    2. *Ruwatan* (dilengkapi poin-poin tujuan pembersihan diri)
    3. *Buka Aura* (dilengkapi poin-poin pancaran energi positif)
    4. *Mustika Bertuah* (dilengkapi poin-poin penguat & perlindungan diri)
  * **Section 5: Testimoni/Quote Block:** Kutipan komitmen pelestarian budaya Nusantara dengan tanda petik ganda emas besar di bagian atas dan bawah, dibatasi oleh garis pembatas ornamen emas.
* **Halaman Katalog Kategori Dinamis:**
  * Navigasi otomatis membaca dari collection `categories`.
  * URL: `/kategori/[slug]` (misal: `/kategori/dupa`, `/kategori/garam-ruqyah`).
  * Kategori mencakup:
    * **Dupa**
    * **Garam Ruqyah Buka Aura** (Paket A-D)
    * **Ruwatan Uborampe** (Paket reguler komplit)
    * **Susuk Pusaka Jati/Mustika Berlian** (Varian GRA 1-3, IGI 1-3, dan Combine)
* **Halaman Detail Produk (`/produk/[slug]`):**
  * Galeri gambar produk dari storage PocketBase.
  * Harga berformat Rupiah & Deskripsi HTML lengkap.
  * CTA Button: **"Beli via Shopee"** (untuk produk fisik) & **"Konsultasi via WhatsApp"** (untuk layanan/ruwatan).
* **Halaman Kontak & Footer:** Tautan sosmed (WhatsApp, Instagram, Facebook, TikTok) & Floating WhatsApp.

### B. Sisi Admin (Admin Dashboard — `/admin`)
* **Autentikasi:** Login menggunakan sistem Auth bawaan PocketBase.
* **Manajemen Kategori:**
  * Tabel daftar kategori.
  * CRUD Kategori dengan validasi (tidak bisa menghapus kategori yang masih memiliki produk terikat).
* **Manajemen Produk:**
  * Data Table Shadcn dengan pencarian, filter kategori, dan pagination.
  * Form Tambah/Edit Produk:
    * Nama, Harga (Format Rupiah).
    * Dropdown Kategori (me-load dinamis dari PocketBase).
    * Rich Text Editor (TipTap) untuk deskripsi.
    * File Upload (Image) langsung di-POST ke API PocketBase.
    * Input URL Shopee.
    * Toggle status Aktif/Non-aktif.
  * Hapus Produk dengan Alert Dialog konfirmasi.

---

## 5. Kebutuhan Docker (Deployment Configuration)
Dijalankan secara terisolasi via `docker-compose.yml`:
1. **Service 1 (PocketBase Backend):**
   * Custom Dockerfile berbasis Alpine Linux.
   * Autoload `pb_migrations` dan `pb_hooks`.
   * Port: `8090:8090`.
   * Volume mapping: `./pb_data:/pb/pb_data` (persistensi data).
2. **Service 2 (Next.js Frontend & Admin):**
   * Dockerfile berbasis `node:alpine`.
   * Port: `3000:3000`.
   * Env: `NEXT_PUBLIC_PB_URL=http://pocketbase:8090` (atau URL publik untuk akses client).

---

## 6. Catatan Teknis & Optimasi
* **GSAP & ScrollSmoother:** Pada halaman publik web, integrasikan GSAP dengan plugin ScrollTrigger dan ScrollSmoother. Pastikan dibungkus di dalam deteksi Client-Side saja (`useEffect` / `'use client'`) dan dukung opsi penonaktifan jika terdeteksi preferensi `prefers-reduced-motion: reduce`.
* **PocketBase SDK:** Gunakan library resmi `pocketbase` (NPM). Batasi pemanggilan API langsung dari Client Components; optimalkan Server Components untuk fetching internal.
* **Optimasi Gambar:** Masukkan domain/IP PocketBase ke `images.remotePatterns` di `next.config.js` untuk optimalisasi `<Image />` Next.js.
* **Styling WYSIWYG:** Terapkan styling Tailwind (border, padding, ring focus) pada editor TipTap agar menyatu secara visual dengan elemen input Shadcn UI lainnya.
