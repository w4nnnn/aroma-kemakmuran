"use client";

import { Menu } from "lucide-react";

export function AdminTopbar({ onMenuClick, title }: { onMenuClick: () => void; title: string }) {
  return (
    <header className="h-16 bg-[#3A040A] border-b border-[#D4AF37]/20 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-[#D4AF37] p-2 -ml-2"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-serif text-xl text-[#FDFBF7]">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2A0206] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-sm">
          AD
        </div>
      </div>
    </header>
  );
}
