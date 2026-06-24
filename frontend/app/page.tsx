import { HeroSection } from "@/components/home/hero-section";
import { ProductDescSection } from "@/components/home/product-desc-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProductDescSection />
      {/* Sections 3, 4, 5 will follow */}
    </div>
  );
}
