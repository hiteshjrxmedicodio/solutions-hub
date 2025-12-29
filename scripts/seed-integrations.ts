// IMPORTANT: Load environment variables FIRST, before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const envPath = resolve(process.cwd(), '.env');
const envLocalPath = resolve(process.cwd(), '.env.local');

// Load .env.local first (takes precedence), then .env
if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Verify MONGO_DB_URL is loaded
if (!process.env.MONGO_DB_URL) {
  console.error('❌ Error: MONGO_DB_URL not found in environment variables');
  console.log('Current working directory:', process.cwd());
  process.exit(1);
}

// Common EHRs/EMRs
const ehrs = [
  'Epic', 'Cerner', 'Allscripts', 'athenahealth', 'eClinicalWorks', 
  'NextGen', 'Greenway Health', 'AdvancedMD', 'CareCloud', 'Kareo',
  'DrChrono', 'Practice Fusion', 'SimplePractice', 'TherapyNotes', 'TheraNest'
];

// Payment systems
const payments = [
  'Stripe', 'Square', 'PayPal', 'Authorize.Net', 'Worldpay',
  'Adyen', 'Braintree', 'Payline', 'Payment Depot', 'Elavon'
];

// Forms/Data collection
const forms = [
  'JotForm', 'Typeform', 'Formstack', 'Wufoo', 'Google Forms',
  'Microsoft Forms', 'FormAssembly', '123FormBuilder', 'Cognito Forms', 'Formsite'
];

// Communication tools
const communication = [
  'Twilio', 'Vonage', 'RingCentral', 'Zoom', 'Microsoft Teams',
  'Slack', 'WhatsApp Business', 'Telegram', 'Signal', 'Webex'
];

// Scheduling systems
const scheduling = [
  'Calendly', 'Acuity Scheduling', 'Square Appointments', 'SimplyBook.me',
  'Appointlet', 'Setmore', '10to8', 'Bookly', 'Timely', 'Reservio'
];

// Billing systems
const billing = [
  'QuickBooks', 'Xero', 'FreshBooks', 'Zoho Books', 'Sage',
  'Wave', 'Invoice2go', 'Bill.com', 'Melio', 'PaySimple'
];

// Analytics tools
const analytics = [
  'Tableau', 'Power BI', 'Google Analytics', 'Mixpanel', 'Amplitude',
  'Looker', 'Qlik', 'Sisense', 'Domo', 'Chartio'
];

let integrationId = 1;

const integrations = [
  ...ehrs.map(name => ({ id: integrationId++, name, category: 'EHRs' as const })),
  ...payments.map(name => ({ id: integrationId++, name, category: 'Payments' as const })),
  ...forms.map(name => ({ id: integrationId++, name, category: 'Forms' as const })),
  ...communication.map(name => ({ id: integrationId++, name, category: 'Communication' as const })),
  ...scheduling.map(name => ({ id: integrationId++, name, category: 'Scheduling' as const })),
  ...billing.map(name => ({ id: integrationId++, name, category: 'Billing' as const })),
  ...analytics.map(name => ({ id: integrationId++, name, category: 'Analytics' as const })),
];

async function seedIntegrations() {
  // Use dynamic imports after env vars are loaded
  const { default: connectDB } = await import('../src/lib/db');
  const { default: Integration } = await import('../src/models/Integration');
  
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing integrations
    await Integration.deleteMany({});
    console.log('Cleared existing integrations');

    // Insert integrations
    await Integration.insertMany(integrations);
    console.log(`Successfully seeded ${integrations.length} integrations`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding integrations:', error);
    process.exit(1);
  }
}

seedIntegrations();

