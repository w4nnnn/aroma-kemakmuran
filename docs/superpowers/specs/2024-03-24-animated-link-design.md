# Spesifikasi Integrasi AnimatedLink Footer

## 1. Tujuan
Menerapkan komponen kustom `AnimatedLink` untuk memberikan efek garis bawah animasi (*animated underline*) yang elegan pada tautan navigasi di komponen Footer.

## 2. Dependencies Baru
Untuk mendukung arsitektur Shadcn UI dan komponen `AnimatedLink` yang diminta, kita perlu menambahkan pustaka utilitas dasar:
- `clsx` (untuk konstruksi kondisional class)
- `tailwind-merge` (untuk menggabungkan konflik class Tailwind dengan aman)

## 3. Struktur File
- **Utilitas Tambahan:** Membuat file `frontend/lib/utils.ts` berisi fungsi `cn`.
- **Komponen Baru:** Membuat file `frontend/components/ui/animated-link.tsx`. Kode asli akan digunakan, namun disesuaikan untuk menggunakan `next/link` (komponen `Link`) alih-alih `<a>` standar HTML, agar navigasi Next.js (*client-side routing*) tetap berjalan dengan optimal. Warna *default* teks juga akan disesuaikan menjadi warna emas bawaan (`text-[#F5F2EB]` / `hover:text-[#D4AF37]`).
- **Target Integrasi:** Mengubah file `frontend/components/layout/footer.tsx` agar menggunakan komponen `<AnimatedLink variant="left" showArrow={false}>` pada semua daftar navigasinya.

## 4. UI/UX
- Efek hover akan menampilkan garis dari sisi kiri ke kanan (`variant: "left"`).
- Karena ini adalah daftar navigasi footer sederhana, panah di ujung (arrow) akan dinonaktifkan (`showArrow: false`) agar terlihat bersih.