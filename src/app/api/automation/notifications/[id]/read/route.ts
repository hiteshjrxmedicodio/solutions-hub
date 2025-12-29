import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== "hitesh.ms24@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
      readAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error: any) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to mark notification as read",
      },
      { status: 500 }
    );
  }
}

