"use client";

import { useState, useEffect, use } from "react";
import { useAdmin } from "@/lib/admin-context";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductFormPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = use(params);
  
  const action = resolvedParams.slug[0];
  const id = resolvedParams.slug[1];
  
  const { products, categories, fetchData } = useAdmin();
  const router = useRouter();
  
  const isEdit = action === 'edit' && !!id;
  const existingProduct = isEdit ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: "", slug: "", category: "", price: "", description: "", shopee_url: "", is_active: true
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        slug: existingProduct.slug,
        category: existingProduct.category,
        price: existingProduct.price.toString(),
        description: existingProduct.description,
        shopee_url: existingProduct.shopee_url || "",
        is_active: existingProduct.is_active
      });
    } else if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [existingProduct, categories]);

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
            <Select required value={formData.category} onValueChange={value => setFormData({...formData, category: value})}>
              <SelectTrigger className="w-full bg-[#2A0206] border-[#D4AF37]/30 text-[#FDFBF7] h-[46px] rounded-md px-4 focus:ring-1 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent className="bg-[#3A040A] border-[#D4AF37]/30 text-[#FDFBF7]">
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id} className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37] cursor-pointer">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
