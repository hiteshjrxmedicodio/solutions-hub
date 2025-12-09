import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHealthcareInstitution extends Document {
  userId: string; // Clerk user ID
  // Section 1: General Information
  selectedAISolutions?: string[]; // AI solutions selected at the start
  institutionName: string;
  institutionType: string; // Hospital, Clinic, Health System, etc.
  location: {
    state: string;
    country: string;
  };
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
  preferredContactMethod: string; // Email, Phone, Video Call
  bestTimeToContact: string;
  
  // Section 2: Medical Information
  medicalSpecialties: string[];
  patientVolume: string;
  currentSystems: string[]; // EHR systems, etc.
  complianceRequirements: string[]; // HIPAA, HITECH, etc.
  integrationRequirements: string[];
  integrationRequirementsOther?: string;
  dataSecurityNeeds: string[];
  dataSecurityNeedsOther?: string;
  
  // Section 3: Problems & AI Solutions Needed
  primaryChallenges: string[]; // Array of challenge descriptions
  primaryChallengesOther?: string;
  currentPainPoints: string[];
  currentPainPointsOther?: string;
  goals: string[];
  goalsOther?: string;
  interestedSolutionAreas: string[]; // Categories from solutions database
  specificSolutions: string[]; // Specific solution titles they're interested in
  mustHaveFeatures: string[];
  mustHaveFeaturesOther?: string;
  niceToHaveFeatures: string[];
  niceToHaveFeaturesOther?: string;
  budgetRange: string; // $0-50k, $50k-100k, $100k-500k, $500k+
  timeline: string; // Immediate, 1-3 months, 3-6 months, 6-12 months, 12+ months
  decisionMakers: string[];
  decisionMakersOther?: string;
  procurementProcess: string[];
  procurementProcessOther?: string;
  additionalNotes: string;
  
  // Status
  status: 'draft' | 'submitted' | 'reviewed' | 'matched';
  submittedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const HealthcareInstitutionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    selectedAISolutions: [{
      type: String,
      trim: true,
    }],
    institutionName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    institutionType: {
      type: String,
      required: true,
      enum: ['Hospital', 'Clinic', 'Health System', 'Medical Group', 'Specialty Practice', 'Urgent Care', 'Other'],
    },
    location: {
      state: { type: String, required: true, trim: true },
      country: { type: String, required: true, default: 'United States', trim: true },
    },
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
    bestTimeToContact: {
      type: String,
      trim: true,
    },
    medicalSpecialties: [{
      type: String,
      trim: true,
    }],
    patientVolume: {
      type: String,
      trim: true,
    },
    currentSystems: [{
      type: String,
      trim: true,
    }],
    complianceRequirements: [{
      type: String,
      enum: ['HIPAA', 'HITECH', 'GDPR', 'SOC 2', 'HITRUST', 'Other'],
    }],
    integrationRequirements: [{
      type: String,
      trim: true,
    }],
    integrationRequirementsOther: { type: String, trim: true, maxlength: 500 },
    dataSecurityNeeds: [{
      type: String,
      trim: true,
    }],
    dataSecurityNeedsOther: { type: String, trim: true, maxlength: 500 },
    primaryChallenges: [{
      type: String,
      trim: true,
    }],
    primaryChallengesOther: { type: String, trim: true, maxlength: 500 },
    currentPainPoints: [{
      type: String,
      trim: true,
    }],
    currentPainPointsOther: { type: String, trim: true, maxlength: 500 },
    goals: [{
      type: String,
      trim: true,
    }],
    goalsOther: { type: String, trim: true, maxlength: 500 },
    interestedSolutionAreas: [{
      type: String,
      trim: true,
    }],
    specificSolutions: [{
      type: String,
      trim: true,
    }],
    mustHaveFeatures: [{
      type: String,
      trim: true,
    }],
    mustHaveFeaturesOther: { type: String, trim: true, maxlength: 500 },
    niceToHaveFeatures: [{
      type: String,
      trim: true,
    }],
    niceToHaveFeaturesOther: { type: String, trim: true, maxlength: 500 },
    budgetRange: {
      type: String,
      enum: ['$0 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000+', 'Not specified'],
    },
    timeline: {
      type: String,
      enum: ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months', 'Exploring options'],
    },
    decisionMakers: [{
      type: String,
      trim: true,
    }],
    decisionMakersOther: { type: String, trim: true, maxlength: 500 },
    procurementProcess: [{
      type: String,
      trim: true,
    }],
    procurementProcessOther: { type: String, trim: true, maxlength: 500 },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'reviewed', 'matched'],
      default: 'draft',
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'healthcareinstitutions',
  }
);

// Create indexes
HealthcareInstitutionSchema.index({ userId: 1 });
HealthcareInstitutionSchema.index({ status: 1 });
HealthcareInstitutionSchema.index({ institutionType: 1 });

const HealthcareInstitution: Model<IHealthcareInstitution> =
  mongoose.models.HealthcareInstitution || mongoose.model<IHealthcareInstitution>('HealthcareInstitution', HealthcareInstitutionSchema);

export default HealthcareInstitution;

