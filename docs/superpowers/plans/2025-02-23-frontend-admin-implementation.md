# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional, mock-data-driven admin dashboard with a premium dark maroon and gold aesthetic.

**Architecture:** Next.js App Router (React 19) nested under `/admin`. Uses a distinct layout with a responsive sidebar. State management uses React Context/Hooks for mock CRUD operations.

**Tech Stack:** Next.js, Tailwind CSS v4, Lucide React, TipTap (for rich text).

## Global Constraints

- Target directory: `frontend/` (all paths below are relative to this unless stated otherwise)
- Background Admin Base: `bg-[#2A0206]`
- Background Admin Elevated (Cards/Tables): `bg-[#3A040A]`
- Accent Gold: `text-[#D4AF37]`, `border-[#D4AF37]`
- Text Primary: `#FDFBF7`
- Text Muted: `#F5F2EB`
- Typography: Montserrat (`font-sans`) for data/body, Playfair Display (`font-serif`) for headers.
- Forms: Dark background, gold borders on focus.
- Components: Build custom UI components matching Shadcn anatomy but strictly adhering to the Maroon/Gold theme.
- Data: Use `lib/mock-data.ts` extended with a Context provider to simulate CRUD operations.

---

### Task 1: Admin Data Context & Auth Setup

**Files:**
- Create: `lib/admin-context.tsx`
- Create: `app/admin/layout.tsx` (temporary wrapper for context)
- Create: `app/admin/login/page.tsx`

**Interfaces:**
- Produces: `AdminProvider` exporting `products`, `categories`, `addProduct`, `updateProduct`, `deleteProduct`, `addCategory`, `updateCategory`, `deleteCategory`.

- [ ] **Step 1: Create Admin Context**
Create `lib/admin-context.tsx`:

```tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Product, Category } from "./types";
import { mockProducts, mockCategories } from "./mock-data";

interface AdminContextType {
  products: Product[];
  categories: Category[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (p: Product) => setProducts(products.map(item => item.id === p.id ? p : item));
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addCategory = (c: Category) => setCategories([...categories, c]);
  const updateCategory = (c: Category) => setCategories(categories.map(item => item.id === c.id ? c : item));
  const deleteCategory = (id: string) => setCategories(categories.filter(c => c.id !== id));

  return (
    <AdminContext.Provider value={{
      products, categories, addProduct, updateProduct, deleteProduct,
      addCategory, updateCategory, deleteCategory,
      isAuthenticated, login: () => setIsAuthenticated(true), logout: () => setIsAuthenticated(false)
    }}>
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

- [ ] **Step 2: Create Admin Layout**
Create `app/admin/layout.tsx` to wrap the admin routes in the provider:

```tsx
import { AdminProvider } from "@/lib/admin-context";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  );
}
```

- [ ] **Step 3: Create Login Page**
Create `app/admin/login/page.tsx`:

```tsx
"use client";

import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { login } = useAdmin();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2A0206] px-4">
      <div className="w-full max-w-md bg-[#3A040A] border border-[#D4AF37]/20 p-8 rounded-xl shadow-2xl">
        <h1 className="font-serif text-3xl text-[#D4AF37] text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Email</label>
            <input 
              type="email" 
              defaultValue="admin@example.com"
              className="w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Password</label>
            <input 
              type="password" 
              defaultValue="password"
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

- [ ] **Step 4: Commit**
```bash
cd frontend && git add lib/admin-context.tsx app/admin/layout.tsx app/admin/login/page.tsx
git commit -m "feat(admin): setup admin context and mock login page"
```

---

### Task 2: Admin Sidebar & Authenticated Layout

**Files:**
- Create: `components/admin/sidebar.tsx`
- Create: `components/admin/topbar.tsx`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: `useAdmin` for logout and auth check.

- [ ] **Step 1: Create Sidebar Component**
Create `components/admin/sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, LogOut } from "lucide-react";
import { useAdmin } from "@/lib/admin-context";

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produk", label: "Produk", icon: Package },
    { href: "/admin/kategori", label: "Kategori", icon: Tags },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#2A0206] border-r border-[#D4AF37]/20 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-16 flex items-center px-6 border-b border-[#D4AF37]/20">
          <span className="font-serif text-xl text-[#D4AF37]">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-[#3A040A] text-[#D4AF37] border border-[#D4AF37]/30" : "text-[#F5F2EB] hover:bg-[#3A040A]/50 hover:text-[#D4AF37]"}`}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-[#3A040A] rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Create Topbar Component**
Create `components/admin/topbar.tsx`:

```tsx
"use client";

import { Menu } from "lucide-react";

export function AdminTopbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="h-16 bg-[#3A040A] border-b border-[#D4AF37]/20 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-[#D4AF37] p-2 -ml-2"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#FDFBF7]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2A0206] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
          AD
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update Layout**
Modify `app/admin/layout.tsx` to handle authentication routing and layout structure:

```tsx
"use client";

import { AdminProvider, useAdmin } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated && pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null; // Prevent flash

  // Determine title based on pathname
  let title = "Dashboard";
  if (pathname.includes("/produk")) title = "Manajemen Produk";
  if (pathname.includes("/kategori")) title = "Manajemen Kategori";

  return (
    <div className="flex h-screen bg-[#2A0206] overflow-hidden text-[#FDFBF7] font-sans">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
```

- [ ] **Step 4: Create Dashboard Overview**
Create `app/admin/page.tsx`:

```tsx
"use client";

import { useAdmin } from "@/lib/admin-context";
import { Package, Tags } from "lucide-react";

export default function AdminDashboard() {
  const { products, categories } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#3A040A] p-6 rounded-xl border border-[#D4AF37]/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2A0206] flex items-center justify-center text-[#D4AF37]">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-[#F5F2EB]">Total Produk</p>
            <p className="text-2xl font-serif text-[#D4AF37]">{products.length}</p>
          </div>
        </div>
        
        <div className="bg-[#3A040A] p-6 rounded-xl border border-[#D4AF37]/20 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#2A0206] flex items-center justify-center text-[#D4AF37]">
            <Tags size={24} />
          </div>
          <div>
            <p className="text-sm text-[#F5F2EB]">Kategori Aktif</p>
            <p className="text-2xl font-serif text-[#D4AF37]">{categories.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**
```bash
cd frontend && git add components/admin/sidebar.tsx components/admin/topbar.tsx app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat(admin): build sidebar layout and dashboard overview"
```

---

### Task 3: Product Management Table

**Files:**
- Create: `components/ui/badge.tsx`
- Create: `app/admin/produk/page.tsx`

**Interfaces:**
- Consumes: `useAdmin` for product list and deletion.

- [ ] **Step 1: Create Badge Component**
Create `components/ui/badge.tsx`:

```tsx
export function Badge({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "neutral" }) {
  const variants = {
    default: "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30",
    success: "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30",
    neutral: "bg-gray-800 text-gray-300 border border-gray-600"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create Product List Page**
Create `app/admin/produk/page.tsx`:

```tsx
"use client";

import { useAdmin } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductPage() {
  const { products, categories, deleteProduct } = useAdmin();

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      deleteProduct(id);
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-[#FDFBF7]">Daftar Produk</h2>
        <Button asChild>
          <Link href="/admin/produk/add">
            <Plus size={18} className="mr-2" /> Tambah Produk
          </Link>
        </Button>
      </div>

      <div className="bg-[#3A040A] rounded-xl border border-[#D4AF37]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2A0206] text-[#D4AF37] border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Produk</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Harga</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#F5F2EB]">Belum ada produk.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#2A0206]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#FDFBF7]">{product.name}</td>
                    <td className="px-6 py-4 text-[#F5F2EB]">{getCategoryName(product.categoryId)}</td>
                    <td className="px-6 py-4 text-[#F5F2EB]">Rp {product.price.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      {product.is_active ? (
                        <Badge variant="default">Aktif</Badge>
                      ) : (
                        <Badge variant="neutral">Non-Aktif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/produk/edit/${product.id}`} className="inline-flex p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="inline-flex p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**
```bash
cd frontend && git add components/ui/badge.tsx app/admin/produk/page.tsx
git commit -m "feat(admin): add product data table"
```

---

### Task 4: TipTap Editor & Product Form Setup

**Files:**
- Create: `components/admin/rich-text-editor.tsx`
- Create: `app/admin/produk/[action]/page.tsx`

**Interfaces:**
- Consumes: `@tiptap/react`, `@tiptap/starter-kit`.

- [ ] **Step 1: Install TipTap**
```bash
cd frontend && npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

- [ ] **Step 2: Create Rich Text Editor Component**
Create `components/admin/rich-text-editor.tsx`:

```tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Deskripsi produk...' })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-[#D4AF37]/30 rounded-md overflow-hidden bg-[#2A0206] focus-within:border-[#D4AF37] transition-colors">
      <div className="flex items-center gap-1 border-b border-[#D4AF37]/20 p-2 bg-[#3A040A]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('bold') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('italic') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-[#D4AF37]/20 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('bulletList') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-[#D4AF37]/10 ${editor.isActive('orderedList') ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-[#F5F2EB]'}`}>
          <ListOrdered size={16} />
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[150px] text-[#FDFBF7] prose prose-invert prose-p:my-2 prose-list:my-2 focus:outline-none max-w-none" 
      />
    </div>
  );
}
```

- [ ] **Step 3: Create Product Form Page**
Create `app/admin/produk/[action]/page.tsx` (Handles both `add` and `edit/[id]` via action param handling).
Wait, Next.js routing makes `/admin/produk/[action]/[id]` complex if sharing a single file without catch-all.
Let's use a catch-all route instead: `app/admin/produk/[...slug]/page.tsx`.

Create `app/admin/produk/[...slug]/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductFormPage({ params }: { params: { slug: string[] } }) {
  const action = params.slug[0]; // 'add' or 'edit'
  const id = params.slug[1]; // undefined if 'add'
  
  const { products, categories, addProduct, updateProduct } = useAdmin();
  const router = useRouter();
  
  const isEdit = action === 'edit' && !!id;
  const existingProduct = isEdit ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: "", slug: "", categoryId: "", price: "", description: "", shopee_url: "", is_active: true
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        slug: existingProduct.slug,
        categoryId: existingProduct.categoryId,
        price: existingProduct.price.toString(),
        description: existingProduct.description,
        shopee_url: existingProduct.shopee_url || "",
        is_active: existingProduct.is_active
      });
    } else if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [existingProduct, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      id: isEdit ? id : `p${Date.now()}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: formData.categoryId,
      price: parseInt(formData.price) || 0,
      description: formData.description,
      images: ["/placeholder.jpg"], // Mock
      shopee_url: formData.shopee_url,
      is_active: formData.is_active
    };

    if (isEdit) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }
    router.push("/admin/produk");
  };

  const inputClass = "w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-3 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37] transition-colors";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/produk" className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-xl font-medium text-[#FDFBF7]">{isEdit ? "Edit Produk" : "Tambah Produk"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#3A040A] p-6 md:p-8 rounded-xl border border-[#D4AF37]/20 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Nama Produk *</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Harga (Rp) *</label>
            <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={inputClass} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Kategori *</label>
            <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className={inputClass}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Link Shopee (Opsional)</label>
            <input type="url" value={formData.shopee_url} onChange={e => setFormData({...formData, shopee_url: e.target.value})} placeholder="https://shopee.co.id/..." className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#F5F2EB]">Deskripsi Produk</label>
          <RichTextEditor content={formData.description} onChange={html => setFormData({...formData, description: html})} />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-5 h-5 accent-[#D4AF37]" />
          <label htmlFor="is_active" className="text-[#FDFBF7] cursor-pointer">Produk Aktif (Tampil di Publik)</label>
        </div>

        <div className="pt-6 border-t border-[#D4AF37]/20 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/produk")}>Batal</Button>
          <Button type="submit">Simpan Produk</Button>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add components/admin/rich-text-editor.tsx app/admin/produk/\[...slug\]/page.tsx package.json package-lock.json
git commit -m "feat(admin): add tiptap editor and product form"
```

---

### Task 5: Category Management Table & Dialog

**Files:**
- Create: `app/admin/kategori/page.tsx`

**Interfaces:**
- Consumes: `useAdmin`

- [ ] **Step 1: Create Category Page**
Create `app/admin/kategori/page.tsx`. We will implement a simple inline conditional form instead of a complex shadcn dialog to satisfy ponytail laziness while keeping UX intact.

```tsx
"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminCategoryPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const getProductCount = (categoryId: string) => products.filter(p => p.categoryId === categoryId).length;

  const handleDelete = (id: string) => {
    if (getProductCount(id) > 0) {
      alert("Tidak bisa menghapus kategori yang masih memiliki produk!");
      return;
    }
    if (confirm("Hapus kategori ini?")) deleteCategory(id);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId || `c${Date.now()}`,
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    if (editingId) updateCategory(payload);
    else addCategory(payload);
    setShowForm(false);
  };

  const inputClass = "w-full bg-[#2A0206] border border-[#D4AF37]/30 rounded-md px-4 py-2 text-[#FDFBF7] focus:outline-none focus:border-[#D4AF37]";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-[#FDFBF7]">Kategori Produk</h2>
        {!showForm && (
          <Button onClick={openNewForm}>
            <Plus size={18} className="mr-2" /> Tambah Kategori
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-[#3A040A] p-6 rounded-xl border border-[#D4AF37]/20 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-[#F5F2EB] hover:text-[#D4AF37]"><X size={20}/></button>
          <h3 className="text-lg font-medium text-[#D4AF37] mb-4">{editingId ? "Edit Kategori" : "Kategori Baru"}</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full space-y-2">
              <label className="text-sm text-[#F5F2EB]">Nama Kategori *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
            </div>
            <div className="w-full space-y-2">
              <label className="text-sm text-[#F5F2EB]">Slug (Opsional)</label>
              <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClass} />
            </div>
            <Button type="submit" className="w-full sm:w-auto shrink-0">Simpan</Button>
          </form>
        </div>
      )}

      <div className="bg-[#3A040A] rounded-xl border border-[#D4AF37]/20 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#2A0206] text-[#D4AF37] border-b border-[#D4AF37]/20">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Kategori</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Jml Produk</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/10">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#2A0206]/50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#FDFBF7]">{cat.name}</td>
                <td className="px-6 py-4 text-[#F5F2EB]">{cat.slug}</td>
                <td className="px-6 py-4 text-[#F5F2EB]">{getProductCount(cat.id)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEdit(cat)} className="inline-flex p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="inline-flex p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
cd frontend && git add app/admin/kategori/page.tsx
git commit -m "feat(admin): add category management page"
```
