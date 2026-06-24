📄 Product Requirements Document (PRD) - Revisi Final

Nama Proyek: Website & Katalog Dupa Aroma Kemakmuran
Platform: Web Application (Responsive Desktop & Mobile)
Tujuan Utama: Membangun website profil usaha sekaligus katalog produk (catalog mode) yang dikelola secara mandiri oleh klien melalui Custom Admin Dashboard. Transaksi diarahkan ke Shopee dan WhatsApp.

1. Arsitektur & Teknologi (Tech Stack)

Framework Frontend & Backend: Next.js (App Router).

Styling & UI Components: Tailwind CSS + Shadcn UI (Untuk komponen seperti Table, Modal, Form, Button, dll).

Backend as a Service (BaaS): PocketBase (Menangani Database, Admin Auth, dan File/Image Storage).

Rich Text Editor: TipTap atau React-Quill (diintegrasikan dengan form admin).

Deployment / Infrastructure: Docker & Docker Compose (Menjalankan container Next.js dan container PocketBase menggunakan Custom Dockerfile secara bersamaan).

2. Struktur Database (Rancangan Collections PocketBase)

Karena kategori dibuat dinamis, kita membutuhkan minimal 2 Collections di PocketBase:

A. Collection: categories

id (Otomatis)

name (Text) - Contoh: Dupa, Garam Ruqyah, Mustika

slug (Text, Unique) - Contoh: dupa, garam-ruqyah

B. Collection: products

id (Otomatis)

name (Text)

slug (Text, Unique)

category (Relation -> mengarah ke categories)

price (Number)

description (Editor / Rich Text - format HTML string)

image (File - minimal 1, bisa di-set multiple di PocketBase)

shopee_url (URL - Opsional)

is_active (Bool - Default: True, untuk menyembunyikan produk jika stok habis)

3. Fitur & Kebutuhan Fungsional (Functional Requirements)

A. Sisi Pengguna (Public Web)

Halaman Utama (Home): UI elegan, menampilkan hero section, Nilai Budaya, dan carousel produk.

Halaman Katalog Berdasarkan Kategori Dinamis:

Menu navigasi akan otomatis membaca dari collection categories.

URL menyesuaikan: /kategori/dupa, /kategori/garam-ruqyah.

Halaman Detail Produk (/produk/[slug]):

Menampilkan gambar (diambil dari URL storage PocketBase).

Harga dan Deskripsi lengkap (HTML hasil dari Rich Text Editor).

Dua CTA Button: "Beli via Shopee" & "Konsultasi via WhatsApp".

Halaman Kontak & Footer: Info sosmed & Floating WhatsApp.

B. Sisi Admin (Admin Dashboard - /admin) - Powered by Shadcn UI

Menggunakan Data Table, Dialog/Modal, dan Forms dari Shadcn UI untuk memberikan pengalaman user-friendly bagi klien.

Autentikasi:

Login menggunakan sistem Auth bawaan PocketBase (sebagai Admin atau Auth User khusus pengelola).

Manajemen Kategori (Dynamic Categories)

Tabel Kategori: Menampilkan daftar kategori.

Aksi: Tambah, Edit, Hapus kategori. (Hapus kategori harus mengecek/memvalidasi apakah ada produk yang terikat).

Manajemen Produk (CRUD System)

Tabel Produk: Menggunakan DataTable Shadcn (dilengkapi Search nama produk, filter kategori, dan Pagination).

Tambah/Edit Produk Form:

Input Nama, Harga (menggunakan format Rupiah).

Dropdown Kategori (Select dari Shadcn UI, me-load data dari collection categories).

Rich Text Editor (TipTap) untuk deskripsi produk.

File Upload (Image) yang langsung di-POST ke REST API PocketBase.

Input URL Shopee.

Toggle / Switch (Shadcn UI) untuk status "Aktif/Non-aktif".

Hapus Produk (muncul Alert Dialog konfirmasi).

4. Kebutuhan Docker (Deployment Configuration)

Aplikasi akan dijalankan secara terisolasi dengan docker-compose.yml. Konsep arsitekturnya:

Service 1 (PocketBase Backend):

Build: Menggunakan Custom Dockerfile (berbasis Alpine Linux). Hal ini dilakukan untuk mengunci versi PocketBase secara spesifik dan memuat file pb_migrations serta pb_hooks secara otomatis ke dalam image.

Ports: 8090:8090 (atau port lain jika diatur di balik reverse proxy seperti Nginx/Traefik).

Volumes: Wajib di-mapping (misal: ./pb_data:/pb/pb_data) agar data produk dan gambar fisik tidak hilang saat container di-restart atau di-build ulang.

Service 2 (Next.js Frontend & Admin):

Build: Custom Dockerfile untuk mem-build aplikasi Next.js (berbasis node:alpine).

Ports: 3000:3000

Environment Variables: Menghubungkan URL API Next.js ke container PocketBase (misal: NEXT_PUBLIC_PB_URL=http://pocketbase:8090 untuk komunikasi antar container, atau public URL untuk akses dari client browser).

5. Catatan Tambahan untuk Developer

PocketBase SDK: Gunakan library resmi pocketbase (NPM) di dalam Next.js. Perhatikan batasan antara Server Components (di mana fetch data bisa dilakukan internal tanpa expose URL API ke klien) dan Client Components.

Optimasi Gambar: Format URL gambar dari PocketBase adalah http://<PB_URL>/api/files/<COLLECTION_ID>/<RECORD_ID>/<FILENAME>. Pastikan domain/IP PocketBase didaftarkan ke dalam images.remotePatterns di file next.config.js agar komponen <Image /> Next.js dapat berfungsi normal.

Shadcn + TipTap: Shadcn UI tidak memiliki komponen WYSIWYG bawaan. TipTap dipasang terpisah, kemudian diberikan styling (border, padding, ring focus) menggunakan kelas Tailwind agar tampilannya seragam dengan elemen input Shadcn lainnya.