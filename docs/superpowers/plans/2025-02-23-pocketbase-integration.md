# PocketBase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate PocketBase backend via Docker, replacing mock data with real database schemas, server-side fetching for public pages, and client-side CRUD with authentication for the admin dashboard.

**Architecture:** Docker Compose orchestrates a PocketBase container and the Next.js frontend. PocketBase uses automated JS migrations to initialize collections. Next.js accesses PocketBase via `INTERNAL_PB_URL` (Server Components) and `NEXT_PUBLIC_PB_URL` (Client Components).

**Tech Stack:** Docker, PocketBase, Next.js (App Router), `pocketbase` npm SDK.

## Global Constraints

- Target directory: Repository root (for Docker/PB) and `frontend/` (for Next.js)
- `NEXT_PUBLIC_PB_URL`: `http://127.0.0.1:8090`
- `INTERNAL_PB_URL`: `http://pocketbase:8090`
- Collections API Rules: `List/View` = `""` (Public), `Create/Update/Delete` = Admins Only (null).
- PocketBase Data Dir: `./pb_data` (mounted). Migrations Dir: `./pb_migrations`.
- Use the official `pocketbase` npm package.

---

### Task 1: Docker Infrastructure & Environment Setup

**Files:**
- Create: `docker-compose.yml`
- Create: `pocketbase/Dockerfile`
- Modify: `frontend/Dockerfile` (Create if missing)
- Modify: `frontend/.env.local`

**Interfaces:**
- Produces: Running Docker environment with `pocketbase:8090` and `frontend:3000`.

- [ ] **Step 1: Create PocketBase Dockerfile**
Create `pocketbase/Dockerfile`:

```dockerfile
FROM alpine:latest

ARG PB_VERSION=0.22.20

RUN apk add --no-cache \
    unzip \
    ca-certificates

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
```

- [ ] **Step 2: Create Frontend Dockerfile**
Create `frontend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

- [ ] **Step 3: Create Docker Compose**
Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  pocketbase:
    build: 
      context: ./pocketbase
    ports:
      - "8090:8090"
    volumes:
      - ./pb_data:/pb/pb_data
      - ./pb_migrations:/pb/pb_migrations

  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
      - INTERNAL_PB_URL=http://pocketbase:8090
    depends_on:
      - pocketbase
```

- [ ] **Step 4: Create Local Environment Variables**
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
INTERNAL_PB_URL=http://127.0.0.1:8090
```

- [ ] **Step 5: Commit**
```bash
git add docker-compose.yml pocketbase/Dockerfile frontend/Dockerfile frontend/.env.local
git commit -m "feat: setup docker infrastructure for pocketbase and frontend"
```

---

### Task 2: PocketBase Migrations (Schema Initialization)

**Files:**
- Create: `pb_migrations/1700000000_collections.js`

**Interfaces:**
- Consumes: PocketBase initialization process.
- Produces: `categories` and `products` collections in the database.

- [ ] **Step 1: Create Migration Script**
Create `pb_migrations/1700000000_collections.js`:

```javascript
/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection1 = new Collection({
    "id": "categories00000",
    "name": "categories",
    "type": "base",
    "system": false,
    "schema": [
      { "system": false, "id": "cat_name000", "name": "name", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "cat_slug000", "name": "slug", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } }
    ],
    "indexes": ["CREATE UNIQUE INDEX `idx_cat_slug` ON `categories` (`slug`)"],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
  });

  const collection2 = new Collection({
    "id": "products0000000",
    "name": "products",
    "type": "base",
    "system": false,
    "schema": [
      { "system": false, "id": "prod_name00", "name": "name", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "prod_slug00", "name": "slug", "type": "text", "required": true, "options": { "min": null, "max": null, "pattern": "" } },
      { "system": false, "id": "prod_cat000", "name": "category", "type": "relation", "required": true, "options": { "collectionId": "categories00000", "cascadeDelete": false, "minSelect": null, "maxSelect": 1, "displayFields": null } },
      { "system": false, "id": "prod_price0", "name": "price", "type": "number", "required": true, "options": { "min": null, "max": null, "noDecimal": true } },
      { "system": false, "id": "prod_desc00", "name": "description", "type": "editor", "required": false, "options": { "convertUrls": false } },
      { "system": false, "id": "prod_img000", "name": "image", "type": "file", "required": false, "options": { "mimeTypes": ["image/jpeg", "image/png", "image/webp"], "thumbs": [], "maxSelect": 1, "maxSize": 5242880, "protected": false } },
      { "system": false, "id": "prod_shop00", "name": "shopee_url", "type": "url", "required": false, "options": { "exceptDomains": [], "onlyDomains": [] } },
      { "system": false, "id": "prod_active", "name": "is_active", "type": "bool", "required": false, "options": {} }
    ],
    "indexes": ["CREATE UNIQUE INDEX `idx_prod_slug` ON `products` (`slug`)"],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
  });

  db.saveCollection(collection1);
  db.saveCollection(collection2);
}, (db) => {
  const dao = new Dao(db);
  const products = dao.findCollectionByNameOrId("products0000000");
  const categories = dao.findCollectionByNameOrId("categories00000");
  dao.deleteCollection(products);
  dao.deleteCollection(categories);
});
```

- [ ] **Step 2: Commit**
```bash
git add pb_migrations/1700000000_collections.js
git commit -m "feat: add pocketbase migration for categories and products"
```

---

### Task 3: PocketBase Client & Next.js Image Config

**Files:**
- Create: `frontend/lib/pocketbase.ts`
- Modify: `frontend/next.config.ts`

**Interfaces:**
- Produces: Configured `PocketBase` instance for client and server.

- [ ] **Step 1: Install PocketBase SDK**
```bash
cd frontend && npm install pocketbase
```

- [ ] **Step 2: Create PocketBase Singleton**
Create `frontend/lib/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';

// Determine URL based on environment (Server vs Client)
const pbUrl = typeof window === 'undefined' 
  ? process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090'
  : process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(pbUrl);

// Helper to construct image URL
export function getPbImageUrl(collectionId: string, recordId: string, fileName: string) {
  if (!fileName) return "/placeholder.jpg"; // Fallback
  return `${process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090'}/api/files/${collectionId}/${recordId}/${fileName}`;
}
```

- [ ] **Step 3: Configure next/image**
Modify `frontend/next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      }
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add lib/pocketbase.ts next.config.ts package.json package-lock.json
git commit -m "feat: setup pocketbase client and next.js image config"
```

---

### Task 4: Server-Side Fetching for Public Pages

**Files:**
- Modify: `frontend/app/(public)/page.tsx`
- Modify: `frontend/app/(public)/kategori/[slug]/page.tsx`
- Modify: `frontend/app/(public)/produk/[slug]/page.tsx`

**Interfaces:**
- Consumes: `lib/pocketbase.ts` (pb client)

- [ ] **Step 1: Update Home Page (Categories Nav fallback if any)**
*Note: Our `layout.tsx` Header imports mockCategories. Let's fix `Header` to fetch server-side or make it async if it's a server component.* Wait, `Header` in `frontend/components/layout/header.tsx` is `"use client"`. We need to fetch categories in a parent server component or useEffect.
Since `Header` is client-side, let's fetch in `useEffect` in `Header`:

Modify `frontend/components/layout/header.tsx` to use PocketBase instead of mock data:
*(Replace `mockCategories` import with fetching logic)*

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { pb } from "@/lib/pocketbase";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    pb.collection('categories').getFullList({ sort: 'name' })
      .then(res => setCategories(res))
      .catch(err => console.error(err));
      
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

// ... update JSX to map `categories` instead of `mockCategories` ...
```

- [ ] **Step 2: Update Category Page (Server-Side)**
Modify `frontend/app/(public)/kategori/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { pb, getPbImageUrl } from "@/lib/pocketbase";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    // 1. Fetch category by slug
    const category = await pb.collection('categories').getFirstListItem(`slug="${resolvedParams.slug}"`, {
      cache: 'no-store' // Adjust caching strategy as needed
    });

    // 2. Fetch products for this category
    const products = await pb.collection('products').getFullList({
      filter: `category="${category.id}" && is_active=true`,
      sort: '-created'
    });

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
                <div className="aspect-[4/3] bg-[#2A0206] relative overflow-hidden flex items-center justify-center">
                  {product.image ? (
                    <img src={getPbImageUrl(product.collectionId, product.id, product.image)} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-gold-primary/30">Foto Produk</span>
                  )}
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
  } catch (error) {
    notFound();
  }
}
```

- [ ] **Step 3: Update Product Page (Server-Side)**
Modify `frontend/app/(public)/produk/[slug]/page.tsx`:

```tsx
import { pb, getPbImageUrl } from "@/lib/pocketbase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    const product = await pb.collection('products').getFirstListItem(`slug="${resolvedParams.slug}" && is_active=true`);
    const isPhysicalProduct = !!product.shopee_url;

    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="aspect-square bg-maroon-elevated rounded-2xl border border-gold-primary/20 relative overflow-hidden flex items-center justify-center">
            {product.image ? (
               <img src={getPbImageUrl(product.collectionId, product.id, product.image)} alt={product.name} className="object-cover w-full h-full" />
            ) : (
               <span className="text-gold-primary/30 text-lg">Galeri Foto Produk</span>
            )}
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
  } catch (error) {
    notFound();
  }
}
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add components/layout/header.tsx app/\(public\)/kategori/\[slug\]/page.tsx app/\(public\)/produk/\[slug\]/page.tsx
git commit -m "feat: replace mock data with pocketbase server-side fetching on public pages"
```

---

### Task 5: Admin Context Auth & Real Data

**Files:**
- Modify: `frontend/lib/admin-context.tsx`

**Interfaces:**
- Consumes: `pb` client.
- Produces: Updated Context methods backed by PocketBase.

- [ ] **Step 1: Rewrite AdminContext**
Modify `frontend/lib/admin-context.tsx`:

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { pb } from "./pocketbase";

interface AdminContextType {
  products: any[];
  categories: any[];
  fetchData: () => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid);
    if (pb.authStore.isValid) fetchData();

    // Listen for auth changes
    const unsub = pb.authStore.onChange((token, model) => {
      setIsAuthenticated(!!token);
      if (token) fetchData();
      else { setProducts([]); setCategories([]); }
    });
    return () => unsub();
  }, []);

  const fetchData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        pb.collection('categories').getFullList({ sort: 'name' }),
        pb.collection('products').getFullList({ sort: '-created' })
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      await pb.admins.authWithPassword(email, pass);
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    pb.authStore.clear();
  };

  return (
    <AdminContext.Provider value={{ products, categories, fetchData, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
```

- [ ] **Step 2: Update Login Page**
Modify `frontend/app/admin/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const success = await login(email, pass);
    if (success) {
      router.push("/admin");
    } else {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A0206] px-4">
      <div className="w-full max-w-md bg-[#3A040A] border border-[#D4AF37]/20 p-8 rounded-xl shadow-2xl">
        <h1 className="font-serif text-3xl text-[#D4AF37] text-center mb-8">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Password</label>
            <input 
              type="password" 
              required
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <Button type="submit" className="w-full">Masuk</Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add lib/admin-context.tsx app/admin/login/page.tsx
git commit -m "feat(admin): replace mock auth and context state with real pocketbase API"
```

---

### Task 6: Real CRUD for Admin Pages (Products & Categories)

**Files:**
- Modify: `frontend/app/admin/kategori/page.tsx`
- Modify: `frontend/app/admin/produk/page.tsx`
- Modify: `frontend/app/admin/produk/[...slug]/page.tsx`

**Interfaces:**
- Consumes: `pb` client for mutations, `fetchData()` from context to refresh lists.

- [ ] **Step 1: Category CRUD**
Modify `frontend/app/admin/kategori/page.tsx`:
*(Replace `addCategory`/`updateCategory`/`deleteCategory` context calls with `pb.collection('categories').create/update/delete` followed by `fetchData()`)*

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { pb } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminCategoryPage() {
  const { categories, products, fetchData } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const getProductCount = (categoryId: string) => products.filter(p => p.category === categoryId).length;

  const handleDelete = async (id: string) => {
    if (getProductCount(id) > 0) {
      alert("Tidak bisa menghapus kategori yang masih memiliki produk!");
      return;
    }
    if (confirm("Hapus kategori ini?")) {
      await pb.collection('categories').delete(id);
      fetchData();
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug });
    setShowForm(true);
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({ name: "", slug: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    if (editingId) await pb.collection('categories').update(editingId, payload);
    else await pb.collection('categories').create(payload);
    
    fetchData();
    setShowForm(false);
  };

  const inputClass = "w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-2 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]";

  return (
    // Keep identical JSX render logic, but update `getCategoryName` usages if necessary
    // ... Copy the rest of the existing JSX ...
// (We will instruct the subagent to copy the JSX but ensure property bindings are correct, i.e., product.category vs product.categoryId)
```

- [ ] **Step 2: Product List Update**
Modify `frontend/app/admin/produk/page.tsx`:
Update deletion logic to use `pb.collection('products').delete(id)`. Ensure property mapping matches PB schema (e.g. `product.category` instead of `product.categoryId`).

- [ ] **Step 3: Product Form (FormData upload)**
Modify `frontend/app/admin/produk/[...slug]/page.tsx`:

```tsx
// Use FormData to allow file uploads
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('slug', formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formDataObj.append('category', formData.category);
    formDataObj.append('price', formData.price);
    formDataObj.append('description', formData.description);
    formDataObj.append('shopee_url', formData.shopee_url);
    formDataObj.append('is_active', formData.is_active ? 'true' : 'false');
    
    // If a new file was selected (assuming we add a file input state `imageFile`)
    // if (imageFile) formDataObj.append('image', imageFile);

    try {
      if (isEdit) {
        await pb.collection('products').update(id, formDataObj);
      } else {
        await pb.collection('products').create(formDataObj);
      }
      fetchData();
      router.push("/admin/produk");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk.");
    }
  };
```

- [ ] **Step 4: Cleanup Mock Data**
Delete `frontend/lib/mock-data.ts`.
Delete `frontend/lib/types.ts` (or update it to PB types).

- [ ] **Step 5: Commit**
```bash
cd frontend && git rm lib/mock-data.ts && git add app/admin/kategori/page.tsx app/admin/produk/page.tsx app/admin/produk/\[...slug\]/page.tsx
git commit -m "feat(admin): implement real CRUD with PocketBase and remove mock data"
```
