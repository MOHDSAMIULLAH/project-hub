const { Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  // Load environment variables
  require('dotenv').config();

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    console.log('📅 Server time:', testResult.rows[0].now);

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n🔄 Executing schema...');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    console.log('\n📊 Tables created:');
    console.log('  - users');
    console.log('  - projects');
    console.log('  - tasks');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
