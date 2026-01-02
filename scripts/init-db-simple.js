/**
 * Database Initialization Script
 * Creates all collections and indexes
 * 
 * Usage: node scripts/init-db-simple.js
 */

const mongoose = require('mongoose');

// Load env from .env.local or .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

let MONGODB_URI = process.env.MONGO_DB_URL;

// Fix connection string if password contains unencoded @ character
if (MONGODB_URI && MONGODB_URI.includes('mongodb+srv://')) {
  const atCount = (MONGODB_URI.match(/@/g) || []).length;
  if (atCount > 1) {
    const parts = MONGODB_URI.split('@');
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
      MONGODB_URI = `mongodb+srv://${username}:${password}@${hostPart}`;
    }
  }
  
  // Ensure database name is "solutions-hub"
  const uriParts = MONGODB_URI.split('?');
  const baseUri = uriParts[0];
  const queryParams = uriParts.length > 1 ? '?' + uriParts[1] : '';
  
  const lastSlashIndex = baseUri.lastIndexOf('/');
  const atIndex = baseUri.lastIndexOf('@');
  
  if (lastSlashIndex > atIndex) {
    MONGODB_URI = baseUri.substring(0, lastSlashIndex + 1) + 'solutions-hub' + queryParams;
  } else {
    MONGODB_URI = baseUri + '/solutions-hub' + queryParams;
  }
}

async function init() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const db = mongoose.connection.db;
    console.log('📦 Creating collections and indexes...\n');

    // Create collections and indexes using mongoose directly
    // This approach works without requiring TypeScript files

    // 1. Users
    const UserSchema = new mongoose.Schema({
      userId: { type: String, required: true, unique: true },
      clerkId: { type: String, required: true, unique: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      emailVerified: { type: Boolean, default: false },
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      imageUrl: { type: String, trim: true },
      role: { type: String, enum: ['customer', 'vendor', 'superadmin', null], default: null },
      hasInstitutionProfile: { type: Boolean, default: false },
      hasVendorProfile: { type: Boolean, default: false },
      profileCompletedAt: { type: Date },
      preferences: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        marketingEmails: { type: Boolean, default: false },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'UTC' },
      },
      isActive: { type: Boolean, default: true },
      lastLoginAt: { type: Date },
      lastActivityAt: { type: Date },
      signUpSource: { type: String },
      metadata: { type: mongoose.Schema.Types.Mixed },
    }, { timestamps: true, collection: 'users' });
    
    // Only add indexes that aren't already created by unique: true
    UserSchema.index({ email: 1 });
    UserSchema.index({ role: 1 });
    UserSchema.index({ isActive: 1 });
    UserSchema.index({ role: 1, isActive: 1 });
    UserSchema.index({ hasInstitutionProfile: 1, hasVendorProfile: 1 });
    
    const User = mongoose.model('User', UserSchema);
    try {
      await User.createIndexes();
    } catch (err) {
      // Indexes may already exist, that's okay
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ users');

    // 2. HealthcareInstitutions
    const HealthcareInstitutionSchema = new mongoose.Schema({}, { timestamps: true, collection: 'healthcareinstitutions' });
    const HealthcareInstitution = mongoose.model('HealthcareInstitution', HealthcareInstitutionSchema);
    try {
      await HealthcareInstitution.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ healthcareinstitutions');

    // 3. Vendors
    const VendorSchema = new mongoose.Schema({}, { timestamps: true, collection: 'vendors' });
    const Vendor = mongoose.model('Vendor', VendorSchema);
    try {
      await Vendor.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ vendors');

    // 4. SolutionCards
    const SolutionCardSchema = new mongoose.Schema({
      id: { type: Number, required: true, unique: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String },
      cols: { type: Number, required: true },
      rows: { type: Number, required: true },
    }, { timestamps: true, collection: 'solutioncards' });
    // id already has unique index, only add category index
    SolutionCardSchema.index({ category: 1 });
    const SolutionCard = mongoose.model('SolutionCard', SolutionCardSchema);
    try {
      await SolutionCard.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ solutioncards');

    // 5. Matches
    const MatchSchema = new mongoose.Schema({
      institutionId: { type: String, required: true },
      vendorId: { type: String, required: true },
      solutionCardId: { type: Number },
      matchScore: { type: Number, default: 0 },
      matchReasons: [{ type: String }],
      status: { type: String, enum: ['pending', 'viewed', 'interested', 'not_interested', 'contacted', 'in_negotiation', 'closed'], default: 'pending' },
      institutionViewedAt: { type: Date },
      vendorViewedAt: { type: Date },
      institutionInterestedAt: { type: Date },
      vendorInterestedAt: { type: Date },
      firstContactAt: { type: Date },
      lastInteractionAt: { type: Date },
      institutionNotes: { type: String },
      vendorNotes: { type: String },
      adminNotes: { type: String },
    }, { timestamps: true, collection: 'matches' });
    MatchSchema.index({ institutionId: 1, vendorId: 1 }, { unique: true });
    MatchSchema.index({ institutionId: 1 });
    MatchSchema.index({ vendorId: 1 });
    MatchSchema.index({ status: 1 });
    MatchSchema.index({ matchScore: -1 });
    MatchSchema.index({ createdAt: -1 });
    const Match = mongoose.model('Match', MatchSchema);
    try {
      await Match.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ matches');

    // 6. Messages
    const MessageSchema = new mongoose.Schema({
      matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
      senderId: { type: String, required: true },
      receiverId: { type: String, required: true },
      senderRole: { type: String, enum: ['buyer', 'seller'], required: true },
      subject: { type: String },
      content: { type: String, required: true },
      messageType: { type: String, enum: ['initial', 'reply', 'system'], default: 'reply' },
      isRead: { type: Boolean, default: false },
      readAt: { type: Date },
      isDeletedBySender: { type: Boolean, default: false },
      isDeletedByReceiver: { type: Boolean, default: false },
      attachments: [{ type: String }],
    }, { timestamps: true, collection: 'messages' });
    MessageSchema.index({ matchId: 1, createdAt: -1 });
    MessageSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
    MessageSchema.index({ senderId: 1, createdAt: -1 });
    const Message = mongoose.model('Message', MessageSchema);
    try {
      await Message.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ messages');

    // 7. Notifications
    const NotificationSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      type: { type: String, enum: ['match', 'message', 'profile_update', 'system', 'match_interest'], required: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
      isRead: { type: Boolean, default: false },
      readAt: { type: Date },
      actionUrl: { type: String },
      actionLabel: { type: String },
    }, { timestamps: true, collection: 'notifications' });
    NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
    NotificationSchema.index({ userId: 1, type: 1 });
    const Notification = mongoose.model('Notification', NotificationSchema);
    try {
      await Notification.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ notifications');

    // 8. ActivityLogs
    const ActivityLogSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      userRole: { type: String, enum: ['buyer', 'seller'], required: true },
      action: { type: String, required: true },
      entityType: { type: String, enum: ['user', 'institution', 'vendor', 'match', 'message', 'solution'], required: true },
      entityId: { type: String, required: true },
      metadata: { type: mongoose.Schema.Types.Mixed },
      ipAddress: { type: String },
      userAgent: { type: String },
    }, { timestamps: { createdAt: true, updatedAt: false }, collection: 'activitylogs' });
    ActivityLogSchema.index({ userId: 1, createdAt: -1 });
    ActivityLogSchema.index({ action: 1, createdAt: -1 });
    ActivityLogSchema.index({ entityType: 1, entityId: 1 });
    const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
    try {
      await ActivityLog.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ activitylogs');

    // 9. SavedSearches
    const SavedSearchSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      userRole: { type: String, enum: ['buyer', 'seller'], required: true },
      name: { type: String, required: true },
      searchCriteria: { type: mongoose.Schema.Types.Mixed },
      lastResultCount: { type: Number },
      lastSearchedAt: { type: Date },
      isActive: { type: Boolean, default: true },
    }, { timestamps: true, collection: 'savedsearches' });
    SavedSearchSchema.index({ userId: 1, isActive: 1 });
    SavedSearchSchema.index({ userId: 1, createdAt: -1 });
    const SavedSearch = mongoose.model('SavedSearch', SavedSearchSchema);
    try {
      await SavedSearch.createIndexes();
    } catch (err) {
      if (!err.message.includes('existing index')) {
        throw err;
      }
    }
    console.log('✅ savedsearches');

    console.log('\n🎉 All collections and indexes created successfully!');
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
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

init();
