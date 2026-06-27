"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

export function HeroSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".hero-anim", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, delay: 0.2 }
    );
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
        
        {/* Hero Image */}
        <div className="relative w-full mx-auto max-w-md md:max-w-none aspect-square md:aspect-[4/3] rounded-xl overflow-hidden bg-maroon-elevated border border-gold-primary/20 hero-anim shadow-2xl shadow-black/50">
          <Image
            src="/hero.jpg"
            alt="Dupa herbal premium Aroma Kemakmuran yang menyala dengan asap yang menenangkan"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
