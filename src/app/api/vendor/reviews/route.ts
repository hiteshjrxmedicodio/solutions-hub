import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";
import HealthcareInstitution from "@/models/HealthcareInstitution";

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
    const body = await request.json();

    const { vendorUserId, testimonial, metrics } = body;

    if (!vendorUserId || !testimonial) {
      return NextResponse.json(
        { success: false, error: "Vendor ID and testimonial are required" },
        { status: 400 }
      );
    }

    // Verify user is a customer
    const institution = await HealthcareInstitution.findOne({ userId });

    if (!institution) {
      return NextResponse.json(
        { success: false, error: "Only customers can add reviews. Please create a healthcare institution profile first." },
        { status: 403 }
      );
    }

    // Find vendor
    const vendor = await Vendor.findOne({ userId: vendorUserId });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Add review (automatically verified since it comes from the customer)
    const newReview = {
      customerName: institution.institutionName,
      customerTitle: institution.primaryContact?.title || undefined,
      testimonial,
      metrics: metrics || undefined,
      verified: true, // Customer reviews are automatically verified
      customerUserId: userId,
    };

    if (!vendor.customerTestimonials) {
      vendor.customerTestimonials = [];
    }

    vendor.customerTestimonials.push(newReview);

    // Update verification status
    if (!vendor.verificationHistory) {
      vendor.verificationHistory = [];
    }

    // Check if already verified by this customer
    const alreadyVerified = vendor.verificationHistory.some(
      (v: any) => v.customerUserId === userId
    );

    if (!alreadyVerified) {
      vendor.verificationHistory.push({
        customerUserId: userId,
        customerName: institution.institutionName,
        verifiedAt: new Date(),
      });
      vendor.verified = true;
    }

    await vendor.save();

    return NextResponse.json({
      success: true,
      data: newReview,
      message: "Review added and verified successfully.",
    });
  } catch (error: any) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add review",
      },
      { status: 500 }
    );
  }
}

