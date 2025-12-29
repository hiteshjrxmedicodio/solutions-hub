const mongoose = require('mongoose');

// Load env from .env.local or .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const ListingSchema = new mongoose.Schema(
  {
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
    budgetRange: { type: String, enum: ['$0 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1,000,000', '$1,000,000+', 'Not specified'] },
    timeline: { type: String, enum: ['Immediate', '1-3 months', '3-6 months', '6-12 months', '12+ months', 'Exploring options'] },
    contractType: [{ type: String, enum: ['Monthly', 'Annual', 'Multi-year', 'Pay-as-you-go', 'One-time', 'Other'] }],
    deploymentPreference: [{ type: String, enum: ['Cloud', 'On-premise', 'Hybrid', 'No preference'] }],
    institutionName: { type: String, trim: true, maxlength: 200 },
    institutionType: { type: String, enum: ['Hospital', 'Clinic', 'Health System', 'Medical Group', 'Specialty Practice', 'Urgent Care', 'Other'] },
    medicalSpecialties: [{ type: String, trim: true }],
    currentSystems: [{ type: String, trim: true }],
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, trim: true, lowercase: true },
    contactPhone: { type: String, trim: true },
    contactTitle: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'], default: 'draft', index: true },
    proposalsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    proposals: [{
      vendorUserId: { type: String, required: true },
      vendorName: { type: String, required: true },
      proposalText: { type: String, required: true, maxlength: 5000 },
      proposedPrice: { type: String, trim: true },
      proposedTimeline: { type: String, trim: true },
      submittedAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    }],
    additionalNotes: { type: String, trim: true, maxlength: 2000 },
    attachments: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    }],
    expiresAt: { type: Date },
    publishedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'listings',
  }
);

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

async function createDummyListing() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    let mongoUri = process.env.MONGO_DB_URL;
    if (!mongoUri) {
      throw new Error('MONGO_DB_URL environment variable is not set. Please check your .env.local or .env file.');
    }
    
    // Handle connection string formatting similar to init-db-simple.js
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

    // Check if dummy listing already exists
    const existingListing = await Listing.findOne({ title: 'Sample Healthcare AI Solution Request' });
    if (existingListing) {
      console.log('⚠️  Dummy listing already exists. Deleting old one...');
      await Listing.deleteOne({ _id: existingListing._id });
      console.log('✅ Old dummy listing deleted');
    }

    // Create dummy listing
    const dummyListing = new Listing({
      userId: 'dummy-user-id', // This can be replaced with actual user ID when needed
      title: 'Sample Healthcare AI Solution Request',
      description: 'We are looking for an AI-powered diagnostic solution to help improve our clinical decision-making process. The solution should integrate seamlessly with our existing EHR system and provide real-time insights for our medical staff.',
      category: ['AI Diagnostics', 'Clinical Decision Support'],
      priority: 'high',
      requiredFeatures: [
        'Real-time diagnostic suggestions',
        'Integration with Epic EHR system',
        'HIPAA compliant',
        'Cloud-based deployment',
        'Mobile app access for physicians'
      ],
      preferredFeatures: [
        'Machine learning model training',
        'Customizable alert thresholds',
        'Multi-language support',
        'Advanced analytics dashboard'
      ],
      technicalRequirements: [
        'RESTful API integration',
        'HL7 FHIR compatibility',
        '99.9% uptime SLA',
        'Data encryption at rest and in transit'
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
      institutionName: 'Sample Medical Center',
      institutionType: 'Hospital',
      medicalSpecialties: ['Cardiology', 'Oncology', 'Emergency Medicine'],
      currentSystems: ['Epic EHR', 'Cerner', 'PACS'],
      contactName: 'Dr. John Smith',
      contactEmail: 'john.smith@samplemedical.com',
      contactPhone: '+1-555-0123',
      contactTitle: 'Chief Medical Officer',
      status: 'active',
      proposalsCount: 0,
      viewsCount: 0,
      additionalNotes: 'This is a sample listing created for testing purposes. We are open to discussing custom solutions that meet our specific needs.',
      publishedAt: new Date(),
    });

    await dummyListing.save();
    console.log('✅ Dummy listing created successfully!');
    console.log(`📋 Listing ID: ${dummyListing._id}`);
    console.log(`📝 Title: ${dummyListing.title}`);
    console.log(`📊 Status: ${dummyListing.status}`);
    console.log(`🔗 View at: http://localhost:3000/listings/${dummyListing._id}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating dummy listing:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createDummyListing();

