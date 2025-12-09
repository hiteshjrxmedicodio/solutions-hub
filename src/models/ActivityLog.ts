import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string; // Clerk user ID
  userRole: 'buyer' | 'seller';
  action: string; // e.g., 'profile_created', 'profile_updated', 'match_viewed', 'message_sent'
  entityType: 'user' | 'institution' | 'vendor' | 'match' | 'message' | 'solution';
  entityId: string; // ID of the related entity
  metadata?: Record<string, any>; // Additional context
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userRole: {
      type: String,
      enum: ['buyer', 'seller'],
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['user', 'institution', 'vendor', 'match', 'message', 'solution'],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'activitylogs',
  }
);

// Compound indexes for analytics
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;

