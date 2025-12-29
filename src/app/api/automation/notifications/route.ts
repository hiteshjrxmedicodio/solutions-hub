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

    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== "hitesh.ms24@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    // Build query based on filter
    let query: any = {};
    if (filter === "unread") {
      query.isRead = false;
    } else if (filter === "read") {
      query.isRead = true;
    }

    // For super admin, show all notifications (or filter by admin userId if needed)
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      notifications: notifications.map((n) => ({
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

