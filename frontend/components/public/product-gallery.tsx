"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string | string[];
  videos: string | string[];
}

export function ProductGallery({ images, videos }: ProductGalleryProps) {
  // Normalize arrays
  const imageList = images ? (Array.isArray(images) ? images : [images]) : [];
  const videoList = videos ? (Array.isArray(videos) ? videos : [videos]) : [];

  const SUPABASE_STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-media/`;

  const media = [
    ...imageList.map(img => ({ type: 'image', url: `${SUPABASE_STORAGE_URL}${img}` })),
    ...videoList.map(vid => ({ type: 'video', url: `${SUPABASE_STORAGE_URL}${vid}` }))
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (media.length === 0) {
    return (
      <div className="aspect-square bg-maroon-elevated rounded-2xl border border-gold-primary/20 relative overflow-hidden flex items-center justify-center">
        <span className="text-gold-primary/30 text-lg">Galeri Foto Produk</span>
      </div>
    );
  }

  const prev = () => setCurrentIndex(i => (i === 0 ? media.length - 1 : i - 1));
  const next = () => setCurrentIndex(i => (i === media.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display */}
      <div className="aspect-square bg-maroon-elevated rounded-2xl border border-gold-primary/20 relative overflow-hidden flex items-center justify-center group shadow-xl">
        {media[currentIndex].type === 'image' ? (
          <img src={media[currentIndex].url} alt={`Gallery ${currentIndex}`} className="object-cover w-full h-full" />
        ) : (
          <video src={media[currentIndex].url} controls className="object-cover w-full h-full bg-black" />
        )}

        {media.length > 1 && (
          <>
            <button 
              onClick={prev} 
              className="absolute left-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 shadow-md backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next} 
              className="absolute right-4 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 shadow-md backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/40 px-3 py-2 rounded-full backdrop-blur-sm">
              {media.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-gold-primary' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((m, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-gold-primary scale-100 opacity-100' : 'border-transparent opacity-50 hover:opacity-100 scale-95 hover:scale-100'}`}
            >
              {m.type === 'image' ? (
                <img src={m.url} className="w-full h-full object-cover" alt="thumb" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                  <video src={m.url} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-white ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
