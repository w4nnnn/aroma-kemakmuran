import { Category, Product } from "./types";

export const mockCategories: Category[] = [
  { id: "c1", name: "Dupa", slug: "dupa" },
  { id: "c2", name: "Garam Ruqyah Buka Aura", slug: "garam-ruqyah" },
  { id: "c3", name: "Ruwatan Uborampe", slug: "ruwatan-uborampe" },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Dupa Aroma Kemakmuran",
    slug: "dupa-aroma-kemakmuran",
    categoryId: "c1",
    price: 150000,
    description: "<p>Dupa herbal premium isi 30 stick.</p>",
    images: ["/placeholder.jpg"], // Will use next/image with a placeholder later
    shopee_url: "https://shopee.co.id/example",
    is_active: true,
  },
  {
    id: "p2",
    name: "Ruwatan Reguler Komplit",
    slug: "ruwatan-reguler-komplit",
    categoryId: "c3",
    price: 500000,
    description: "<p>Paket ruwatan pembersihan diri.</p>",
    images: ["/placeholder.jpg"],
    is_active: true, // No shopee_url, falls back to WA
  }
];
