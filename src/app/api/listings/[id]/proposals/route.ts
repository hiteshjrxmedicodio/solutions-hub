import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Vendor from "@/models/Vendor";

// POST - Submit a proposal for a listing
export async function POST(
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
    
    // Check if listing is active
    if (listing.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: "This listing is not accepting proposals",
        },
        { status: 400 }
      );
    }
    
    // Get vendor information
    const vendor = await Vendor.findOne({ userId: user.id });
    if (!vendor) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor profile not found. Please create a vendor profile first.",
        },
        { status: 400 }
      );
    }
    
    // Check if vendor already submitted a proposal
    const existingProposal = listing.proposals?.find(
      (p) => p.vendorUserId === user.id
    );
    
    if (existingProposal) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted a proposal for this listing",
        },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Add proposal
    const proposal = {
      vendorUserId: user.id,
      vendorName: vendor.companyName,
      proposalText: body.proposalText,
      proposedPrice: body.proposedPrice,
      proposedTimeline: body.proposedTimeline,
      submittedAt: new Date(),
      status: 'pending' as const,
    };
    
    if (!listing.proposals) {
      listing.proposals = [];
    }
    
    listing.proposals.push(proposal);
    listing.proposalsCount = listing.proposals.length;
    await listing.save();
    
    return NextResponse.json({
      success: true,
      data: proposal,
      message: "Proposal submitted successfully",
    });
  } catch (error: any) {
    console.error("Error submitting proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit proposal",
      },
      { status: 500 }
    );
  }
}

