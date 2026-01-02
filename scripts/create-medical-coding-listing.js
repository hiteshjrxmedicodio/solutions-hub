require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

// Define schemas inline (similar to other scripts)
const ListingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  institutionId: { type: String, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: [{ type: String, trim: true }],
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  requiredFeatures: [{ type: String, trim: true }],
  preferredFeatures: [{ type: String, trim: true }],
  technicalRequirements: [{ type: String, trim: true }],
  integrationRequirements: [{ type: String, trim: true }],
  complianceRequirements: [{ type: String, enum: ['HIPAA', 'HITECH', 'GDPR', 'SOC 2', 'HITRUST', 'ISO 27001', 'Other'] }],
  budgetRange: { type: String },
  timeline: { type: String },
  contractType: [{ type: String }],
  deploymentPreference: [{ type: String }],
  institutionName: { type: String, trim: true },
  institutionType: { type: String },
  medicalSpecialties: [{ type: String }],
  currentSystems: [{ type: String }],
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  contactTitle: { type: String },
  status: { type: String, enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'], default: 'draft' },
  proposalsCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  proposals: [{
    vendorUserId: { type: String, required: true },
    vendorName: { type: String, required: true },
    proposalText: { type: String, required: true },
    proposedPrice: { type: String },
    proposedTimeline: { type: String },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }],
  additionalNotes: { type: String },
  publishedAt: { type: Date },
}, { timestamps: true, collection: 'listings' });

const VendorSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  companyName: { type: String, required: true },
}, { timestamps: true, collection: 'vendors' });

const HealthcareInstitutionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  institutionName: { type: String, required: true },
  institutionType: { type: String },
  location: {
    state: { type: String },
    country: { type: String },
  },
  primaryContact: {
    name: { type: String },
    title: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  medicalSpecialties: [{ type: String }],
  currentSystems: [{ type: String }],
}, { timestamps: true, collection: 'healthcareinstitutions' });

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
}, { timestamps: true, collection: 'users' });

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
const HealthcareInstitution = mongoose.models.HealthcareInstitution || mongoose.model('HealthcareInstitution', HealthcareInstitutionSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const SUPER_ADMIN_EMAIL = 'hitesh.ms24@gmail.com';

async function createMedicalCodingListing() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    let mongoUri = process.env.MONGO_DB_URL;
    if (!mongoUri) {
      throw new Error('MONGO_DB_URL environment variable is not set. Please check your .env.local or .env file.');
    }
    
    // Handle connection string formatting
    if (mongoUri.includes('mongodb+srv://')) {
      const atCount = (mongoUri.match(/@/g) || []).length;
      if (atCount > 1) {
        const parts = mongoUri.split('@');
        const credentialsPart = parts[0];
        const hostPart = parts[parts.length - 1];
        const passwordParts = parts.slice(1, -1);
        
        const match = credentialsPart.match(/^mongodb\+srv:\/\/([^:]+):(.+)$/);
        if (match) {
          const username = match[1];
          let password = match[2];
          if (passwordParts.length > 0) {
            password = password + '@' + passwordParts.join('@');
          }
          password = password.replace(/@/g, '%40');
          mongoUri = `mongodb+srv://${username}:${password}@${hostPart}`;
        }
      }
      
      // Ensure database name is "solutions-hub"
      const uriParts = mongoUri.split('?');
      const baseUri = uriParts[0];
      const queryParams = uriParts.length > 1 ? '?' + uriParts[1] : '';
      
      const lastSlashIndex = baseUri.lastIndexOf('/');
      const atIndex = baseUri.lastIndexOf('@');
      
      if (lastSlashIndex > atIndex) {
        mongoUri = baseUri.substring(0, lastSlashIndex + 1) + 'solutions-hub' + queryParams;
      } else {
        mongoUri = baseUri + '/solutions-hub' + queryParams;
      }
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find super admin user
    const superAdmin = await User.findOne({ email: SUPER_ADMIN_EMAIL });
    if (!superAdmin) {
      throw new Error('Super admin user not found');
    }
    console.log('Found super admin user:', superAdmin.userId);

    // Find customer profile for super admin
    const customerProfile = await HealthcareInstitution.findOne({ userId: superAdmin.userId });
    if (!customerProfile) {
      throw new Error('Customer profile not found for super admin');
    }
    console.log('Found customer profile:', customerProfile.institutionName);

    // Find medicodio vendor
    const medicodioVendor = await Vendor.findOne({ userId: 'seed-medicodio' });
    if (!medicodioVendor) {
      throw new Error('Medicodio vendor not found');
    }
    console.log('Found medicodio vendor:', medicodioVendor.companyName);

    // Create listing data
    const listingData = {
      userId: superAdmin.userId,
      title: 'AI-Powered Medical Coding Solution',
      description: 'We are looking for an advanced AI-powered medical coding solution to automate our ICD-10, CPT, and HCPCS coding processes. The solution should integrate seamlessly with our existing EHR system and provide real-time coding suggestions with high accuracy rates. We need a system that can handle complex coding scenarios, reduce manual coding errors, and improve our revenue cycle management efficiency.',
      category: ['Medical Coding'],
      priority: 'high',
      requiredFeatures: [
        'Automated ICD-10, CPT, and HCPCS coding',
        'Real-time coding suggestions',
        'EHR integration (Epic, Cerner)',
        'High accuracy rates (95%+)',
        'Audit trail and compliance reporting',
        'HIPAA compliant'
      ],
      preferredFeatures: [
        'Machine learning model training',
        'Customizable coding rules',
        'Multi-language support',
        'Advanced analytics dashboard',
        'API integration capabilities'
      ],
      technicalRequirements: [
        'RESTful API integration',
        'HL7 FHIR compatibility',
        '99.9% uptime SLA',
        'Data encryption at rest and in transit',
        'Cloud-based deployment preferred'
      ],
      integrationRequirements: [
        'Epic EHR system',
        'Cerner EHR system',
        'HL7 interface',
        'SSO authentication'
      ],
      complianceRequirements: ['HIPAA', 'HITECH', 'SOC 2'],
      budgetRange: '$100,000 - $500,000',
      timeline: '3-6 months',
      contractType: ['Annual', 'Multi-year'],
      deploymentPreference: ['Cloud', 'Hybrid'],
      institutionId: customerProfile._id.toString(),
      institutionName: customerProfile.institutionName,
      institutionType: customerProfile.institutionType,
      medicalSpecialties: customerProfile.medicalSpecialties || [],
      currentSystems: customerProfile.currentSystems || [],
      contactName: customerProfile.primaryContact?.name || 'Admin',
      contactEmail: customerProfile.primaryContact?.email || SUPER_ADMIN_EMAIL,
      contactPhone: customerProfile.primaryContact?.phone || '+1-555-0000',
      contactTitle: customerProfile.primaryContact?.title || 'Chief Medical Officer',
      additionalNotes: 'We are open to discussing custom solutions that meet our specific needs. Priority is on accuracy and seamless integration.',
      status: 'active',
      publishedAt: new Date(),
      viewsCount: 0,
      proposalsCount: 0,
    };

    // Check if listing already exists
    const existingListing = await Listing.findOne({
      userId: superAdmin.userId,
      title: listingData.title,
      category: { $in: ['Medical Coding'] }
    });

    let listing;
    if (existingListing) {
      console.log('Listing already exists, updating...');
      Object.assign(existingListing, listingData);
      await existingListing.save();
      listing = existingListing;
    } else {
      listing = new Listing(listingData);
      await listing.save();
      console.log('Created listing:', listing._id);
    }

    // Check if proposal already exists
    const hasExistingProposal = listing.proposals?.some(
      (p) => p.vendorUserId === 'seed-medicodio'
    );

    if (!hasExistingProposal) {
      // Create proposal from medicodio
      const proposal = {
        vendorUserId: 'seed-medicodio',
        vendorName: medicodioVendor.companyName,
        proposalText: `We understand your need for an AI-powered medical coding solution that improves accuracy and efficiency. Our platform offers real-time coding automation with 98%+ accuracy rates, seamless EHR integration with Epic and Cerner, and comprehensive compliance reporting. We've helped similar institutions reduce coding errors by 85% while improving revenue cycle efficiency by 40%. Our solution is HIPAA compliant, includes ongoing maintenance and updates, and provides detailed analytics dashboards for performance monitoring.`,
        proposedPrice: '$180,000 - $250,000',
        proposedTimeline: '4-5 months',
        submittedAt: new Date(),
        status: 'pending',
      };

      if (!listing.proposals) {
        listing.proposals = [];
      }

      listing.proposals.push(proposal);
      listing.proposalsCount = listing.proposals.length;
      await listing.save();
      console.log('Created proposal from medicodio');
    } else {
      console.log('Proposal from medicodio already exists');
    }

    console.log('\n✅ Successfully created:');
    console.log(`   - Listing: ${listing.title}`);
    console.log(`   - Listing ID: ${listing._id}`);
    console.log(`   - Category: Medical Coding`);
    console.log(`   - Proposals: ${listing.proposalsCount}`);
    console.log(`   - Vendor: ${medicodioVendor.companyName}`);
    console.log(`   🔗 View at: http://localhost:3000/listings/${listing._id}`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createMedicalCodingListing();

