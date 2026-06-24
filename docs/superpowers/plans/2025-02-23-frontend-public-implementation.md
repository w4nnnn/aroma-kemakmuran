# Halaman Publik Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the public-facing pages for Dupa Aroma Kemakmuran featuring a premium traditional Nusantara dark theme with GSAP smooth scrolling.

**Architecture:** Next.js App Router (React 19) with Tailwind CSS v4, GSAP for animations (conditional for desktop), Lucide icons, and Shadcn UI primitives customized for a luxury look.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS v4, GSAP (ScrollTrigger/ScrollSmoother), Lucide React.

## Global Constraints
- Target directory: `frontend/` (all paths below are relative to this unless stated otherwise)
- Background Utama: `#2A0206`
- Background Elevasi: `#3A040A`
- Aksen Emas Utama: `#D4AF37`
- Teks Utama: `#FDFBF7`
- Teks Muted/Sekunder: `#F5F2EB`
- Headings: Playfair Display (`font-serif`)
- Body: Montserrat (`font-sans`)
- Animations: GSAP with `expo.out` easing, ScrollSmoother active only on `>=768px`.
- Icons: Vector SVG (Lucide/Heroicons) colored gold. No emojis.
- Tap Targets: Min 44x44px.
- Use mock data (JSON) mimicking PocketBase schema.

---

### Task 1: Basic Setup (Fonts, Tailwind Theme, Layout Base)

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `tailwind.config.ts` (if needed for v4 theme variables) or use v4 `@theme` in css. *Note: Tailwind v4 uses CSS variables for theme setup.*

- [ ] **Step 1: Setup Google Fonts in layout**
Modify `app/layout.tsx` to include Playfair Display and Montserrat.

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dupa Aroma Kemakmuran",
  description: "Dupa herbal premium Nusantara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#2A0206] text-[#FDFBF7] selection:bg-[#D4AF37] selection:text-[#2A0206] min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Setup Tailwind v4 Theme Variables**
Modify `app/globals.css` to define custom theme colors.

```css
@import "tailwindcss";

@theme {
  --color-maroon-base: #2A0206;
  --color-maroon-elevated: #3A040A;
  --color-gold-primary: #D4AF37;
  --color-gold-glow: #F3E5AB;
  --color-text-primary: #FDFBF7;
  --color-text-muted: #F5F2EB;
  
  --font-serif: var(--font-playfair), ui-serif, Georgia, serif;
  --font-sans: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add app/layout.tsx app/globals.css
git commit -m "chore: setup fonts and tailwind v4 theme"
```

---

### Task 2: Mock Data & Types

**Files:**
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`

**Interfaces:**
- Produces: `Category`, `Product` types. `mockCategories`, `mockProducts` arrays.

- [ ] **Step 1: Define Types**
Create `lib/types.ts`:

```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  description: string;
  images: string[];
  shopee_url?: string;
  is_active: boolean;
}
```

- [ ] **Step 2: Create Mock Data**
Create `lib/mock-data.ts`:

```typescript
import { Category, Product } from "./types";

export const mockCategories: Category[] = [
  { id: "c1", name: "Dupa", slug: "dupa" },
  { id: "c2", name: "Garam Ruqyah Buka Aura", slug: "garam-ruqyah" },
  { id: "c3", name: "Ruwatan Uborampe", slug: "ruwatan-uborampe" },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Dupa Aroma Kemakmuran",
    slug: "dupa-aroma-kemakmuran",
    categoryId: "c1",
    price: 150000,
    description: "<p>Dupa herbal premium isi 30 stick.</p>",
    images: ["/placeholder.jpg"], // Will use next/image with a placeholder later
    shopee_url: "https://shopee.co.id/example",
    is_active: true,
  },
  {
    id: "p2",
    name: "Ruwatan Reguler Komplit",
    slug: "ruwatan-reguler-komplit",
    categoryId: "c3",
    price: 500000,
    description: "<p>Paket ruwatan pembersihan diri.</p>",
    images: ["/placeholder.jpg"],
    is_active: true, // No shopee_url, falls back to WA
  }
];
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add lib/types.ts lib/mock-data.ts
git commit -m "feat: setup types and mock data"
```

---

### Task 3: Shared UI Components (Button & Header)

**Files:**
- Create: `components/ui/button.tsx` (Simple standard button for now, can be swapped with shadcn later if needed, but ponytail says build what we need)
- Create: `components/layout/header.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `mockCategories` for dynamic links.
- Produces: `<Header />` component.

- [ ] **Step 1: Install Lucide React**
```bash
cd frontend && npm install lucide-react
```

- [ ] **Step 2: Create Custom Button**
Create `components/ui/button.tsx`:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Need to install this or just use standard button

// Ponytail: Just a simple button component instead of full class-variance-authority for now
export function Button({ 
  className = "", 
  variant = "primary", 
  asChild = false,
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline", asChild?: boolean }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-primary disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-6 py-2";
  
  const variants = {
    primary: "bg-gold-primary text-maroon-base hover:bg-gold-glow active:scale-[0.98]",
    outline: "border border-gold-primary text-gold-primary hover:bg-gold-primary/10 active:scale-[0.98]"
  };

  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
```
*Note: Run `npm i @radix-ui/react-slot` first.*

- [ ] **Step 3: Create Header (Sticky + Frosted Glass)**
Create `components/layout/header.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockCategories } from "@/lib/mock-data";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2A0206]/80 backdrop-blur-md border-b border-[#D4AF37]/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-medium tracking-wide text-gold-primary">
          Aroma Kemakmuran
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {mockCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/kategori/${cat.slug}`}
              className="text-sm font-medium text-text-muted hover:text-gold-primary transition-colors p-2"
            >
              {cat.name}
            </Link>
          ))}
          <a 
            href="#kontak" 
            className="text-sm font-medium text-text-muted hover:text-gold-primary transition-colors p-2"
          >
            Kontak
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gold-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-maroon-elevated border-b border-[#D4AF37]/20 shadow-xl">
          <nav className="flex flex-col py-4">
            {mockCategories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/kategori/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-text-muted hover:text-gold-primary hover:bg-[#2A0206] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Integrate Header into Layout**
Modify `app/layout.tsx` to include `<Header />`.

```tsx
// ... imports ...
import { Header } from "@/components/layout/header";

// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#2A0206] text-[#FDFBF7] selection:bg-[#D4AF37] selection:text-[#2A0206] min-h-screen flex flex-col pt-[80px]">
        <Header />
        <main className="flex-grow">{children}</main>
        {/* Footer will go here */}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**
```bash
cd frontend && npm i @radix-ui/react-slot && git add components/ui/button.tsx components/layout/header.tsx app/layout.tsx package.json package-lock.json
git commit -m "feat: add sticky frosted header and button component"
```

---

### Task 4: GSAP ScrollSmoother Setup (Optional/Client Wrapper)

**Files:**
- Create: `components/layout/smooth-scroll.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `<SmoothScroll>` wrapper.

- [ ] **Step 1: Install GSAP**
```bash
cd frontend && npm install gsap @gsap/react
```

- [ ] **Step 2: Create SmoothScroll Wrapper**
Create `components/layout/smooth-scroll.tsx`. 
*Note: ScrollSmoother is a Club GreenSock premium plugin. If you don't have a license in this project, we must fallback to standard ScrollTrigger or native smooth scroll. Assuming standard ScrollTrigger for enter animations is okay, we will set up the registry here.*

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Ponytail: True ScrollSmoother requires paid license. 
  // We rely on CSS scroll-smooth for the container, and use GSAP just for entrance animations.
  
  useEffect(() => {
    // Global defaults for animations
    gsap.defaults({ ease: "expo.out", duration: 1 });
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3: Add to Layout**
Modify `app/layout.tsx` to wrap children in `<SmoothScroll>`.

```tsx
import { SmoothScroll } from "@/components/layout/smooth-scroll";
// ...
        <Header />
        <main className="flex-grow">
          <SmoothScroll>{children}</SmoothScroll>
        </main>
// ...
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add components/layout/smooth-scroll.tsx app/layout.tsx package.json package-lock.json
git commit -m "feat: setup gsap registry and scroll wrapper"
```

---

### Task 5: Home Page - Hero & Product Description (Sections 1 & 2)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/home/hero-section.tsx`
- Create: `components/home/product-desc-section.tsx`

- [ ] **Step 1: Hero Section**
Create `components/home/hero-section.tsx`:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".hero-anim", {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      delay: 0.2,
    });
  }, { scope: container });

  return (
    <section ref={container} className="min-h-[80vh] flex items-center relative overflow-hidden px-4 py-20">
      {/* Ambient glow blob */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#5C0612]/40 to-[#D4AF37]/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4 hero-anim">
            <div className="w-12 h-[1px] bg-gold-primary" />
            <span className="text-gold-primary font-medium tracking-widest uppercase text-sm">Profil</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight hero-anim">
            Kemurnian Alam, <br/>
            <span className="text-gold-primary">Ketenangan Jiwa.</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-lg hero-anim">
            Dupa herbal premium yang terinspirasi dari kearifan budaya Nusantara. Dibuat dengan bahan alami pilihan untuk menghadirkan ketenangan, fokus, dan energi positif di setiap hembusan aromanya.
          </p>
        </div>
        
        {/* Placeholder for Hero Image */}
        <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-maroon-elevated border border-gold-primary/20 hero-anim">
           <div className="absolute inset-0 flex items-center justify-center text-gold-primary/50">
             [Gambar Produk Premium]
           </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Product Description Section**
Create `components/home/product-desc-section.tsx`:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function ProductDescSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".desc-anim", {
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.2,
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 bg-maroon-elevated">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden bg-[#2A0206] border border-gold-primary/20 desc-anim order-2 md:order-1">
           <div className="absolute inset-0 flex items-center justify-center text-gold-primary/50">
             [Gambar Kemasan Fisik 30 Stick]
           </div>
        </div>
        
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="font-serif text-4xl md:text-5xl text-gold-primary desc-anim">Dupa Aroma Kemakmuran</h2>
          <div className="desc-anim space-y-4 text-text-muted leading-relaxed">
            <p>
              Merupakan karya kriya perpaduan antara resep kuno dan teknik modern. Berisikan 30 stick dupa herbal tanpa bahan kimia berbahaya.
            </p>
            <p>
              Setiap batang diproses dengan presisi untuk memastikan durasi bakar yang lama dan penyebaran aroma yang merata di seluruh sudut ruangan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update Home Page**
Modify `app/page.tsx`:

```tsx
import { HeroSection } from "@/components/home/hero-section";
import { ProductDescSection } from "@/components/home/product-desc-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProductDescSection />
      {/* Sections 3, 4, 5 will follow */}
    </div>
  );
}
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add components/home/hero-section.tsx components/home/product-desc-section.tsx app/page.tsx
git commit -m "feat: add hero and product description sections"
```

---

### Task 6: Home Page - Benefits, Culture, Testimonial (Sections 3, 4, 5)

**Files:**
- Create: `components/home/benefits-section.tsx`
- Create: `components/home/culture-section.tsx`
- Create: `components/home/quote-section.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Benefits Section**
Create `components/home/benefits-section.tsx`:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wind, Sparkles, Flame, Heart, Droplets } from "lucide-react";

const benefits = [
  { icon: Wind, title: "Pengharum Ruangan" },
  { icon: Heart, title: "Relaksasi & Meditasi" },
  { icon: Flame, title: "Kesan Khidmat" },
  { icon: Sparkles, title: "Energi Positif" },
  { icon: Droplets, title: "Aroma Pilihan" },
];

export function BenefitsSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".benefit-item", {
      scrollTrigger: { trigger: container.current, start: "top 75%" },
      y: 20, opacity: 0, stagger: 0.1,
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-center font-serif text-3xl md:text-4xl text-gold-primary mb-16 benefit-item">
          Manfaat Penggunaan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 benefit-item">
              <div className="w-16 h-16 rounded-full border border-gold-primary/30 flex items-center justify-center bg-maroon-elevated text-gold-primary">
                <b.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-sm md:text-base text-text-primary">{b.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Culture Section**
Create `components/home/culture-section.tsx`:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const cultures = [
  { title: "Tradisi Dupa", desc: "Simbol penyucian dan doa." },
  { title: "Ruwatan", desc: "Pembersihan diri dari energi negatif." },
  { title: "Buka Aura", desc: "Memancarkan karisma positif." },
  { title: "Mustika Bertuah", desc: "Penguat perlindungan diri." },
];

export function CultureSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".culture-card", {
      scrollTrigger: { trigger: container.current, start: "top 75%" },
      y: 30, opacity: 0, stagger: 0.15,
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 bg-maroon-elevated">
      <div className="container mx-auto">
        <div className="text-center mb-16 culture-card">
          <h2 className="font-serif text-3xl md:text-4xl text-gold-primary mb-4">Nilai Budaya</h2>
          <p className="text-text-muted max-w-2xl mx-auto">Merawat peninggalan leluhur melalui praktik yang diwariskan turun-temurun.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultures.map((c, i) => (
            <div key={i} className="culture-card p-6 rounded-2xl border border-gold-primary/20 bg-[#2A0206] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:border-gold-primary/40 group flex flex-col items-center text-center">
              {/* Ornamen Lingkaran */}
              <div className="w-20 h-20 rounded-full border-2 border-gold-primary/30 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-gold-primary transition-colors">
                 <div className="w-16 h-16 rounded-full bg-maroon-elevated border border-gold-primary/20 flex items-center justify-center">
                   <span className="text-gold-primary/50 text-xs">img</span>
                 </div>
              </div>
              <h3 className="font-serif text-xl text-gold-primary mb-3">{c.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Quote Section**
Create `components/home/quote-section.tsx`:

```tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Quote } from "lucide-react";

export function QuoteSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".quote-anim", {
      scrollTrigger: { trigger: container.current, start: "top 80%" },
      scale: 0.95, opacity: 0, duration: 1,
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-4xl quote-anim relative">
        <div className="absolute -top-8 -left-4 text-gold-primary/20">
          <Quote size={80} className="rotate-180" />
        </div>
        <div className="border-y border-gold-primary/30 py-12 px-8 md:px-16 text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-text-primary">
            "Merawat tradisi bukan sekadar mengulang masa lalu, tetapi <span className="text-gold-primary">menghidupkan kembali nilai spiritual</span> di tengah laju zaman."
          </p>
        </div>
        <div className="absolute -bottom-10 -right-4 text-gold-primary/20">
          <Quote size={80} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Update Home Page**
Modify `app/page.tsx`:

```tsx
import { HeroSection } from "@/components/home/hero-section";
import { ProductDescSection } from "@/components/home/product-desc-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { CultureSection } from "@/components/home/culture-section";
import { QuoteSection } from "@/components/home/quote-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProductDescSection />
      <BenefitsSection />
      <CultureSection />
      <QuoteSection />
    </div>
  );
}
```

- [ ] **Step 5: Commit**
```bash
cd frontend && git add components/home/benefits-section.tsx components/home/culture-section.tsx components/home/quote-section.tsx app/page.tsx
git commit -m "feat: complete homepage sections"
```

---

### Task 7: Category & Product Pages

**Files:**
- Create: `app/kategori/[slug]/page.tsx`
- Create: `app/produk/[slug]/page.tsx`
- Modify: `components/ui/button.tsx` (ensure it's exported)

- [ ] **Step 1: Category Page**
Create `app/kategori/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = mockCategories.find(c => c.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  const products = mockProducts.filter(p => p.categoryId === category.id && p.is_active);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-gold-primary mb-12 border-b border-gold-primary/20 pb-6">
        {category.name}
      </h1>
      
      {products.length === 0 ? (
        <p className="text-text-muted">Belum ada produk di kategori ini.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <Link 
              key={product.id} 
              href={`/produk/${product.slug}`}
              className="group flex flex-col bg-maroon-elevated rounded-xl overflow-hidden border border-gold-primary/10 hover:border-gold-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)]"
            >
              <div className="aspect-[4/3] bg-[#2A0206] relative overflow-hidden">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gold-primary/30">
                  Foto Produk
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-serif text-xl text-text-primary group-hover:text-gold-primary transition-colors mb-2 line-clamp-2">
                  {product.name}
                </h2>
                <div className="mt-auto pt-4">
                  <span className="font-medium text-gold-primary text-lg">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Product Detail Page**
Create `app/produk/[slug]/page.tsx`:

```tsx
import { mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find(p => p.slug === params.slug);
  
  if (!product || !product.is_active) {
    notFound();
  }

  const isPhysicalProduct = !!product.shopee_url;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="aspect-square bg-maroon-elevated rounded-2xl border border-gold-primary/20 relative overflow-hidden">
           <div className="absolute inset-0 flex items-center justify-center text-gold-primary/30 text-lg">
             Galeri Foto Produk
           </div>
        </div>
        
        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="text-3xl text-gold-primary font-medium mb-8">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
          
          <div 
            className="prose prose-invert prose-p:text-text-muted prose-a:text-gold-primary max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          
          <div className="mt-auto pt-8 border-t border-gold-primary/20">
            {isPhysicalProduct ? (
              <Button asChild className="w-full sm:w-auto min-w-[200px]" variant="primary">
                <a href={product.shopee_url} target="_blank" rel="noopener noreferrer">
                  <ShoppingBag className="mr-2" size={20} />
                  Beli via Shopee
                </a>
              </Button>
            ) : (
              <Button asChild className="w-full sm:w-auto min-w-[200px]" variant="outline">
                <a href="https://wa.me/628000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2" size={20} />
                  Konsultasi via WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add app/kategori/[slug]/page.tsx app/produk/[slug]/page.tsx
git commit -m "feat: add category and product detail pages"
```

---

### Task 8: Global Footer

**Files:**
- Create: `components/layout/footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create Footer**
Create `components/layout/footer.tsx`:

```tsx
import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A0103] border-t border-gold-primary/10 pt-16 pb-8 px-4 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-gold-primary">Aroma Kemakmuran</h3>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Menghadirkan keharuman dan energi positif Nusantara langsung ke ruangan Anda.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-text-primary mb-4">Navigasi</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Beranda</Link></li>
            <li><Link href="/kategori/dupa" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Dupa</Link></li>
            <li><Link href="/kategori/garam-ruqyah" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Garam Ruqyah</Link></li>
          </ul>
        </div>

        <div id="kontak">
          <h4 className="font-medium text-text-primary mb-4">Hubungi Kami</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto pt-8 border-t border-white/5 text-center text-sm text-white/30">
        &copy; {new Date().getFullYear()} Aroma Kemakmuran. Hak cipta dilindungi.
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Add Footer to Layout**
Modify `app/layout.tsx`:

```tsx
// ... imports ...
import { Footer } from "@/components/layout/footer";

// ... Inside layout render ...
        <Header />
        <main className="flex-grow">
          <SmoothScroll>{children}</SmoothScroll>
        </main>
        <Footer />
// ...
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add components/layout/footer.tsx app/layout.tsx
git commit -m "feat: add global footer"
```
