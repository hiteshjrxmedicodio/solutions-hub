import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import HealthcareInstitution from "@/models/HealthcareInstitution";

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

    const institution = await HealthcareInstitution.findOne({ userId });

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

