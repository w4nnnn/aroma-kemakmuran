# Spesifikasi Desain Frontend Admin Dashboard: Dupa Aroma Kemakmuran

## 1. Arsitektur Komponen & Layout
### Struktur Layout Admin (`app/admin/layout.tsx`)
Layout khusus untuk rute `/admin` yang terpisah dari halaman publik.
- **Sidebar Kiri (Desktop) / Drawer (Mobile)**
  - Kondisi: Tetap (fixed) di sebelah kiri pada layar besar. Disembunyikan dan dapat diakses via Hamburger Menu pada layar kecil.
  - Tampilan: Konsisten dengan tema premium (Background: `#2A0206`, Border Kanan: Emas Tipis `#D4AF37`/20).
  - Menu: Dashboard (Ringkasan), Produk, Kategori, Logout.
- **Top Header (Khusus Area Admin)**
  - Menampilkan judul halaman aktif dan profil admin.
  - Background Maroon Elevasi (`#3A040A`) dengan *hairline border* emas.
- **Main Content Area**
  - Area utama untuk tabel data dan form. Background menggunakan `#2A0206`.

### Halaman & Rute
1. **Login (`app/admin/login/page.tsx`)**
   - Form otentikasi di tengah layar.
   - Input: Email/Username & Password.
   - Menggunakan *mock auth* (hardcoded) yang mengarahkan ke dashboard jika sukses.
2. **Dashboard Overview (`app/admin/page.tsx`)**
   - Ringkasan statistik (contoh: Total Produk, Kategori Aktif). Menggunakan komponen Card bergaya premium.
3. **Manajemen Produk (`app/admin/produk/page.tsx`)**
   - Data Table (berbasis desain Shadcn UI yang di-customize).
   - Kolom: Gambar, Nama, Kategori, Harga, Status (Aktif/Tidak), Aksi (Edit/Hapus).
   - Tombol "Tambah Produk".
4. **Form Tambah/Edit Produk (`app/admin/produk/[action]/page.tsx`)**
   - Form dengan input field bertema gelap (border emas saat fokus).
   - Dropdown untuk memilih Kategori.
   - Integrasi Text Editor kaya (TipTap) untuk deskripsi produk (disesuaikan dengan dark theme).
   - Area Upload Gambar (Mock UI).
5. **Manajemen Kategori (`app/admin/kategori/page.tsx`)**
   - Data Table Kategori (Nama, Slug, Jumlah Produk Terkait).
   - Modal/Dialog untuk Tambah/Edit Kategori (agar tidak perlu pindah halaman).

---

## 2. Palet Warna & Styling (Konsisten dengan Publik)
Menggunakan variabel Tailwind v4 yang sudah dibuat di tahap publik.
- **Background Admin:** `bg-[#2A0206]` (Base) dan `bg-[#3A040A]` (Elevated, untuk tabel/kartu).
- **Tabel & Form:** 
  - Input fields: Background transparan atau maroon gelap dengan border `#D4AF37`/30, teks `#FDFBF7`.
  - Header Tabel: Maroon Elevasi (`#3A040A`) dengan teks emas `text-[#D4AF37]`.
  - Baris Tabel: Background `#2A0206`, hover effect dengan highlight sangat tipis.
- **Tipografi:** Tetap menggunakan *Montserrat* untuk keterbacaan data, dan *Playfair Display* hanya untuk judul halaman utama.
- **Ikon:** Lucide React (Warna Emas).

---

## 3. Komponen Shadcn UI yang Dibutuhkan & Kustomisasi
Karena kita mempertahankan tema Maroon & Emas secara eksklusif, komponen Shadcn UI standar (yang biasanya hitam/putih/abu-abu) harus dibangun ulang atau dikustomisasi secara manual:
- **Table:** Komponen tabel custom tanpa garis grid tebal, hanya border bottom transparan emas.
- **Forms (Input, Select, Label):** Custom styling ring-offset dan border menggunakan emas.
- **Dialog/Modal:** Untuk *alert hapus* dan *tambah kategori*. Background `#3A040A` dengan teks ivory.
- **Badge/Status:** Badge "Aktif" (Emas/Maroon) dan "Non-Aktif" (Abu-abu/Maroon redup).

---

## 4. State Management & Mock Data
- Menggunakan `lib/mock-data.ts` yang sama dengan publik, namun dengan penambahan *React State* (`useState` / Context sederhana) di memori lokal saat user berinteraksi, sehingga penambahan/penghapusan produk akan terlihat berhasil selama halaman belum di-refresh.
- **Editor TipTap:** Memerlukan instalasi paket `@tiptap/react` dan ekstensi dasarnya.

---

## 5. Pertimbangan UX Admin
- Area *click* / *tap target* pada tabel akan dibuat cukup longgar agar nyaman digunakan walau di perangkat tablet.
- Pesan *feedback* (Toast/Notifikasi) akan muncul setelah melakukan aksi CRUD (Tambah/Ubah/Hapus).
