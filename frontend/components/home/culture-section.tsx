"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const cultures = [
  { title: "Tradisi Dupa", desc: "Simbol penyucian dan doa." },
  { title: "Ruwatan", desc: "Pembersihan diri dari energi negatif." },
  { title: "Buka Aura", desc: "Memancarkan karisma positif." },
  { title: "Mustika Bertuah", desc: "Penguat perlindungan diri." },
];

export function CultureSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".culture-card", 
      { y: 30, opacity: 0 },
      {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 0, opacity: 1, stagger: 0.15,
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 bg-maroon-elevated">
      <div className="container mx-auto">
        <div className="text-center mb-16 culture-card">
          <h2 className="font-serif text-3xl md:text-4xl text-gold-primary mb-4">Nilai Budaya</h2>
          <p className="text-text-muted max-w-2xl mx-auto">Merawat peninggalan leluhur melalui praktik yang diwariskan turun-temurun.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultures.map((c, i) => (
            <div key={i} className="culture-card p-6 rounded-2xl border border-gold-primary/20 bg-[#2A0206] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)] hover:border-gold-primary/40 group flex flex-col items-center text-center">
              {/* Ornamen Lingkaran */}
              <div className="w-20 h-20 rounded-full border-2 border-gold-primary/30 flex items-center justify-center mb-6 relative overflow-hidden group-hover:border-gold-primary transition-colors">
                 <div className="w-16 h-16 rounded-full bg-maroon-elevated border border-gold-primary/20 flex items-center justify-center">
                   <span className="text-gold-primary/50 text-xs">img</span>
                 </div>
              </div>
              <h3 className="font-serif text-xl text-gold-primary mb-3">{c.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
