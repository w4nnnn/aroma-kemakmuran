"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockCategories } from "@/lib/mock-data";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#2A0206]/80 backdrop-blur-md border-b border-[#D4AF37]/20 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-medium tracking-wide text-gold-primary">
          Aroma Kemakmuran
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {mockCategories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/kategori/${cat.slug}`}
              className="text-sm font-medium text-text-muted hover:text-gold-primary transition-colors py-3 px-2"
            >
              {cat.name}
            </Link>
          ))}
          <a 
            href="#kontak" 
            className="text-sm font-medium text-text-muted hover:text-gold-primary transition-colors py-3 px-2"
          >
            Kontak
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-11 h-11 flex items-center justify-center text-gold-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-maroon-elevated border-b border-[#D4AF37]/20 shadow-xl">
          <nav className="flex flex-col py-4">
            {mockCategories.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/kategori/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 text-text-muted hover:text-gold-primary hover:bg-[#2A0206] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <a 
              href="#kontak" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 text-text-muted hover:text-gold-primary hover:bg-[#2A0206] transition-colors"
            >
              Kontak
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
