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
  missionStatement?: string; // Company mission statement focused on AI coding innovation
  headquarters?: string; // Headquarters location
  
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
  productDescription?: string; // Detailed breakdown of AI tool (autonomous coding, NLP features, supported code sets)
  solutionCategory: string[]; // Tags - can change based on company preference (references Category model)
  targetSpecialties: string[]; // Cardiology, Oncology, etc.
  specialtiesPerformance?: Array<{ // Model-specific performance data per specialty
    specialty: string;
    performanceData: string; // e.g., "95% accuracy", "30% productivity boost"
  }>;
  targetInstitutionTypes: string[]; // Hospital, Clinic, etc.
  keyFeatures: string[];
  keyFeaturesOther?: string;
  technologyStack: string[];
  technologyStackOther?: string;
  deploymentOptions: string[]; // Cloud, On-premise, Hybrid
  integrationCapabilities: string[];
  integrationCapabilitiesOther?: string;
  integrations?: Array<{ // Compatible EHRs/EMRs with logos
    name: string; // e.g., "Epic", "Cerner"
    logoUrl?: string; // URL to logo image
    apiCompatible?: boolean;
    workflowTools?: string[];
  }>;
  
  // Section 4: Compliance & Security
  complianceCertifications: string[]; // HIPAA, HITECH, SOC 2, etc.
  complianceCertificationsOther?: string;
  certificationDocuments?: Array<{ // Official certification documents/logos
    certification: string;
    documentUrl?: string; // URL to certification document
    logoUrl?: string; // URL to certification logo
    issuedDate?: Date;
    expiryDate?: Date;
  }>;
  securityFeatures: string[];
  securityFeaturesOther?: string;
  dataHandling: string; // How they handle patient data
  auditTrails?: string; // Audit trail information
  regulatoryUpdateFrequency?: string; // How often regulatory updates are provided
  
  // Section 5: Business Information
  pricingModel: string; // Subscription, One-time, Usage-based, Custom
  pricingRange: string; // $0-50k, $50k-100k, etc.
  pricingPlans?: Array<{ // Tiered pricing plans
    tierName: string;
    price: string;
    features: string[];
    contractTerms?: string[];
  }>;
  freemiumOptions?: string; // Description of freemium options
  roiCalculator?: string; // URL or description of ROI calculator
  contractTerms: string[]; // Monthly, Annual, Multi-year, etc.
  implementationTime: string; // Immediate, 1-3 months, etc.
  supportOffered: string[];
  supportOfferedOther?: string;
  supportSLAs?: string; // Support SLA information
  trainingProvided: string[];
  trainingProvidedOther?: string;
  demoLink?: string; // Link to live demo
  trialLink?: string; // Link to free trial
  onboardingProcess?: string; // Description of onboarding process
  
  // Section 6: Market & Clients
  currentClients: string[]; // Types of clients they serve
  clientCount?: number;
  caseStudies?: string; // URLs or descriptions
  testimonials?: string;
  customerTestimonials?: Array<{ // Verified testimonials with metrics
    customerName: string;
    customerTitle?: string;
    customerLogo?: string; // Provider logo
    testimonial: string;
    metrics?: string; // e.g., "30% productivity boost"
    verified?: boolean;
  }>;
  awards?: string[];
  
  // Section 7: Additional Information
  competitiveAdvantages: string[];
  competitiveAdvantagesOther?: string;
  futureRoadmap?: string;
  additionalNotes?: string;
  
  // Team & Leadership
  teamMembers?: Array<{
    name: string;
    title: string;
    bio?: string;
    photoUrl?: string;
    expertise?: string[]; // e.g., ["AI/ML", "Healthcare"]
    linkedinUrl?: string;
  }>;
  
  // Key Metrics (category-specific)
  keyMetrics?: {
    codingAccuracy?: string; // e.g., "95%+"
    firstPassRate?: string;
    throughputGains?: string;
    costSavings?: string;
    [key: string]: string | undefined; // Allow category-specific metrics
  };
  
  // Updates & Roadmap
  updates?: Array<{ // Recent releases and updates
    title: string;
    content: string;
    date: Date;
    type: 'release' | 'feature' | 'announcement' | 'roadmap';
    linkedinPosted?: boolean; // Whether this was posted to LinkedIn
  }>;
  
  // Card Display Properties (for Solutions Hub)
  displayId?: number; // Unique ID for display in solutions hub
  cardCols?: number; // Grid columns (1-4)
  cardRows?: number; // Grid rows (1-2)
  
  // Status
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  submittedAt?: Date;
  
  // Customer Verification (customer-driven)
  verified: boolean; // True if at least one verified customer has accepted testimonials
  verificationHistory?: Array<{ // Track which customers verified this vendor
    customerUserId: string; // Institution user ID who verified
    customerName: string;
    verifiedAt: Date;
    testimonialId?: string; // Reference to the testimonial that was accepted
  }>;
  
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
    missionStatement: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    headquarters: {
      type: String,
      trim: true,
      maxlength: 200,
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
    productDescription: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    solutionCategory: [{
      type: String,
      trim: true,
    }],
    targetSpecialties: [{
      type: String,
      trim: true,
    }],
    specialtiesPerformance: [{
      specialty: { type: String, trim: true },
      performanceData: { type: String, trim: true },
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
    integrations: [{
      name: { type: String, required: true, trim: true },
      logoUrl: { type: String, trim: true },
      apiCompatible: { type: Boolean, default: false },
      workflowTools: [{ type: String, trim: true }],
    }],
    
    // Section 4: Compliance & Security
    complianceCertifications: [{
      type: String,
      enum: ['HIPAA', 'HITECH', 'GDPR', 'SOC 2', 'HITRUST', 'ISO 27001', 'Other'],
    }],
    complianceCertificationsOther: { type: String, trim: true, maxlength: 500 },
    certificationDocuments: [{
      certification: { type: String, required: true, trim: true },
      documentUrl: { type: String, trim: true },
      logoUrl: { type: String, trim: true },
      issuedDate: { type: Date },
      expiryDate: { type: Date },
    }],
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
    auditTrails: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    regulatoryUpdateFrequency: {
      type: String,
      trim: true,
      maxlength: 200,
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
    pricingPlans: [{
      tierName: { type: String, trim: true },
      price: { type: String, trim: true },
      features: [{ type: String, trim: true }],
      contractTerms: [{ type: String, trim: true }],
    }],
    freemiumOptions: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    roiCalculator: {
      type: String,
      trim: true,
      maxlength: 500,
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
    supportSLAs: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    trainingProvided: [{
      type: String,
      trim: true,
    }],
    trainingProvidedOther: { type: String, trim: true, maxlength: 500 },
    demoLink: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    trialLink: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    onboardingProcess: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    
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
    customerTestimonials: [{
      customerName: { type: String, required: true, trim: true },
      customerTitle: { type: String, trim: true },
      customerLogo: { type: String, trim: true },
      testimonial: { type: String, required: true, trim: true, maxlength: 2000 },
      metrics: { type: String, trim: true },
      verified: { type: Boolean, default: false },
    }],
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
    
    // Team & Leadership
    teamMembers: [{
      name: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      bio: { type: String, trim: true, maxlength: 2000 },
      photoUrl: { type: String, trim: true },
      expertise: [{ type: String, trim: true }],
      linkedinUrl: { type: String, trim: true },
    }],
    
    // Key Metrics
    keyMetrics: {
      type: Map,
      of: String,
    },
    
    // Updates & Roadmap
    updates: [{
      title: { type: String, required: true, trim: true },
      content: { type: String, required: true, trim: true, maxlength: 5000 },
      date: { type: Date, required: true, default: Date.now },
      type: {
        type: String,
        enum: ['release', 'feature', 'announcement', 'roadmap'],
        default: 'announcement',
      },
      linkedinPosted: { type: Boolean, default: false },
    }],
    
    // Card Display Properties
    displayId: {
      type: Number,
      unique: true,
      sparse: true, // Allow null/undefined
      index: true,
    },
    cardCols: {
      type: Number,
      min: 1,
      max: 4,
      default: 2,
    },
    cardRows: {
      type: Number,
      min: 1,
      max: 2,
      default: 1,
    },
    
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
    
    // Customer Verification
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationHistory: [{
      customerUserId: { type: String, required: true, trim: true },
      customerName: { type: String, required: true, trim: true },
      verifiedAt: { type: Date, required: true, default: Date.now },
      testimonialId: { type: String, trim: true },
    }],
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

