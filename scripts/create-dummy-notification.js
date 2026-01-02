/**
 * Create Dummy Notification Script
 * Creates a dummy notification in the database for testing
 * 
 * Usage: 
 *   node scripts/create-dummy-notification.js
 *   node scripts/create-dummy-notification.js <userId>
 */

const mongoose = require('mongoose');

// Load env from .env.local or .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['match', 'message', 'profile_update', 'system', 'match_interest', 'vendor_created', 'customer_started_using_vendor', 'new_listing', 'solution_published', 'proposal_received', 'proposal_accepted', 'proposal_rejected', 'listing_status_changed'],
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    index: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    index: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
  },
  actionUrl: {
    type: String,
    trim: true,
  },
  actionLabel: {
    type: String,
    trim: true,
    maxlength: 50,
  },
}, {
  timestamps: true,
  collection: 'notifications',
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

async function createDummyNotification() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    let mongoUri = process.env.MONGO_DB_URL;
    if (!mongoUri) {
      throw new Error('MONGO_DB_URL environment variable is not set. Please check your .env.local or .env file.');
    }
    
    // Handle connection string formatting
    if (mongoUri.includes('mongodb+srv://')) {
      const atCount = (mongoUri.match(/@/g) || []).length;
      if (atCount > 1) {
        const parts = mongoUri.split('@');
        const credentialsPart = parts[0];
        const hostPart = parts[parts.length - 1];
        const passwordParts = parts.slice(1, -1);
        
        const match = credentialsPart.match(/^mongodb\+srv:\/\/([^:]+):(.+)$/);
        if (match) {
          const username = match[1];
          let password = match[2];
          if (passwordParts.length > 0) {
            password = password + '@' + passwordParts.join('@');
          }
          password = password.replace(/@/g, '%40');
          mongoUri = `mongodb+srv://${username}:${password}@${hostPart}`;
        }
      }
      
      // Ensure database name is "solutions-hub"
      const uriParts = mongoUri.split('?');
      const baseUri = uriParts[0];
      const queryParams = uriParts.length > 1 ? '?' + uriParts[1] : '';
      
      const lastSlashIndex = baseUri.lastIndexOf('/');
      const atIndex = baseUri.lastIndexOf('@');
      
      if (lastSlashIndex > atIndex) {
        mongoUri = baseUri.substring(0, lastSlashIndex + 1) + 'solutions-hub' + queryParams;
      } else {
        mongoUri = baseUri + '/solutions-hub' + queryParams;
      }
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get userId from command line argument or use a default
    const userId = process.argv[2];
    
    if (!userId) {
      console.log('⚠️  No userId provided. Creating notifications for common test users...');
      console.log('   Usage: node scripts/create-dummy-notification.js <userId>');
      console.log('   Example: node scripts/create-dummy-notification.js user_36EAu0ig43tKcJsy7YMTYTYmcIE\n');
      
      // Try to find a user from the database
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      const users = await User.find({}).limit(5).lean();
      
      if (users.length === 0) {
        console.log('❌ No users found in database. Please provide a userId.');
        process.exit(1);
      }
      
      console.log('📋 Found users in database:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.userId || user.clerkId || 'N/A'} (${user.email || 'No email'})`);
      });
      
      // Use the first user's userId
      const firstUser = users[0];
      const testUserId = firstUser.userId || firstUser.clerkId;
      
      if (!testUserId) {
        console.log('❌ Could not find a valid userId. Please provide one as an argument.');
        process.exit(1);
      }
      
      console.log(`\n✅ Using userId: ${testUserId}\n`);
      
      // Create multiple dummy notifications
      const notifications = [
        {
          userId: testUserId,
          type: 'proposal_received',
          title: 'New Proposal Received',
          message: 'You have received a new proposal for your listing. Review it now!',
          isRead: false,
          actionUrl: '/dashboard',
          actionLabel: 'View Proposal',
        },
        {
          userId: testUserId,
          type: 'new_listing',
          title: 'New Listing Match',
          message: 'A new listing matches your solution categories. Check it out!',
          isRead: false,
          actionUrl: '/listings',
          actionLabel: 'View Listing',
        },
        {
          userId: testUserId,
          type: 'system',
          title: 'Welcome to Astro Vault!',
          message: 'This is a test notification. Complete your profile to get started.',
          isRead: false,
          actionUrl: '/dashboard',
          actionLabel: 'Go to Dashboard',
        },
      ];
      
      const created = await Notification.insertMany(notifications);
      console.log(`✅ Successfully created ${created.length} dummy notifications for user: ${testUserId}`);
      created.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} (${notif.type}) - Unread: ${!notif.isRead}`);
      });
      
    } else {
      // Create notifications for the provided userId
      const notifications = [
        {
          userId: userId,
          type: 'proposal_received',
          title: 'New Proposal Received',
          message: 'You have received a new proposal for your listing. Review it now!',
          isRead: false,
          actionUrl: '/dashboard',
          actionLabel: 'View Proposal',
        },
        {
          userId: userId,
          type: 'new_listing',
          title: 'New Listing Match',
          message: 'A new listing matches your solution categories. Check it out!',
          isRead: false,
          actionUrl: '/listings',
          actionLabel: 'View Listing',
        },
        {
          userId: userId,
          type: 'system',
          title: 'Test Notification',
          message: 'This is a test notification created via script.',
          isRead: false,
          actionUrl: '/dashboard',
          actionLabel: 'Go to Dashboard',
        },
      ];
      
      const created = await Notification.insertMany(notifications);
      console.log(`✅ Successfully created ${created.length} dummy notifications for user: ${userId}`);
      created.forEach((notif, index) => {
        console.log(`   ${index + 1}. ${notif.title} (${notif.type}) - Unread: ${!notif.isRead}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating dummy notification:', error);
    process.exit(1);
  }
}

createDummyNotification();

