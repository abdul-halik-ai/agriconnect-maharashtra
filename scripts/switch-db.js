const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'sqlite';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const pgSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');

if (target === 'postgres' || target === 'postgresql') {
  if (fs.existsSync(pgSchemaPath)) {
    const content = fs.readFileSync(pgSchemaPath, 'utf8');
    fs.writeFileSync(schemaPath, content, 'utf8');
    console.log('✅ Successfully switched Prisma schema to PostgreSQL provider.');
    console.log('💡 Remember to set DATABASE_URL="postgresql://..." in your .env or Vercel settings.');
  } else {
    console.error('❌ Could not find schema.postgresql.prisma');
  }
} else if (target === 'sqlite') {
  let content = fs.readFileSync(schemaPath, 'utf8');
  content = content.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, 'utf8');
  console.log('✅ Successfully switched Prisma schema to SQLite provider for local development.');
} else {
  console.error('Usage: node scripts/switch-db.js [sqlite|postgres]');
}
