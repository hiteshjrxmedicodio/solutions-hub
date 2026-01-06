import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

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

    const { vendorUserId, customerName, customerTitle, testimonial, metrics } = body;

    if (!vendorUserId || !customerName || !testimonial) {
      return NextResponse.json(
        { success: false, error: "Vendor ID, customer name, and testimonial are required" },
        { status: 400 }
      );
    }

    // Verify user is the vendor owner
    const vendor = await Vendor.findOne({ userId: vendorUserId });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    if (vendor.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Only vendor owner can add testimonials" },
        { status: 403 }
      );
    }

    // Add testimonial
    const newTestimonial = {
      customerName,
      customerTitle: customerTitle || undefined,
      testimonial,
      metrics: metrics || undefined,
      verified: false,
    };

    if (!vendor.customerTestimonials) {
      vendor.customerTestimonials = [];
    }

    vendor.customerTestimonials.push(newTestimonial);
    await vendor.save();

    return NextResponse.json({
      success: true,
      data: newTestimonial,
      message: "Testimonial added successfully. It will be verified when the customer accepts it.",
    });
  } catch (error: any) {
    console.error("Error adding testimonial:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add testimonial",
      },
      { status: 500 }
    );
  }
}


