import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import LinkedInCredentials from "@/models/LinkedInCredentials";

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/solutions-hub', request.url));
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    if (error) {
      return NextResponse.redirect(
        `${baseUrl}/developer/automation/linkedin?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || state !== user.id) {
      return NextResponse.redirect(
        `${baseUrl}/developer/automation/linkedin?error=invalid_auth`
      );
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/automation/linkedin/auth/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${baseUrl}/developer/automation/linkedin?error=config_missing`
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange error:', errorData);
      return NextResponse.redirect(
        `${baseUrl}/developer/automation/linkedin?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user's LinkedIn Person URN using the /v2/me endpoint
    let personUrn = null;
    try {
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        // LinkedIn Person URN is returned as 'id' field
        personUrn = profileData.id || null;
      }
    } catch (error) {
      console.error('Error fetching LinkedIn profile:', error);
      // Continue without Person URN - we can try to get it later
    }

    // Save credentials to database
    await connectDB();
    const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : undefined;

    await LinkedInCredentials.findOneAndUpdate(
      { userId: user.id },
      {
        userId: user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        personUrn,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(
      `${baseUrl}/developer/automation/linkedin?connected=true`
    );
  } catch (error: any) {
    console.error("Error in LinkedIn callback:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(
      `${baseUrl}/developer/automation/linkedin?error=callback_failed`
    );
  }
}

