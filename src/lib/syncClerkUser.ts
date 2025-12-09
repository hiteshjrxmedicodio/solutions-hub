import { currentUser } from "@clerk/nextjs/server";
import connectDB from "./db";
import User from "@/models/User";

/**
 * Syncs user data from Clerk to our database
 * Call this function in API routes or server components to ensure user data is up-to-date
 */
export async function syncClerkUserToDB() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser?.id) {
      return null;
    }

    await connectDB();

    // Find or create user
    let user = await User.findOne({ userId: clerkUser.id });

    if (!user) {
      // Create new user
      user = await User.create({
        userId: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl || "",
        lastLoginAt: new Date(),
        lastActivityAt: new Date(),
        metadata: {
          createdAt: clerkUser.createdAt,
          lastSignInAt: clerkUser.lastSignInAt,
        },
      });
    } else {
      // Update existing user with latest Clerk data
      user.clerkId = clerkUser.id;
      user.email = clerkUser.emailAddresses[0]?.emailAddress || user.email;
      user.emailVerified = clerkUser.emailAddresses[0]?.verification?.status === 'verified';
      user.firstName = clerkUser.firstName || user.firstName;
      user.lastName = clerkUser.lastName || user.lastName;
      user.imageUrl = clerkUser.imageUrl || user.imageUrl;
      user.lastLoginAt = new Date();
      user.lastActivityAt = new Date();
      user.metadata = {
        ...user.metadata,
        lastSignInAt: clerkUser.lastSignInAt,
        updatedAt: clerkUser.updatedAt,
      };
      await user.save();
    }

    return user;
  } catch (error) {
    console.error("Error syncing Clerk user to DB:", error);
    return null;
  }
}

/**
 * Updates user's last activity timestamp
 */
export async function updateUserActivity(userId: string) {
  try {
    await connectDB();
    await User.findOneAndUpdate(
      { userId },
      { lastActivityAt: new Date() },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating user activity:", error);
  }
}

