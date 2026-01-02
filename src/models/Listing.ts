import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IListing extends Document {
  userId: string; // Clerk user ID of the customer who created the listing
  institutionId?: string; // Reference to HealthcareInstitution if exists
  
  // Basic Information
  title: string;
  description: string;
  category: string[]; // Solution categories (e.g., "AI Diagnostics", "Medical Coding")
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Requirements
  requiredFeatures: string[]; // Must-have features
  preferredFeatures: string[]; // Nice-to-have features
  technicalRequirements: string[]; // Technical specifications
  integrationRequirements: string[]; // Integration needs
  complianceRequirements: string[]; // HIPAA, HITECH, etc.
  
  // Business Details
  budgetRange: string; // $0-50k, $50k-100k, etc.
  timeline: string; // Immediate, 1-3 months, etc.
  contractType: string[]; // Monthly, Annual, etc.
  deploymentPreference: string[]; // Cloud, On-premise, Hybrid
  
  // Institution Context
  institutionName?: string;
  institutionType?: string;
  medicalSpecialties?: string[];
  currentSystems?: string[];
  
  // Contact Information
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle?: string;
  
  // Status & Management
  status: 'draft' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  proposalsCount: number; // Number of vendor proposals
  viewsCount: number; // Number of views
  
  // Vendor Responses
  proposals?: Array<{
    vendorUserId: string;
    vendorName: string;
    proposalText: string;
    proposedPrice?: string;
    proposedTimeline?: string;
    submittedAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  
  // Additional Information
  additionalNotes?: string;
  attachments?: Array<{
    name: string;
    url: string;
    uploadedAt: Date;
  }>;
  
  // Metadata
  expiresAt?: Date; // Optional expiration date
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    institutionId: {
      type: String,
      index: true,
    },
    
    // Basic Information
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
      maxlength: 5000,
    },
    category: [{
      type: String,
      trim: true,
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    
    // Requirements
    requiredFeatures: [{
      type: String,
      trim: true,
    }],
    preferredFeatures: [{
      type: String,
      trim: true,
    }],
    technicalRequirements: [{
      type: String,
      trim: true,
    }],
    integrationRequirements: [{
      type: String,
      trim: true,
    }],
    complianceRequirements: [{
      type: String,
      enum: ['HIPAA', 'HITECH', 'GDPR', 'SOC 2', 'HITRUST', 'ISO 27001', 'Other'],
    }],
    
    // Business Details
    budgetRange: {
      type: String,
      enum: ['$0 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000+', 'Not specified'],
    },
    timeline: {
      type: String,
      enum: ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months', 'Exploring options'],
    },
    contractType: [{
      type: String,
      enum: ['Monthly', 'Annual', 'Multi-year', 'Pay-as-you-go', 'One-time', 'Other'],
    }],
    deploymentPreference: [{
      type: String,
      enum: ['Cloud', 'On-premise', 'Hybrid', 'No preference'],
    }],
    
    // Institution Context
    institutionName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    institutionType: {
      type: String,
      enum: ['Hospital', 'Clinic', 'Health System', 'Medical Group', 'Specialty Practice', 'Urgent Care', 'Other'],
    },
    medicalSpecialties: [{
      type: String,
      trim: true,
    }],
    currentSystems: [{
      type: String,
      trim: true,
    }],
    
    // Contact Information
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    contactTitle: {
      type: String,
      trim: true,
    },
    
    // Status & Management
    status: {
      type: String,
      enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'],
      default: 'draft',
    },
    proposalsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    
    // Vendor Responses
    proposals: [{
      vendorUserId: { type: String, required: true },
      vendorName: { type: String, required: true },
      proposalText: { type: String, required: true, maxlength: 5000 },
      proposedPrice: { type: String, trim: true },
      proposedTimeline: { type: String, trim: true },
      submittedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    }],
    
    // Additional Information
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    attachments: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    }],
    
    // Metadata
    expiresAt: {
      type: Date,
    },
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'listings',
  }
);

// Create indexes
ListingSchema.index({ userId: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ category: 1 });
ListingSchema.index({ priority: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ publishedAt: -1 });

const Listing: Model<IListing> =
  mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;

