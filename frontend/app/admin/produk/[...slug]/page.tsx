"use client";

import { useState, useEffect, use } from "react";
import { useAdmin } from "@/lib/admin-context";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<{ url: string, isExisting: boolean, name: string }[]>([]);
  const [previewVideos, setPreviewVideos] = useState<{ url: string, isExisting: boolean, name: string }[]>([]);
  const [removeMedia, setRemoveMedia] = useState<{ images: string[], videos: string[] }>({ images: [], videos: [] });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    if (isEdit && products.length === 0) return;
    if (!isEdit && categories.length === 0) return;

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
      
      if (existingProduct.image) {
        const images = Array.isArray(existingProduct.image) ? existingProduct.image : [existingProduct.image];
        setPreviewImages(images.map(img => ({ url: pb.files.getUrl(existingProduct, img), isExisting: true, name: img })));
      }
      if (existingProduct.video) {
        const videos = Array.isArray(existingProduct.video) ? existingProduct.video : [existingProduct.video];
        setPreviewVideos(videos.map(vid => ({ url: pb.files.getUrl(existingProduct, vid), isExisting: true, name: vid })));
      }
      setIsInitialized(true);
    } else if (!isEdit && categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0].id }));
      setIsInitialized(true);
    }
  }, [existingProduct, categories, isEdit, isInitialized, products.length]);

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

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => formDataObj.append('image', file));
    }

    if (videoFiles.length > 0) {
      videoFiles.forEach(file => formDataObj.append('video', file));
    }

    try {
      if (isEdit) {
        if (removeMedia.images.length > 0) {
           await pb.collection('products').update(id, { "image-": removeMedia.images });
        }
        if (removeMedia.videos.length > 0) {
           await pb.collection('products').update(id, { "video-": removeMedia.videos });
        }
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

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Foto Produk</label>
            <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-lg p-4 flex flex-col gap-4 bg-[#2A0206] min-h-[160px]">
              
              <div className="grid grid-cols-2 gap-4">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden group">
                    <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => { 
                        setPreviewImages(prev => prev.filter((_, i) => i !== idx));
                        if (img.isExisting) {
                          setRemoveMedia(p => ({ ...p, images: [...p.images, img.name] }));
                        } else {
                          setImageFiles(prev => prev.filter(f => f.name !== img.name));
                        }
                      }} className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                <label className="border-2 border-dashed border-[#D4AF37]/50 rounded-md flex flex-col items-center justify-center gap-2 aspect-square cursor-pointer hover:bg-[#D4AF37]/5 transition-colors">
                  <ImageIcon className="text-[#D4AF37]/50" size={24} />
                  <span className="text-[10px] text-[#F5F2EB]/60 text-center px-2">Tambah Gambar</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImageFiles(prev => [...prev, ...files]);
                    setPreviewImages(prev => [
                      ...prev, 
                      ...files.map(file => ({ url: URL.createObjectURL(file), isExisting: false, name: file.name }))
                    ]);
                  }} />
                </label>
              </div>

            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[#F5F2EB]">Video Produk (Opsional)</label>
            <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-lg p-4 flex flex-col gap-4 bg-[#2A0206] min-h-[160px]">
              
              <div className="flex flex-col gap-4">
                {previewVideos.map((vid, idx) => (
                  <div key={idx} className="relative aspect-video rounded-md overflow-hidden group">
                    <video src={vid.url} className="w-full h-full object-cover bg-black" controls />
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => { 
                        setPreviewVideos(prev => prev.filter((_, i) => i !== idx));
                        if (vid.isExisting) {
                          setRemoveMedia(p => ({ ...p, videos: [...p.videos, vid.name] }));
                        } else {
                          setVideoFiles(prev => prev.filter(f => f.name !== vid.name));
                        }
                      }} className="bg-red-500/80 text-white p-1.5 rounded-full hover:bg-red-500 shadow-md">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <label className="border-2 border-dashed border-[#D4AF37]/50 rounded-md py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#D4AF37]/5 transition-colors">
                  <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-[#D4AF37]/50 ml-1" />
                  </div>
                  <span className="text-xs text-[#F5F2EB]/60">Tambah Video</span>
                  <input type="file" accept="video/mp4,video/webm" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setVideoFiles(prev => [...prev, ...files]);
                    setPreviewVideos(prev => [
                      ...prev, 
                      ...files.map(file => ({ url: URL.createObjectURL(file), isExisting: false, name: file.name }))
                    ]);
                  }} />
                </label>
              </div>

            </div>
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
