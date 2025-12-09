/**
 * Database Initialization Script
 * Run this script to create all collections and indexes in MongoDB
 * 
 * Usage: node scripts/init-db.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import all models to ensure they're registered
const User = require('../src/models/User').default;
const HealthcareInstitution = require('../src/models/HealthcareInstitution').default;
const Vendor = require('../src/models/Vendor').default;
const SolutionCard = require('../src/models/SolutionCard').default;
const Match = require('../src/models/Match').default;
const Message = require('../src/models/Message').default;
const Notification = require('../src/models/Notification').default;
const ActivityLog = require('../src/models/ActivityLog').default;
const SavedSearch = require('../src/models/SavedSearch').default;

async function initializeDatabase() {
  try {
    const MONGODB_URI = process.env.MONGO_DB_URL;
    
    if (!MONGODB_URI) {
      throw new Error('MONGO_DB_URL environment variable is not set');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📦 Creating collections and indexes...\n');

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
    console.log('   - users');
    console.log('   - healthcareinstitutions');
    console.log('   - vendors');
    console.log('   - solutioncards');
    console.log('   - matches');
    console.log('   - messages');
    console.log('   - notifications');
    console.log('   - activitylogs');
    console.log('   - savedsearches');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

