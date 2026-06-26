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
      await pb.admins.authWithPassword(email, pass);
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
