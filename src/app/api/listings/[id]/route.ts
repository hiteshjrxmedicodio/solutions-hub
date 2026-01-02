import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

// GET - Fetch a single listing by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          error: "Listing not found",
        },
        { status: 404 }
      );
    }
    
    // Increment view count
    listing.viewsCount = (listing.viewsCount || 0) + 1;
    await listing.save();
    
    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch listing",
      },
      { status: 500 }
    );
  }
}

// PUT - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    await connectDB();
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          error: "Listing not found",
        },
        { status: 404 }
      );
    }
    
    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL;
    
    // Check if user owns the listing or is super admin
    if (listing.userId !== user.id && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You can only update your own listings",
        },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Update fields
    Object.keys(body).forEach((key) => {
      if (key !== '_id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
        (listing as any)[key] = body[key];
      }
    });
    
    // Set published date if status changed to active
    if (body.status === 'active' && listing.status !== 'active') {
      listing.publishedAt = new Date();
    }
    
    await listing.save();
    
    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update listing",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    await connectDB();
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          error: "Listing not found",
        },
        { status: 404 }
      );
    }
    
    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";
    
    // Check if user owns the listing or is super admin
    if (listing.userId !== user.id && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You can only delete your own listings",
        },
        { status: 403 }
      );
    }
    
    await Listing.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete listing",
      },
      { status: 500 }
    );
  }
}

