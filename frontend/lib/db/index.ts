import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// ponytail: single global connection for serverless, upgrade to pool if throughput matters
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
