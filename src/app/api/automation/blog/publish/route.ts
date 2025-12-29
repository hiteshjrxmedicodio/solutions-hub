import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { blogPosts } from "@/lib/automation-storage";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, content, images, tags, topic, platform, publishTime } = body;

    if (!title || !content || !platform) {
      return NextResponse.json(
        { success: false, error: "Title, content, and platform are required" },
        { status: 400 }
      );
    }

    // Handle scheduled posts
    const publishDate = publishTime ? new Date(publishTime) : new Date();
    const isScheduled = publishTime && publishDate > new Date();

    // In production, integrate with HubSpot or Medium API
    const postData = {
      id: Date.now().toString(),
      title,
      content,
      images: images || [],
      tags: tags || [],
      topic,
      platform,
      status: isScheduled ? "scheduled" : "published",
      url: isScheduled ? null : (platform === "hubspot" 
        ? `https://hubspot.com/blog/post-${Date.now()}`
        : `https://medium.com/@your-username/post-${Date.now()}`),
      publishTime: publishTime || null,
      publishedAt: isScheduled ? null : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    blogPosts.unshift(postData);

    // In production, save to database and make API calls:
    // 
    // For HubSpot:
    // const hubspotResponse = await fetch('https://api.hubapi.com/content/api/v2/blog-posts', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: title,
    //     contentGroupId: HUBSPOT_BLOG_ID,
    //     htmlTitle: title,
    //     postBody: content,
    //     publishDate: publishTime || new Date().toISOString(),
    //     tags: tags,
    //     ...(images?.length > 0 && { featuredImage: images[0] }),
    //   }),
    // });
    //
    // For Medium:
    // const mediumResponse = await fetch('https://api.medium.com/v1/posts', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${MEDIUM_ACCESS_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     title,
    //     contentFormat: 'html',
    //     content: content,
    //     publishStatus: isScheduled ? 'draft' : 'public',
    //     tags: tags,
    //     ...(images?.length > 0 && { imageUrls: images }),
    //   }),
    // });

    return NextResponse.json({
      success: true,
      post: postData,
      message: isScheduled
        ? `Post scheduled to ${platform === "hubspot" ? "HubSpot" : "Medium"} successfully`
        : `Post published to ${platform === "hubspot" ? "HubSpot" : "Medium"} successfully`,
    });
  } catch (error: any) {
    console.error("Error publishing blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to publish blog post",
      },
      { status: 500 }
    );
  }
}

// Export posts for retrieval
export async function GET() {
  return NextResponse.json({
    success: true,
    posts: blogPosts.slice(0, 10),
  });
}

