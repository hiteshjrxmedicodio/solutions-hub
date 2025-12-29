import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

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
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/automation/linkedin/auth/callback`;
    const state = user.id; // Use user ID as state for security

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: "LinkedIn Client ID not configured" },
        { status: 500 }
      );
    }

    // LinkedIn OAuth 2.0 scopes needed for posting
    const scopes = [
      'openid',
      'profile',
      'email',
      'w_member_social', // Required for posting
    ].join(' ');

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent(scopes)}`;

    return NextResponse.json({
      success: true,
      authUrl,
    });
  } catch (error: any) {
    console.error("Error generating LinkedIn auth URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate auth URL",
      },
      { status: 500 }
    );
  }
}


