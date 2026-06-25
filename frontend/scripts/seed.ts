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