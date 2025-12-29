import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILinkedInCredentials extends Document {
  userId: string; // Clerk user ID
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  personUrn?: string; // LinkedIn Person URN (urn:li:person:xxx)
  organizationUrn?: string; // LinkedIn Organization URN if posting as organization
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LinkedInCredentialsSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    personUrn: {
      type: String,
      trim: true,
    },
    organizationUrn: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'linkedin_credentials',
  }
);

// Index for efficient queries
LinkedInCredentialsSchema.index({ userId: 1, isActive: 1 });

// Method to check if token is expired
LinkedInCredentialsSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() >= this.expiresAt;
};

const LinkedInCredentials: Model<ILinkedInCredentials> =
  mongoose.models.LinkedInCredentials || mongoose.model<ILinkedInCredentials>('LinkedInCredentials', LinkedInCredentialsSchema);

export default LinkedInCredentials;


