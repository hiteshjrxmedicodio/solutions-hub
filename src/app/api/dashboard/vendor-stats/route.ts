import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Listing from "@/models/Listing";
import Vendor from "@/models/Vendor";
import SavedSearch from "@/models/SavedSearch";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com";

    // Get filter category from query params
    const { searchParams } = new URL(request.url);
    const filterCategory = searchParams.get("category");

    // Get vendor profile - for super admin, use seed-medicodio vendor
    let vendor;
    if (isSuperAdmin) {
      vendor = await Vendor.findOne({ userId: "seed-medicodio" });
    } else {
      vendor = await Vendor.findOne({ userId: user.id });
    }

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const vendorUserId = isSuperAdmin ? "seed-medicodio" : user.id;
    const allVendorCategories = vendor.solutionCategory || [];
    
    // Filter by selected category if provided (for data filtering)
    let filterCategories = allVendorCategories;
    if (filterCategory && filterCategory !== "all") {
      filterCategories = [filterCategory];
    }

    // 1. Recent listings visited (last 10 listings viewed by this vendor)
    // Note: We'll need to track this separately. For now, we'll get listings where vendor has proposals
    const listingsWithProposals = await Listing.find({
      "proposals.vendorUserId": vendorUserId,
    })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("title _id createdAt category status")
      .lean();

    // 2. Recent proposals sent (last 10 proposals)
    const recentProposals = await Listing.find({
      "proposals.vendorUserId": vendorUserId,
    })
      .select("title _id proposals status")
      .lean();

    const proposalsSent = recentProposals
      .flatMap((listing) =>
        listing.proposals
          ?.filter((p: any) => p.vendorUserId === vendorUserId)
          .map((p: any) => ({
            listingId: listing._id.toString(),
            listingTitle: listing.title,
            status: p.status,
            submittedAt: p.submittedAt,
            listingStatus: listing.status,
          })) || []
      )
      .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 10);

    // 3. Accepted proposals count
    const acceptedProposalsCount = await Listing.countDocuments({
      "proposals.vendorUserId": vendorUserId,
      "proposals.status": "accepted",
    });

    // 4. Number of people searching for your product
    // This would require tracking search queries. For now, we'll count listings in vendor's categories
    const listingsInVendorCategories = await Listing.find({
      category: { $in: filterCategories },
      status: "active",
    }).countDocuments();

    // 5. Number of people visiting categories that your product solves
    // Count total views of listings in vendor's categories
    const categoryViewsResult = await Listing.aggregate([
      {
        $match: {
          category: { $in: filterCategories },
          status: "active",
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewsCount" },
        },
      },
    ]);

    const categoryViews = categoryViewsResult[0]?.totalViews || 0;

    // 6. Company search count - Count searches that match vendor's categories or company name
    const companySearchCount = await SavedSearch.countDocuments({
      userRole: "buyer",
      isActive: true,
      $or: [
        {
          "searchCriteria.solutionCategories": { $in: filterCategories },
        },
        {
          "searchCriteria.specialties": { $in: filterCategories },
        },
      ],
    });

    // 7. Accepted proposals with status completed or in progress - Get full list
    const activeAcceptedProposalsQuery: any = {
      "proposals.vendorUserId": vendorUserId,
      "proposals.status": "accepted",
      status: { $in: ["in_progress", "completed"] },
    };
    
    // Filter by category if selected
    if (filterCategory && filterCategory !== "all") {
      activeAcceptedProposalsQuery.category = { $in: [filterCategory] };
    }
    
    const activeAcceptedProposalsList = await Listing.find(activeAcceptedProposalsQuery)
      .select("title _id category status createdAt")
      .sort({ updatedAt: -1 })
      .lean();

    const activeAcceptedProposals = activeAcceptedProposalsList.length;

    // Get all proposals with their statuses
    const allProposals = await Listing.find({
      "proposals.vendorUserId": vendorUserId,
    })
      .select("title _id proposals status")
      .lean();

    const proposalsByStatus = {
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    allProposals.forEach((listing) => {
      listing.proposals?.forEach((p: any) => {
        if (p.vendorUserId === vendorUserId) {
          proposalsByStatus[p.status as keyof typeof proposalsByStatus]++;
        }
      });
    });

    // Calculate profile completion percentage
    const calculateProfileCompletion = (vendor: any): number => {
      let completedFields = 0;
      let totalFields = 0;

      // Section 1: Company Information (7 fields)
      totalFields += 7;
      if (vendor.companyName) completedFields++;
      if (vendor.companyType) completedFields++;
      if (vendor.website) completedFields++;
      if (vendor.foundedYear) completedFields++;
      if (vendor.location?.state) completedFields++;
      if (vendor.location?.country) completedFields++;
      if (vendor.companySize) completedFields++;

      // Section 2: Contact Information (5 fields)
      totalFields += 5;
      if (vendor.primaryContact?.name) completedFields++;
      if (vendor.primaryContact?.email) completedFields++;
      if (vendor.primaryContact?.phone) completedFields++;
      if (vendor.preferredContactMethod) completedFields++;
      if (vendor.bestTimeToContactDays) completedFields++;

      // Section 3: Solution Information (8 fields)
      totalFields += 8;
      if (vendor.solutionName) completedFields++;
      if (vendor.solutionDescription) completedFields++;
      if (vendor.solutionCategory && vendor.solutionCategory.length > 0) completedFields++;
      if (vendor.targetSpecialties && vendor.targetSpecialties.length > 0) completedFields++;
      if (vendor.targetInstitutionTypes && vendor.targetInstitutionTypes.length > 0) completedFields++;
      if (vendor.keyFeatures && vendor.keyFeatures.length > 0) completedFields++;
      if (vendor.technologyStack && vendor.technologyStack.length > 0) completedFields++;
      if (vendor.deploymentOptions && vendor.deploymentOptions.length > 0) completedFields++;

      // Section 4: Compliance & Security (3 fields)
      totalFields += 3;
      if (vendor.complianceCertifications && vendor.complianceCertifications.length > 0) completedFields++;
      if (vendor.securityFeatures && vendor.securityFeatures.length > 0) completedFields++;
      if (vendor.dataHandling) completedFields++;

      // Section 5: Business Information (5 fields)
      totalFields += 5;
      if (vendor.pricingModel) completedFields++;
      if (vendor.pricingRange) completedFields++;
      if (vendor.contractTerms && vendor.contractTerms.length > 0) completedFields++;
      if (vendor.implementationTime) completedFields++;
      if (vendor.supportOffered && vendor.supportOffered.length > 0) completedFields++;

      // Section 6: Market & Clients (3 fields)
      totalFields += 3;
      if (vendor.currentClients && vendor.currentClients.length > 0) completedFields++;
      if (vendor.customerTestimonials && vendor.customerTestimonials.length > 0) completedFields++;
      if (vendor.caseStudies) completedFields++;

      // Section 7: Additional Information (2 fields)
      totalFields += 2;
      if (vendor.competitiveAdvantages && vendor.competitiveAdvantages.length > 0) completedFields++;
      if (vendor.futureRoadmap) completedFields++;

      return Math.round((completedFields / totalFields) * 100);
    };

    const profileCompletionPercentage = calculateProfileCompletion(vendor);

    return NextResponse.json({
      success: true,
      data: {
        recentListingsVisited: listingsWithProposals.map((l: any) => ({
          id: l._id.toString(),
          title: l.title,
          category: l.category,
          status: l.status,
          visitedAt: l.updatedAt,
        })),
        recentProposalsSent: proposalsSent,
        acceptedProposalsCount,
        listingsInVendorCategories,
        categoryViews,
        companySearchCount,
        activeAcceptedProposals,
        activeAcceptedProposalsList: activeAcceptedProposalsList.map((l: any) => ({
          id: l._id.toString(),
          title: l.title,
          category: l.category,
          status: l.status,
          createdAt: l.createdAt,
        })),
        proposalsByStatus,
        vendorCategories: allVendorCategories, // Always return all categories for filter dropdown
        vendorProductName: vendor.solutionName || "",
        vendorCompanyName: vendor.companyName || "",
        profileCompletionPercentage,
      },
    });
  } catch (error: any) {
    console.error("Error fetching vendor stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch vendor stats",
      },
      { status: 500 }
    );
  }
}

