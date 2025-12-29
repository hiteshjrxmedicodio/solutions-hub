import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import HealthcareInstitution from "@/models/HealthcareInstitution";

// GET - Fetch all listings (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const userId = searchParams.get('userId'); // Filter by user's listings
    
    const query: any = {};
    
    // Only show active listings by default (unless filtering by user's own listings)
    if (userId) {
      query.userId = userId;
    } else if (!status) {
      query.status = 'active';
    } else {
      query.status = status;
    }
    
    if (category) {
      query.category = { $in: [category] };
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    return NextResponse.json({
      success: true,
      data: listings,
      count: listings.length,
    });
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch listings",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    await connectDB();
    const body = await request.json();
    
    // Try to get institution data if available
    let institutionData = null;
    try {
      const institution = await HealthcareInstitution.findOne({ userId: user.id });
      if (institution) {
        institutionData = institution;
      }
    } catch (err) {
      // Institution not found, continue without it
    }
    
    // Prepare listing data
    const listingData: any = {
      userId: user.id,
      title: body.title,
      description: body.description,
      category: body.category || [],
      priority: body.priority || 'medium',
      requiredFeatures: body.requiredFeatures || [],
      preferredFeatures: body.preferredFeatures || [],
      technicalRequirements: body.technicalRequirements || [],
      integrationRequirements: body.integrationRequirements || [],
      complianceRequirements: body.complianceRequirements || [],
      budgetRange: body.budgetRange || 'Not specified',
      timeline: body.timeline || 'Exploring options',
      contractType: body.contractType || [],
      deploymentPreference: body.deploymentPreference || [],
      contactName: body.contactName || user.firstName || user.emailAddresses[0]?.emailAddress || '',
      contactEmail: body.contactEmail || user.emailAddresses[0]?.emailAddress || '',
      contactPhone: body.contactPhone || '',
      contactTitle: body.contactTitle || '',
      additionalNotes: body.additionalNotes || '',
      status: body.status || 'draft',
    };
    
    // Auto-fill from institution data if available
    if (institutionData) {
      listingData.institutionId = institutionData._id.toString();
      listingData.institutionName = institutionData.institutionName;
      listingData.institutionType = institutionData.institutionType;
      listingData.medicalSpecialties = institutionData.medicalSpecialties || [];
      listingData.currentSystems = institutionData.currentSystems || [];
      
      if (!listingData.contactName && institutionData.primaryContact?.name) {
        listingData.contactName = institutionData.primaryContact.name;
      }
      if (!listingData.contactEmail && institutionData.primaryContact?.email) {
        listingData.contactEmail = institutionData.primaryContact.email;
      }
      if (!listingData.contactPhone && institutionData.primaryContact?.phone) {
        listingData.contactPhone = institutionData.primaryContact.phone;
      }
      if (!listingData.contactTitle && institutionData.primaryContact?.title) {
        listingData.contactTitle = institutionData.primaryContact.title;
      }
    }
    
    // Set published date if status is active
    if (listingData.status === 'active') {
      listingData.publishedAt = new Date();
    }
    
    const listing = new Listing(listingData);
    await listing.save();
    
    return NextResponse.json({
      success: true,
      data: listing,
    });
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create listing",
      },
      { status: 500 }
    );
  }
}

