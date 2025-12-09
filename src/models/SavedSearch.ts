import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedSearch extends Document {
  userId: string; // Clerk user ID
  userRole: 'buyer' | 'seller';
  name: string; // User-defined name for the search
  searchCriteria: {
    // For buyers searching vendors
    solutionCategories?: string[];
    specialties?: string[];
    complianceRequirements?: string[];
    pricingRange?: string;
    deploymentOptions?: string[];
    
    // For sellers searching institutions
    institutionTypes?: string[];
    patientVolume?: string[];
    location?: {
      states?: string[];
      countries?: string[];
    };
    budgetRange?: string;
  };
  
  // Results tracking
  lastResultCount?: number;
  lastSearchedAt?: Date;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const SavedSearchSchema: Schema = new Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    searchCriteria: {
      solutionCategories: [{
        type: String,
        trim: true,
      }],
      specialties: [{
        type: String,
        trim: true,
      }],
      complianceRequirements: [{
        type: String,
        trim: true,
      }],
      pricingRange: {
        type: String,
        trim: true,
      },
      deploymentOptions: [{
        type: String,
        trim: true,
      }],
      institutionTypes: [{
        type: String,
        trim: true,
      }],
      patientVolume: [{
        type: String,
        trim: true,
      }],
      location: {
        states: [{
          type: String,
          trim: true,
        }],
        countries: [{
          type: String,
          trim: true,
        }],
      },
      budgetRange: {
        type: String,
        trim: true,
      },
    },
    lastResultCount: {
      type: Number,
      min: 0,
    },
    lastSearchedAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'savedsearches',
  }
);

// Indexes
SavedSearchSchema.index({ userId: 1, isActive: 1 });
SavedSearchSchema.index({ userId: 1, createdAt: -1 });

const SavedSearch: Model<ISavedSearch> =
  mongoose.models.SavedSearch || mongoose.model<ISavedSearch>('SavedSearch', SavedSearchSchema);

export default SavedSearch;

