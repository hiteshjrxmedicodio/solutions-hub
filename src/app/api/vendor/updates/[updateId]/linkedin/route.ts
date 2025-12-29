import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Vendor from "@/models/Vendor";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ updateId: string }> }
) {
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
    const { updateId } = await params;
    
    const vendor = await Vendor.findOne({ userId });
    
    if (!vendor || !vendor.updates) {
      return NextResponse.json(
        { success: false, error: "Vendor profile or update not found" },
        { status: 404 }
      );
    }

    const update = vendor.updates.find((u: any) => u._id?.toString() === updateId);
    
    if (!update) {
      return NextResponse.json(
        { success: false, error: "Update not found" },
        { status: 404 }
      );
    }

    // Mark as posted to LinkedIn
    update.linkedinPosted = true;
    await vendor.save();

    // TODO: Integrate with LinkedIn API to actually post the update
    // This would require LinkedIn OAuth and posting permissions

    return NextResponse.json({
      success: true,
      message: "Update marked as posted to LinkedIn",
      data: update,
    });
  } catch (error: any) {
    console.error("Error posting to LinkedIn:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to post to LinkedIn",
      },
      { status: 500 }
    );
  }
}

