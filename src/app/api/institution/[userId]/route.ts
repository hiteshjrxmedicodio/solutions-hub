import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await currentUser();
    const authUserId = user?.id;
    
    if (!authUserId || authUserId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
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

