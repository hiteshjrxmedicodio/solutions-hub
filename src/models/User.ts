import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  // Clerk Integration
  userId: string; // Clerk user ID (primary key)
  clerkId: string; // Same as userId, for consistency
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  imageUrl?: string; // Profile image from Clerk
  
  // Application Role
  role: 'buyer' | 'seller' | null; // null means not selected yet
  
  // Profile Completion
  hasInstitutionProfile: boolean;
  hasVendorProfile: boolean;
  profileCompletedAt?: Date;
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    language: string;
    timezone: string;
  };
  
  // Account Status
  isActive: boolean;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  
  // Metadata
  signUpSource?: string; // How they signed up
  metadata?: Record<string, any>; // Additional Clerk metadata
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', null],
      default: null,
      index: true,
      sparse: true, // Allows null values in unique index
    },
    hasInstitutionProfile: {
      type: Boolean,
      default: false,
      index: true,
    },
    hasVendorProfile: {
      type: Boolean,
      default: false,
      index: true,
    },
    profileCompletedAt: {
      type: Date,
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
      language: {
        type: String,
        default: 'en',
        trim: true,
      },
      timezone: {
        type: String,
        default: 'UTC',
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      index: true,
    },
    signUpSource: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Compound indexes for efficient queries
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ email: 1, isActive: 1 });
UserSchema.index({ hasInstitutionProfile: 1, hasVendorProfile: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.email;
});

// Method to sync with Clerk user data
UserSchema.methods.syncWithClerk = async function(clerkUser: any) {
  this.clerkId = clerkUser.id;
  this.email = clerkUser.emailAddresses[0]?.emailAddress || this.email;
  this.emailVerified = clerkUser.emailAddresses[0]?.verification?.status === 'verified';
  this.firstName = clerkUser.firstName || this.firstName;
  this.lastName = clerkUser.lastName || this.lastName;
  this.imageUrl = clerkUser.imageUrl || this.imageUrl;
  this.lastLoginAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

