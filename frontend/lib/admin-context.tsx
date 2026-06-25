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
