"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // ponytail: True ScrollSmoother requires paid license. 
  // We rely on CSS scroll-smooth for the container, and use GSAP just for entrance animations.
  
  useEffect(() => {
    // Global defaults for animations
    gsap.defaults({ ease: "expo.out", duration: 1 });
  }, []);

  return <>{children}</>;
}
