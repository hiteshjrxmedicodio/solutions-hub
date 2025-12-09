import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import HealthcareInstitution from "@/models/HealthcareInstitution";
import Vendor from "@/models/Vendor";
import { syncClerkUserToDB } from "@/lib/syncClerkUser";

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
    
    // Sync user data from Clerk
    let userDoc = await syncClerkUserToDB();
    
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: "Failed to sync user data" },
        { status: 500 }
      );
    }

    // Check if user has profiles
    const hasInstitution = await HealthcareInstitution.findOne({ userId });
    const hasVendor = await Vendor.findOne({ userId });
    
    // Update profile flags
    userDoc.hasInstitutionProfile = !!hasInstitution;
    userDoc.hasVendorProfile = !!hasVendor;
    if ((hasInstitution || hasVendor) && !userDoc.profileCompletedAt) {
      userDoc.profileCompletedAt = new Date();
    }
    await userDoc.save();

    return NextResponse.json({
      success: true,
      data: userDoc,
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Sync user data from Clerk first
    let userDoc = await syncClerkUserToDB();
    
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: "Failed to sync user data" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Update role if provided
    if (body.role !== undefined) {
      userDoc.role = body.role;
    }

    // Update preferences if provided
    if (body.preferences) {
      userDoc.preferences = {
        ...userDoc.preferences,
        ...body.preferences,
      };
    }

    await userDoc.save();

    return NextResponse.json({
      success: true,
      data: userDoc,
    });
  } catch (error: any) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save user",
      },
      { status: 500 }
    );
  }
}

