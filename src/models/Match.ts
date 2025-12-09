import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMatch extends Document {
  institutionId: string; // Reference to HealthcareInstitution userId
  vendorId: string; // Reference to Vendor userId
  solutionCardId?: number; // Reference to SolutionCard id (if applicable)
  
  // Match Details
  matchScore: number; // 0-100 compatibility score
  matchReasons: string[]; // Why they were matched
  status: 'pending' | 'viewed' | 'interested' | 'not_interested' | 'contacted' | 'in_negotiation' | 'closed';
  
  // Interaction Tracking
  institutionViewedAt?: Date;
  vendorViewedAt?: Date;
  institutionInterestedAt?: Date;
  vendorInterestedAt?: Date;
  firstContactAt?: Date;
  lastInteractionAt?: Date;
  
  // Notes
  institutionNotes?: string;
  vendorNotes?: string;
  adminNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    institutionId: {
      type: String,
      required: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    solutionCardId: {
      type: Number,
      index: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    matchReasons: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ['pending', 'viewed', 'interested', 'not_interested', 'contacted', 'in_negotiation', 'closed'],
      default: 'pending',
      index: true,
    },
    institutionViewedAt: {
      type: Date,
    },
    vendorViewedAt: {
      type: Date,
    },
    institutionInterestedAt: {
      type: Date,
    },
    vendorInterestedAt: {
      type: Date,
    },
    firstContactAt: {
      type: Date,
    },
    lastInteractionAt: {
      type: Date,
    },
    institutionNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    vendorNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    collection: 'matches',
  }
);

// Compound indexes for efficient queries
MatchSchema.index({ institutionId: 1, vendorId: 1 }, { unique: true });
MatchSchema.index({ institutionId: 1, status: 1 });
MatchSchema.index({ vendorId: 1, status: 1 });
MatchSchema.index({ matchScore: -1 }); // For sorting by relevance
MatchSchema.index({ createdAt: -1 }); // For recent matches

const Match: Model<IMatch> =
  mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

export default Match;

