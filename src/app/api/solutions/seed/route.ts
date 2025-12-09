import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolutionCard from '@/models/SolutionCard';

// 65 diverse healthcare solution cards
const DUMMY_CARDS = [
  { id: 1, cols: 4, rows: 2, title: "Clinical Decision Support", description: "Advanced AI-powered tools for evidence-based clinical decision making", category: "Clinical" },
  { id: 2, cols: 3, rows: 1, title: "Patient Monitoring", description: "Real-time patient health tracking and alerts" },
  { id: 3, cols: 2, rows: 2, title: "Telemedicine Platform", description: "Comprehensive virtual care delivery system with integrated scheduling and billing", category: "Telehealth" },
  { id: 4, cols: 3, rows: 2, title: "Electronic Health Records", description: "Seamless EHR integration with interoperability standards" },
  { id: 5, cols: 3, rows: 1, title: "Lab Integration", description: "Automated lab result processing and delivery" },
  { id: 6, cols: 2, rows: 2, title: "Pharmacy Management", description: "Streamlined medication ordering and tracking" },
  { id: 7, cols: 4, rows: 1, title: "Population Health Analytics", description: "Advanced analytics platform for population health management and predictive insights", category: "Analytics" },
  { id: 8, cols: 3, rows: 2, title: "Scheduling System", description: "Intelligent appointment scheduling and optimization" },
  { id: 9, cols: 2, rows: 1, title: "Revenue Cycle Management", description: "End-to-end revenue cycle optimization with automated claims processing", category: "Financial" },
  { id: 10, cols: 4, rows: 2, title: "Care Coordination", description: "Multi-provider care coordination and communication platform" },
  { id: 11, cols: 2, rows: 2, title: "Documentation Tools", description: "AI-assisted clinical documentation" },
  { id: 12, cols: 4, rows: 1, title: "Referral Management", description: "Streamlined referral workflow automation" },
  { id: 13, cols: 4, rows: 2, title: "Enterprise Integration Platform", description: "Comprehensive API and integration hub for seamless system connectivity" },
  { id: 14, cols: 2, rows: 1, title: "Quality Metrics", description: "Real-time quality measure tracking" },
  { id: 15, cols: 4, rows: 1, title: "Compliance Tools", description: "HIPAA and regulatory compliance automation" },
  { id: 16, cols: 2, rows: 2, title: "Patient Engagement", description: "Multi-channel patient communication and education platform" },
  { id: 17, cols: 2, rows: 2, title: "Workflow Automation", description: "Intelligent workflow orchestration with customizable rules engine", category: "Automation" },
  { id: 18, cols: 2, rows: 2, title: "Mobile App", description: "Native mobile application for providers" },
  { id: 19, cols: 3, rows: 1, title: "Reporting Dashboard", description: "Customizable analytics and reporting" },
  { id: 20, cols: 4, rows: 2, title: "Data Analytics", description: "Advanced business intelligence and predictive analytics" },
  { id: 21, cols: 3, rows: 1, title: "Security Suite", description: "Enterprise-grade security and access control" },
  { id: 22, cols: 2, rows: 2, title: "Billing Solutions", description: "Automated billing and claims management with denial prevention", category: "Financial" },
  { id: 23, cols: 4, rows: 1, title: "Inventory Management", description: "Medical supply and inventory tracking" },
  { id: 24, cols: 3, rows: 2, title: "Clinical Research", description: "Tools for clinical trial management and data collection" },
  { id: 25, cols: 4, rows: 1, title: "Training Platform", description: "Continuing education and certification tracking" },
  { id: 26, cols: 3, rows: 1, title: "Radiology PACS", description: "Picture archiving and communication system for medical imaging", category: "Imaging" },
  { id: 27, cols: 2, rows: 2, title: "Chronic Care Management", description: "Comprehensive platform for managing chronic conditions and care plans", category: "Clinical" },
  { id: 28, cols: 4, rows: 2, title: "Provider Network Management", description: "Tools for managing provider networks, credentials, and relationships" },
  { id: 29, cols: 2, rows: 1, title: "Prior Authorization", description: "Automated prior authorization request processing" },
  { id: 30, cols: 4, rows: 1, title: "Claims Processing", description: "Automated healthcare claims submission and processing system", category: "Financial" },
  { id: 31, cols: 3, rows: 2, title: "Patient Portal", description: "Secure online portal for patients to access health records and communicate", category: "Patient" },
  { id: 32, cols: 2, rows: 2, title: "Medication Reconciliation", description: "Automated medication list management and reconciliation" },
  { id: 33, cols: 4, rows: 1, title: "Risk Stratification", description: "AI-powered patient risk scoring and stratification tools", category: "Analytics" },
  { id: 34, cols: 3, rows: 1, title: "Clinical Pathways", description: "Evidence-based clinical pathway management and adherence tracking" },
  { id: 35, cols: 2, rows: 2, title: "Remote Patient Monitoring", description: "IoT-enabled remote monitoring devices and data integration", category: "Telehealth" },
  { id: 36, cols: 4, rows: 2, title: "Interoperability Hub", description: "FHIR-compliant data exchange and interoperability platform" },
  { id: 37, cols: 2, rows: 1, title: "Charge Capture", description: "Automated charge capture and coding optimization" },
  { id: 38, cols: 3, rows: 2, title: "Clinical Documentation Improvement", description: "CDI tools for enhancing documentation quality and accuracy", category: "Clinical" },
  { id: 39, cols: 4, rows: 1, title: "Provider Credentialing", description: "Streamlined provider credentialing and privileging workflow" },
  { id: 40, cols: 2, rows: 2, title: "Patient Satisfaction", description: "Real-time patient feedback collection and analysis platform", category: "Patient" },
  { id: 41, cols: 3, rows: 1, title: "Utilization Management", description: "Healthcare utilization review and management system" },
  { id: 42, cols: 4, rows: 2, title: "Value-Based Care Platform", description: "Comprehensive platform for value-based care delivery and reporting" },
  { id: 43, cols: 2, rows: 2, title: "Care Plan Builder", description: "Intelligent care plan creation and management tools" },
  { id: 44, cols: 4, rows: 1, title: "Denial Management", description: "Automated claim denial prevention and appeal management", category: "Financial" },
  { id: 45, cols: 3, rows: 2, title: "Clinical Trial Matching", description: "AI-powered patient-clinical trial matching platform" },
  { id: 46, cols: 2, rows: 1, title: "Provider Directory", description: "Comprehensive provider directory and search functionality" },
  { id: 47, cols: 4, rows: 2, title: "Health Information Exchange", description: "Regional HIE platform for secure health data sharing" },
  { id: 48, cols: 2, rows: 2, title: "Medication Therapy Management", description: "Comprehensive MTM services and medication optimization", category: "Clinical" },
  { id: 49, cols: 4, rows: 1, title: "Cost Transparency", description: "Patient cost estimation and price transparency tools", category: "Financial" },
  { id: 50, cols: 3, rows: 1, title: "Clinical Alerts", description: "Real-time clinical decision alerts and notifications system" },
  { id: 51, cols: 2, rows: 2, title: "Social Determinants", description: "SDOH screening, tracking, and resource referral platform", category: "Analytics" },
  { id: 52, cols: 4, rows: 2, title: "Care Management Platform", description: "Integrated care management for complex patient populations" },
  { id: 53, cols: 3, rows: 1, title: "Provider Performance", description: "Provider performance metrics and benchmarking dashboard" },
  { id: 54, cols: 2, rows: 2, title: "Medication Adherence", description: "Patient medication adherence tracking and intervention tools" },
  { id: 55, cols: 4, rows: 1, title: "Clinical Quality Measures", description: "Automated CQM calculation and reporting system" },
  { id: 56, cols: 3, rows: 2, title: "Telepsychiatry Platform", description: "Specialized telemedicine platform for mental health services", category: "Telehealth" },
  { id: 57, cols: 2, rows: 1, title: "Appointment Reminders", description: "Automated multi-channel appointment reminder system" },
  { id: 58, cols: 4, rows: 2, title: "Population Health Registry", description: "Comprehensive disease registry and population health management" },
  { id: 59, cols: 2, rows: 2, title: "Clinical Decision Rules", description: "Evidence-based clinical decision rule engine and implementation", category: "Clinical" },
  { id: 60, cols: 4, rows: 1, title: "Provider Communication", description: "Secure provider-to-provider communication and collaboration" },
  { id: 61, cols: 3, rows: 1, title: "Patient Flow Management", description: "Real-time patient flow optimization and capacity management" },
  { id: 62, cols: 2, rows: 2, title: "Medication Safety", description: "Drug interaction checking and medication safety alerts", category: "Clinical" },
  { id: 63, cols: 4, rows: 2, title: "Enterprise Analytics", description: "Advanced healthcare analytics and business intelligence platform", category: "Analytics" },
  { id: 64, cols: 3, rows: 1, title: "Provider Onboarding", description: "Streamlined provider onboarding and orientation system" },
  { id: 65, cols: 2, rows: 2, title: "Patient Self-Service", description: "Comprehensive patient self-service kiosk and mobile solutions", category: "Patient" },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing cards
    await SolutionCard.deleteMany({});

    // Insert new cards
    const result = await SolutionCard.insertMany(DUMMY_CARDS, {
      ordered: false, // Continue even if some fail
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${result.length} solution cards`,
        count: result.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error seeding solution cards:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed solution cards',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

