const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  // Load environment variables
  require('dotenv').config();

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    const testResult = await sql`SELECT NOW()`;
    console.log('✅ Database connected successfully');
    console.log('📅 Server time:', testResult[0].now);

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('\n🔄 Executing schema...');
    
    // Execute schema (split by semicolon and execute each statement)
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await sql(statement);
      }
    }
    
    console.log('✅ Database schema created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Detail:', error.detail);
    }
    process.exit(1);
  }
}

initDatabase();
