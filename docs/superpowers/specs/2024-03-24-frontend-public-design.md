# Spesifikasi Desain Frontend Halaman Publik: Dupa Aroma Kemakmuran

## 1. Arsitektur Komponen & Layout
### Struktur Layout Utama (`app/layout.tsx`)
- **Top Navigation (Header)**
  - Kondisi: Sticky di atas.
  - Efek: Berubah menjadi *frosted glass* maroon (`rgba(42, 2, 6, 0.8)` dengan `backdrop-blur`) saat halaman di-scroll. Memiliki *hairline border* emas tipis di bagian bawah saat state ter-scroll.
  - Komponen: Logo teks berfont Serif (Playfair Display), Navigasi Kategori dinamis, dan Link ke Kontak.
- **Main Content Area**
  - Komponen *Wrapper* untuk GSAP ScrollSmoother (hanya aktif pada `min-width: 768px` / md). Di mobile, akan *fallback* ke native smooth scrolling.
- **Global Footer**
  - Nuansa gelap solid (`#2A0206`) dengan grid minimalis.
  - Komponen: Link navigasi, Informasi Kontak, dan Link Sosial Media.

### Struktur Halaman Utama (`app/page.tsx`)
Terdiri dari 5 section sesuai referensi (diadaptasi ke mode gelap premium):
1. **Hero / Profil Section:** Judul Serif besar. Teks profil dan elemen ornamen emas (divider vertikal). Gambar produk premium/natural.
2. **Deskripsi Produk Section:** Gambar kemasan 30 stick dengan layout asimetris yang menonjolkan produk.
3. **Manfaat Produk (Grid):** Grid 5 kolom (di desktop, 2-3 di mobile) dengan ikon *lucide/heroicons* berwarna emas. Animasi *fade-up* berurutan (*staggered*) saat di-scroll.
4. **Nilai Budaya (Cards):** 4 Kartu dengan *border* emas tipis membulat (lingkaran ornamen). Efek *hover* halus (elevasi bayangan emas pudar + slight scale up).
5. **Testimoni/Quote:** Blok kutipan besar diapit simbol petik ganda (") emas. Dibingkai dengan garis ornamen emas.

### Halaman Katalog (`app/kategori/[slug]/page.tsx`)
- Header kategori besar (Serif).
- Product Grid: Kartu produk dengan *cover* gambar, nama produk (Playfair Display), dan Harga (Montserrat).
- Interaksi: Kartu membesar sedikit saat di-*hover* (`scale-[1.02]`) dengan transisi *cubic-bezier* 250ms.

### Halaman Detail Produk (`app/produk/[slug]/page.tsx`)
- Layout Split: Kiri (Galeri Gambar), Kanan (Informasi Produk).
- Tipografi: Nama produk menonjol, format harga rapi.
- **CTA Dinamis:** Tombol emas utama (solid). Menampilkan "Beli via Shopee" jika URL Shopee tersedia, jika tidak, menampikan "Konsultasi via WhatsApp".

---

## 2. Palet Warna (Diimplementasikan di Tailwind)
- **Background Utama:** `bg-[#2A0206]`
- **Background Elevasi:** `bg-[#3A040A]`
- **Aksen Emas Utama:** `text-[#D4AF37]` / `border-[#D4AF37]` / `bg-[#D4AF37]` (Teks/ikon pada bg ini akan menggunakan maroon gelap `#2A0206`).
- **Glow Emas:** `shadow-[0_0_15px_rgba(212,175,55,0.3)]`
- **Teks Utama:** `text-[#FDFBF7]`
- **Teks Muted/Sekunder:** `text-[#F5F2EB]`

---

## 3. Tipografi
- **Headings (Playfair Display):** Menggunakan utilitas font Tailwind khusus (misal `font-serif`), `tracking-wide`, font-weight regular/medium.
- **Body (Montserrat):** Utilitas `font-sans`, base text 16px, `leading-relaxed`.

---

## 4. Konfigurasi GSAP & Animasi
- **ScrollSmoother Wrapper:** Diimplementasikan di komponen layout *client-side* tingkat atas, dengan pengecekan `window.matchMedia("(min-width: 768px)")` dan `prefers-reduced-motion`.
- **ScrollTrigger Animasi:** 
  - `y: 30`, `opacity: 0` -> `y: 0`, `opacity: 1`
  - Durasi: 0.8s - 1.2s.
  - Easing: `expo.out`.

---

## 5. Komponen Shadcn UI yang Dibutuhkan
- Button (di-customize radius dan warna)
- Card (di-customize untuk style Nusantara)
- Sheet (untuk navigasi mobile)
- Dialog (jika diperlukan untuk pop-up/preview gambar)

---

## 6. Integrasi Eksternal (Placeholder Backend)
- Untuk tahap frontend murni ini, data kategori dan produk akan menggunakan data *mock* (JSON lokal) yang strukturnya meniru respons dari PocketBase agar mudah disambungkan nanti.
