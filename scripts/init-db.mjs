/**
 * Database Initialization Script (ES Modules)
 * Run this script to create all collections and indexes in MongoDB
 * 
 * Usage: node scripts/init-db.mjs
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', '.env.local') });
config({ path: join(__dirname, '..', '.env') });

async function initializeDatabase() {
  try {
    const MONGODB_URI = process.env.MONGO_DB_URL;
    
    if (!MONGODB_URI) {
      throw new Error('MONGO_DB_URL environment variable is not set in .env or .env.local');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📦 Creating collections and indexes...\n');

    // Import models dynamically
    const { default: User } = await import('../src/models/User.js');
    const { default: HealthcareInstitution } = await import('../src/models/HealthcareInstitution.js');
    const { default: Vendor } = await import('../src/models/Vendor.js');
    const { default: SolutionCard } = await import('../src/models/SolutionCard.js');
    const { default: Match } = await import('../src/models/Match.js');
    const { default: Message } = await import('../src/models/Message.js');
    const { default: Notification } = await import('../src/models/Notification.js');
    const { default: ActivityLog } = await import('../src/models/ActivityLog.js');
    const { default: SavedSearch } = await import('../src/models/SavedSearch.js');

    // Create all indexes (this also creates collections if they don't exist)
    await User.createIndexes();
    console.log('✅ Users collection initialized');

    await HealthcareInstitution.createIndexes();
    console.log('✅ HealthcareInstitutions collection initialized');

    await Vendor.createIndexes();
    console.log('✅ Vendors collection initialized');

    await SolutionCard.createIndexes();
    console.log('✅ SolutionCards collection initialized');

    await Match.createIndexes();
    console.log('✅ Matches collection initialized');

    await Message.createIndexes();
    console.log('✅ Messages collection initialized');

    await Notification.createIndexes();
    console.log('✅ Notifications collection initialized');

    await ActivityLog.createIndexes();
    console.log('✅ ActivityLogs collection initialized');

    await SavedSearch.createIndexes();
    console.log('✅ SavedSearches collection initialized');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📊 Collections created:');
    console.log('   ✓ users');
    console.log('   ✓ healthcareinstitutions');
    console.log('   ✓ vendors');
    console.log('   ✓ solutioncards');
    console.log('   ✓ matches');
    console.log('   ✓ messages');
    console.log('   ✓ notifications');
    console.log('   ✓ activitylogs');
    console.log('   ✓ savedsearches');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

