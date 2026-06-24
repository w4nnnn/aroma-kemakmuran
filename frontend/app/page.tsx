import { HeroSection } from "@/components/home/hero-section";
import { ProductDescSection } from "@/components/home/product-desc-section";
import { BenefitsSection } from "@/components/home/benefits-section";
import { CultureSection } from "@/components/home/culture-section";
import { QuoteSection } from "@/components/home/quote-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ProductDescSection />
      <BenefitsSection />
      <CultureSection />
      <QuoteSection />
    </div>
  );
}
