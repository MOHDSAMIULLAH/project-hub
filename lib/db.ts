import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Legacy query function for backward compatibility (if needed)
export const query = async (text: string, params?: any[]) => {
  const result = await sql(text, params);
  return {
    rows: result,
    rowCount: result.length,
  };
};

export default db;