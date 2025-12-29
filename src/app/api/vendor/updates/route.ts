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
    
    const { title, content, type } = body;
    
    if (!title || !content || !type) {
      return NextResponse.json(
        { success: false, error: "Title, content, and type are required" },
        { status: 400 }
      );
    }

    if (!['release', 'feature', 'announcement', 'roadmap'].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid update type" },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ userId });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const newUpdate = {
      title,
      content,
      type,
      date: new Date(),
      linkedinPosted: false,
    };

    if (!vendor.updates) {
      vendor.updates = [];
    }
    
    vendor.updates.push(newUpdate);
    await vendor.save();

    return NextResponse.json({
      success: true,
      data: newUpdate,
    });
  } catch (error: any) {
    console.error("Error posting update:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to post update",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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
    const vendor = await Vendor.findOne({ userId });
    
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: vendor.updates || [],
    });
  } catch (error: any) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch updates",
      },
      { status: 500 }
    );
  }
}

