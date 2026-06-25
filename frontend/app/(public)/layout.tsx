import { Header } from "@/components/layout/header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col pt-[80px]">
      <Header />
      <main className="flex-grow">
        <SmoothScroll>{children}</SmoothScroll>
      </main>
      <Footer />
    </div>
  );
}
