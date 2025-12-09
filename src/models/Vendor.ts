import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVendor extends Document {
  userId: string; // Clerk user ID
  // Section 1: Company Information
  companyName: string;
  companyType: string; // Startup, SME, Enterprise, Other
  companyTypeOther?: string;
  website: string;
  foundedYear?: number;
  location: {
    state: string;
    country: string;
    countryOther?: string;
  };
  companySize: string; // 1-10, 11-50, 51-200, 201-1000, 1000+
  
  // Section 2: Contact Information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  secondaryContact?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  preferredContactMethod: string;
  bestTimeToContactDays: string;
  bestTimeToContactStartTime: string;
  bestTimeToContactEndTime: string;
  bestTimeToContactTimeZone: string;
  bestTimeToContactTimeZoneOther?: string;
  
  // Section 3: Solution Information
  solutionName: string;
  solutionDescription: string;
  solutionCategory: string[]; // Clinical, Financial, Administrative, etc.
  targetSpecialties: string[]; // Cardiology, Oncology, etc.
  targetInstitutionTypes: string[]; // Hospital, Clinic, etc.
  keyFeatures: string[];
  keyFeaturesOther?: string;
  technologyStack: string[];
  technologyStackOther?: string;
  deploymentOptions: string[]; // Cloud, On-premise, Hybrid
  integrationCapabilities: string[];
  integrationCapabilitiesOther?: string;
  
  // Section 4: Compliance & Security
  complianceCertifications: string[]; // HIPAA, HITECH, SOC 2, etc.
  complianceCertificationsOther?: string;
  securityFeatures: string[];
  securityFeaturesOther?: string;
  dataHandling: string; // How they handle patient data
  
  // Section 5: Business Information
  pricingModel: string; // Subscription, One-time, Usage-based, Custom
  pricingRange: string; // $0-50k, $50k-100k, etc.
  contractTerms: string[]; // Monthly, Annual, Multi-year, etc.
  implementationTime: string; // Immediate, 1-3 months, etc.
  supportOffered: string[];
  supportOfferedOther?: string;
  trainingProvided: string[];
  trainingProvidedOther?: string;
  
  // Section 6: Market & Clients
  currentClients: string[]; // Types of clients they serve
  clientCount?: number;
  caseStudies?: string; // URLs or descriptions
  testimonials?: string;
  awards?: string[];
  
  // Section 7: Additional Information
  competitiveAdvantages: string[];
  competitiveAdvantagesOther?: string;
  futureRoadmap?: string;
  additionalNotes?: string;
  
  // Status
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  submittedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Section 1: Company Information
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    companyType: {
      type: String,
      required: true,
      enum: ['Startup', 'SME', 'Enterprise', 'Other'],
    },
    companyTypeOther: { type: String, trim: true, maxlength: 200 },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    foundedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear(),
    },
    location: {
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      countryOther: { type: String, trim: true, maxlength: 200 },
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
    },
    
    // Section 2: Contact Information
    primaryContact: {
      name: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    secondaryContact: {
      name: { type: String, trim: true },
      title: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    preferredContactMethod: {
      type: String,
      enum: ['Email', 'Phone', 'Video Call', 'In-Person'],
      default: 'Email',
    },
    bestTimeToContactDays: { type: String, trim: true },
    bestTimeToContactStartTime: { type: String, trim: true },
    bestTimeToContactEndTime: { type: String, trim: true },
    bestTimeToContactTimeZone: { type: String, trim: true },
    bestTimeToContactTimeZoneOther: { type: String, trim: true, maxlength: 200 },
    
    // Section 3: Solution Information
    solutionName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    solutionDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    solutionCategory: [{
      type: String,
      trim: true,
    }],
    targetSpecialties: [{
      type: String,
      trim: true,
    }],
    targetInstitutionTypes: [{
      type: String,
      trim: true,
    }],
    keyFeatures: [{
      type: String,
      trim: true,
    }],
    keyFeaturesOther: { type: String, trim: true, maxlength: 500 },
    technologyStack: [{
      type: String,
      trim: true,
    }],
    technologyStackOther: { type: String, trim: true, maxlength: 500 },
    deploymentOptions: [{
      type: String,
      enum: ['Cloud', 'On-premise', 'Hybrid'],
    }],
    integrationCapabilities: [{
      type: String,
      trim: true,
    }],
    integrationCapabilitiesOther: { type: String, trim: true, maxlength: 500 },
    
    // Section 4: Compliance & Security
    complianceCertifications: [{
      type: String,
      enum: ['HIPAA', 'HITECH', 'GDPR', 'SOC 2', 'HITRUST', 'ISO 27001', 'Other'],
    }],
    complianceCertificationsOther: { type: String, trim: true, maxlength: 500 },
    securityFeatures: [{
      type: String,
      trim: true,
    }],
    securityFeaturesOther: { type: String, trim: true, maxlength: 500 },
    dataHandling: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    
    // Section 5: Business Information
    pricingModel: {
      type: String,
      enum: ['Subscription', 'One-time', 'Usage-based', 'Custom', 'Free', 'Other'],
    },
    pricingRange: {
      type: String,
      enum: ['Free', '$0 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000+', 'Custom'],
    },
    contractTerms: [{
      type: String,
      enum: ['Monthly', 'Annual', 'Multi-year', 'Pay-as-you-go', 'Other'],
    }],
    implementationTime: {
      type: String,
      enum: ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months'],
    },
    supportOffered: [{
      type: String,
      trim: true,
    }],
    supportOfferedOther: { type: String, trim: true, maxlength: 500 },
    trainingProvided: [{
      type: String,
      trim: true,
    }],
    trainingProvidedOther: { type: String, trim: true, maxlength: 500 },
    
    // Section 6: Market & Clients
    currentClients: [{
      type: String,
      trim: true,
    }],
    clientCount: {
      type: Number,
      min: 0,
    },
    caseStudies: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    testimonials: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    awards: [{
      type: String,
      trim: true,
    }],
    
    // Section 7: Additional Information
    competitiveAdvantages: [{
      type: String,
      trim: true,
    }],
    competitiveAdvantagesOther: { type: String, trim: true, maxlength: 500 },
    futureRoadmap: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'vendors',
  }
);

// Create indexes
VendorSchema.index({ userId: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ solutionCategory: 1 });
VendorSchema.index({ targetSpecialties: 1 });

const Vendor: Model<IVendor> =
  mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

export default Vendor;

