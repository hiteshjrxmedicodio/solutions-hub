"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { HamburgerMenu } from "@/components/HamburgerMenu";

interface SolutionCardData {
  id: number;
  title: string;
  description: string;
  category?: string;
  cols: number;
  rows: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function SolutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const userRole = userData?.role;
  const [solution, setSolution] = useState<SolutionCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect vendors away from solution detail pages
  useEffect(() => {
    if (isLoaded && !isLoadingUserData && user && userRole === "seller") {
      router.push("/profile");
    }
  }, [isLoaded, isLoadingUserData, user, userRole, router]);

  useEffect(() => {
    async function fetchSolution() {
      try {
        const response = await fetch("/api/solutions");
        if (!response.ok) {
          throw new Error("Failed to fetch solutions");
        }
        const data = await response.json();
        if (data.success && data.data) {
          const solutionId = parseInt(params.id as string);
          const foundSolution = data.data.find(
            (card: SolutionCardData) => card.id === solutionId
          );
          if (foundSolution) {
            setSolution(foundSolution);
          } else {
            setError("Solution not found");
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching solution:", err);
        setError(err instanceof Error ? err.message : "Failed to load solution");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchSolution();
    }
  }, [params.id]);

  // Show loading while checking user role or fetching solution
  if (!isLoaded || isLoadingUserData || loading) {
    return (
      <main className="min-h-screen bg-white">
        <HamburgerMenu 
          isOpen={true} 
          onToggle={() => {}}
          onClose={() => {}}
          isClosable={false}
          showShadow={false}
        />
        <div className="max-w-4xl mx-auto px-6 py-16 pt-28 flex items-center justify-center">
          <div className="text-zinc-600">Loading...</div>
        </div>
      </main>
    );
  }

  // If vendor, don't render (will redirect)
  if (userRole === "seller") {
    return null;
  }

  if (error || !solution) {
    return (
      <main className="min-h-screen bg-white">
        <HamburgerMenu 
          isOpen={true} 
          onToggle={() => {}}
          onClose={() => {}}
          isClosable={false}
          showShadow={false}
        />
        <div className="max-w-4xl mx-auto px-6 py-16 pt-28">
          <div className="text-red-600">Error: {error || "Solution not found"}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar - Always Open, Not Closable */}
      <HamburgerMenu 
        isOpen={true} 
        onToggle={() => {}}
        onClose={() => {}}
        isClosable={false}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-16 pt-28">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            {solution.category && (
              <span className="inline-block rounded-full bg-gradient-to-r from-zinc-50 to-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600">
                {solution.category}
              </span>
            )}
            <h1 className="text-5xl font-light text-zinc-900">{solution.title}</h1>
            <div className="h-px bg-zinc-200"></div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="prose prose-zinc max-w-none">
              <p className="text-lg leading-relaxed text-zinc-700">{solution.description}</p>
            </div>

            {/* Additional Details */}
            <div className="pt-8 border-t border-zinc-200 space-y-4">
              <h2 className="text-2xl font-semibold text-zinc-900">Solution Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Solution ID:</span>
                  <span className="ml-2 text-zinc-900 font-medium">{solution.id}</span>
                </div>
                {solution.category && (
                  <div>
                    <span className="text-zinc-500">Category:</span>
                    <span className="ml-2 text-zinc-900 font-medium">{solution.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-zinc-200 flex gap-4">
            <button className="px-6 py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors font-medium">
              Learn More
            </button>
            <button className="px-6 py-3 border border-zinc-300 text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors font-medium">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

