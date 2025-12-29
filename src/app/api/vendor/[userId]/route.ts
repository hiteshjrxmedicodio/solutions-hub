import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

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
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: "Vendor profile not found",
      });
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

export async function PUT(
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
    const body = await request.json();
    const vendor = await Vendor.findOne({ userId });

    if (!vendor) {
      return NextResponse.json({
        success: false,
        error: "Vendor profile not found",
      }, { status: 404 });
    }

    // Update vendor with provided fields
    Object.keys(body).forEach((key) => {
      (vendor as any)[key] = body[key];
    });

    await vendor.save();

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error updating vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update vendor profile",
      },
      { status: 500 }
    );
  }
}

