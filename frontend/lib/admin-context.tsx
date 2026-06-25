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
