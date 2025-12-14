import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Test connection
    console.log('\n1. Testing connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('   Server time:', result.rows[0].now);

    // Check if tables exist
    console.log('\n2. Checking tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('   Existing tables:', tablesResult.rows.map(r => r.table_name).join(', '));

    // Check users table
    console.log('\n3. Checking users...');
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log('   Users count:', usersResult.rows[0].count);

    // Check projects table
    console.log('\n4. Checking projects...');
    const projectsResult = await pool.query('SELECT COUNT(*) FROM projects');
    console.log('   Projects count:', projectsResult.rows[0].count);

    // Check tasks table
    console.log('\n5. Checking tasks...');
    const tasksResult = await pool.query('SELECT COUNT(*) FROM tasks');
    console.log('   Tasks count:', tasksResult.rows[0].count);

    console.log('\n✅ All checks passed!');
    
  } catch (error) {
    console.error('\n❌ Database error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
