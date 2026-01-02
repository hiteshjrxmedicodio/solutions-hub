import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";
import User from "@/models/User";

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

    // Transform questionnaire data to match HealthcareInstitution schema
    const institutionData = {
      userId,
      // Institution Details
      institutionName: body.institutionName,
      institutionType: body.institutionType,
      location: {
        state: body.location?.state || "",
        country: body.location?.country === "Other" 
          ? (body.location?.countryOther || body.location?.country || "United States")
          : (body.location?.country || "United States"),
      },
      
      // Solution Categories (map to selectedAISolutions)
      selectedAISolutions: body.solutionCategories || [],
      
      // Priority (store in additionalNotes, but also extract if it was stored there)
      additionalNotes: body.priority ? `Priority: ${body.priority}` : (body.additionalNotes || ""),
      
      // Contact Information
      primaryContact: {
        name: body.primaryContact?.name || "",
        title: body.primaryContact?.title || "",
        email: body.primaryContact?.email || "",
        phone: body.primaryContact?.phone || "",
      },
      
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
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: institution,
    });
  } catch (error: any) {
    console.error("Error saving buyer questionnaire:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save buyer questionnaire",
      },
      { status: 500 }
    );
  }
}

