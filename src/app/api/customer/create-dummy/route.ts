import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";
import User from "@/models/User";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";

    if (!isSuperAdmin) {
      return NextResponse.json(
        { success: false, error: "Only super admin can create dummy profiles" },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if customer profile already exists
    const existingProfile = await HealthcareInstitution.findOne({ userId: user.id });
    if (existingProfile) {
      return NextResponse.json({
        success: true,
        message: "Customer profile already exists",
        data: existingProfile,
      });
    }

    // Create a complete dummy customer profile
    const dummyProfile = {
      userId: user.id,
      institutionName: "Sample Medical Center",
      institutionType: "Hospital",
      location: {
        state: "CA",
        country: "United States",
      },
      selectedAISolutions: ["AI Diagnostics", "Clinical Decision Support", "Predictive Analytics"],
      additionalNotes: "Priority: High",
      primaryContact: {
        name: user.firstName || "Admin",
        title: "Chief Medical Officer",
        email: userEmail,
        phone: "+1-555-0000",
      },
      status: "submitted",
      submittedAt: new Date(),
    };

    const institution = await HealthcareInstitution.create(dummyProfile);

    // Update user profile flag
    await User.findOneAndUpdate(
      { userId: user.id },
      {
        hasInstitutionProfile: true,
        profileCompletedAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Dummy customer profile created successfully",
      data: institution,
    });
  } catch (error: any) {
    console.error("Error creating dummy customer profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create dummy customer profile",
      },
      { status: 500 }
    );
  }
}

