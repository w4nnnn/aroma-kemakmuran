import 'dotenv/config';
import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function seedCategories() {
  const categories = [
    { name: "Dupa", slug: "dupa" },
    { name: "Garam Ruqyah Buka Aura", slug: "garam-ruqyah" },
    { name: "Ruwatan Uborampe", slug: "ruwatan-uborampe" },
  ];

  const createdCategories: Record<string, string> = {};

  console.log('[Seed] Seeding categories...');
  for (const cat of categories) {
    try {
      // Check if exists
      const existing = await pb.collection('categories').getFirstListItem(`slug="${cat.slug}"`).catch(() => null);
      if (existing) {
        console.log(`[Seed] Category '${cat.name}' already exists.`);
        createdCategories[cat.slug] = existing.id;
        continue;
      }

      // Create
      const record = await pb.collection('categories').create(cat);
      console.log(`[Seed] Created category '${cat.name}'.`);
      createdCategories[cat.slug] = record.id;
    } catch (error: any) {
      console.error(`[Seed] Failed to seed category '${cat.name}':`, error.message);
    }
  }

  return createdCategories;
}

async function seedProducts(categoryIds: Record<string, string>) {
  const products = [
    {
      name: "Dupa Aroma Kemakmuran",
      slug: "dupa-aroma-kemakmuran",
      category: categoryIds["dupa"],
      price: 150000,
      description: "<p>Dupa herbal premium isi 30 stick.</p>",
      shopee_url: "https://shopee.co.id/example",
      is_active: true,
    },
    {
      name: "Ruwatan Reguler Komplit",
      slug: "ruwatan-reguler-komplit",
      category: categoryIds["ruwatan-uborampe"],
      price: 500000,
      description: "<p>Paket ruwatan pembersihan diri.</p>",
      shopee_url: "",
      is_active: true,
    }
  ];

  console.log('[Seed] Seeding products...');
  for (const prod of products) {
    if (!prod.category) {
      console.warn(`[Seed] Skipping product '${prod.name}' because its category is missing.`);
      continue;
    }

    try {
      // Check if exists
      const existing = await pb.collection('products').getFirstListItem(`slug="${prod.slug}"`).catch(() => null);
      if (existing) {
        console.log(`[Seed] Product '${prod.name}' already exists.`);
        continue;
      }

      // Create
      await pb.collection('products').create(prod);
      console.log(`[Seed] Created product '${prod.name}'.`);
    } catch (error: any) {
      console.error(`[Seed] Failed to seed product '${prod.name}':`, error.message);
    }
  }
}

async function main() {
  console.log(`[Seed] Connecting to PocketBase at ${pbUrl}...`);
  
  const email = process.env.PB_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.PB_ADMIN_PASSWORD || 'password123';

  try {
    await pb.admins.authWithPassword(email, password);
    console.log('[Seed] Authenticated as admin successfully.');
  } catch (error: any) {
    console.error('[Seed] Failed to authenticate as admin. Please ensure PocketBase is running and credentials are correct.');
    console.error('Error Details:', error.message, error.originalError);
    process.exit(1);
  }

  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);

  console.log('[Seed] Database seeded successfully!');
}

main().catch(console.error);
