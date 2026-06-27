import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password123';

  console.log(`[Admin] Creating admin user: ${email}`);

  // Check if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('[Admin] Failed to list users:', listError.message);
    process.exit(1);
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    console.log('[Admin] User already exists. Updating password...');
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
    if (error) {
      console.error('[Admin] Failed to update password:', error.message);
      process.exit(1);
    }
    console.log('[Admin] Password updated successfully.');
    process.exit(0);
  }

  // Create new admin user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    console.error('[Admin] Failed to create user:', error.message);
    process.exit(1);
  }

  console.log('[Admin] Admin user created successfully!');
  console.log('[Admin] User ID:', data.user?.id);
  process.exit(0);
}

createAdmin();
