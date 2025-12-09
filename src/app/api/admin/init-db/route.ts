import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { initializeDatabase } from "@/lib/initDatabase";

/**
 * Admin endpoint to initialize database collections and indexes
 * Only accessible to authenticated users (add admin check if needed)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Add admin role check here if needed
    // const userDoc = await User.findOne({ userId: user.id });
    // if (userDoc?.role !== 'admin') {
    //   return NextResponse.json(
    //     { success: false, error: "Forbidden" },
    //     { status: 403 }
    //   );
    // }

    await initializeDatabase();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error: any) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize database",
      },
      { status: 500 }
    );
  }
}

