"use client";

import { useAdmin } from "@/lib/admin-context";
import { deleteProduct } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductPage() {
  const { products, categories, fetchData } = useAdmin();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      const product = await deleteProduct(id);

      // Clean up storage files
      if (product) {
        const filesToRemove: string[] = [];
        if (product.image && product.image.length > 0) filesToRemove.push(...product.image);
        if (product.video && product.video.length > 0) filesToRemove.push(...product.video);
        if (filesToRemove.length > 0) {
          await supabase.storage.from('product-media').remove(filesToRemove);
        }
      }
      fetchData();
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-[#FDFBF7]">Daftar Produk</h2>
        <Button asChild><Link href="/admin/produk/add"><Plus size={18} className="mr-2" /> Tambah Produk</Link></Button>
      </div>
      <div className="bg-[#3A040A] rounded-xl border border-[#D4AF37]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2A0206] text-[#D4AF37] border-b border-[#D4AF37]/20">
              <tr><th className="px-6 py-4 font-medium">Nama Produk</th><th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 font-medium">Harga</th><th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#F5F2EB]">Belum ada produk.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#2A0206]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#FDFBF7]">{product.name}</td>
                    <td className="px-6 py-4 text-[#F5F2EB]">{getCategoryName(product.categoryId)}</td>
                    <td className="px-6 py-4 text-[#F5F2EB]">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">{product.isActive ? <Badge variant="default">Aktif</Badge> : <Badge variant="neutral">Non-Aktif</Badge>}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/produk/edit/${product.id}`} className="inline-flex p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-md transition-colors"><Edit size={18} /></Link>
                      <button onClick={() => handleDelete(product.id)} className="inline-flex p-2 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"><Trash2 size={18} /></button>
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
