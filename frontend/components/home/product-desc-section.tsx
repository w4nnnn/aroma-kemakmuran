"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function ProductDescSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".desc-anim", {
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      stagger: 0.2,
    });
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4 bg-maroon-elevated">
      <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-video md:aspect-square rounded-xl overflow-hidden bg-[#2A0206] border border-gold-primary/20 desc-anim order-2 md:order-1">
           <div className="absolute inset-0 flex items-center justify-center text-gold-primary/50">
             [Gambar Kemasan Fisik 30 Stick]
           </div>
        </div>
        
        <div className="space-y-6 order-1 md:order-2">
          <h2 className="font-serif text-4xl md:text-5xl text-gold-primary desc-anim">Dupa Aroma Kemakmuran</h2>
          <div className="desc-anim space-y-4 text-text-muted leading-relaxed">
            <p>
              Merupakan karya kriya perpaduan antara resep kuno dan teknik modern. Berisikan 30 stick dupa herbal tanpa bahan kimia berbahaya.
            </p>
            <p>
              Setiap batang diproses dengan presisi untuk memastikan durasi bakar yang lama dan penyebaran aroma yang merata di seluruh sudut ruangan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
