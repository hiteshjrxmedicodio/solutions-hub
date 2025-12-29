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

    try {
      await connectDB();
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
        },
        { status: 500 }
      );
    }

    const { id } = await params;

    // Verify the notification belongs to the user
    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

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

