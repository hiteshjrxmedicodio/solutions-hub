import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  matchId: mongoose.Types.ObjectId; // Reference to Match
  senderId: string; // Clerk user ID of sender
  receiverId: string; // Clerk user ID of receiver
  senderRole: 'buyer' | 'seller'; // Role of sender
  
  // Message Content
  subject?: string;
  content: string;
  messageType: 'initial' | 'reply' | 'system';
  
  // Status
  isRead: boolean;
  readAt?: Date;
  isDeletedBySender: boolean;
  isDeletedByReceiver: boolean;
  
  // Attachments (for future use)
  attachments?: string[]; // URLs to attachments
  
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ['buyer', 'seller'],
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    messageType: {
      type: String,
      enum: ['initial', 'reply', 'system'],
      default: 'reply',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
    isDeletedBySender: {
      type: Boolean,
      default: false,
    },
    isDeletedByReceiver: {
      type: Boolean,
      default: false,
    },
    attachments: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
    collection: 'messages',
  }
);

// Compound indexes for efficient queries
MessageSchema.index({ matchId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, createdAt: -1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

