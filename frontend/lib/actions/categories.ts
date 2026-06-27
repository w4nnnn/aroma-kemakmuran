'use server';

import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0] || null;
}

export async function createCategory(data: { name: string; slug: string }) {
  const result = await db.insert(categories).values(data).returning();
  return result[0];
}

export async function updateCategory(id: string, data: { name: string; slug: string }) {
  const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
  return result[0];
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
}
