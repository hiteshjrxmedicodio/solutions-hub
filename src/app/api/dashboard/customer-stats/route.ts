import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";

    // Get customer profile - for super admin, use their own userId
    let institution;
    if (isSuperAdmin) {
      // Super admin viewing their own customer profile
      institution = await HealthcareInstitution.findOne({ userId: user.id });
    } else {
      institution = await HealthcareInstitution.findOne({ userId: user.id });
    }

    if (!institution) {
      return NextResponse.json({
        success: true,
        data: {
          profileCompletionPercentage: 0,
        },
      });
    }

    // Calculate profile completion percentage based on customer questionnaire fields
    const calculateProfileCompletion = (institution: any): number => {
      let completedFields = 0;
      let totalFields = 0;

      // Section 1: Institution Details (4 fields)
      totalFields += 4;
      if (institution.institutionName) completedFields++;
      if (institution.institutionType) completedFields++;
      if (institution.location?.state) completedFields++;
      if (institution.location?.country) completedFields++;

      // Section 2: Solution Categories (1 field)
      totalFields += 1;
      if (institution.selectedAISolutions && institution.selectedAISolutions.length > 0) completedFields++;

      // Section 3: Priority (1 field - stored in additionalNotes)
      totalFields += 1;
      if (institution.additionalNotes && institution.additionalNotes.startsWith("Priority: ")) completedFields++;

      // Section 4: Contact Information (4 fields)
      totalFields += 4;
      if (institution.primaryContact?.name) completedFields++;
      if (institution.primaryContact?.title) completedFields++;
      if (institution.primaryContact?.email) completedFields++;
      if (institution.primaryContact?.phone) completedFields++;

      return Math.round((completedFields / totalFields) * 100);
    };

    const profileCompletionPercentage = calculateProfileCompletion(institution);

    return NextResponse.json({
      success: true,
      data: {
        profileCompletionPercentage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching customer stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch customer stats",
      },
      { status: 500 }
    );
  }
}

