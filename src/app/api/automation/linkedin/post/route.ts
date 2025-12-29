import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { linkedInPosts } from "@/lib/automation-storage";
import connectDB from "@/lib/db";
import SolutionCard from "@/models/SolutionCard";
import LinkedInCredentials from "@/models/LinkedInCredentials";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

async function refreshLinkedInToken(credentials: any) {
  if (!credentials.refreshToken) {
    throw new Error("No refresh token available");
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("LinkedIn credentials not configured");
  }

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: credentials.refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const tokenData = await response.json();
  const expiresAt = tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined;

  await LinkedInCredentials.findByIdAndUpdate(credentials._id, {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token || credentials.refreshToken,
    expiresAt,
  });

  return tokenData.access_token;
}

async function getLinkedInAccessToken(userId: string): Promise<string> {
  await connectDB();
  const credentials = await LinkedInCredentials.findOne({ 
    userId,
    isActive: true 
  });

  if (!credentials) {
    throw new Error("LinkedIn account not connected. Please connect your LinkedIn account first.");
  }

  // Check if token is expired and refresh if needed
  if (credentials.expiresAt && new Date() >= credentials.expiresAt) {
    if (credentials.refreshToken) {
      return await refreshLinkedInToken(credentials);
    } else {
      throw new Error("LinkedIn token expired and no refresh token available. Please reconnect your account.");
    }
  }

  return credentials.accessToken;
}

async function uploadImageToLinkedIn(accessToken: string, imageData: string): Promise<string> {
  // First, register the image upload
  const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner: 'urn:li:organization:YOUR_ORG_ID', // This needs to be set if posting as organization
        serviceRelationships: [{
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent'
        }]
      }
    }),
  });

  if (!registerResponse.ok) {
    // If organization posting fails, try personal posting without images
    throw new Error('Image upload not supported. Posting text only.');
  }

  const registerData = await registerResponse.json();
  const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
  const asset = registerData.value.asset;

  // Upload the image
  const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64');
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: imageBuffer,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image to LinkedIn');
  }

  return asset;
}

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
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { header, body: postBody, content, images, mentions, scheduledTime, listingId } = body;

    // Support both old format (content) and new format (header + body)
    const finalHeader = header || "";
    const finalBody = postBody || content || "";
    
    if (!finalHeader && !finalBody) {
      return NextResponse.json(
        { success: false, error: "Header or body is required" },
        { status: 400 }
      );
    }

    const fullContent = finalHeader ? `${finalHeader}\n\n${finalBody}` : finalBody;

    // Fetch listing title if listingId is provided
    let listingTitle = listingId ? "Solution Listing" : "Custom Post";
    if (listingId) {
      try {
        await connectDB();
        const listing = await SolutionCard.findOne({ id: listingId });
        if (listing) {
          listingTitle = listing.title;
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    }

    // Handle scheduled posts
    const postDate = scheduledTime ? new Date(scheduledTime) : new Date();
    const isScheduled = scheduledTime && postDate > new Date();

    // Get LinkedIn access token
    let accessToken: string;
    let personUrn: string;
    
    try {
      await connectDB();
      const credentials = await LinkedInCredentials.findOne({ 
        userId: user.id,
        isActive: true 
      });

      if (!credentials) {
        return NextResponse.json(
          { success: false, error: "LinkedIn account not connected. Please connect your LinkedIn account first." },
          { status: 400 }
        );
      }

      // Check if token is expired and refresh if needed
      if (credentials.expiresAt && new Date() >= credentials.expiresAt) {
        if (credentials.refreshToken) {
          accessToken = await refreshLinkedInToken(credentials);
        } else {
          return NextResponse.json(
            { success: false, error: "LinkedIn token expired. Please reconnect your account." },
            { status: 401 }
          );
        }
      } else {
        accessToken = credentials.accessToken;
      }

      personUrn = credentials.personUrn || `urn:li:person:${user.id}`;
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message || "Failed to get LinkedIn credentials" },
        { status: 500 }
      );
    }

    // Prepare LinkedIn post payload
    const postPayload: any = {
      author: personUrn,
      lifecycleState: isScheduled ? 'DRAFT' : 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: fullContent,
          },
          shareMediaCategory: images && images.length > 0 ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // Handle images if provided
    if (images && images.length > 0) {
      try {
        // For now, LinkedIn image upload requires organization posting or more complex setup
        // We'll post text-only for personal accounts
        // If you have organization access, you can implement image upload here
        console.log('Images provided but image upload requires organization access');
      } catch (error) {
        console.error('Error uploading images:', error);
        // Continue with text-only post
      }
    }

    // Add scheduled time if provided
    if (isScheduled && scheduledTime) {
      postPayload.scheduledAt = Math.floor(new Date(scheduledTime).getTime() / 1000) * 1000; // LinkedIn expects milliseconds
    }

    // Post to LinkedIn API
    const linkedInResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postPayload),
    });

    if (!linkedInResponse.ok) {
      const errorData = await linkedInResponse.text();
      console.error('LinkedIn API error:', errorData);
      
      // Try to parse error message
      let errorMessage = 'Failed to post to LinkedIn';
      try {
        const errorJson = JSON.parse(errorData);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorData || errorMessage;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: linkedInResponse.status }
      );
    }

    const linkedInData = await linkedInResponse.json();
    const linkedInPostId = linkedInData.id;
    const linkedInUrl = `https://www.linkedin.com/feed/update/${linkedInPostId}`;

    // Save post data locally
    const postData = {
      id: Date.now().toString(),
      header: finalHeader,
      body: finalBody,
      content: fullContent,
      images: images || [],
      mentions: mentions || [],
      scheduledTime: scheduledTime || null,
      listingId,
      listingTitle,
      linkedInUrl: isScheduled ? null : linkedInUrl,
      linkedInPostId,
      createdAt: new Date().toISOString(),
      status: isScheduled ? "scheduled" : "published",
    };

    linkedInPosts.unshift(postData);

    return NextResponse.json({
      success: true,
      post: postData,
      message: isScheduled 
        ? "Post scheduled successfully" 
        : "Post published to LinkedIn successfully",
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

// Export posts for retrieval
export async function GET() {
  return NextResponse.json({
    success: true,
    posts: linkedInPosts.slice(0, 10), // Return last 10 posts
  });
}

