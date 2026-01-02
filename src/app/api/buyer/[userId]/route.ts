import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await currentUser();
    const authUserId = user?.id;
    const userEmail = user?.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";
    
    // Allow access if user is viewing their own profile or is super admin
    if (!authUserId || (authUserId !== userId && !isSuperAdmin)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const institution = await HealthcareInstitution.findOne({ userId });

    if (!institution) {
      return NextResponse.json({
        success: true,
        data: null, // Return null instead of error to allow creating profile
      });
    }

    return NextResponse.json({
      success: true,
      data: institution,
    });
  } catch (error: any) {
    console.error("Error fetching buyer profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch buyer profile",
      },
      { status: 500 }
    );
  }
}

