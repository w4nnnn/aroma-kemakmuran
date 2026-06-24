# Design System — Dupa Aroma Kemakmuran

Estetika visual Nusantara Tradisional Premium dengan tema gelap (Dark Theme) berbasis perpaduan warna Maroon dan Emas yang dioptimalkan sesuai dengan `frontend-design` dan `ui-ux-pro-max`.

## 1. Palet Warna (Semantic Tokens)
* **Background Utama (Deep Maroon):** `#2A0206` (OLED-friendly dark maroon to prevent pure black glare while keeping atmospheric depth)
* **Background Elevasi/Kartu (Elevated Maroon):** `#3A040A`
* **Background Dropdown/Navigasi (Frosted Maroon):** `rgba(42, 2, 6, 0.8)` with backdrop blur
* **Aksen Emas Utama (Premium Gold):** `#D4AF37` / `#C5A85C` (Adjusted to meet WCAG 2.1 AA contrast standards against deep dark surfaces)
* **Aksen Emas Terang (Glow Accent):** `#F3E5AB` (Used sparingly for hover highlights)
* **Teks Utama (Ivory/Gading):** `#FDFBF7` (High readability, avoids harsh white)
* **Teks Sekunder (Warm Cream):** `#F5F2EB`
* **Muted/Borders:** `rgba(212, 175, 55, 0.15)` (Subtle gold hairline border to maintain clean layout separation without heavy gray lines)

## 2. Tipografi & Font Pairing
* **Display/Heading:** *Playfair Display* (Serif) — Set with letter-spacing `tracking-wide` or `tracking-wider` to express Nusantara luxury.
* **Body/UI:** *Montserrat* (Sans-serif) — Large base scale (16px/1rem on mobile) with comfortable line-height (`leading-relaxed` or `leading-loose`) to enhance readability.

## 3. Desain Interaksi & Gerak (Micro-interactions)
* **Interaksi Scroll (GSAP ScrollSmoother):** Menggunakan GSAP ScrollSmoother di halaman publik untuk transisi scroll yang lembut dan stabil. Elemen hero dan kartu konten dianimasikan perlahan saat memasuki viewport menggunakan ScrollTrigger untuk memperkuat kesan premium dan interaktif.
* **Timing & Easing:** All transitions (hover, scale, opacity) use `cubic-bezier(0.16, 1, 0.3, 1)` (Expo-out) over 250ms for a premium fluid feel.
* **Tap Feedback:** Pressable items animate slightly down on scale (`scale-[0.98]` or `scale-[0.95]`) with an opacity layer of `0.9` to emulate tactile feedback.
* **Ambient Glow:** Ambient blobs in the background use gradients between `#5C0612` and `#D4AF37` with slow animated transitions and a high blur radius (`blur-[100px]`).

## 4. Aksesibilitas & Batasan
* **Kontras:** Teks utama (`#FDFBF7` / `#F5F2EB`) di atas background maroon gelap memenuhi rasio kontras WCAG AAA (7:1+).
* **Ikon:** Hanya menggunakan ikon vector SVG (Lucide/Heroicons) berwarna emas. Tidak diperbolehkan menggunakan emoji sebagai ikon UI struktural.
* **Target Sentuh:** Seluruh tombol navigasi dan tautan interaktif dirancang dengan area klik minimal 44x44px.
