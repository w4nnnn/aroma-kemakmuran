# Frontend Public Pages — Design Spec

**Tanggal:** 2026-06-24
**Scope:** Semua halaman publik website Dupa Aroma Kemakmuran dengan data dummy (tanpa backend).
**Pendekatan:** Static-first — data hardcoded, nanti disambungkan ke PocketBase.

---

## 1. Halaman & Routing

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Homepage | 5 section: Profil, Deskripsi Produk, Manfaat, Nilai Budaya, Quote |
| `/kategori/[slug]` | Katalog Kategori | Grid produk per kategori |
| `/produk/[slug]` | Detail Produk | Galeri, harga, deskripsi, CTA |
| `/kontak` | Kontak | Info kontak & link sosmed |

Total: 4 route (2 dinamis, 2 statis).

---

## 2. Design System

Sesuai `DESIGN.md`. Diimplementasikan sebagai CSS custom properties di `globals.css` dan Tailwind theme extension.

### Warna (CSS Variables)

```
--bg-deep:       #2A0206    (background utama, deep maroon)
--bg-elevated:   #3A040A    (kartu, elevasi)
--bg-frosted:    rgba(42, 2, 6, 0.8)  (navbar, dropdown — dengan backdrop-blur)
--gold:          #D4AF37    (aksen emas utama)
--gold-soft:     #C5A85C    (aksen emas alternatif)
--gold-glow:     #F3E5AB    (hover highlights, sparingly)
--text-primary:  #FDFBF7    (teks utama, ivory)
--text-secondary:#F5F2EB    (teks sekunder, warm cream)
--border-gold:   rgba(212, 175, 55, 0.15)  (border halus)
```

### Tipografi

- **Heading/Display:** Playfair Display (Serif), `tracking-wide`/`tracking-wider`
- **Body/UI:** Montserrat (Sans-serif), base 16px, `leading-relaxed`
- Dimuat via `next/font/google` di root layout.

### Animasi & Interaksi

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Expo-out), 250ms
- **Tap feedback:** `scale-[0.98]` + opacity 0.9
- **Scroll animations:** GSAP ScrollTrigger — elemen fade-in/slide-up saat masuk viewport
- **Ambient glow:** Background gradient blobs (`#5C0612` → `#D4AF37`), blur-[100px], animasi lambat
- **Reduced motion:** Semua animasi dinonaktifkan jika `prefers-reduced-motion: reduce`

**Catatan GSAP:** ScrollSmoother memerlukan lisensi Club GreenSock. Kita gunakan ScrollTrigger (gratis) untuk animasi elemen-per-elemen saat scroll. Efek smooth scrolling bisa dicapai dengan CSS `scroll-behavior: smooth` sebagai fallback.

---

## 3. Struktur Komponen

```
frontend/
├── app/
│   ├── layout.tsx                  # Root: font, metadata, navbar, footer, floating WA
│   ├── globals.css                 # CSS variables, Tailwind theme, ambient glow
│   ├── page.tsx                    # Homepage — compose 5 sections
│   ├── kategori/[slug]/page.tsx    # Katalog grid
│   ├── produk/[slug]/page.tsx      # Detail produk
│   └── kontak/page.tsx             # Kontak
├── components/
│   ├── layout/
│   │   ├── navbar.tsx              # Logo + navigasi kategori, frosted maroon bg
│   │   └── footer.tsx              # Sosmed links, copyright, ornamen
│   ├── home/
│   │   ├── section-profil.tsx      # 2 kolom: teks kiri, gambar dupa kanan
│   │   ├── section-deskripsi.tsx   # 2 kolom: teks kiri, gambar kemasan kanan
│   │   ├── section-manfaat.tsx     # Grid 5 kolom, ikon emas + penjelasan
│   │   ├── section-nilai-budaya.tsx# 4 kartu lingkaran emas
│   │   └── section-quote.tsx       # Quote block, tanda kutip emas besar
│   ├── katalog/
│   │   └── product-card.tsx        # Kartu produk: gambar, nama, harga
│   ├── produk/
│   │   ├── product-gallery.tsx     # Galeri gambar (thumbnail + preview)
│   │   └── product-cta.tsx         # Tombol Shopee + WhatsApp
│   ├── ui/                         # Shadcn UI (button, card, badge, dll)
│   ├── floating-wa.tsx             # WhatsApp button fixed bottom-right
│   └── ornament-divider.tsx        # Divider ornamen emas reusable
└── lib/
    └── dummy-data.ts               # Data statis: kategori, produk, konten homepage
```

---

## 4. Detail Per Halaman

### 4.1 Homepage (`/`)

5 section vertikal full-width, background `--bg-deep`, dipisahkan ornamen emas.

**Section 1 — Profil (Tentang Kami)**
- Layout: 2 kolom (60% teks, 40% gambar)
- Kiri: Badge "TENTANG KAMI", heading "Profil" dengan garis emas vertikal di kiri, paragraf pengantar
- Kanan: Foto dupa/rempah dalam wadah premium (placeholder image dulu)

**Section 2 — Deskripsi Produk**
- Layout: 2 kolom (50/50)
- Kiri: Heading dengan ornamen daun/panah emas, 2 paragraf deskripsi
- Kanan: Gambar kemasan produk "Dupa Aroma Kemakmuran" (placeholder)

**Section 3 — Manfaat Produk**
- Heading dengan ornamen, diikuti grid 5 kolom (responsive: 2-3 kolom di mobile)
- Setiap kartu: ikon emas (Lucide), judul bold, penjelasan singkat
- Background kartu: `--bg-elevated` dengan border `--border-gold`
- 5 item: Pengharum Ruangan Alami, Relaksasi & Meditasi, Kesan Khidmat, Energi Positif, Aroma Pilihan

**Section 4 — Nilai Budaya**
- Heading terpusat + teks pembuka
- Grid 4 kolom: kartu dengan gambar lingkaran berbingkai emas
- Setiap kartu: gambar bulat, judul, deskripsi, bullet list emas
- 4 item: Tradisi Dupa, Ruwatan, Buka Aura, Mustika Bertuah

**Section 5 — Quote Block**
- Tanda kutip ganda emas besar (atas & bawah)
- Paragraf kutipan komitmen pelestarian budaya
- Dibatasi ornamen emas horizontal

### 4.2 Katalog Kategori (`/kategori/[slug]`)

- Heading kategori + deskripsi singkat
- Grid 3 kolom (responsive: 1-2 di mobile) berisi `product-card`
- Setiap kartu: gambar produk, nama, harga format Rupiah, badge status
- Klik kartu → navigasi ke `/produk/[slug]`
- Dummy: 4 kategori (Dupa, Garam Ruqyah, Ruwatan Uborampe, Susuk Pusaka), 2-3 produk per kategori

### 4.3 Detail Produk (`/produk/[slug]`)

- Galeri gambar (gambar utama besar + thumbnail kecil di bawah)
- Nama produk (Playfair Display)
- Harga format Rupiah (`Rp XX.XXX`)
- Deskripsi HTML (untuk sekarang plain text dummy)
- CTA: Tombol "Beli via Shopee" (gold) + "Konsultasi via WhatsApp" (outline)
- Breadcrumb: Home > Kategori > Produk

### 4.4 Kontak (`/kontak`)

- Heading + teks ajakan konsultasi
- Grid/list link sosmed: WhatsApp, Instagram, Facebook, TikTok
- Setiap item: ikon Lucide + label + link
- Bisa digabungkan sebagai section di footer juga

---

## 5. Navigasi & Layout Global

### Navbar
- Fixed top, frosted maroon background (`--bg-frosted` + backdrop-blur)
- Logo/brand name kiri
- Link navigasi kanan: Home, Kategori (dropdown/mega menu menampilkan 4 kategori), Kontak
- Hamburger menu di mobile

### Footer
- Background `--bg-elevated`
- 3 kolom: Info brand, Link navigasi, Sosial media
- Copyright + ornamen emas
- Link sosmed: WhatsApp, Instagram, Facebook, TikTok, Shopee

### Floating WhatsApp
- Button bulat fixed di bottom-right
- Ikon WhatsApp warna emas/putih
- Link ke `https://wa.me/[nomor]` (nomor dummy dulu)
- Animasi pulse subtle

---

## 6. Responsiveness

- **Desktop (≥1024px):** Layout penuh, grid 5/4/3 kolom
- **Tablet (768-1023px):** Grid 2-3 kolom, section 2-kolom tetap
- **Mobile (<768px):** Single column, hamburger nav, kartu stack vertikal
- Touch target minimum 44x44px sesuai DESIGN.md

---

## 7. Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `shadcn/ui` (init) | latest | Button, Card, Badge, DropdownMenu, Sheet (mobile nav) |
| `gsap` | ^3 | ScrollTrigger untuk animasi scroll |
| `lucide-react` | latest | Ikon SVG |
| `next/font/google` | built-in | Playfair Display + Montserrat |

Tidak ada dependency tambahan lain. Tailwind CSS 4 sudah terinstall.

---

## 8. Data Dummy (`lib/dummy-data.ts`)

Struktur data mengikuti schema PocketBase di PRD:

```typescript
// Kategori
type Category = {
  id: string;
  name: string;
  slug: string;
};

// Produk
type Product = {
  id: string;
  name: string;
  slug: string;
  category: string; // category id
  price: number;
  description: string;
  image: string[];  // placeholder paths
  shopee_url?: string;
  is_active: boolean;
};
```

4 kategori, 8-10 produk total sebagai sample data.

---

## 9. Batasan & Keputusan

- **Tidak ada backend** di tahap ini. Semua data hardcoded.
- **Tidak ada admin dashboard** di scope ini.
- **GSAP ScrollSmoother** tidak digunakan (berbayar). Pakai ScrollTrigger (gratis) + CSS smooth scroll.
- **Gambar produk** menggunakan placeholder (kotak warna atau `/public/placeholder.jpg`).
- **SEO metadata** dasar diterapkan (title, description per halaman).
- **Aksesibilitas:** kontras WCAG AAA, target sentuh 44px, semantic HTML, alt text.
