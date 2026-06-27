import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import postgres from 'postgres';

async function main() {
  console.log('[Policy] Connecting to database...');
  const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

  try {
    // Drop existing overly-permissive policies
    console.log('[Policy] Removing old public policies (if any)...');
    await sql`DROP POLICY IF EXISTS "Allow public insert to product-media" ON storage.objects;`.catch(() => {});
    await sql`DROP POLICY IF EXISTS "Allow public update to product-media" ON storage.objects;`.catch(() => {});
    await sql`DROP POLICY IF EXISTS "Allow public delete from product-media" ON storage.objects;`.catch(() => {});

    // 1. Allow public read access
    console.log('[Policy] Setting up SELECT policy (Public)...');
    await sql`
      CREATE POLICY "Allow public select from product-media" 
      ON storage.objects FOR SELECT 
      USING ( bucket_id = 'product-media' );
    `.catch(e => {
      if (e.message.includes('already exists')) console.log('[Policy] SELECT policy already exists');
      else throw e;
    });

    // 2. Allow authenticated users to insert
    console.log('[Policy] Setting up INSERT policy (Authenticated only)...');
    await sql`
      CREATE POLICY "Allow authenticated insert to product-media" 
      ON storage.objects FOR INSERT 
      TO authenticated
      WITH CHECK ( bucket_id = 'product-media' );
    `.catch(e => {
      if (e.message.includes('already exists')) console.log('[Policy] INSERT policy already exists');
      else throw e;
    });
    
    // 3. Allow authenticated users to update
    console.log('[Policy] Setting up UPDATE policy (Authenticated only)...');
    await sql`
      CREATE POLICY "Allow authenticated update to product-media" 
      ON storage.objects FOR UPDATE 
      TO authenticated
      USING ( bucket_id = 'product-media' );
    `.catch(e => {
      if (e.message.includes('already exists')) console.log('[Policy] UPDATE policy already exists');
      else throw e;
    });
    
    // 4. Allow authenticated users to delete
    console.log('[Policy] Setting up DELETE policy (Authenticated only)...');
    await sql`
      CREATE POLICY "Allow authenticated delete from product-media" 
      ON storage.objects FOR DELETE 
      TO authenticated
      USING ( bucket_id = 'product-media' );
    `.catch(e => {
      if (e.message.includes('already exists')) console.log('[Policy] DELETE policy already exists');
      else throw e;
    });

    console.log('[Policy] Secure authentication policies applied successfully!');
  } catch (error: any) {
    console.error('Failed to apply policies:', error.message);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
