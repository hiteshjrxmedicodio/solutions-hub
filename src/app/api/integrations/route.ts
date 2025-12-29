import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Integration from "@/models/Integration";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query = category ? { category } : {};
    const integrations = await Integration.find(query).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: integrations,
    });
  } catch (error: any) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch integrations",
      },
      { status: 500 }
    );
  }
}

