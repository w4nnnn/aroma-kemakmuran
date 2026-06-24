"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".hero-anim", {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      delay: 0.2,
    });
  }, { scope: container });

  return (
    <section ref={container} className="min-h-[80vh] flex items-center relative overflow-hidden px-4 py-20">
      {/* Ambient glow blob */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#5C0612]/40 to-[#D4AF37]/10 blur-[100px] rounded-full -z-10 pointer-events-none" />
      
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4 hero-anim">
            <div className="w-12 h-[1px] bg-gold-primary" />
            <span className="text-gold-primary font-medium tracking-widest uppercase text-sm">Profil</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight hero-anim">
            Kemurnian Alam, <br/>
            <span className="text-gold-primary">Ketenangan Jiwa.</span>
          </h1>
          <p className="text-text-muted text-lg leading-relaxed max-w-lg hero-anim">
            Dupa herbal premium yang terinspirasi dari kearifan budaya Nusantara. Dibuat dengan bahan alami pilihan untuk menghadirkan ketenangan, fokus, dan energi positif di setiap hembusan aromanya.
          </p>
        </div>
        
        {/* Placeholder for Hero Image */}
        <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-maroon-elevated border border-gold-primary/20 hero-anim">
           <div className="absolute inset-0 flex items-center justify-center text-gold-primary/50">
             [Gambar Produk Premium]
           </div>
        </div>
      </div>
    </section>
  );
}
