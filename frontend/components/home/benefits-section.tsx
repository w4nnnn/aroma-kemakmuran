"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Wind, Sparkles, Flame, Heart, Droplets } from "lucide-react";

const benefits = [
  { icon: Wind, title: "Pengharum Ruangan" },
  { icon: Heart, title: "Relaksasi & Meditasi" },
  { icon: Flame, title: "Kesan Khidmat" },
  { icon: Sparkles, title: "Energi Positif" },
  { icon: Droplets, title: "Aroma Pilihan" },
];

export function BenefitsSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".benefit-item", 
      { y: 20, opacity: 0 },
      {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
        y: 0, opacity: 1, stagger: 0.1,
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-center font-serif text-3xl md:text-4xl text-gold-primary mb-16 benefit-item">
          Manfaat Penggunaan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {benefits.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-4 benefit-item">
              <div className="w-16 h-16 rounded-full border border-gold-primary/30 flex items-center justify-center bg-maroon-elevated text-gold-primary">
                <b.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-sm md:text-base text-text-primary">{b.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
