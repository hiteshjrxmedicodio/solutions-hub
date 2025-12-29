"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Sidebar as AutomationSidebar } from "../components/Sidebar";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "./components/PageHeader";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { QuickStartSection } from "./components/QuickStartSection";
import { PostContentSection } from "./components/PostContentSection";
import { MediaEngagementSection } from "./components/MediaEngagementSection";
import { RecentPostsSection } from "./components/RecentPostsSection";
import { LinkedInConnection } from "./components/LinkedInConnection";
import { useLinkedInPost } from "./hooks/useLinkedInPost";
import { useLinkedInData } from "./hooks/useLinkedInData";

const LINKEDIN_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6 text-blue-600"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export default function LinkedInAgentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const {
    postHeader,
    postBody,
    postImages,
    mentions,
    scheduledTime,
    selectedListingTitle,
    isGenerating,
    isPosting,
    setPostHeader,
    setPostBody,
    setMentions,
    setScheduledTime,
    setSelectedListingTitle,
    addImages,
    removeImage,
    generatePost,
    generatePostContent,
    publishPost,
    resetForm,
  } = useLinkedInPost();

  const {
    recentPosts,
    newListings,
    unreadCount,
    isLoading: dataLoading,
    error: dataError,
    refreshPosts,
  } = useLinkedInData();

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = useMemo(
    () => userEmail === SUPER_ADMIN_EMAIL,
    [userEmail]
  );

  // Handle OAuth callback messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const error = params.get('error');
    
    if (connected === 'true') {
      alert('LinkedIn account connected successfully!');
      // Remove query params from URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (error) {
      const errorMessages: Record<string, string> = {
        'invalid_auth': 'Invalid authentication. Please try again.',
        'token_exchange_failed': 'Failed to exchange authorization code. Please try again.',
        'callback_failed': 'Failed to complete connection. Please try again.',
        'config_missing': 'LinkedIn configuration is missing. Please contact support.',
      };
      alert(errorMessages[error] || 'Failed to connect LinkedIn account. Please try again.');
      // Remove query params from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addImages(files);
    }
  };

  // Handle post generation
  const handleGenerate = async () => {
    const result = await generatePost(newListings);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Handle post content generation (both header and body)
  const handleGeneratePostContent = async () => {
    const result = await generatePostContent();
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Handle post publishing
  const handlePublish = async () => {
    const result = await publishPost(newListings);
    if (result.success) {
      resetForm();
      await refreshPosts();
      alert("Post published to LinkedIn successfully!");
    } else if (result.error) {
      alert(result.error);
    }
  };

  // Auth and permission checks
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!isSuperAdmin) {
      router.push("/solutions-hub");
      return;
    }
  }, [isLoaded, user, isSuperAdmin, router]);

  // Loading state
  if (!isLoaded || dataLoading) {
    return <LoadingState />;
  }

  // Auth check
  if (!user || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-br from-zinc-50 to-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex min-h-full pt-28 pb-12">
        {/* Main Content - Offset by sidebar width + padding (375px + 20px = 395px) */}
        <main className={`flex-1 mr-[395px] pl-5 pr-5 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="space-y-4">
            {/* Page Header */}
            <PageHeader
              title="Create LinkedIn Post"
              description="Craft and schedule professional LinkedIn posts with ease"
              icon={LINKEDIN_ICON}
            />

            {/* Error State */}
            {dataError && (
              <ErrorState message={dataError} onRetry={refreshPosts} />
            )}

            {/* Post Creation Section */}
            <section className="space-y-4">
              {/* LinkedIn Connection Status */}
              <LinkedInConnection />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column - Content */}
                <div className="lg:col-span-6 space-y-4">
                  <QuickStartSection
                    newListings={newListings}
                    selectedListingTitle={selectedListingTitle}
                    onListingSelect={setSelectedListingTitle}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />

                  <PostContentSection
                    postHeader={postHeader}
                    postBody={postBody}
                    onHeaderChange={setPostHeader}
                    onBodyChange={setPostBody}
                    onGeneratePostContent={handleGeneratePostContent}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Right Column - Media & Actions */}
                <div className="lg:col-span-6">
                  <MediaEngagementSection
                    postImages={postImages}
                    mentions={mentions}
                    scheduledTime={scheduledTime}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={removeImage}
                    onMentionsChange={setMentions}
                    onScheduledTimeChange={setScheduledTime}
                    onPublish={handlePublish}
                    isPublishDisabled={(!postHeader && !postBody) || isPosting}
                    isPosting={isPosting}
                  />
                </div>
              </div>
            </section>

            {/* Recent Posts Section */}
            <RecentPostsSection posts={recentPosts} />
          </div>
        </main>

        {/* Sidebar - Fixed width 375px with 20px padding = 395px total offset */}
        <aside className="fixed right-0 top-28 bottom-0 w-[375px] flex-shrink-0 pl-5 pr-5 overflow-y-auto z-30">
          <AutomationSidebar unreadCount={unreadCount} />
        </aside>
      </div>
    </div>
  );
}
