"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminCategoryPage() {
  const { categories, products, fetchData } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const supabase = createClient();

  // Updated to use category_id instead of category
  const getProductCount = (categoryId: string) => products.filter(p => p.category_id === categoryId).length;

  const handleDelete = async (id: string) => {
    if (getProductCount(id) > 0) {
      alert("Tidak bisa menghapus kategori yang masih memiliki produk!");
      return;
    }
    if (confirm("Hapus kategori ini?")) {
      await supabase.from('categories').delete().eq('id', id);
      fetchData();
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    if (editingId) {
      await supabase.from('categories').update(payload).eq('id', editingId);
    } else {
      await supabase.from('categories').insert(payload);
    }
    
    fetchData();
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
