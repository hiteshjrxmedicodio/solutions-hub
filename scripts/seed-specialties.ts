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

const specialties = [
  { id: 1, name: 'Cardiology', description: 'Heart and cardiovascular system' },
  { id: 2, name: 'Oncology', description: 'Cancer diagnosis and treatment' },
  { id: 3, name: 'Radiology', description: 'Medical imaging and diagnostics' },
  { id: 4, name: 'Pathology', description: 'Disease diagnosis through laboratory analysis' },
  { id: 5, name: 'Neurology', description: 'Nervous system disorders' },
  { id: 6, name: 'Orthopedics', description: 'Musculoskeletal system' },
  { id: 7, name: 'Dermatology', description: 'Skin, hair, and nails' },
  { id: 8, name: 'Ophthalmology', description: 'Eye and vision care' },
  { id: 9, name: 'Endocrinology', description: 'Hormones and metabolism' },
  { id: 10, name: 'Pulmonology', description: 'Respiratory system and lungs' },
  { id: 11, name: 'Gastroenterology', description: 'Digestive system' },
  { id: 12, name: 'Nephrology', description: 'Kidney diseases' },
  { id: 13, name: 'Urology', description: 'Urinary tract and male reproductive system' },
  { id: 14, name: 'Hematology', description: 'Blood and blood-forming organs' },
  { id: 15, name: 'Rheumatology', description: 'Autoimmune and inflammatory diseases' },
  { id: 16, name: 'Infectious Disease', description: 'Bacterial, viral, and fungal infections' },
  { id: 17, name: 'Emergency Medicine', description: 'Acute care and trauma' },
  { id: 18, name: 'Critical Care', description: 'Intensive care and life support' },
  { id: 19, name: 'Anesthesiology', description: 'Pain management and surgical anesthesia' },
  { id: 20, name: 'General Surgery', description: 'Surgical procedures' },
  { id: 21, name: 'Cardiothoracic Surgery', description: 'Heart, lungs, and chest surgery' },
  { id: 22, name: 'Neurosurgery', description: 'Brain and spinal cord surgery' },
  { id: 23, name: 'Plastic Surgery', description: 'Reconstructive and cosmetic surgery' },
  { id: 24, name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
  { id: 25, name: 'Pediatric Cardiology', description: 'Heart conditions in children' },
  { id: 26, name: 'Pediatric Oncology', description: 'Cancer in children' },
  { id: 27, name: 'Neonatology', description: 'Newborn intensive care' },
  { id: 28, name: 'Geriatrics', description: 'Medical care for elderly patients' },
  { id: 29, name: 'Internal Medicine', description: 'Adult primary care and disease prevention' },
  { id: 30, name: 'Family Medicine', description: 'Comprehensive care for all ages' },
  { id: 31, name: 'Obstetrics and Gynecology', description: 'Women\'s reproductive health' },
  { id: 32, name: 'Maternal-Fetal Medicine', description: 'High-risk pregnancies' },
  { id: 33, name: 'Psychiatry', description: 'Mental health and behavioral disorders' },
  { id: 34, name: 'Child Psychiatry', description: 'Mental health in children and adolescents' },
  { id: 35, name: 'Addiction Medicine', description: 'Substance use disorders' },
  { id: 36, name: 'Physical Medicine and Rehabilitation', description: 'Physical therapy and recovery' },
  { id: 37, name: 'Sports Medicine', description: 'Athletic injuries and performance' },
  { id: 38, name: 'Occupational Medicine', description: 'Workplace health and safety' },
  { id: 39, name: 'Preventive Medicine', description: 'Disease prevention and health promotion' },
  { id: 40, name: 'Allergy and Immunology', description: 'Allergies and immune system disorders' },
  { id: 41, name: 'Otolaryngology', description: 'Ear, nose, and throat' },
  { id: 42, name: 'Pain Management', description: 'Chronic and acute pain treatment' },
  { id: 43, name: 'Palliative Care', description: 'End-of-life and comfort care' },
  { id: 44, name: 'Hospice Medicine', description: 'Terminal illness care' },
  { id: 45, name: 'Sleep Medicine', description: 'Sleep disorders' },
  { id: 46, name: 'Nuclear Medicine', description: 'Radioactive imaging and treatment' },
  { id: 47, name: 'Interventional Radiology', description: 'Image-guided minimally invasive procedures' },
  { id: 48, name: 'Radiation Oncology', description: 'Radiation therapy for cancer' },
  { id: 49, name: 'Medical Oncology', description: 'Chemotherapy and cancer treatment' },
  { id: 50, name: 'Surgical Oncology', description: 'Cancer surgery' },
  { id: 51, name: 'Gynecologic Oncology', description: 'Female reproductive system cancers' },
  { id: 52, name: 'Pediatric Surgery', description: 'Surgery for children' },
  { id: 53, name: 'Trauma Surgery', description: 'Emergency and critical injury surgery' },
  { id: 54, name: 'Vascular Surgery', description: 'Blood vessel surgery' },
  { id: 55, name: 'Colorectal Surgery', description: 'Colon and rectal surgery' },
  { id: 56, name: 'Transplant Surgery', description: 'Organ transplantation' },
  { id: 57, name: 'Bariatric Surgery', description: 'Weight loss surgery' },
  { id: 58, name: 'Breast Surgery', description: 'Breast disease and cancer surgery' },
  { id: 59, name: 'Endocrine Surgery', description: 'Hormone-related organ surgery' },
  { id: 60, name: 'Hepatobiliary Surgery', description: 'Liver, gallbladder, and bile duct surgery' },
  { id: 61, name: 'Thoracic Surgery', description: 'Chest and lung surgery' },
  { id: 62, name: 'Cardiac Surgery', description: 'Heart surgery' },
  { id: 63, name: 'Electrophysiology', description: 'Heart rhythm disorders' },
  { id: 64, name: 'Interventional Cardiology', description: 'Minimally invasive heart procedures' },
  { id: 65, name: 'Hematology-Oncology', description: 'Blood cancers and disorders' },
  { id: 66, name: 'Medical Genetics', description: 'Genetic disorders and counseling' },
  { id: 68, name: 'Clinical Genetics', description: 'Genetic disease diagnosis' },
  { id: 69, name: 'Reproductive Endocrinology', description: 'Fertility and hormone disorders' },
  { id: 70, name: 'Reproductive Medicine', description: 'Fertility treatment' },
  { id: 71, name: 'Andrology', description: 'Male reproductive health' },
  { id: 72, name: 'Gynecology', description: 'Women\'s reproductive health' },
  { id: 73, name: 'Perinatology', description: 'High-risk pregnancy care' },
  { id: 74, name: 'Adolescent Medicine', description: 'Healthcare for teenagers' },
  { id: 75, name: 'Developmental Pediatrics', description: 'Child development disorders' },
  { id: 76, name: 'Pediatric Emergency Medicine', description: 'Emergency care for children' },
  { id: 77, name: 'Pediatric Intensive Care', description: 'Critical care for children' },
  { id: 78, name: 'Pediatric Neurology', description: 'Neurological disorders in children' },
  { id: 79, name: 'Pediatric Endocrinology', description: 'Hormone disorders in children' },
  { id: 80, name: 'Pediatric Gastroenterology', description: 'Digestive disorders in children' },
  { id: 81, name: 'Pediatric Hematology-Oncology', description: 'Blood disorders and cancer in children' },
  { id: 82, name: 'Pediatric Infectious Disease', description: 'Infections in children' },
  { id: 83, name: 'Pediatric Nephrology', description: 'Kidney diseases in children' },
  { id: 84, name: 'Pediatric Pulmonology', description: 'Respiratory disorders in children' },
  { id: 85, name: 'Pediatric Rheumatology', description: 'Autoimmune diseases in children' },
  { id: 86, name: 'Pediatric Urology', description: 'Urinary and genital disorders in children' },
  { id: 87, name: 'Forensic Psychiatry', description: 'Mental health and legal issues' },
  { id: 88, name: 'Geriatric Psychiatry', description: 'Mental health in elderly patients' },
  { id: 89, name: 'Psychosomatic Medicine', description: 'Mind-body interactions and psychological factors in physical illness' },
  { id: 90, name: 'Neuropsychiatry', description: 'Neurological and psychiatric disorders' },
  { id: 91, name: 'Consultation-Liaison Psychiatry', description: 'Psychiatry in medical settings' },
  { id: 92, name: 'Community Psychiatry', description: 'Public mental health' },
  { id: 93, name: 'Emergency Psychiatry', description: 'Crisis mental health care' },
  { id: 94, name: 'Addiction Psychiatry', description: 'Substance use and mental health' },
  { id: 95, name: 'Medical Toxicology', description: 'Poisoning and overdose treatment' },
  { id: 97, name: 'Hyperbaric Medicine', description: 'Oxygen therapy' },
  { id: 98, name: 'Aerospace Medicine', description: 'Aviation and space medicine' },
  { id: 99, name: 'Undersea Medicine', description: 'Diving and hyperbaric medicine' },
  { id: 100, name: 'Wilderness Medicine', description: 'Remote and outdoor emergency care' },
  { id: 101, name: 'Disaster Medicine', description: 'Mass casualty and disaster response' },
  { id: 102, name: 'Hospital Medicine', description: 'Inpatient care coordination' },
  { id: 103, name: 'Urgent Care', description: 'Acute non-emergency care' },
  { id: 104, name: 'Telemedicine', description: 'Remote healthcare delivery' },
  { id: 105, name: 'Primary Care', description: 'General medical care' },
];

async function seedSpecialties() {
  // Use dynamic imports after env vars are loaded
  const { default: connectDB } = await import('../src/lib/db');
  const { default: Specialty } = await import('../src/models/Specialty');
  
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing specialties
    await Specialty.deleteMany({});
    console.log('Cleared existing specialties');

    // Insert specialties
    await Specialty.insertMany(specialties);
    console.log(`Successfully seeded ${specialties.length} specialties`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding specialties:', error);
    process.exit(1);
  }
}

seedSpecialties();

