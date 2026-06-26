# Animated Link Footer Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the `AnimatedLink` component into the dynamic footer navigation, adding necessary utilities (`cn`, `clsx`, `tailwind-merge`).

**Architecture:** A reusable React UI component built on Next.js `<Link>` instead of `<a href>`, powered by Tailwind for animation. The footer is a Server Component fetching categories and mapping them to `AnimatedLink`.

**Tech Stack:** React, Tailwind CSS v4, Next.js (App Router), `clsx`, `tailwind-merge`.

## Global Constraints

- Target directory: `frontend/` (all paths below are relative to this unless stated otherwise)
- Brand Colors: Text should be `text-[#F5F2EB]` defaulting to `hover:text-[#D4AF37]` (or inherit correctly from parent).
- Next.js Routing: The `AnimatedLink` MUST use `import Link from "next/link"` under the hood for internal routing.
- The arrow should be disabled by default or passed `showArrow={false}` in the footer.

---

### Task 1: Setup Utilities and Dependencies

**Files:**
- Create: `frontend/lib/utils.ts`
- Modify: `frontend/package.json`

**Interfaces:**
- Produces: `cn` utility function.

- [ ] **Step 1: Install dependencies**
```bash
cd frontend && npm install clsx tailwind-merge
```

- [ ] **Step 2: Create utility file**
Create `frontend/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add lib/utils.ts package.json package-lock.json
git commit -m "chore: add clsx and tailwind-merge for ui components"
```

---

### Task 2: Create AnimatedLink Component

**Files:**
- Create: `frontend/components/ui/animated-link.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`, `Link` from `next/link`.
- Produces: `<AnimatedLink>` component.

- [ ] **Step 1: Create Component**
Create `frontend/components/ui/animated-link.tsx`:

```tsx
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AnimatedLinkVariant = "left" | "right" | "center";

const underlineVariants: Record<AnimatedLinkVariant, string> = {
  // underline wipes in from the left edge
  left: "before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100",
  // underline wipes in from the right edge
  right:
    "before:origin-left before:scale-x-0 hover:before:origin-right hover:before:scale-x-100",
  // underline grows outward from the center
  center: "before:origin-center before:scale-x-0 hover:before:scale-x-100",
};

// Extend Next.js Link props instead of anchor props
export interface AnimatedLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  /** Direction the underline reveals from on hover. */
  variant?: AnimatedLinkVariant;
  /** Show the diagonal arrow that lifts in on hover. */
  showArrow?: boolean;
}

const AnimatedLink = ({
  variant = "left",
  showArrow = true,
  className,
  children,
  ...props
}: AnimatedLinkProps) => {
  return (
    <Link
      className={cn(
        "group relative inline-flex w-fit items-center",
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.2em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:before:transition-none",
        underlineVariants[variant],
        className
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <svg
          className="ml-[0.3em] size-[0.55em] transition-none"
          fill="none"
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="[stroke-dasharray:32] [stroke-dashoffset:32] transition-[stroke-dashoffset] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:[stroke-dashoffset:0] motion-reduce:transition-none"
          />
        </svg>
      )}
    </Link>
  );
};

export { AnimatedLink };
export default AnimatedLink;
```

- [ ] **Step 2: Commit**
```bash
cd frontend && git add components/ui/animated-link.tsx
git commit -m "feat: add AnimatedLink component using next/link"
```

---

### Task 3: Integrate Component into Footer

**Files:**
- Modify: `frontend/components/layout/footer.tsx`

**Interfaces:**
- Consumes: `<AnimatedLink>`

- [ ] **Step 1: Refactor Footer Navigation**
Modify `frontend/components/layout/footer.tsx` to use `AnimatedLink`. (Assuming Task "Dynamic Footer" was completed and footer maps categories asynchronously). Replace standard `<Link>` with `<AnimatedLink>`. Set `showArrow={false}`. Maintain `text-sm text-text-muted hover:text-gold-primary transition-colors` styles by passing them to `className`.

```tsx
import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { pb } from "@/lib/pocketbase";
import { AnimatedLink } from "@/components/ui/animated-link";

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
          <ul className="space-y-3">
            <li>
              <AnimatedLink 
                href="/" 
                variant="left" 
                showArrow={false} 
                className="text-sm text-[#F5F2EB] hover:text-[#D4AF37] transition-colors"
              >
                Beranda
              </AnimatedLink>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <AnimatedLink 
                  href={`/kategori/${cat.slug}`} 
                  variant="left" 
                  showArrow={false}
                  className="text-sm text-[#F5F2EB] hover:text-[#D4AF37] transition-colors"
                >
                  {cat.name}
                </AnimatedLink>
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
git commit -m "feat: replace footer navigation links with AnimatedLink component"
```
