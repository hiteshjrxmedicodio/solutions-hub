import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";

// GET - Fetch all listings where vendor has accepted proposals
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vendorUserId: string }> }
) {
  try {
    const { vendorUserId } = await params;
    await connectDB();
    
    // Handle special case for seed-medicodio
    const actualVendorUserId = vendorUserId === "seed-medicodio" ? "seed-medicodio" : vendorUserId;
    
    // Find all listings where this vendor has an accepted proposal
    const listings = await Listing.find({
      "proposals.vendorUserId": actualVendorUserId,
      "proposals.status": "accepted",
    })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Filter to only include listings with accepted proposals from this vendor
    const solvedListings = listings.filter((listing) => {
      if (!listing.proposals) return false;
      return listing.proposals.some(
        (proposal) => proposal.vendorUserId === actualVendorUserId && proposal.status === "accepted"
      );
    });
    
    return NextResponse.json({
      success: true,
      data: solvedListings,
      count: solvedListings.length,
    });
  } catch (error: any) {
    console.error("Error fetching solved listings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch solved listings",
      },
      { status: 500 }
    );
  }
}

