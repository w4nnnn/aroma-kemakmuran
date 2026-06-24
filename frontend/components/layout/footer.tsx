import Link from "next/link";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A0103] border-t border-gold-primary/10 pt-16 pb-8 px-4 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-gold-primary">Aroma Kemakmuran</h3>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Menghadirkan keharuman dan energi positif Nusantara langsung ke ruangan Anda.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-text-primary mb-4">Navigasi</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Beranda</Link></li>
            <li><Link href="/kategori/dupa" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Dupa</Link></li>
            <li><Link href="/kategori/garam-ruqyah" className="text-sm text-text-muted hover:text-gold-primary transition-colors">Garam Ruqyah</Link></li>
          </ul>
        </div>

        <div id="kontak">
          <h4 className="font-medium text-text-primary mb-4">Hubungi Kami</h4>
          <div className="flex gap-4">
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-11 h-11 rounded-full bg-maroon-elevated flex items-center justify-center text-gold-primary hover:bg-gold-primary hover:text-maroon-base transition-colors">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto pt-8 border-t border-white/5 text-center text-sm text-white/30">
        &copy; {new Date().getFullYear()} Aroma Kemakmuran. Hak cipta dilindungi.
      </div>
    </footer>
  );
}
