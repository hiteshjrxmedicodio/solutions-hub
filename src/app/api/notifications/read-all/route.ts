import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function POST(request: NextRequest) {
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

    await Notification.updateMany(
      { userId: user.id, isRead: false },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to mark all notifications as read",
      },
      { status: 500 }
    );
  }
}

