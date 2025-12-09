import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: string; // Clerk user ID
  type: 'match' | 'message' | 'profile_update' | 'system' | 'match_interest';
  title: string;
  message: string;
  
  // Related entities
  matchId?: mongoose.Types.ObjectId; // Reference to Match
  messageId?: mongoose.Types.ObjectId; // Reference to Message
  
  // Status
  isRead: boolean;
  readAt?: Date;
  
  // Action link
  actionUrl?: string;
  actionLabel?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['match', 'message', 'profile_update', 'system', 'match_interest'],
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
      type: Schema.Types.ObjectId,
      ref: 'Match',
      index: true,
    },
    messageId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);

// Compound indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

