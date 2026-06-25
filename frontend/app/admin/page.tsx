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
