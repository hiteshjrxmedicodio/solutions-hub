"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

const developerSections = [
  {
    id: "automation",
    name: "Automation Center",
    description: "Manage automated workflows and agents",
    href: "/developer/automation",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    color: "purple",
  },
  {
    id: "ingestion",
    name: "Ingestion Centre",
    description: "Manage data ingestion and processing",
    href: "/developer/ingestion",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    color: "blue",
  },
  {
    id: "onboarding",
    name: "Onboarding Phase",
    description: "Manage user onboarding process",
    href: "/developer/onboarding",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "teal",
  },
];

export default function DeveloperPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const userRole = user?.publicMetadata?.role as string | undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if user is super admin
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";


  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
      // Redirect non-admin users to solutions hub
      router.push("/solutions-hub");
    }
  }, [isLoaded, user, isSuperAdmin, router]);

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
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto" style={{ height: "100vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex pt-24">
        {/* Main Content */}
        <main className={`flex-1 mr-[280px] p-8 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              Developer Mode
            </h1>
            <p className="text-zinc-600">
              Advanced tools and utilities for system administration
            </p>
          </div>

          {/* Admin Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-blue-600 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Super Admin Access
                </h3>
                <p className="text-blue-800 text-sm">
                  You are logged in as a super administrator. This page provides
                  access to advanced system management tools. Use these features
                  with caution.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Card - Developer Mode (Right Side) */}
        <aside className="w-fit fixed right-6 top-[140px] z-40">
          <div className="bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 mb-1 whitespace-nowrap">
                  Developer Mode
                </h2>
                <p className="text-sm text-zinc-600 whitespace-nowrap">
                  System administration tools
                </p>
              </div>

              <nav className="space-y-2">
                {developerSections.map((section) => {
                  const isActive = pathname?.startsWith(section.href);
                  const colorClasses = {
                    purple: isActive
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "hover:bg-purple-50 text-zinc-700 hover:text-purple-700",
                    blue: isActive
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "hover:bg-blue-50 text-zinc-700 hover:text-blue-700",
                    teal: isActive
                      ? "bg-teal-100 text-teal-700 border-teal-300"
                      : "hover:bg-teal-50 text-zinc-700 hover:text-teal-700",
                  };

                  return (
                    <Link
                      key={section.id}
                      href={section.href}
                      className={`flex flex-col gap-2 px-4 py-3 rounded-lg border transition-colors ${
                        colorClasses[section.color as keyof typeof colorClasses]
                      } ${isActive ? "border-2" : "border-transparent"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            isActive
                              ? section.color === "purple"
                                ? "bg-purple-200"
                                : section.color === "blue"
                                ? "bg-blue-200"
                                : section.color === "teal"
                                ? "bg-teal-200"
                                : "bg-zinc-200"
                              : "bg-zinc-200"
                          }`}
                        >
                          {section.icon}
                        </div>
                        <div className="font-medium text-sm whitespace-nowrap">{section.name}</div>
                      </div>
                      <div className="text-xs text-zinc-500 pl-11">
                        {section.description}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

