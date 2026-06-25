# Spesifikasi Integrasi Root Environment (Single Source of Truth)

## 1. Tujuan
Menyederhanakan konfigurasi infrastruktur dan aplikasi dengan menggunakan satu file `.env` terpusat di *root directory*. Ini memungkinkan pengubahan port (frontend/backend) atau URL API secara instan tanpa mengedit `docker-compose.yml` atau *source code* secara langsung.

## 2. Skema File Global `.env`
File `.env` di direktori *root* akan berisi *key-value* berikut:

```env
# ==========================================
# KONFIGURASI DOCKER PORTS (HOST)
# ==========================================
# Port yang akan digunakan untuk mengakses Frontend di browser Anda
FRONTEND_PORT=2200

# Port yang akan digunakan untuk mengakses PocketBase Backend di browser Anda
PB_PORT=8090

# ==========================================
# KONFIGURASI APLIKASI (NEXT.JS & POCKETBASE)
# ==========================================
# URL publik PocketBase (Digunakan oleh Browser / Client Components Next.js)
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090

# URL internal PocketBase (Digunakan oleh Docker untuk Server-Side Fetching)
# Biasanya 'http://pocketbase:8090' (sesuai nama service dan port internal docker)
INTERNAL_PB_URL=http://pocketbase:8090
```

## 3. Perubahan Konfigurasi
### A. `docker-compose.yml`
- Interpolasi port *host* akan diubah menjadi dinamis berdasarkan *environment variables*.
- Variabel akan diekspos (pass-through) dari file `.env` root ke dalam *container* Next.js.
- File konfigurasi lama yang di-*hardcode* akan dihapus.

### B. `frontend/.env.local`
- File `frontend/.env.local` tidak akan digunakan lagi di production/docker dan sebaiknya dihapus dari Git *tracking*.
- Untuk *development* lokal tanpa docker (jika diperlukan), developer cukup menyalin file `.env` dari root.

## 4. Efek Samping & Manajemen Git
- `.env` utama biasanya **TIDAK** di-commit ke Git demi keamanan.
- Kita akan membuat file `.env.example` sebagai panduan/template untuk *developer* lain yang melakukan kloning (*clone*) pada repository ini. File template ini yang akan masuk ke Git.