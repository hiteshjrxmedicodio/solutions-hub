import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getLinkedInAgentEnabled,
  setLinkedInAgentEnabled,
} from "@/lib/automation-storage";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currentEnabled = getLinkedInAgentEnabled();
    const newEnabled = body.enabled !== undefined ? body.enabled : !currentEnabled;
    setLinkedInAgentEnabled(newEnabled);

    return NextResponse.json({
      success: true,
      enabled: newEnabled,
    });
  } catch (error: any) {
    console.error("Error toggling agent:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to toggle agent",
      },
      { status: 500 }
    );
  }
}

