import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    await connectDB();
    const vendor = await Vendor.findOne({ userId, status: 'approved' });

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: "Vendor profile not found or not approved",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error fetching vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch vendor profile",
      },
      { status: 500 }
    );
  }
}

