// IMPORTANT: Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const envPath = resolve(process.cwd(), '.env');
const envLocalPath = resolve(process.cwd(), '.env.local');

// Load .env.local first (takes precedence), then .env
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log('Loaded .env.local');
}
if (existsSync(envPath)) {
  config({ path: envPath });
  console.log('Loaded .env');
}

// Verify MONGO_DB_URL is loaded
if (!process.env.MONGO_DB_URL) {
  console.error('❌ Error: MONGO_DB_URL not found in environment variables');
  console.log('Current working directory:', process.cwd());
  process.exit(1);
}

console.log('✅ Environment variables loaded');

// Vendor company data
const medicalCodingCompanies = [
  { name: 'Sully.ai', website: 'https://www.sully.ai', strengths: 'Modular AI agents for full coding autonomy, high first-pass accuracy', category: 'AI Medical Coding' },
  { name: 'Fathom AI', website: 'https://www.fathomhealth.com', strengths: 'NLP for real-time ICD/CPT suggestions, strong in multi-specialty workflows', category: 'AI Medical Coding' },
  { name: 'Nym Health', website: 'https://www.nymhealth.com', strengths: 'Autonomous engine with 95%+ accuracy, clinical language understanding', category: 'AI Medical Coding' },
  { name: 'Medicodio', website: 'https://medicodio.ai', strengths: 'Real-time NLP suggestions, 30-50% throughput gains, MCaaS model', category: 'AI Medical Coding' },
  { name: 'Aptarro', website: 'https://www.aptarro.com', strengths: 'RevCycle Engine for full revenue cycle, analytics-driven accuracy', category: 'AI Medical Coding' },
  { name: 'CodaMetrix', website: 'https://www.codametrix.com', strengths: 'Enterprise AI processing multiple data sources, audit trails', category: 'AI Medical Coding' },
  { name: '3M (CodeFinder)', website: 'https://www.3m.com', strengths: 'CAC with NLP, boosts coder efficiency in EHRs', category: 'AI Medical Coding' },
  { name: 'Nuance (Solventum)', website: 'https://www.nuance.com', strengths: 'NLP for documentation improvement, real-time coding', category: 'AI Medical Coding' },
  { name: 'TachyHealth AiCode', website: 'https://www.tachyhealth.com', strengths: 'Multi-format parsing (notes, images), supports global code sets', category: 'AI Medical Coding' },
  { name: 'XpertDox', website: 'https://www.xpertdox.com', strengths: 'EHR-integrated analytics, performance tracking', category: 'AI Medical Coding' },
  { name: 'Optum', website: 'https://www.optum.com', strengths: 'EncoderPro with AI recommendations, compliance focus', category: 'AI Medical Coding' },
  { name: 'CorroHealth PULSE', website: 'https://www.corrohealth.com', strengths: 'NLP/CAC hybrid, 97% claimed accuracy', category: 'AI Medical Coding' },
  { name: 'Dolbey', website: 'https://www.dolbey.com', strengths: 'AI workflow optimization for large systems', category: 'AI Medical Coding' },
  { name: 'Athenahealth', website: 'https://www.athenahealth.com', strengths: 'Integrated coding module with automation', category: 'AI Medical Coding' },
  { name: 'TruCode', website: 'https://www.trucode.com', strengths: 'Intuitive ICD/CPT search for inpatient coding', category: 'AI Medical Coding' },
];

const aiScribingCompanies = [
  { name: 'DeepScribe', website: 'https://www.deepscribe.ai', strengths: 'Specialty-specific models, 98.8 KLAS score, contextual NLP', category: 'AI Scribing' },
  { name: 'Suki AI', website: 'https://www.suki.ai', strengths: 'Fast setup, major EHR integrations, voice commands', category: 'AI Scribing' },
  { name: 'Augmedix', website: 'https://www.augmedix.com', strengths: 'AI + human review, real-time notes, multi-specialty', category: 'AI Scribing' },
  { name: 'Sprypt AI', website: 'https://www.sprypt.com', strengths: '90% burnout reduction, seamless EHR sync', category: 'AI Scribing' },
  { name: 'Notable', website: 'https://www.notablehealth.com', strengths: 'End-to-end automation, customizable workflows', category: 'AI Scribing' },
  { name: 'Freed AI', website: 'https://www.freed.ai', strengths: 'Affordable, flexible for small clinics', category: 'AI Scribing' },
  { name: 'Sunoh.ai', website: 'https://www.sunoh.ai', strengths: 'Contract flexibility, multilingual support', category: 'AI Scribing' },
  { name: 'CureMD AI Scribe', website: 'https://www.curemd.com', strengths: 'Customizable transcription, EHR-native', category: 'AI Scribing' },
  { name: 'OmniMD AI', website: 'https://www.omnimd.com', strengths: 'Real-time/async modes, HIPAA-compliant', category: 'AI Scribing' },
  { name: 'Ezyscribe', website: 'https://www.ezyscribe.com', strengths: 'Ambient AI, high accuracy for modern workflows', category: 'AI Scribing' },
  { name: 'Abridge', website: 'https://www.abridge.com', strengths: 'Mobile-friendly, patient summaries', category: 'AI Scribing' },
  { name: 'Nabla', website: 'https://www.nabla.com', strengths: 'Lightweight, easy deployment for solos', category: 'AI Scribing' },
  { name: 'Microsoft Dragon Copilot', website: 'https://www.microsoft.com', strengths: 'Deep EHR integration for large systems', category: 'AI Scribing' },
  { name: 'Vero Scribe', website: 'https://www.veroscribe.com', strengths: 'File uploads, pre-charting, complex cases', category: 'AI Scribing' },
  { name: 'Lindy', website: 'https://www.lindy.ai', strengths: 'No-code custom workflows, EMR-ready notes', category: 'AI Scribing' },
  // Sully.AI already in medical coding list, skipping duplicate
];

const rcmCompanies = [
  { name: 'R1 RCM', website: 'https://www.r1rcm.com', strengths: 'Full-cycle automation, $30B+ annual revenue processed, Best in KLAS', category: 'Revenue Cycle Management' },
  { name: 'Optum360', website: 'https://www.optum.com', strengths: 'AI coding/compliance, health system scale, predictive analytics', category: 'Revenue Cycle Management' },
  { name: 'Change Healthcare', website: 'https://www.changehealthcare.com', strengths: 'Claims EDI, payment analytics, payer-provider integration', category: 'Revenue Cycle Management' },
  { name: 'Waystar', website: 'https://www.waystar.com', strengths: 'Claims management leader (91.8 KLAS), denial prevention', category: 'Revenue Cycle Management' },
  { name: 'Ensemble Health', website: 'https://www.ensemblehp.com', strengths: 'End-to-end RCM (95.1 KLAS), patient engagement', category: 'Revenue Cycle Management' },
  { name: 'Athenahealth', website: 'https://www.athenahealth.com', strengths: 'Cloud EHR+RCM, analytics for mid-size practices', category: 'Revenue Cycle Management' },
  { name: 'Oracle Cerner', website: 'https://www.cerner.com', strengths: 'Integrated clinical/financial workflows, data insights', category: 'Revenue Cycle Management' },
  { name: 'FinThrive', website: 'https://www.finthrive.com', strengths: 'RPA platform, predictive analytics end-to-end', category: 'Revenue Cycle Management' },
  { name: 'TriZetto (Cognizant)', website: 'https://www.trizetto.com', strengths: 'Payer-provider tools, value-based care', category: 'Revenue Cycle Management' },
  { name: 'Experian Health', website: 'https://www.experian.com/healthcare', strengths: 'Identity verification, contract management (90.3 KLAS)', category: 'Revenue Cycle Management' },
  { name: 'NextGen Healthcare', website: 'https://www.nextgen.com', strengths: 'Ambulatory focus, cloud billing', category: 'Revenue Cycle Management' },
  { name: 'TruBridge', website: 'https://www.trubridge.com', strengths: 'Cloud RCM for community hospitals', category: 'Revenue Cycle Management' },
  { name: 'Epic Systems', website: 'https://www.epic.com', strengths: 'Integrated RCM/EHR for large hospitals', category: 'Revenue Cycle Management' },
  { name: 'Sprypt', website: 'https://www.sprypt.com', strengths: 'AI-human hybrid, 300% ROI claims', category: 'Revenue Cycle Management' },
  { name: 'RevSpring', website: 'https://www.revspringinc.com', strengths: 'Patient engagement leader (90.3 KLAS)', category: 'Revenue Cycle Management' },
];

const telemedicineCompanies = [
  { name: 'Teladoc Health', website: 'https://www.teladoc.com', strengths: 'Global scale, 24/7 multi-specialty, AI triage', category: 'Telemedicine/Virtual Care' },
  { name: 'Amwell', website: 'https://www.amwell.com', strengths: 'White-label, insurance integration, provider marketplace', category: 'Telemedicine/Virtual Care' },
  { name: 'Doxy.me', website: 'https://www.doxy.me', strengths: 'Free HIPAA-compliant, seamless for small practices', category: 'Telemedicine/Virtual Care' },
  { name: 'MDLive', website: 'https://www.mdlive.com', strengths: 'Enterprise scheduling, EHR sync, mobile-first', category: 'Telemedicine/Virtual Care' },
  { name: 'Sesame Care', website: 'https://www.sesamecare.com', strengths: 'Transparent pricing, longer visits, doctor pay focus', category: 'Telemedicine/Virtual Care' },
  { name: 'PlushCare', website: 'https://www.plushcare.com', strengths: 'Primary care focus, prescriptions, high satisfaction', category: 'Telemedicine/Virtual Care' },
  { name: 'HealthTap', website: 'https://www.healthtap.com', strengths: 'AI assistant, global access, multilingual', category: 'Telemedicine/Virtual Care' },
  { name: 'Babylon Health', website: 'https://www.babylonhealth.com', strengths: 'Chronic care, tech-driven accessibility', category: 'Telemedicine/Virtual Care' },
  { name: 'Mend', website: 'https://www.mend.com', strengths: 'Subscription models, patient engagement', category: 'Telemedicine/Virtual Care' },
  { name: 'Chiron Health', website: 'https://www.chironhealth.com', strengths: 'Chronic management, automated scheduling', category: 'Telemedicine/Virtual Care' },
];

const staffSchedulingCompanies = [
  { name: 'QGenda', website: 'https://www.qgenda.com', strengths: 'Enterprise rules-based scheduling, credential tracking, real-time analytics', category: 'Staff Scheduling' },
  { name: 'Vars Health', website: 'https://www.varshealth.com', strengths: 'Mobile-first, automated notifications, shift swapping for clinics', category: 'Staff Scheduling' },
  { name: 'Connecteam', website: 'https://www.connecteam.com', strengths: 'Drag-and-drop, free tier, HIPAA-compliant communication', category: 'Staff Scheduling' },
  { name: 'Rotageek', website: 'https://www.rotageek.com', strengths: 'AI labor forecasting, skills-based assignment', category: 'Staff Scheduling' },
  { name: 'AMiON', website: 'https://www.amion.com', strengths: 'Provider-focused, Epic integration, mobile access', category: 'Staff Scheduling' },
  { name: 'Epic Scheduler', website: 'https://www.epic.com', strengths: 'Seamless EHR alignment, patient self-booking', category: 'Staff Scheduling' },
  { name: 'FlowForma', website: 'https://www.flowforma.com', strengths: 'No-code automation, Microsoft 365 sync', category: 'Staff Scheduling' },
  { name: 'Deputy', website: 'https://www.deputy.com', strengths: 'Shift templates, conflict detection', category: 'Staff Scheduling' },
  { name: 'ShiftWizard', website: 'https://www.shiftwizard.com', strengths: 'HealthStream-backed, overtime alerts', category: 'Staff Scheduling' },
  { name: 'Teambridge', website: 'https://www.teambridge.com', strengths: 'Custom logic for agencies, locums support', category: 'Staff Scheduling' },
];

const allCompanies = [
  ...medicalCodingCompanies,
  ...aiScribingCompanies,
  ...rcmCompanies,
  ...telemedicineCompanies,
  ...staffSchedulingCompanies,
];

// Helper function to determine card size
function getCardSize(company: typeof allCompanies[0]): { cols: number; rows: number } {
  const nameLength = company.name.length;
  const descLength = company.strengths.length;
  
  if (nameLength > 20 || descLength > 100) {
    return { cols: 3, rows: 2 };
  } else if (nameLength > 15 || descLength > 80) {
    return { cols: 2, rows: 2 };
  } else {
    return { cols: 2, rows: 1 };
  }
}

async function seedVendorsForHub() {
  // Use dynamic imports after env vars are loaded
  const { default: connectDB } = await import('../src/lib/db');
  const { default: Vendor } = await import('../src/models/Vendor');
  
  try {
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing seed vendors (those with userId starting with "seed-")
    const deletedCount = await Vendor.deleteMany({ userId: /^seed-/ });
    if (deletedCount.deletedCount > 0) {
      console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing seed vendors`);
    }
    
    console.log('📝 Creating vendors for Solutions Hub...');

    let displayId = 1;
    const createdVendors = [];

    // Track used userIds to avoid duplicates
    const usedUserIds = new Set<string>();
    
    for (const company of allCompanies) {
      const { cols, rows } = getCardSize(company);
      
      // Generate unique userId, handling duplicates
      let baseUserId = `seed-${company.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
      let userId = baseUserId;
      let counter = 1;
      
      // Ensure userId is unique
      while (usedUserIds.has(userId)) {
        userId = `${baseUserId}-${counter}`;
        counter++;
      }
      usedUserIds.add(userId);
      
      const vendorData = {
        userId,
        companyName: company.name,
        companyType: 'Enterprise',
        website: company.website,
        location: {
          state: 'CA',
          country: 'United States',
        },
        companySize: '1000+',
        primaryContact: {
          name: 'Contact',
          title: 'Sales',
          email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: '555-0000',
        },
        preferredContactMethod: 'Email',
        bestTimeToContactDays: 'Monday - Friday',
        bestTimeToContactStartTime: '09:00',
        bestTimeToContactEndTime: '17:00',
        bestTimeToContactTimeZone: 'PST',
        solutionName: company.name,
        solutionDescription: company.strengths,
        solutionCategory: [company.category],
        targetSpecialties: [],
        targetInstitutionTypes: [],
        keyFeatures: [],
        technologyStack: [],
        deploymentOptions: ['Cloud'],
        integrationCapabilities: [],
        complianceCertifications: ['HIPAA'],
        securityFeatures: [],
        dataHandling: 'Secure cloud-based processing',
        pricingModel: 'Subscription',
        pricingRange: '$50,000 - $100,000',
        contractTerms: ['Annual'],
        implementationTime: '1-3 months',
        supportOffered: ['24/7 Support'],
        trainingProvided: ['Online Training'],
        currentClients: [],
        competitiveAdvantages: [],
        status: 'approved',
        submittedAt: new Date(),
        displayId: displayId++,
        cardCols: cols,
        cardRows: rows,
      };

      // Use upsert to update existing or create new vendor
      await Vendor.findOneAndUpdate(
        { userId }, // Find by userId (unique)
        vendorData,
        { upsert: true, new: true, runValidators: true }
      );
      createdVendors.push(company.name);
    }

    console.log(`✅ Successfully created/updated ${createdVendors.length} vendors`);
    console.log(`\n📊 Breakdown by category:`);
    
    const byCategory = allCompanies.reduce((acc, company) => {
      if (!acc[company.category]) acc[company.category] = [];
      acc[company.category].push(company.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(byCategory).forEach(([category, names]) => {
      console.log(`   ${category}: ${names.length} companies`);
    });

    console.log('\n💡 Note: These vendors use placeholder userIds. In production, vendors should register through the app.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding vendors:', error);
    process.exit(1);
  }
}

seedVendorsForHub();

