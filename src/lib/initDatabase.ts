/**
 * Database Initialization Script
 * 
 * This script ensures all database collections and indexes are created.
 * Run this once after deployment or when setting up a new database.
 */

import connectDB from './db';
import {
  User,
  HealthcareInstitution,
  Vendor,
  SolutionCard,
  Match,
  Message,
  Notification,
  ActivityLog,
  SavedSearch,
} from '@/models';

export async function initializeDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('✓ Database connected');

    // Initialize all models to ensure collections and indexes are created
    console.log('Initializing collections and indexes...');
    
    // These operations will create collections and indexes if they don't exist
    await User.createIndexes();
    console.log('✓ Users collection initialized');
    
    await HealthcareInstitution.createIndexes();
    console.log('✓ HealthcareInstitutions collection initialized');
    
    await Vendor.createIndexes();
    console.log('✓ Vendors collection initialized');
    
    await SolutionCard.createIndexes();
    console.log('✓ SolutionCards collection initialized');
    
    await Match.createIndexes();
    console.log('✓ Matches collection initialized');
    
    await Message.createIndexes();
    console.log('✓ Messages collection initialized');
    
    await Notification.createIndexes();
    console.log('✓ Notifications collection initialized');
    
    await ActivityLog.createIndexes();
    console.log('✓ ActivityLogs collection initialized');
    
    await SavedSearch.createIndexes();
    console.log('✓ SavedSearches collection initialized');

    console.log('✓ Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization successful');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

