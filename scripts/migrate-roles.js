const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try to load .env.local first, then .env
const envLocalPath = path.join(__dirname, '../.env.local');
const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

const UserSchema = new mongoose.Schema({
  userId: String,
  clerkId: String,
  email: String,
  role: String,
}, { collection: 'users', strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function migrateRoles() {
  try {
    // Connect to MongoDB - check both possible env variable names
    const mongoUri = process.env.MONGO_DB_URL || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGO_DB_URL or MONGODB_URI not found in environment variables');
      console.error('Make sure .env.local file exists with MONGO_DB_URL or MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find all users with old role values
    const usersToUpdate = await User.find({
      role: { $in: ['buyer', 'seller', 'superAdmin'] }
    });

    console.log(`Found ${usersToUpdate.length} users to update`);

    // Update roles
    let updated = 0;
    for (const user of usersToUpdate) {
      let newRole = user.role;
      
      if (user.role === 'buyer') {
        newRole = 'customer';
      } else if (user.role === 'seller') {
        newRole = 'vendor';
      } else if (user.role === 'superAdmin') {
        newRole = 'superadmin';
      }

      await User.updateOne(
        { _id: user._id },
        { $set: { role: newRole } }
      );
      
      console.log(`Updated user ${user.email || user.userId}: ${user.role} → ${newRole}`);
      updated++;
    }

    console.log(`\nMigration complete! Updated ${updated} users.`);
    
    // Verify the migration
    const remainingOldRoles = await User.find({
      role: { $in: ['buyer', 'seller', 'superAdmin'] }
    });
    
    if (remainingOldRoles.length > 0) {
      console.log(`\nWarning: ${remainingOldRoles.length} users still have old roles!`);
    } else {
      console.log('\nAll users have been migrated successfully!');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error migrating roles:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrateRoles();

