import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    // Build query based on filter
    let query: any = { userId: user.id };
    if (filter === "unread") {
      query.isRead = false;
    } else if (filter === "read") {
      query.isRead = true;
    }

    // Fetch user's notifications
    let notifications;
    try {
      notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
    } catch (queryError: any) {
      console.error("Error querying notifications:", queryError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch notifications",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: notifications.map((n: any) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
        actionUrl: n.actionUrl,
        actionLabel: n.actionLabel,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
}

