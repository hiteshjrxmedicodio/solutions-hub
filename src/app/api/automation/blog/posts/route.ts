import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { blogPosts } from "@/lib/automation-storage";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // In production, fetch from database:
    // await connectDB();
    // const posts = await BlogPost.find().sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      success: true,
      posts: blogPosts.slice(0, 10),
    });
  } catch (error: any) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}

