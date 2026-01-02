import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Vendor from "@/models/Vendor";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

// POST - Add dummy proposals to a listing
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

    // Check if user owns the listing or is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || user?.publicMetadata?.role === "superadmin";
    
    if (listing.userId !== user.id && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - You can only add proposals to your own listings",
        },
        { status: 403 }
      );
    }

    // Get some vendors to create dummy proposals
    const vendors = await Vendor.find({}).limit(3).lean();
    
    if (vendors.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No vendors found in database. Please create vendor profiles first.",
        },
        { status: 400 }
      );
    }

    // Create 3 dummy proposals
    const dummyProposals = [
      {
        vendorUserId: vendors[0].userId,
        vendorName: vendors[0].companyName || "TechMed Solutions",
        proposalText: "We are excited to propose our AI-powered diagnostic solution that integrates seamlessly with your existing EHR system. Our platform uses advanced machine learning algorithms to assist with clinical decision-making, reducing diagnostic errors by up to 40%. We offer comprehensive training and 24/7 support to ensure smooth implementation.",
        proposedPrice: "$150,000 - $200,000",
        proposedTimeline: "3-4 months",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: "pending" as const,
      },
      {
        vendorUserId: vendors[1]?.userId || vendors[0].userId,
        vendorName: vendors[1]?.companyName || "HealthAI Innovations",
        proposalText: "Our clinical decision support system has been successfully deployed in over 50 healthcare institutions. We specialize in AI diagnostics and can provide a customized solution tailored to your specific needs. Our team includes certified healthcare IT professionals who understand the unique challenges of clinical workflows.",
        proposedPrice: "$120,000 - $180,000",
        proposedTimeline: "2-3 months",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: "pending" as const,
      },
      {
        vendorUserId: vendors[2]?.userId || vendors[0].userId,
        vendorName: vendors[2]?.companyName || "MedTech Pro",
        proposalText: "We understand your need for an AI diagnostic solution that improves clinical decision-making. Our platform offers real-time analysis, seamless EHR integration, and comprehensive reporting. We've helped similar institutions reduce diagnostic turnaround time by 35% while maintaining high accuracy rates. Our solution is HIPAA compliant and includes ongoing maintenance and updates.",
        proposedPrice: "$180,000 - $250,000",
        proposedTimeline: "4-5 months",
        submittedAt: new Date(), // Today
        status: "pending" as const,
      },
    ];

    // Initialize proposals array if it doesn't exist
    if (!listing.proposals) {
      listing.proposals = [];
    }

    // Add dummy proposals (only if they don't already exist from these vendors)
    const existingVendorIds = listing.proposals.map((p: any) => p.vendorUserId);
    const newProposals = dummyProposals.filter(
      (proposal) => !existingVendorIds.includes(proposal.vendorUserId)
    );

    if (newProposals.length > 0) {
      listing.proposals.push(...newProposals);
      listing.proposalsCount = listing.proposals.length;
      await listing.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        added: newProposals.length,
        total: listing.proposals.length,
        proposals: listing.proposals,
      },
      message: `Successfully added ${newProposals.length} dummy proposal(s)`,
    });
  } catch (error: any) {
    console.error("Error adding dummy proposals:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add dummy proposals",
      },
      { status: 500 }
    );
  }
}

