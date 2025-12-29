import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import { syncClerkUserToDB } from "@/lib/syncClerkUser";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    // Transform the form data to match the schema
    const vendorData = {
      userId,
      companyName: body.companyName,
      companyType: body.companyType,
      companyTypeOther: body.companyTypeOther,
      website: body.website,
      foundedYear: body.foundedYear,
      location: {
        state: body.state,
        country: body.country || "United States",
        countryOther: body.countryOther,
      },
      companySize: body.companySize,
      missionStatement: body.missionStatement,
      headquarters: body.headquarters,
      primaryContact: {
        name: body.primaryContactName,
        title: body.primaryContactTitle,
        email: body.primaryContactEmail,
        phone: body.primaryContactPhone,
      },
      secondaryContact: body.secondaryContactName ? {
        name: body.secondaryContactName,
        title: body.secondaryContactTitle,
        email: body.secondaryContactEmail,
        phone: body.secondaryContactPhone,
      } : undefined,
      preferredContactMethod: body.preferredContactMethod || "Email",
      bestTimeToContactDays: body.bestTimeToContactDays,
      bestTimeToContactStartTime: body.bestTimeToContactStartTime,
      bestTimeToContactEndTime: body.bestTimeToContactEndTime,
      bestTimeToContactTimeZone: body.bestTimeToContactTimeZone,
      bestTimeToContactTimeZoneOther: body.bestTimeToContactTimeZoneOther,
      solutionName: body.solutionName,
      solutionDescription: body.solutionDescription,
      productDescription: body.productDescription,
      solutionCategory: body.solutionCategory || [],
      targetSpecialties: body.targetSpecialties || [],
      specialtiesPerformance: body.specialtiesPerformance || [],
      targetInstitutionTypes: body.targetInstitutionTypes || [],
      keyFeatures: body.keyFeatures || [],
      keyFeaturesOther: body.keyFeaturesOther,
      technologyStack: body.technologyStack || [],
      technologyStackOther: body.technologyStackOther,
      deploymentOptions: body.deploymentOptions || [],
      integrationCapabilities: body.integrationCapabilities || [],
      integrationCapabilitiesOther: body.integrationCapabilitiesOther,
      integrations: body.integrations || [],
      complianceCertifications: body.complianceCertifications || [],
      complianceCertificationsOther: body.complianceCertificationsOther,
      certificationDocuments: body.certificationDocuments || [],
      securityFeatures: body.securityFeatures || [],
      securityFeaturesOther: body.securityFeaturesOther,
      dataHandling: body.dataHandling,
      auditTrails: body.auditTrails,
      regulatoryUpdateFrequency: body.regulatoryUpdateFrequency,
      pricingModel: body.pricingModel,
      pricingRange: body.pricingRange,
      pricingPlans: body.pricingPlans || [],
      freemiumOptions: body.freemiumOptions,
      roiCalculator: body.roiCalculator,
      contractTerms: body.contractTerms || [],
      implementationTime: body.implementationTime,
      supportOffered: body.supportOffered || [],
      supportOfferedOther: body.supportOfferedOther,
      supportSLAs: body.supportSLAs,
      trainingProvided: body.trainingProvided || [],
      trainingProvidedOther: body.trainingProvidedOther,
      demoLink: body.demoLink,
      trialLink: body.trialLink,
      onboardingProcess: body.onboardingProcess,
      currentClients: body.currentClients || [],
      clientCount: body.clientCount,
      caseStudies: body.caseStudies,
      testimonials: body.testimonials,
      customerTestimonials: body.customerTestimonials || [],
      awards: body.awards || [],
      competitiveAdvantages: body.competitiveAdvantages || [],
      competitiveAdvantagesOther: body.competitiveAdvantagesOther,
      futureRoadmap: body.futureRoadmap,
      additionalNotes: body.additionalNotes,
      teamMembers: body.teamMembers || [],
      keyMetrics: body.keyMetrics || {},
      status: "submitted",
      submittedAt: new Date(),
    };

    // Upsert: update if exists, create if not
    const vendor = await Vendor.findOneAndUpdate(
      { userId },
      vendorData,
      { new: true, upsert: true, runValidators: true }
    );

    // Update user profile flag
    await User.findOneAndUpdate(
      { userId },
      {
        hasVendorProfile: true,
        profileCompletedAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error saving vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save vendor profile",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Sync user data from Clerk
    await syncClerkUserToDB();
    
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: "Vendor profile not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error fetching vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch vendor profile",
      },
      { status: 500 }
    );
  }
}

