import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dupa Aroma Kemakmuran",
  description: "Dupa herbal premium Nusantara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${playfair.variable} ${montserrat.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#2A0206] text-[#FDFBF7] selection:bg-[#D4AF37] selection:text-[#2A0206] min-h-screen flex flex-col pt-[80px]">
        <Header />
        <main className="flex-grow">
          <SmoothScroll>{children}</SmoothScroll>
        </main>
        {/* Footer will go here */}
      </body>
    </html>
  );
}
