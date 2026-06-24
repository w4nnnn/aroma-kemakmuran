"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Quote } from "lucide-react";

export function QuoteSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(".quote-anim", 
      { scale: 0.95, opacity: 0 },
      {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        scale: 1, opacity: 1, duration: 1,
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="py-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto max-w-4xl quote-anim relative">
        <div className="absolute -top-8 -left-4 text-gold-primary/20">
          <Quote size={80} className="rotate-180" />
        </div>
        <div className="border-y border-gold-primary/30 py-12 px-8 md:px-16 text-center">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-text-primary">
            "Merawat tradisi bukan sekadar mengulang masa lalu, tetapi <span className="text-gold-primary">menghidupkan kembali nilai spiritual</span> di tengah laju zaman."
          </p>
        </div>
        <div className="absolute -bottom-10 -right-4 text-gold-primary/20">
          <Quote size={80} />
        </div>
      </div>
    </section>
  );
}
