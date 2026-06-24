import Link from "next/link";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = mockCategories.find(c => c.slug === resolvedParams.slug);
  
  if (!category) {
    notFound();
  }

  const products = mockProducts.filter(p => p.categoryId === category.id && p.is_active);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl md:text-5xl text-gold-primary mb-12 border-b border-gold-primary/20 pb-6">
        {category.name}
      </h1>
      
      {products.length === 0 ? (
        <p className="text-text-muted">Belum ada produk di kategori ini.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <Link 
              key={product.id} 
              href={`/produk/${product.slug}`}
              className="group flex flex-col bg-maroon-elevated rounded-xl overflow-hidden border border-gold-primary/10 hover:border-gold-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(212,175,55,0.05)]"
            >
              <div className="aspect-[4/3] bg-[#2A0206] relative overflow-hidden">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-gold-primary/30">
                  Foto Produk
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-serif text-xl text-text-primary group-hover:text-gold-primary transition-colors mb-2 line-clamp-2">
                  {product.name}
                </h2>
                <div className="mt-auto pt-4">
                  <span className="font-medium text-gold-primary text-lg">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
