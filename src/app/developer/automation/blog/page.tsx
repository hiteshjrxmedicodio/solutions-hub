"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Sidebar as AutomationSidebar } from "../components/Sidebar";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "./components/PageHeader";
import { LoadingState } from "./components/LoadingState";
import { ArticleContentSection } from "./components/ArticleContentSection";
import { useBlogPost } from "./hooks/useBlogPost";
import { useBlogData } from "./hooks/useBlogData";

const BLOG_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-green-600"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export default function BlogAgentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    topic,
    selectedPlatform,
    articleTitle,
    sections,
    articleImages,
    tags,
    publishTime,
    isGenerating,
    isPublishing,
    setTopic,
    setSelectedPlatform,
    setArticleTitle,
    setSectionHeader,
    setSectionContent,
    setSectionImage,
    addSection,
    removeSection,
    setTags,
    setPublishTime,
    addImages,
    removeImage,
    generatePost,
    generateTitle,
    generateSection,
    publishPost,
    resetForm,
  } = useBlogPost();

  const {
    unreadCount,
    isLoading: dataLoading,
  } = useBlogData();

  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = useMemo(
    () => userEmail === SUPER_ADMIN_EMAIL,
    [userEmail]
  );


  // Handle post generation
  const handleGenerate = async () => {
    const result = await generatePost();
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Handle title generation
  const handleGenerateTitle = async () => {
    const result = await generateTitle();
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Handle section generation (both header and content)
  const handleGenerateSection = async (id: string) => {
    const result = await generateSection(id);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Handle post publishing
  const handlePublish = async () => {
    const result = await publishPost();
    if (result.success) {
      resetForm();
      const action = publishTime ? "scheduled" : "published";
      alert(`Blog post ${action} to ${selectedPlatform === "hubspot" ? "HubSpot" : "Medium"} successfully!`);
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
        {/* Main Content - Increased width (sidebar: 375px + 20px left padding + 20px right padding = 415px) */}
        <main className={`flex-1 mr-[415px] pl-6 pr-6 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <div className="space-y-4">
            {/* Page Header */}
            <PageHeader
              title="Create Blog Post"
              description="Generate and publish blog posts to HubSpot or Medium"
              icon={BLOG_ICON}
            />

            {/* Post Creation Section */}
            <section className="space-y-4">
              <div className="max-w-6xl">
                <ArticleContentSection
                  articleTitle={articleTitle}
                  sections={sections}
                  onTitleChange={setArticleTitle}
                  onSectionHeaderChange={setSectionHeader}
                  onSectionChange={setSectionContent}
                  onSectionImageChange={setSectionImage}
                  onAddSection={addSection}
                  onRemoveSection={removeSection}
                  onGenerateTitle={handleGenerateTitle}
                  onGenerateSection={handleGenerateSection}
                  onPublish={handlePublish}
                  isPublishDisabled={(!articleTitle || sections.length === 0 || sections.every((s) => !s.content.trim())) || isPublishing}
                  isPublishing={isPublishing}
                  isGenerating={isGenerating}
                  publishTime={publishTime}
                  selectedPlatform={selectedPlatform}
                />
              </div>
            </section>
          </div>
        </main>

        {/* Sidebar - Fixed (30% wider: 288px * 1.3 = 375px) */}
        <aside className="fixed right-0 top-28 bottom-0 w-[375px] flex-shrink-0 pl-5 pr-5 overflow-y-auto z-30">
          <AutomationSidebar unreadCount={unreadCount} />
        </aside>
      </div>
    </div>
  );
}
