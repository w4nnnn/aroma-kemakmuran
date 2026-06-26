# Spesifikasi Dinamisasi Navigasi Footer

## 1. Tujuan
Menjadikan daftar navigasi kategori pada komponen Footer bersifat dinamis agar selalu sinkron dengan data kategori terbaru di database PocketBase, menggantikan teks hardcoded yang ada saat ini.

## 2. Arsitektur Komponen
- **File:** `frontend/components/layout/footer.tsx`
- **Tipe Komponen:** Diubah menjadi **Async Server Component** (karena tidak memerlukan *client state* seperti `useState` atau event onClick).
- **Metode Fetching:** *Server-Side Fetching* memanfaatkan SDK PocketBase `pb.collection('categories').getFullList()`.

## 3. UI/UX
- **Struktur List:** Link "Beranda" tetap berada di posisi paling atas secara hardcoded. Di bawahnya, akan diikuti oleh list seluruh kategori (hasil *map* dari database) secara berurutan.
- **Styling:** Menggunakan styling yang sudah ada: `text-sm text-text-muted hover:text-gold-primary transition-colors`.

## 4. Keamanan & Performa
- Data yang diambil hanya digunakan untuk perenderan tautan navigasi, menghemat *bundle size* client.
- Menggunakan *error handling* (`try/catch`) sederhana sehingga jika PocketBase mati, tautan "Beranda" tetap akan dirender tanpa membuat halaman keseluruhan *crash*.