// MongoDB Shell Script - Copy and paste this entire script into mongosh
// Make sure you're connected to your local MongoDB instance

// Switch to local database
db = db.getSiblingDB('local');

print('🔌 Connected to local database');
print('📦 Creating collections and indexes...\n');

// 1. Users Collection
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
print('✅ users');

// 2. Healthcare Institutions Collection
db.createCollection('healthcareinstitutions');
db.healthcareinstitutions.createIndex({ userId: 1 }, { unique: true });
db.healthcareinstitutions.createIndex({ status: 1 });
db.healthcareinstitutions.createIndex({ institutionType: 1 });
print('✅ healthcareinstitutions');

// 3. Vendors Collection
db.createCollection('vendors');
db.vendors.createIndex({ userId: 1 }, { unique: true });
db.vendors.createIndex({ status: 1 });
db.vendors.createIndex({ solutionCategory: 1 });
db.vendors.createIndex({ targetSpecialties: 1 });
print('✅ vendors');

// 4. Solution Cards Collection
db.createCollection('solutioncards');
db.solutioncards.createIndex({ id: 1 }, { unique: true });
db.solutioncards.createIndex({ category: 1 });
print('✅ solutioncards');

// 5. Matches Collection
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
print('✅ matches');

// 6. Messages Collection
db.createCollection('messages');
db.messages.createIndex({ matchId: 1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ receiverId: 1 });
db.messages.createIndex({ isRead: 1 });
db.messages.createIndex({ matchId: 1, createdAt: -1 });
db.messages.createIndex({ receiverId: 1, isRead: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1, createdAt: -1 });
print('✅ messages');

// 7. Notifications Collection
db.createCollection('notifications');
db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ isRead: 1 });
db.notifications.createIndex({ matchId: 1 });
db.notifications.createIndex({ messageId: 1 });
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.notifications.createIndex({ userId: 1, type: 1 });
print('✅ notifications');

// 8. Activity Logs Collection
db.createCollection('activitylogs');
db.activitylogs.createIndex({ userId: 1 });
db.activitylogs.createIndex({ userRole: 1 });
db.activitylogs.createIndex({ action: 1 });
db.activitylogs.createIndex({ entityType: 1 });
db.activitylogs.createIndex({ entityId: 1 });
db.activitylogs.createIndex({ userId: 1, createdAt: -1 });
db.activitylogs.createIndex({ action: 1, createdAt: -1 });
db.activitylogs.createIndex({ entityType: 1, entityId: 1 });
print('✅ activitylogs');

// 9. Saved Searches Collection
db.createCollection('savedsearches');
db.savedsearches.createIndex({ userId: 1 });
db.savedsearches.createIndex({ userRole: 1 });
db.savedsearches.createIndex({ isActive: 1 });
db.savedsearches.createIndex({ userId: 1, isActive: 1 });
db.savedsearches.createIndex({ userId: 1, createdAt: -1 });
print('✅ savedsearches');

print('\n🎉 All collections and indexes created successfully!');
print('\n📊 Collections in local database:');
print('   ✓ users');
print('   ✓ healthcareinstitutions');
print('   ✓ vendors');
print('   ✓ solutioncards');
print('   ✓ matches');
print('   ✓ messages');
print('   ✓ notifications');
print('   ✓ activitylogs');
print('   ✓ savedsearches');

