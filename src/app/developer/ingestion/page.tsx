"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";

const ingestionSections = [
  {
    id: "data-sources",
    name: "Data Sources",
    description: "Configure and manage data sources",
    href: "/developer/ingestion/data-sources",
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
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    color: "blue",
  },
  {
    id: "pipelines",
    name: "Processing Pipelines",
    description: "Set up and monitor pipelines",
    href: "/developer/ingestion/pipelines",
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
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
        <polyline points="7.5 19.79 7.5 14.6 3 12" />
        <polyline points="21 12 16.5 14.6 16.5 19.79" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    color: "green",
  },
  {
    id: "monitoring",
    name: "Monitoring & Logs",
    description: "View status and performance metrics",
    href: "/developer/ingestion/monitoring",
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
        <path d="M3 3v18h18" />
        <path d="M18 17V9M12 17V5M6 17v-3" />
      </svg>
    ),
    color: "orange",
  },
  {
    id: "configuration",
    name: "Configuration",
    description: "Manage settings and preferences",
    href: "/developer/ingestion/configuration",
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
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
      </svg>
    ),
    color: "purple",
  },
];

export default function IngestionCentrePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Check if user is super admin
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com";

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    } else if (isLoaded && user && !isSuperAdmin) {
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
        <main className={`flex-1 mr-[344px] p-8 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              Ingestion Centre
            </h1>
            <p className="text-zinc-600">
              Manage data ingestion and processing workflows
            </p>
          </div>

          {/* Info Card */}
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
                  Ingestion Centre
                </h3>
                <p className="text-blue-800 text-sm">
                  This section provides tools for managing data ingestion pipelines,
                  processing workflows, and monitoring data flows. Configure and
                  monitor your data ingestion processes here.
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Data Sources
              </h3>
              <p className="text-zinc-600 text-sm">
                Configure and manage data sources for ingestion.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Processing Pipelines
              </h3>
              <p className="text-zinc-600 text-sm">
                Set up and monitor data processing pipelines.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Monitoring & Logs
              </h3>
              <p className="text-zinc-600 text-sm">
                View ingestion status, logs, and performance metrics.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Configuration
              </h3>
              <p className="text-zinc-600 text-sm">
                Manage ingestion settings and preferences.
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar Card - Data Ingestion Center (Right Side) */}
        <aside className="fixed right-6 top-[140px] bottom-6 w-[320px] z-40">
          <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">
            <div className="p-5 flex-shrink-0">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                    Data Ingestion Center
                  </h2>
                <p className="text-sm text-zinc-600">
                  Manage data ingestion workflows
                </p>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
              {ingestionSections.map((section) => {
                const isActive = pathname?.startsWith(section.href);
                const colorClasses = {
                  blue: isActive
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "hover:bg-blue-50 text-zinc-700 hover:text-blue-700",
                  green: isActive
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "hover:bg-green-50 text-zinc-700 hover:text-green-700",
                  orange: isActive
                    ? "bg-orange-100 text-orange-700 border-orange-300"
                    : "hover:bg-orange-50 text-zinc-700 hover:text-orange-700",
                  purple: isActive
                    ? "bg-purple-100 text-purple-700 border-purple-300"
                    : "hover:bg-purple-50 text-zinc-700 hover:text-purple-700",
                };

                return (
                  <Link
                    key={section.id}
                      href={section.href}
                      className={`flex flex-col gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                        colorClasses[section.color as keyof typeof colorClasses]
                      } ${isActive ? "border-2 shadow-sm" : "border-transparent"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-lg flex-shrink-0 ${
                            isActive
                              ? section.color === "blue"
                                ? "bg-blue-200"
                                : section.color === "green"
                                ? "bg-green-200"
                                : section.color === "orange"
                                ? "bg-orange-200"
                                : section.color === "purple"
                                ? "bg-purple-200"
                                : "bg-zinc-200"
                              : "bg-zinc-200"
                          }`}
                        >
                          {section.icon}
                        </div>
                        <div className="font-medium text-sm">{section.name}</div>
                      </div>
                      <div className="text-xs text-zinc-500 pl-11">
                        {section.description}
                      </div>
                    </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

