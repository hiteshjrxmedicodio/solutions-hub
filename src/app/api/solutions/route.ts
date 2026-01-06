import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/models/Vendor';

export async function GET() {
  try {
    await connectDB();

    // Fetch only approved vendors that have displayId (for solutions hub)
    const vendors = await Vendor.find({
      status: 'approved',
      displayId: { $exists: true, $ne: null },
    })
      .sort({ displayId: 1 })
      .lean()
      .exec();

    // Transform vendors to card format for Solutions Hub
    const cards = vendors.map((vendor: any) => ({
      id: vendor.displayId,
      title: vendor.companyName,
      description: vendor.solutionDescription || vendor.solutionName || '',
      category: vendor.solutionCategory?.[0] || undefined, // Use first category as primary
      categories: vendor.solutionCategory || [], // All categories
      companyType: vendor.companyType || undefined,
      companySize: vendor.companySize || undefined,
      integrationCapabilities: vendor.integrationCapabilities || [],
      deploymentOptions: vendor.deploymentOptions || [],
      targetInstitutionTypes: vendor.targetInstitutionTypes || [],
      targetSpecialties: vendor.targetSpecialties || [],
      cols: vendor.cardCols || 2,
      rows: vendor.cardRows || 1,
      userId: vendor.userId, // Keep userId for navigation to vendor detail page
    }));

    return NextResponse.json(
      {
        success: true,
        data: cards,
        count: cards.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching vendors for solutions hub:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch vendors',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

