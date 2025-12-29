import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIntegration extends Document {
  id: number;
  name: string;
  category: string; // EHRs, Payments, Forms, Communication, etc.
  logoUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IntegrationSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['EHRs', 'Payments', 'Forms', 'Communication', 'Scheduling', 'Billing', 'Analytics', 'Other'],
      index: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    collection: 'integrations',
  }
);

// Create indexes
IntegrationSchema.index({ id: 1 });
IntegrationSchema.index({ category: 1 });
IntegrationSchema.index({ name: 1 });

const Integration: Model<IIntegration> =
  mongoose.models.Integration || mongoose.model<IIntegration>('Integration', IntegrationSchema);

export default Integration;

