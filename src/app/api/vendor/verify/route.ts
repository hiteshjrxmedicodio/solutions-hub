import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";
import HealthcareInstitution from "@/models/HealthcareInstitution";

/**
 * Customer-driven verification endpoint
 * When a customer (institution) accepts a testimonial for a vendor,
 * the vendor gets verified. We verify the customer first.
 */
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
    
    const { vendorUserId, testimonialId, customerName } = body;
    
    if (!vendorUserId) {
      return NextResponse.json(
        { success: false, error: "Vendor user ID is required" },
        { status: 400 }
      );
    }

    // Verify the customer (institution) exists and is valid
    const institution = await HealthcareInstitution.findOne({ userId });
    
    if (!institution) {
      return NextResponse.json(
        { success: false, error: "Customer institution not found. Only verified institutions can verify vendors." },
        { status: 403 }
      );
    }

    // Find the vendor
    const vendor = await Vendor.findOne({ userId: vendorUserId });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    // Check if testimonial exists and is for this customer
    if (testimonialId && vendor.customerTestimonials) {
      const testimonial = vendor.customerTestimonials.find(
        (t: any) => t._id?.toString() === testimonialId
      );
      
      if (!testimonial) {
        return NextResponse.json(
          { success: false, error: "Testimonial not found" },
          { status: 404 }
        );
      }

      // Mark testimonial as verified
      testimonial.verified = true;
    }

    // Add to verification history
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
        customerName: customerName || institution.institutionName,
        verifiedAt: new Date(),
        testimonialId: testimonialId || undefined,
      });

      // Mark vendor as verified if not already
      vendor.verified = true;
    }

    await vendor.save();

    return NextResponse.json({
      success: true,
      message: "Vendor verified successfully",
      data: {
        verified: vendor.verified,
        verificationCount: vendor.verificationHistory?.length || 0,
      },
    });
  } catch (error: any) {
    console.error("Error verifying vendor:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify vendor",
      },
      { status: 500 }
    );
  }
}

