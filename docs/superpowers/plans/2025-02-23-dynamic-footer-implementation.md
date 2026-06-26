# Dynamic Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the static footer navigation into an Async Server Component that dynamically fetches and displays all categories from PocketBase.

**Architecture:** Next.js Server Component fetching data directly from PocketBase via the `pocketbase` npm SDK. Includes error handling to gracefully degrade if the database is unreachable.

**Tech Stack:** Next.js (App Router), PocketBase JS SDK, Tailwind CSS.

## Global Constraints

- Target directory: `frontend/` (all paths below are relative to this unless stated otherwise)
- Target component: `frontend/components/layout/footer.tsx`
- The `Footer` must become an `async` function (Server Component).
- Always retain the "Beranda" (`/`) link at the top of the list.
- Use `try/catch` around the PocketBase fetch. If it fails, log error and fallback to an empty array (just rendering "Beranda").

---

### Task 1: Refactor Footer to Async Server Component

**Files:**
- Modify: `frontend/components/layout/footer.tsx`

**Interfaces:**
- Consumes: `pb` client from `lib/pocketbase.ts`.
- Produces: Async Server Component `Footer` mapping dynamic links.

- [ ] **Step 1: Rewrite Footer as Async Component**
Modify `frontend/components/layout/footer.tsx`:

```tsx
import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { pb } from "@/lib/pocketbase";

export async function Footer() {
  let categories: any[] = [];
  
  try {
    categories = await pb.collection('categories').getFullList({ sort: 'name' });
  } catch (error) {
    console.error("Failed to load categories for footer:", error);
  }

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
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={`/kategori/${cat.slug}`} className="text-sm text-text-muted hover:text-gold-primary transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="kontak">
          <h4 className="font-medium text-text-primary mb-4">Hubungi Kami</h4>
          <div className="flex gap-4">
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
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

- [ ] **Step 2: Commit**
```bash
cd frontend && git add components/layout/footer.tsx
git commit -m "feat: make footer navigation categories dynamic via pocketbase"
```
