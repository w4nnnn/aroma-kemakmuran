# Database Seed Script Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone Node.js/TypeScript script to populate the PocketBase database with initial categories and products.

**Architecture:** A TypeScript file run via `tsx` or `ts-node` that authenticates with PocketBase using the JS SDK, checks for existing records to prevent duplicates, and inserts the required seed data.

**Tech Stack:** Node.js, TypeScript, `pocketbase`, `dotenv`, `tsx` (for executing TS files directly).

## Global Constraints

- Target directory: `frontend/` (all paths below are relative to this unless stated otherwise)
- Seed File Location: `frontend/scripts/seed.ts`
- Use the official `pocketbase` npm SDK.
- Auth: Authenticate as an admin using credentials from env vars (`PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD`).
- Prevent Duplicates: Check if a record with the same slug exists before inserting.

---

### Task 1: Setup Script Environment & Dependencies

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/scripts/seed.ts`

**Interfaces:**
- Produces: Executable npm script `npm run seed` that runs the TypeScript file.

- [ ] **Step 1: Install executor and dotenv**
Install `tsx` (a lightweight TypeScript executor) and `dotenv`.
```bash
cd frontend && npm install -D tsx dotenv
```

- [ ] **Step 2: Add npm script**
Modify `frontend/package.json` to add the seed script to the `"scripts"` block:
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "tsx scripts/seed.ts"
  }
```

- [ ] **Step 3: Create script scaffold**
Create `frontend/scripts/seed.ts` with basic setup:
```typescript
import 'dotenv/config';
import PocketBase from 'pocketbase';

// Default to localhost if run outside docker
const pbUrl = process.env.NEXT_PUBLIC_PB_URL || 'http://127.0.0.1:8090';
const pb = new PocketBase(pbUrl);

async function main() {
  console.log(`[Seed] Connecting to PocketBase at ${pbUrl}...`);
  
  const email = process.env.PB_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.PB_ADMIN_PASSWORD || 'password123';

  try {
    await pb.admins.authWithPassword(email, password);
    console.log('[Seed] Authenticated as admin successfully.');
  } catch (error) {
    console.error('[Seed] Failed to authenticate as admin. Please ensure PocketBase is running and credentials are correct.');
    console.error(error);
    process.exit(1);
  }

  // Placeholder for seed logic
  console.log('[Seed] Database seeded successfully!');
}

main().catch(console.error);
```

- [ ] **Step 4: Commit**
```bash
cd frontend && git add package.json package-lock.json scripts/seed.ts
git commit -m "feat: setup database seed script environment"
```

---

### Task 2: Implement Seed Logic (Categories & Products)

**Files:**
- Modify: `frontend/scripts/seed.ts`

**Interfaces:**
- Consumes: The `pb` authenticated client.
- Produces: Database records for 3 categories and 2 products.

- [ ] **Step 1: Write Category and Product Seed Logic**
Modify `frontend/scripts/seed.ts` to include the insertion logic:

```typescript
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
  } catch (error) {
    console.error('[Seed] Failed to authenticate as admin. Please ensure PocketBase is running and credentials are correct.');
    console.error('Use the PocketBase Admin UI to create the first admin user matching these credentials.');
    process.exit(1);
  }

  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);

  console.log('[Seed] Database seeded successfully!');
}

main().catch(console.error);
```

- [ ] **Step 2: Commit**
```bash
cd frontend && git add scripts/seed.ts
git commit -m "feat: implement database seed logic for categories and products"
```
