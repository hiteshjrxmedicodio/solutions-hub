// IMPORTANT: Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const envPath = resolve(process.cwd(), '.env');
const envLocalPath = resolve(process.cwd(), '.env.local');

// Load .env.local first (takes precedence), then .env
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Verify MONGO_DB_URL is loaded
if (!process.env.MONGO_DB_URL) {
  console.error('❌ Error: MONGO_DB_URL not found in environment variables');
  process.exit(1);
}

console.log('🚀 Starting complete database seed...\n');

const scripts = [
  { name: 'Categories', script: 'seed-categories.ts' },
  { name: 'Integrations', script: 'seed-integrations.ts' },
  { name: 'Specialties', script: 'seed-specialties.ts' },
  { name: 'Solution Cards', script: 'seed-solution-cards.ts' },
];

async function runAllSeeds() {
  try {
    for (const { name, script } of scripts) {
      console.log(`\n📦 Seeding ${name}...`);
      console.log('─'.repeat(50));
      
      try {
        execSync(`npx tsx scripts/${script}`, {
          stdio: 'inherit',
          cwd: process.cwd(),
        });
        console.log(`✅ ${name} seeded successfully`);
      } catch (error) {
        console.error(`❌ Failed to seed ${name}:`, error);
        process.exit(1);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 All seeds completed successfully!');
    console.log('='.repeat(50));
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

runAllSeeds();

