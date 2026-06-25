import { pb, getPbImageUrl } from "@/lib/pocketbase";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  try {
    const product = await pb.collection('products').getFirstListItem(`slug="${resolvedParams.slug}" && is_active=true`);
    const isPhysicalProduct = !!product.shopee_url;

    return (
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="aspect-square bg-maroon-elevated rounded-2xl border border-gold-primary/20 relative overflow-hidden flex items-center justify-center">
            {product.image ? (
               <img src={getPbImageUrl(product.collectionId, product.id, product.image)} alt={product.name} className="object-cover w-full h-full" />
            ) : (
               <span className="text-gold-primary/30 text-lg">Galeri Foto Produk</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="text-3xl text-gold-primary font-medium mb-8">
              Rp {product.price.toLocaleString('id-ID')}
            </div>
            
            <div 
              className="prose prose-invert prose-p:text-text-muted prose-a:text-gold-primary max-w-none mb-10"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            
            <div className="mt-auto pt-8 border-t border-gold-primary/20">
              {isPhysicalProduct ? (
                <Button asChild className="w-full sm:w-auto min-w-[200px]" variant="primary">
                  <a href={product.shopee_url} target="_blank" rel="noopener noreferrer">
                    <ShoppingBag className="mr-2" size={20} />
                    Beli via Shopee
                  </a>
                </Button>
              ) : (
                <Button asChild className="w-full sm:w-auto min-w-[200px]" variant="outline">
                  <a href="https://wa.me/628000000000" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2" size={20} />
                    Konsultasi via WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
