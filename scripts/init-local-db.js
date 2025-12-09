/**
 * MongoDB Shell Script to Initialize Local Database
 * Creates all collections and indexes for the Healthcare AI Solutions Hub
 * 
 * Usage: In mongosh, run: load('scripts/init-local-db.js')
 * Or: mongosh < scripts/init-local-db.js
 */

// Switch to local database
db = db.getSiblingDB('local');

print('🔌 Connected to local database');
print('📦 Creating collections and indexes...\n');

// 1. Users Collection
print('Creating users collection...');
db.createCollection('users');
db.users.createIndex({ userId: 1 }, { unique: true });
db.users.createIndex({ clerkId: 1 }, { unique: true });
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });
db.users.createIndex({ hasInstitutionProfile: 1 });
db.users.createIndex({ hasVendorProfile: 1 });
db.users.createIndex({ lastLoginAt: 1 });
db.users.createIndex({ lastActivityAt: 1 });
db.users.createIndex({ firstName: 1 });
db.users.createIndex({ lastName: 1 });
db.users.createIndex({ role: 1, isActive: 1 });
db.users.createIndex({ email: 1, isActive: 1 });
db.users.createIndex({ hasInstitutionProfile: 1, hasVendorProfile: 1 });
print('✅ users collection created with indexes\n');

// 2. Healthcare Institutions Collection
print('Creating healthcareinstitutions collection...');
db.createCollection('healthcareinstitutions');
db.healthcareinstitutions.createIndex({ userId: 1 }, { unique: true });
db.healthcareinstitutions.createIndex({ status: 1 });
db.healthcareinstitutions.createIndex({ institutionType: 1 });
print('✅ healthcareinstitutions collection created with indexes\n');

// 3. Vendors Collection
print('Creating vendors collection...');
db.createCollection('vendors');
db.vendors.createIndex({ userId: 1 }, { unique: true });
db.vendors.createIndex({ status: 1 });
db.vendors.createIndex({ solutionCategory: 1 });
db.vendors.createIndex({ targetSpecialties: 1 });
print('✅ vendors collection created with indexes\n');

// 4. Solution Cards Collection
print('Creating solutioncards collection...');
db.createCollection('solutioncards');
db.solutioncards.createIndex({ id: 1 }, { unique: true });
db.solutioncards.createIndex({ category: 1 });
print('✅ solutioncards collection created with indexes\n');

// 5. Matches Collection
print('Creating matches collection...');
db.createCollection('matches');
db.matches.createIndex({ institutionId: 1, vendorId: 1 }, { unique: true });
db.matches.createIndex({ institutionId: 1 });
db.matches.createIndex({ vendorId: 1 });
db.matches.createIndex({ solutionCardId: 1 });
db.matches.createIndex({ status: 1 });
db.matches.createIndex({ matchScore: -1 });
db.matches.createIndex({ createdAt: -1 });
db.matches.createIndex({ institutionId: 1, status: 1 });
db.matches.createIndex({ vendorId: 1, status: 1 });
print('✅ matches collection created with indexes\n');

// 6. Messages Collection
print('Creating messages collection...');
db.createCollection('messages');
db.messages.createIndex({ matchId: 1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ receiverId: 1 });
db.messages.createIndex({ isRead: 1 });
db.messages.createIndex({ matchId: 1, createdAt: -1 });
db.messages.createIndex({ receiverId: 1, isRead: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1, createdAt: -1 });
print('✅ messages collection created with indexes\n');

// 7. Notifications Collection
print('Creating notifications collection...');
db.createCollection('notifications');
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ matchId: 1 });
db.notifications.createIndex({ messageId: 1 });
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.notifications.createIndex({ userId: 1, type: 1 });
print('✅ notifications collection created with indexes\n');

// 8. Activity Logs Collection
print('Creating activitylogs collection...');
db.createCollection('activitylogs');
db.activitylogs.createIndex({ userId: 1 });
db.activitylogs.createIndex({ userRole: 1 });
db.activitylogs.createIndex({ action: 1 });
db.activitylogs.createIndex({ entityType: 1 });
db.activitylogs.createIndex({ entityId: 1 });
db.activitylogs.createIndex({ userId: 1, createdAt: -1 });
db.activitylogs.createIndex({ action: 1, createdAt: -1 });
db.activitylogs.createIndex({ entityType: 1, entityId: 1 });
print('✅ activitylogs collection created with indexes\n');

// 9. Saved Searches Collection
print('Creating savedsearches collection...');
db.createCollection('savedsearches');
db.savedsearches.createIndex({ userId: 1 });
db.savedsearches.createIndex({ userRole: 1 });
db.savedsearches.createIndex({ isActive: 1 });
db.savedsearches.createIndex({ userId: 1, isActive: 1 });
db.savedsearches.createIndex({ userId: 1, createdAt: -1 });
print('✅ savedsearches collection created with indexes\n');

print('\n🎉 All collections and indexes created successfully!');
print('\n📊 Collections created in local database:');
print('   ✓ users');
print('   ✓ healthcareinstitutions');
print('   ✓ vendors');
print('   ✓ solutioncards');
print('   ✓ matches');
print('   ✓ messages');
print('   ✓ notifications');
print('   ✓ activitylogs');
print('   ✓ savedsearches');
print('\n✅ Database initialization complete!');

