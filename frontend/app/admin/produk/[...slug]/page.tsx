"use client";

import { useState, useEffect, use } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductFormPage({ params }: { params: Promise<{ slug: string[] }> }) {
  // Use React.use to unwrap params since it's a Promise in Next.js 15+
  const resolvedParams = use(params);
  
  const action = resolvedParams.slug[0]; // 'add' or 'edit'
  const id = resolvedParams.slug[1]; // undefined if 'add'
  
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
