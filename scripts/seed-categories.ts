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
  console.log('Checked for .env at:', envPath);
  console.log('Checked for .env.local at:', envLocalPath);
  console.log('\nMake sure your .env file contains:');
  console.log('MONGO_DB_URL=mongodb://localhost:27017/solutions-hub');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('MONGO_DB_URL:', process.env.MONGO_DB_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

const categories = [
  { id: 1, name: 'AI Medical Coding', primaryUseCase: 'ICD/CPT/HCPCS automation' },
  { id: 2, name: 'AI Scribing', primaryUseCase: 'Ambient clinical note generation' },
  { id: 3, name: 'AI Diagnostics', primaryUseCase: 'Imaging/pathology analysis' },
  { id: 4, name: 'Clinical Decision Support', primaryUseCase: 'Real-time treatment recommendations' },
  { id: 5, name: 'Precision Medicine', primaryUseCase: 'Genomic/personalized therapies' },
  { id: 6, name: 'Disease Detection', primaryUseCase: 'Early screening via ML' },
  { id: 7, name: 'Mental Health AI', primaryUseCase: 'Chatbots/therapy tools' },
  { id: 8, name: 'Drug Discovery', primaryUseCase: 'Molecular modeling' },
  { id: 9, name: 'Surgical Planning', primaryUseCase: 'Pre-op simulation' },
  { id: 10, name: 'Radiology AI', primaryUseCase: 'X-ray/CT/MRI interpretation' },
  { id: 11, name: 'Pathology Analysis', primaryUseCase: 'Tissue/slide diagnostics' },
  { id: 12, name: 'Genomics Interpretation', primaryUseCase: 'DNA sequence analysis' },
  { id: 13, name: 'Oncology Treatment', primaryUseCase: 'Cancer therapy planning' },
  { id: 14, name: 'Cardiology Risk', primaryUseCase: 'Heart disease prediction' },
  { id: 15, name: 'Dermatology Imaging', primaryUseCase: 'Skin lesion detection' },
  { id: 16, name: 'Neurology AI', primaryUseCase: 'Stroke/EEG analysis' },
  { id: 17, name: 'Ophthalmology AI', primaryUseCase: 'Retinal screening' },
  { id: 18, name: 'Orthopedics Planning', primaryUseCase: 'Fracture/joint analysis' },
  { id: 19, name: 'Endocrinology AI', primaryUseCase: 'Diabetes management prediction' },
  { id: 20, name: 'Pulmonology AI', primaryUseCase: 'Lung function/COVID monitoring' },
  { id: 21, name: 'Revenue Cycle Management', primaryUseCase: 'Billing/claims/denials' },
  { id: 22, name: 'Staff Scheduling', primaryUseCase: 'Nurse/provider shift optimization' },
  { id: 23, name: 'Practice Management', primaryUseCase: 'Receptionist/scheduling automation' },
  { id: 24, name: 'Provider Credentialing', primaryUseCase: 'Licensing/compliance tracking' },
  { id: 25, name: 'Patient Access', primaryUseCase: 'Intake/reminders' },
  { id: 26, name: 'Care Coordination', primaryUseCase: 'Nurse handoffs/population health' },
  { id: 27, name: 'Billing Automation', primaryUseCase: 'Invoice generation' },
  { id: 28, name: 'Claims Processing', primaryUseCase: 'Payer submissions' },
  { id: 29, name: 'Denial Management', primaryUseCase: 'Appeal prediction' },
  { id: 30, name: 'Insurance Verification', primaryUseCase: 'Eligibility checks' },
  { id: 31, name: 'Telemedicine/Virtual Care', primaryUseCase: 'AI triage/video platforms' },
  { id: 32, name: 'Remote Patient Monitoring', primaryUseCase: 'Wearables/RPM' },
  { id: 33, name: 'Predictive Analytics', primaryUseCase: 'Readmission risks' },
  { id: 34, name: 'Patient Engagement', primaryUseCase: 'Chatbots/adherence apps' },
  { id: 35, name: 'EHR/EMR Integrations', primaryUseCase: 'Workflow AI enhancements' },
  { id: 36, name: 'Administrative Automation', primaryUseCase: 'Routine task RPA' },
  { id: 37, name: 'Conversational AI', primaryUseCase: 'Virtual health assistants' },
  { id: 38, name: 'Surgical Robotics', primaryUseCase: 'Precision surgery guidance' },
  { id: 39, name: 'Public Health Management', primaryUseCase: 'Epidemic tracking' },
  { id: 40, name: 'Supply Chain Optimization', primaryUseCase: 'Inventory/drug logistics' },
  { id: 41, name: 'Inventory Management', primaryUseCase: 'Stock level prediction' },
  { id: 42, name: 'Cybersecurity Detection', primaryUseCase: 'Threat monitoring' },
  { id: 43, name: 'Fraud Prevention', primaryUseCase: 'Claims anomaly detection' },
  { id: 44, name: 'Population Health', primaryUseCase: 'Community risk stratification' },
  { id: 45, name: 'Virtual Nursing', primaryUseCase: 'Remote monitoring/alerts' },
  { id: 46, name: 'Ambient Monitoring', primaryUseCase: 'In-room patient safety' },
  { id: 47, name: 'Workflow Orchestration', primaryUseCase: 'Multi-team coordination' },
  { id: 48, name: 'Capacity Planning', primaryUseCase: 'Bed/staff forecasting' },
  { id: 49, name: 'Pharmacy Automation', primaryUseCase: 'Dispensing/error reduction' },
  { id: 50, name: 'Lab Workflow AI', primaryUseCase: 'Sample processing/triage' },
];

async function seedCategories() {
  // Use dynamic imports after env vars are loaded
  const { default: connectDB } = await import('../src/lib/db');
  const { default: Category } = await import('../src/models/Category');
  
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert categories
    await Category.insertMany(categories);
    console.log(`Successfully seeded ${categories.length} categories`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();

