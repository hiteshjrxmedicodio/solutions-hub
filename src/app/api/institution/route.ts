import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";
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
    const institutionData = {
      userId,
      selectedAISolutions: body.selectedAISolutions || [],
      institutionName: body.institutionName,
      institutionType: body.institutionType,
      location: {
        state: body.state,
        country: body.country || "United States",
      },
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
      bestTimeToContact: body.bestTimeToContact,
      medicalSpecialties: body.medicalSpecialties || [],
      patientVolume: body.patientVolume,
      currentSystems: body.currentSystems || [],
      complianceRequirements: body.complianceRequirements || [],
      integrationRequirements: body.integrationRequirements || [],
      integrationRequirementsOther: body.integrationRequirementsOther,
      dataSecurityNeeds: body.dataSecurityNeeds || [],
      dataSecurityNeedsOther: body.dataSecurityNeedsOther,
      primaryChallenges: body.primaryChallenges || [],
      primaryChallengesOther: body.primaryChallengesOther,
      currentPainPoints: body.currentPainPoints || [],
      currentPainPointsOther: body.currentPainPointsOther,
      goals: body.goals || [],
      goalsOther: body.goalsOther,
      interestedSolutionAreas: body.interestedSolutionAreas || [],
      specificSolutions: body.specificSolutions || [],
      mustHaveFeatures: body.mustHaveFeatures || [],
      mustHaveFeaturesOther: body.mustHaveFeaturesOther,
      niceToHaveFeatures: body.niceToHaveFeatures || [],
      niceToHaveFeaturesOther: body.niceToHaveFeaturesOther,
      budgetRange: body.budgetRange,
      timeline: body.timeline,
      decisionMakers: body.decisionMakers || [],
      decisionMakersOther: body.decisionMakersOther,
      procurementProcess: body.procurementProcess || [],
      procurementProcessOther: body.procurementProcessOther,
      additionalNotes: body.additionalNotes,
      status: "submitted",
      submittedAt: new Date(),
    };

    // Upsert: update if exists, create if not
    const institution = await HealthcareInstitution.findOneAndUpdate(
      { userId },
      institutionData,
      { new: true, upsert: true, runValidators: true }
    );

    // Update user profile flag
    await User.findOneAndUpdate(
      { userId },
      {
        hasInstitutionProfile: true,
        profileCompletedAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      data: institution,
    });
  } catch (error: any) {
    console.error("Error saving institution profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save institution profile",
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
    
    const institution = await HealthcareInstitution.findOne({ userId });

    if (!institution) {
      return NextResponse.json({
        success: false,
        error: "Institution profile not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: institution,
    });
  } catch (error: any) {
    console.error("Error fetching institution profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch institution profile",
      },
      { status: 500 }
    );
  }
}

