# Spesifikasi Skrip Seeding Database (Node.js)

## 1. Tujuan
Membuat skrip Node.js mandiri yang dapat dieksekusi secara manual (misal via `npm run seed`) untuk memasukkan data awal (*seed data*) ke dalam koleksi PocketBase (`categories` dan `products`) menggunakan PocketBase JS SDK.

## 2. Arsitektur & Teknologi
- **Lokasi Skrip:** `frontend/scripts/seed.ts` (menggunakan TypeScript/tsx untuk eksekusi).
- **Library:** 
  - `pocketbase` (SDK resmi).
  - `dotenv` (untuk memuat kredensial admin dan URL).
- **Eksekusi:** Didaftarkan di `package.json` dalam blok `"scripts"`.

## 3. Data Seed
### A. Kategori (Categories)
1. Dupa (`slug: dupa`)
2. Garam Ruqyah Buka Aura (`slug: garam-ruqyah`)
3. Ruwatan Uborampe (`slug: ruwatan-uborampe`)

### B. Produk (Products)
1. **Dupa Aroma Kemakmuran**
   - Kategori: Dupa
   - Harga: 150000
   - Deskripsi: `<p>Dupa herbal premium isi 30 stick.</p>`
   - Link Shopee: `https://shopee.co.id/example`
   - Aktif: `true`
2. **Ruwatan Reguler Komplit**
   - Kategori: Ruwatan Uborampe
   - Harga: 500000
   - Deskripsi: `<p>Paket ruwatan pembersihan diri.</p>`
   - Link Shopee: (Kosong, agar memunculkan tombol WA)
   - Aktif: `true`

## 4. Alur Kerja (Workflow)
1. Skrip memuat environment variable `INTERNAL_PB_URL` atau `NEXT_PUBLIC_PB_URL`.
2. Skrip melakukan autentikasi sebagai Admin (menggunakan kredensial admin default atau yang dilempar via argument/env).
3. Skrip melakukan *truncate* / penghapusan data lama (opsional, untuk mencegah duplikasi) atau mengecek apakah data dengan slug yang sama sudah ada.
4. Skrip melakukan *insert* data kategori ke PocketBase.
5. Skrip mengambil ID kategori yang baru dibuat.
6. Skrip melakukan *insert* data produk menggunakan ID kategori yang sesuai.
7. Menampilkan log sukses/gagal di terminal.