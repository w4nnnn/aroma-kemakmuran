import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need the service role key to bypass RLS for seeding, or just rely on RLS if anon key is enough
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Seed] Missing Supabase URL or Key in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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
      const { data: existing, error: fetchError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', cat.slug)
        .single();

      if (existing) {
        console.log(`[Seed] Category '${cat.name}' already exists.`);
        createdCategories[cat.slug] = existing.id;
        continue;
      }

      // Create
      const { data: record, error: createError } = await supabase
        .from('categories')
        .insert(cat)
        .select('id')
        .single();

      if (createError) throw createError;

      if (record) {
        console.log(`[Seed] Created category '${cat.name}'.`);
        createdCategories[cat.slug] = record.id;
      }
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
      category_id: categoryIds["dupa"],
      price: 150000,
      description: "<p>Dupa herbal premium isi 30 stick.</p>",
      shopee_url: "https://shopee.co.id/example",
      is_active: true,
    },
    {
      name: "Ruwatan Reguler Komplit",
      slug: "ruwatan-reguler-komplit",
      category_id: categoryIds["ruwatan-uborampe"],
      price: 500000,
      description: "<p>Paket ruwatan pembersihan diri.</p>",
      shopee_url: "",
      is_active: true,
    }
  ];

  console.log('[Seed] Seeding products...');
  for (const prod of products) {
    if (!prod.category_id) {
      console.warn(`[Seed] Skipping product '${prod.name}' because its category is missing.`);
      continue;
    }

    try {
      // Check if exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', prod.slug)
        .single();

      if (existing) {
        console.log(`[Seed] Product '${prod.name}' already exists.`);
        continue;
      }

      // Create
      const { error: createError } = await supabase
        .from('products')
        .insert(prod);

      if (createError) throw createError;
      
      console.log(`[Seed] Created product '${prod.name}'.`);
    } catch (error: any) {
      console.error(`[Seed] Failed to seed product '${prod.name}':`, error.message);
    }
  }
}

async function main() {
  console.log(`[Seed] Connecting to Supabase at ${supabaseUrl}...`);
  
  // Note: if you only have anon key, you might need to authenticate first depending on RLS.
  // If RLS allows public inserts, or if you use service_role_key, auth isn't strictly necessary.
  
  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);

  console.log('[Seed] Database seeded successfully!');
}

main().catch(console.error);
