import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('[Storage] Checking if product-media bucket exists...');
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Failed to list buckets:', listError.message);
    process.exit(1);
  }

  const bucketExists = buckets.some(b => b.name === 'product-media');
  
  if (!bucketExists) {
    console.log('[Storage] Creating product-media bucket...');
    const { data, error } = await supabase.storage.createBucket('product-media', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error) {
      console.error('Failed to create bucket:', error.message);
      process.exit(1);
    }
    
    console.log('[Storage] Bucket created successfully!');
  } else {
    console.log('[Storage] product-media bucket already exists.');
    
    // Ensure it's public
    console.log('[Storage] Updating bucket to ensure it is public...');
    await supabase.storage.updateBucket('product-media', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
      fileSizeLimit: 52428800,
    });
  }
}

main().catch(console.error);
