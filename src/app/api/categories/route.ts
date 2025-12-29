import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const categories = await Category.find({}).sort({ id: 1 });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

