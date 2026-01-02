"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface ProfileIncompleteBannerProps {
  profileCompletionPercentage: number;
  profileType: "vendor" | "customer";
  userId?: string;
  userEmail?: string;
  isSuperAdmin?: boolean;
  actingAs?: "vendor" | "customer" | null;
}

export function ProfileIncompleteBanner({
  profileCompletionPercentage,
  profileType,
  userId,
  userEmail,
  isSuperAdmin,
  actingAs,
}: ProfileIncompleteBannerProps) {
  const router = useRouter();
  const { user } = useUser();

  // Don't show if profile is 100% complete
  if (profileCompletionPercentage >= 100) {
    return null;
  }

  const handleCompleteProfile = () => {
    if (!userId) return;

    if (profileType === "vendor") {
      // For super admin, use special vendor profile
      if (isSuperAdmin && (userEmail === "hitesh.ms24@gmail.com" || actingAs === "vendor")) {
        router.push("/vendor/seed-medicodio");
      } else {
        router.push(`/vendor/${userId}`);
      }
    } else {
      // Customer profile
      router.push(`/customer/${userId}`);
    }
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 mb-1">
              Complete Your {profileType === "vendor" ? "Vendor" : "Customer"} Profile
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Your profile is {profileCompletionPercentage}% complete. Complete your profile to unlock all features and improve your visibility.
            </p>
            <button
              onClick={handleCompleteProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

