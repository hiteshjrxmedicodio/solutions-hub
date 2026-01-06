import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function PUT(request: NextRequest) {
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
        { success: false, error: "Forbidden - Super admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { vendorUserId, updates } = body;

    if (!vendorUserId || !updates) {
      return NextResponse.json(
        { success: false, error: "vendorUserId and updates are required" },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ userId: vendorUserId });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Update vendor with provided fields
    Object.keys(updates).forEach((key) => {
      (vendor as any)[key] = updates[key];
    });

    await vendor.save();

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error updating vendor:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update vendor",
      },
      { status: 500 }
    );
  }
}


