import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    
    // Only allow super admin to access this special endpoint
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    // Find vendor with userId = "seed-medicodio"
    const vendor = await Vendor.findOne({ userId: "seed-medicodio" });

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: "Vendor profile not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error fetching seed-medicodio vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch vendor profile",
      },
      { status: 500 }
    );
  }
}

