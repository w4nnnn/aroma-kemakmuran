"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "./supabase/client";
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
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchData();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ]);
      
      if (catsRes.error) throw catsRes.error;
      if (prodsRes.error) throw prodsRes.error;
      
      setCategories(catsRes.data || []);
      setProducts(prodsRes.data || []);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      setIsAuthenticated(true);
      fetchData();
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
