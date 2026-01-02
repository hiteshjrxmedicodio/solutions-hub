import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";
import User from "@/models/User";
import { syncClerkUserToDB } from "@/lib/syncClerkUser";

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

    // Transform questionnaire data to match Vendor schema
    const vendorData = {
      userId,
      // Section 1: Company Overview
      companyName: body.companyName,
      companyType: body.companyType,
      companyTypeOther: body.companyTypeOther,
      location: {
        state: body.location?.state || "",
        country: body.location?.country || "United States",
        countryOther: body.location?.countryOther,
      },
      website: body.website,
      
      // Section 2: Contact Information
      primaryContact: {
        name: body.primaryContact?.name || "",
        title: body.primaryContact?.title || "",
        email: body.primaryContact?.email || "",
        phone: body.primaryContact?.phone || "",
      },
      
      // Section 3: Product Information
      // Map first product to solutionName/solutionDescription for backward compatibility
      // Store all products if available
      solutionName: body.products && body.products.length > 0 
        ? body.products[0].name 
        : body.productName || "",
      solutionDescription: body.products && body.products.length > 0 
        ? body.products[0].overview 
        : body.productOverview || "",
      // Store all products in a new field (if model supports it, otherwise we'll add it)
      products: body.products && body.products.length > 0 
        ? body.products.map((p: any) => ({ 
            name: p.name, 
            overview: p.overview,
            url: p.url || "" 
          }))
        : (body.productName && body.productOverview 
          ? [{ name: body.productName, overview: body.productOverview, url: "" }]
          : []),
      
      // Section 4: Integrations Required
      integrationCapabilities: body.integrationsRequired || [],
      integrationCapabilitiesOther: body.integrationsRequiredOther,
      otherIntegrations: body.otherIntegrations || "",
      integrationCategories: body.integrationCategories || {},
      otherIntegrationsByCategory: body.otherIntegrationsByCategory || {},
      
      // Section 5: Compliance and Certifications
      complianceCertifications: body.complianceCertifications || [],
      complianceCertificationsOther: body.complianceCertificationsOther,
      
      status: "submitted",
      submittedAt: new Date(),
    };

    // Upsert: update if exists, create if not
    const vendor = await Vendor.findOneAndUpdate(
      { userId },
      vendorData,
      { new: true, upsert: true, runValidators: true }
    );

    // Update user profile flag
    await User.findOneAndUpdate(
      { userId },
      {
        hasVendorProfile: true,
        profileCompletedAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      data: vendor,
    });
  } catch (error: any) {
    console.error("Error saving vendor questionnaire:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save vendor questionnaire",
      },
      { status: 500 }
    );
  }
}

