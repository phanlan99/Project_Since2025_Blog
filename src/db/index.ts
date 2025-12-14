import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // Import toàn bộ schema

const sql = neon(process.env.DATABASE_URL!);

// Truyền schema vào hàm drizzle
export const db = drizzle(sql, { schema });