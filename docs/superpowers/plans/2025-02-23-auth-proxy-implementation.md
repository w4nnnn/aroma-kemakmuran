# Server-Side Auth & PocketBase Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure the admin dashboard with Next.js SSR/Middleware using HTTP cookies, and entirely proxy PocketBase communications so the database port is no longer exposed.

**Architecture:** We will update PocketBase connection logic to read and write to HTTP cookies. Next.js Middleware will intercept `/admin` routes and validate these cookies. Client operations that previously called PocketBase directly will now call Next.js API Route Handlers, which forward the requests internally to PocketBase.

**Tech Stack:** Next.js (App Router), Next.js Middleware, PocketBase JS SDK, Docker Compose.

## Global Constraints
- PocketBase port 8090 must not be exposed to the host in `docker-compose.yml`.
- All client-side fetch calls to PocketBase must use relative paths (`/api/pb/...` or `/api/files/...`).
- SSR must correctly hydrate the auth state to prevent UI flashes.

---

### Task 1: Update PocketBase Helper & Add Server Client

**Files:**
- Modify: `frontend/lib/pocketbase.ts`
- Modify: `frontend/package.json` (add `server-only` if needed, though Next.js has native cookies)

**Interfaces:**
- Produces: `getPbImageUrl(collectionId, recordId, fileName)` returns relative URL (`/api/files/...`)
- Produces: `createServerClient()` function to initialize PB with `next/headers` cookies.

- [ ] **Step 1: Write the updated `lib/pocketbase.ts`**
```typescript
import PocketBase from 'pocketbase';

// Client-side singleton (defaults to relative URL now)
const pbUrl = typeof window === 'undefined' 
  ? process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090' // Only used in server components that don't need auth, or via proxy
  : '/api/pb'; // Client side points to proxy

export const pb = new PocketBase(pbUrl);

// Helper to construct image URL via proxy
export function getPbImageUrl(collectionId: string, recordId: string, fileName: string) {
  if (!fileName) return "/placeholder.jpg";
  return `/api/files/${collectionId}/${recordId}/${fileName}`;
}
```

- [ ] **Step 2: Commit**
```bash
git add frontend/lib/pocketbase.ts
git commit -m "refactor(auth): update pocketbase client for proxy usage"
```

---

### Task 2: Implement Media Proxy Route

**Files:**
- Create: `frontend/app/api/files/[collectionId]/[recordId]/[filename]/route.ts`

**Interfaces:**
- Consumes: URL params `collectionId`, `recordId`, `filename`
- Produces: Streams the file from internal PocketBase to the client

- [ ] **Step 1: Write the media proxy route**
```typescript
// frontend/app/api/files/[collectionId]/[recordId]/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string; recordId: string; filename: string }> }
) {
  const { collectionId, recordId, filename } = await params;
  const pbUrl = process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090';
  const targetUrl = `${pbUrl}/api/files/${collectionId}/${recordId}/${filename}`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse("File not found", { status: response.status });
    }

    const contentType = response.headers.get("content-type");
    
    // Create a new response with the stream
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add frontend/app/api/files/
git commit -m "feat(api): create media proxy route for pocketbase files"
```

---

### Task 3: Implement PocketBase API Proxy

**Files:**
- Create: `frontend/app/api/pb/[...path]/route.ts`

**Interfaces:**
- Consumes: Any request to `/api/pb/*`
- Produces: Forwards request to internal PocketBase, passing along the `pb_auth` cookie if present.

- [ ] **Step 1: Write the API proxy route**
```typescript
// frontend/app/api/pb/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pbUrl = process.env.INTERNAL_PB_URL || 'http://127.0.0.1:8090';
  
  // Construct the target URL
  const targetPath = path.join("/");
  const url = new URL(request.url);
  const targetUrl = new URL(`/api/${targetPath}${url.search}`, pbUrl);

  // Forward headers (especially auth and content-type)
  const headers = new Headers();
  
  // Transfer auth cookie to Authorization header if present
  const pbAuth = request.cookies.get('pb_auth');
  if (pbAuth) {
    try {
      const parsed = JSON.parse(pbAuth.value);
      if (parsed.token) {
        headers.set('Authorization', `Bearer ${parsed.token}`);
      }
    } catch(e) {}
  }

  if (request.headers.get('content-type')) {
    headers.set('Content-Type', request.headers.get('content-type')!);
  }

  // Handle body
  let body: any = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    // Check if it's multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
      // Remove content-type so fetch generates the correct boundary automatically
      headers.delete('Content-Type');
    } else {
      body = await request.text();
    }
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body,
      // allow fetching self-signed if internal
      duplex: body instanceof ReadableStream ? "half" : undefined,
    } as RequestInit);

    // If it's a login request (auth-with-password), we need to capture the token
    // and set it as an HTTP-only cookie on the Next.js side.
    const isLogin = targetPath.includes("auth-with-password");
    let responseData;
    let resOptions: ResponseInit = {
      status: response.status,
      headers: new Headers(response.headers),
    };

    if (isLogin && response.ok) {
      responseData = await response.json();
      const nextRes = NextResponse.json(responseData, resOptions);
      nextRes.cookies.set('pb_auth', JSON.stringify({ token: responseData.token, model: responseData.record }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return nextRes;
    }

    // For normal responses
    const arrayBuffer = await response.arrayBuffer();
    const nextRes = new NextResponse(arrayBuffer, resOptions);
    return nextRes;
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
```

- [ ] **Step 2: Commit**
```bash
git add frontend/app/api/pb/
git commit -m "feat(api): create comprehensive proxy for pocketbase data and auth"
```

---

### Task 4: Implement SSR Middleware Protection

**Files:**
- Create/Modify: `frontend/middleware.ts`

**Interfaces:**
- Protects `/admin` routes.

- [ ] **Step 1: Write `middleware.ts`**
```typescript
// frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Only run on /admin routes, but skip /admin/login
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const authCookie = request.cookies.get('pb_auth');
    let isAuthenticated = false;

    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value);
        if (parsed.token) {
          isAuthenticated = true;
        }
      } catch (e) {
        // Invalid cookie
      }
    }

    if (!isAuthenticated) {
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login
  if (url.pathname === '/admin/login') {
    const authCookie = request.cookies.get('pb_auth');
    if (authCookie) {
      try {
        const parsed = JSON.parse(authCookie.value);
        if (parsed.token) {
          url.pathname = '/admin/produk';
          return NextResponse.redirect(url);
        }
      } catch (e) {}
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Commit**
```bash
git add frontend/middleware.ts
git commit -m "feat(auth): add middleware to protect admin routes via http cookies"
```

---

### Task 5: Refactor Client Auth Context & Login

**Files:**
- Modify: `frontend/lib/admin-context.tsx`
- Modify: `frontend/app/admin/layout.tsx`

**Interfaces:**
- Syncs Context with the fact that Auth is now managed by the Proxy cookies.

- [ ] **Step 1: Update `admin-context.tsx` to handle proxy login**
```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { pb } from "./pocketbase";
import { useRouter } from "next/navigation";

interface AdminContextType {
  products: any[];
  categories: any[];
  fetchData: () => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  // Assume true initially if on an admin route protected by middleware
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    // Only attempt fetch if we think we're authenticated
    // Note: since pbUrl is now /api/pb, authStore in JS SDK is effectively useless
    // The browser automatically sends the HTTP-Only cookie.
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        pb.collection('categories').getFullList({ sort: 'name' }),
        pb.collection('products').getFullList({ sort: '-created' })
      ]);
      setCategories(cats);
      setProducts(prods);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      // If fetching fails with 401, proxy cookie is invalid/expired
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      // This goes to proxy, which intercepts auth-with-password and sets the cookie
      await pb.collection('_superusers').authWithPassword(email, pass);
      setIsAuthenticated(true);
      fetchData();
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    // We need an endpoint to clear the cookie, or we can just fetch an invalid endpoint or clear it via JS if not http-only.
    // Since it's HTTP-only, we must tell the server to delete it. Let's do it by fetching a custom logout route.
    await fetch('/api/pb/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setProducts([]);
    setCategories([]);
    router.push('/admin/login');
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

- [ ] **Step 2: Add Logout to Proxy Route (`frontend/app/api/pb/[...path]/route.ts`)**
Modify the top of `handleProxy`:
```typescript
  if (path[0] === 'logout') {
    const res = NextResponse.json({ success: true });
    res.cookies.delete('pb_auth');
    return res;
  }
```

- [ ] **Step 3: Update `app/admin/layout.tsx`**
Remove the client-side redirect logic because Middleware handles it.
```tsx
"use client";

import { AdminProvider } from "@/lib/admin-context";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { useState } from "react";
import { usePathname } from "next/navigation";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

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

- [ ] **Step 4: Commit**
```bash
git add frontend/lib/admin-context.tsx frontend/app/admin/layout.tsx frontend/app/api/pb/
git commit -m "refactor(auth): transition admin context and layout to rely on middleware and http cookies"
```

---

### Task 6: Secure Docker Configuration

**Files:**
- Modify: `docker-compose.yml`

**Interfaces:**
- Removes external exposure of port 8090.

- [ ] **Step 1: Edit `docker-compose.yml`**
Remove the `ports:` block from the `pocketbase` service.
```yaml
services:
  pocketbase:
    build: 
      context: ./pocketbase
    # REMOVED ports entirely
    volumes:
      - ./pb_data:/pb/pb_data
      - ./pb_migrations:/pb/pb_migrations

  frontend:
    build:
      context: ./frontend
    ports:
      - "${FRONTEND_PORT:-2200}:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NEXT_PUBLIC_PB_URL=http://localhost:3000 # Since proxy handles it, browser uses relative paths implicitly
      - INTERNAL_PB_URL=${INTERNAL_PB_URL:-http://pocketbase:8090}
    depends_on:
      - pocketbase
```

- [ ] **Step 2: Commit**
```bash
git add docker-compose.yml
git commit -m "chore(infra): close pocketbase public port exposure for production security"
```
