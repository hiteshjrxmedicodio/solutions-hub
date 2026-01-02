/**
 * Create Dummy Proposals Script
 * Creates 3 dummy proposals for a listing in the database
 * 
 * Usage: 
 *   node scripts/create-dummy-proposals.js
 *   node scripts/create-dummy-proposals.js <listingId>
 */

const mongoose = require('mongoose');

// Load env from .env.local or .env
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Listing Schema
const ListingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  category: [{ type: String, trim: true }],
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['draft', 'active', 'in_progress', 'completed', 'cancelled'], default: 'draft', index: true },
  proposals: [{
    vendorUserId: { type: String, required: true },
    vendorName: { type: String, required: true },
    proposalText: { type: String, required: true, maxlength: 5000 },
    proposedPrice: { type: String, trim: true },
    proposedTimeline: { type: String, trim: true },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  }],
  proposalsCount: { type: Number, default: 0 },
}, {
  timestamps: true,
  collection: 'listings',
});

// Vendor Schema
const VendorSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  companyName: { type: String, required: true, trim: true },
  companyType: { type: String, trim: true },
  website: { type: String, trim: true },
  location: {
    state: { type: String, trim: true },
    country: { type: String, trim: true },
  },
}, {
  timestamps: true,
  collection: 'vendors',
});

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

async function createDummyProposals() {
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

    // Get listingId from command line argument or find first active listing
    const listingId = process.argv[2];
    
    let listing;
    if (listingId) {
      listing = await Listing.findById(listingId);
      if (!listing) {
        console.log(`❌ Listing with ID "${listingId}" not found.`);
        process.exit(1);
      }
    } else {
      console.log('⚠️  No listingId provided. Finding first active listing...');
      listing = await Listing.findOne({ status: 'active' }).sort({ createdAt: -1 });
      
      if (!listing) {
        console.log('❌ No active listings found. Please provide a listingId or create an active listing first.');
        console.log('   Usage: node scripts/create-dummy-proposals.js <listingId>');
        
        // Show available listings
        const allListings = await Listing.find({}).limit(10).select('_id title status userId').lean();
        if (allListings.length > 0) {
          console.log('\n📋 Available listings:');
          allListings.forEach((l, index) => {
            console.log(`   ${index + 1}. ${l._id} - "${l.title}" (${l.status})`);
          });
        }
        
        process.exit(1);
      }
      
      console.log(`✅ Found listing: "${listing.title}" (${listing._id})\n`);
    }

    // Get vendors to create dummy proposals
    const vendors = await Vendor.find({}).limit(3).lean();
    
    if (vendors.length === 0) {
      console.log('❌ No vendors found in database. Please create vendor profiles first.');
      process.exit(1);
    }

    console.log(`📋 Found ${vendors.length} vendor(s) to use for dummy proposals\n`);

    // Create 3 dummy proposals
    const dummyProposals = [
      {
        vendorUserId: vendors[0].userId,
        vendorName: vendors[0].companyName || "TechMed Solutions",
        proposalText: "We are excited to propose our AI-powered diagnostic solution that integrates seamlessly with your existing EHR system. Our platform uses advanced machine learning algorithms to assist with clinical decision-making, reducing diagnostic errors by up to 40%. We offer comprehensive training and 24/7 support to ensure smooth implementation.",
        proposedPrice: "$150,000 - $200,000",
        proposedTimeline: "3-4 months",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: "pending",
      },
      {
        vendorUserId: vendors[1]?.userId || vendors[0].userId,
        vendorName: vendors[1]?.companyName || "HealthAI Innovations",
        proposalText: "Our clinical decision support system has been successfully deployed in over 50 healthcare institutions. We specialize in AI diagnostics and can provide a customized solution tailored to your specific needs. Our team includes certified healthcare IT professionals who understand the unique challenges of clinical workflows.",
        proposedPrice: "$120,000 - $180,000",
        proposedTimeline: "2-3 months",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: "pending",
      },
      {
        vendorUserId: vendors[2]?.userId || vendors[0].userId,
        vendorName: vendors[2]?.companyName || "MedTech Pro",
        proposalText: "We understand your need for an AI diagnostic solution that improves clinical decision-making. Our platform offers real-time analysis, seamless EHR integration, and comprehensive reporting. We've helped similar institutions reduce diagnostic turnaround time by 35% while maintaining high accuracy rates. Our solution is HIPAA compliant and includes ongoing maintenance and updates.",
        proposedPrice: "$180,000 - $250,000",
        proposedTimeline: "4-5 months",
        submittedAt: new Date(), // Today
        status: "pending",
      },
    ];

    // Initialize proposals array if it doesn't exist
    if (!listing.proposals) {
      listing.proposals = [];
    }

    // Add dummy proposals (only if they don't already exist from these vendors)
    const existingVendorIds = listing.proposals.map((p) => p.vendorUserId);
    const newProposals = dummyProposals.filter(
      (proposal) => !existingVendorIds.includes(proposal.vendorUserId)
    );

    if (newProposals.length === 0) {
      console.log('⚠️  All dummy proposals already exist for this listing.');
      console.log(`   Current proposals: ${listing.proposals.length}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    listing.proposals.push(...newProposals);
    listing.proposalsCount = listing.proposals.length;
    await listing.save();

    console.log(`✅ Successfully added ${newProposals.length} dummy proposal(s) to listing: "${listing.title}"`);
    console.log(`   Total proposals: ${listing.proposals.length}\n`);
    
    newProposals.forEach((proposal, index) => {
      console.log(`   ${index + 1}. ${proposal.vendorName}`);
      console.log(`      Price: ${proposal.proposedPrice}`);
      console.log(`      Timeline: ${proposal.proposedTimeline}`);
      console.log(`      Status: ${proposal.status}\n`);
    });

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating dummy proposals:', error);
    process.exit(1);
  }
}

createDummyProposals();

