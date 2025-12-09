import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISolutionCard extends Document {
  id: number;
  title: string;
  description: string;
  category?: string;
  cols: number;
  rows: number;
  createdAt: Date;
  updatedAt: Date;
}

const SolutionCardSchema: Schema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    cols: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    rows: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
  },
  {
    timestamps: true,
    collection: 'solutioncards',
  }
);

// Create indexes for better query performance
// Note: id field already has unique: true which creates an index automatically
SolutionCardSchema.index({ category: 1 });

// Prevent re-compilation during development
const SolutionCard: Model<ISolutionCard> =
  mongoose.models.SolutionCard || mongoose.model<ISolutionCard>('SolutionCard', SolutionCardSchema);

export default SolutionCard;

