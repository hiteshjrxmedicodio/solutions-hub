import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import LinkedInCredentials from "@/models/LinkedInCredentials";

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

    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();
    const credentials = await LinkedInCredentials.findOne({ 
      userId: user.id,
      isActive: true 
    });

    if (!credentials) {
      return NextResponse.json({
        success: true,
        connected: false,
      });
    }

    // Check if token is expired
    const isExpired = credentials.expiresAt && new Date() >= credentials.expiresAt;

    return NextResponse.json({
      success: true,
      connected: !isExpired,
      expired: isExpired,
      personUrn: credentials.personUrn,
    });
  } catch (error: any) {
    console.error("Error checking LinkedIn status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to check LinkedIn status",
      },
      { status: 500 }
    );
  }
}
