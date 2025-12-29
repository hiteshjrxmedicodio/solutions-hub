"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AutomationCenterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";

  // Check if user is super admin
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
      router.push("/solutions-hub");
    } else if (isLoaded && user && isSuperAdmin && pathname === "/developer/automation") {
      // Redirect to LinkedIn agent by default
      router.push("/developer/automation/linkedin");
    }
  }, [isLoaded, user, isSuperAdmin, router, pathname]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  // Redirect to LinkedIn agent by default
  if (isLoaded && user && isSuperAdmin && pathname === "/developer/automation") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}

