'use server';

import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function getProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getActiveProductsByCategory(categoryId: string) {
  return db.select().from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));
}

export async function getActiveProductBySlug(slug: string) {
  const result = await db.select().from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return result[0] || null;
}

export async function createProduct(data: {
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  description?: string;
  shopeeUrl?: string;
  isActive?: boolean;
  image?: string[];
  video?: string[];
}) {
  // Map to snake_case column names via schema
  const result = await db.insert(products).values({
    name: data.name,
    slug: data.slug,
    categoryId: data.categoryId,
    price: data.price,
    description: data.description || null,
    shopeeUrl: data.shopeeUrl || null,
    isActive: data.isActive ?? true,
    image: data.image || [],
    video: data.video || [],
  }).returning();
  return result[0];
}

export async function updateProduct(id: string, data: {
  name?: string;
  slug?: string;
  categoryId?: string;
  price?: string;
  description?: string;
  shopeeUrl?: string;
  isActive?: boolean;
  image?: string[];
  video?: string[];
}) {
  const result = await db.update(products).set(data).where(eq(products.id, id)).returning();
  return result[0];
}

export async function deleteProduct(id: string) {
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const product = result[0];
  await db.delete(products).where(eq(products.id, id));
  return product; // Return deleted product so caller can clean up storage
}
