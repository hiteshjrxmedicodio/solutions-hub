import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user role from database
    const userDoc = await User.findOne({ $or: [{ userId: user.id }, { clerkId: user.id }] });
    const userRole = userDoc?.role || user?.publicMetadata?.role;
    const userEmail = user.emailAddresses[0]?.emailAddress || "";
    const isSuperAdmin = userEmail === SUPER_ADMIN_EMAIL || userRole === "superadmin";

    // Create dummy notifications based on user role
    const notifications = [];

    if (userRole === "vendor" || (isSuperAdmin && userRole !== "customer")) {
      // Vendor notifications
      notifications.push(
        new Notification({
          userId: user.id,
          type: "proposal_received",
          title: "New Proposal Received",
          message: "You have received a new proposal for your listing. Review it now!",
          isRead: false,
          actionUrl: "/dashboard",
          actionLabel: "View Proposal",
        }),
        new Notification({
          userId: user.id,
          type: "new_listing",
          title: "New Listing Match",
          message: "A new listing matches your solution categories. Check it out!",
          isRead: false,
          actionUrl: "/listings",
          actionLabel: "View Listing",
        })
      );
    }

    if (userRole === "customer" || isSuperAdmin) {
      // Customer notifications
      notifications.push(
        new Notification({
          userId: user.id,
          type: "proposal_accepted",
          title: "Proposal Accepted",
          message: "Your proposal has been accepted! Start working on the project.",
          isRead: false,
          actionUrl: "/dashboard",
          actionLabel: "View Details",
        }),
        new Notification({
          userId: user.id,
          type: "solution_published",
          title: "New Solution Available",
          message: "A new AI solution matching your requirements has been published.",
          isRead: false,
          actionUrl: "/solutions-hub",
          actionLabel: "Browse Solutions",
        })
      );
    }

    // If no specific role, create a generic notification
    if (notifications.length === 0) {
      notifications.push(
        new Notification({
          userId: user.id,
          type: "system",
          title: "Welcome to Astro Vault!",
          message: "This is a sample notification. Complete your profile to get started.",
          isRead: false,
          actionUrl: "/dashboard",
          actionLabel: "Go to Dashboard",
        })
      );
    }

    // Save all notifications
    const savedNotifications = await Notification.insertMany(notifications);

    return NextResponse.json({
      success: true,
      data: savedNotifications.map((n: any) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt,
        actionUrl: n.actionUrl,
        actionLabel: n.actionLabel,
      })),
      count: savedNotifications.length,
    });
  } catch (error: any) {
    console.error("Error creating dummy notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create notification",
      },
      { status: 500 }
    );
  }
}

