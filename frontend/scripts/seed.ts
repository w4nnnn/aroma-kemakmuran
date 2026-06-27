import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories, products } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function seedCategories() {
  const seedData = [
    { name: "Dupa", slug: "dupa" },
    { name: "Garam Ruqyah Buka Aura", slug: "garam-ruqyah" },
    { name: "Ruwatan Uborampe", slug: "ruwatan-uborampe" },
  ];

  const createdCategories: Record<string, string> = {};

  console.log('[Seed] Seeding categories...');
  for (const cat of seedData) {
    try {
      const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, cat.slug)).limit(1);
      if (existing.length > 0) {
        console.log(`[Seed] Category '${cat.name}' already exists.`);
        createdCategories[cat.slug] = existing[0].id;
        continue;
      }
      const result = await db.insert(categories).values(cat).returning({ id: categories.id });
      console.log(`[Seed] Created category '${cat.name}'.`);
      createdCategories[cat.slug] = result[0].id;
    } catch (error: any) {
      console.error(`[Seed] Failed to seed category '${cat.name}':`, error.message);
    }
  }
  return createdCategories;
}

async function seedProducts(categoryIds: Record<string, string>) {
  const seedData = [
    {
      name: "Dupa Aroma Kemakmuran",
      slug: "dupa-aroma-kemakmuran",
      categoryId: categoryIds["dupa"],
      price: "150000",
      description: "<p>Dupa herbal premium isi 30 stick.</p>",
      shopeeUrl: "https://shopee.co.id/example",
      isActive: true,
    },
    {
      name: "Ruwatan Reguler Komplit",
      slug: "ruwatan-reguler-komplit",
      categoryId: categoryIds["ruwatan-uborampe"],
      price: "500000",
      description: "<p>Paket ruwatan pembersihan diri.</p>",
      shopeeUrl: "",
      isActive: true,
    }
  ];

  console.log('[Seed] Seeding products...');
  for (const prod of seedData) {
    if (!prod.categoryId) {
      console.warn(`[Seed] Skipping product '${prod.name}' — category missing.`);
      continue;
    }
    try {
      const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, prod.slug)).limit(1);
      if (existing.length > 0) {
        console.log(`[Seed] Product '${prod.name}' already exists.`);
        continue;
      }
      await db.insert(products).values(prod);
      console.log(`[Seed] Created product '${prod.name}'.`);
    } catch (error: any) {
      console.error(`[Seed] Failed to seed product '${prod.name}':`, error.message);
    }
  }
}

async function main() {
  console.log('[Seed] Connecting to database...');
  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);
  console.log('[Seed] Database seeded successfully!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
