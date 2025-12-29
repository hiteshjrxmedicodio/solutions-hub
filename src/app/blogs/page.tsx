"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function BlogsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<"foryou" | "featured">("foryou");
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const blogs = [
    {
      id: 1,
      title: "The Future of Healthcare Technology",
      excerpt:
        "Exploring how emerging technologies are reshaping the healthcare landscape and improving patient care delivery.",
      date: "Nov 29",
      category: "Technology",
      author: "Sarah Johnson",
      authorVerified: false,
      likes: "2.4K",
      comments: "156",
      thumbnail: "/api/placeholder/200/134",
    },
    {
      id: 2,
      title: "Implementing Telemedicine Solutions",
      excerpt:
        "A comprehensive guide to successfully deploying telemedicine platforms in healthcare organizations.",
      date: "Nov 25",
      category: "Telehealth",
      author: "Dr. Michael Chen",
      authorVerified: true,
      likes: "1.8K",
      comments: "89",
      thumbnail: "/api/placeholder/200/134",
    },
    {
      id: 3,
      title: "Data Analytics in Population Health",
      excerpt:
        "How advanced analytics are helping healthcare providers identify trends and improve population health outcomes.",
      date: "Nov 20",
      category: "Analytics",
      author: "Emily Rodriguez",
      authorVerified: false,
      likes: "3.1K",
      comments: "203",
      thumbnail: "/api/placeholder/200/134",
    },
    {
      id: 4,
      title: "Streamlining Revenue Cycle Management",
      excerpt:
        "Best practices for optimizing revenue cycle processes and reducing administrative burden in healthcare settings.",
      date: "Nov 15",
      category: "Financial",
      author: "James Wilson",
      authorVerified: false,
      likes: "1.2K",
      comments: "67",
      thumbnail: "/api/placeholder/200/134",
    },
    {
      id: 5,
      title: "AI-Powered Clinical Decision Support",
      excerpt:
        "The role of artificial intelligence in enhancing clinical decision-making and improving diagnostic accuracy.",
      date: "Nov 10",
      category: "Clinical",
      author: "Dr. Lisa Anderson",
      authorVerified: true,
      likes: "4.5K",
      comments: "312",
      thumbnail: "/api/placeholder/200/134",
    },
  ];

  return (
    <main className="min-h-screen bg-white flex overflow-y-auto" style={{ height: "100vh", overflowY: "auto" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} overflow-y-auto h-screen`}>
        <div className="pt-8 pb-12 px-8">
          {/* Header Card - Full Width */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-zinc-900 mb-3">Blogs & Articles</h1>
                <p className="text-zinc-700 text-lg leading-relaxed">
                  Discover insights, trends, and expert perspectives on healthcare technology, 
                  innovation, and industry best practices from leading professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - 70/30 Split */}
          <div className="flex gap-8">
            {/* Left Side - Blog Listings (70%) */}
            <div className="flex-[0.7] min-w-0">
              {/* Search Bar - Above Tabs, Only Article Width */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blogs, articles, authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3.5 pl-12 text-base border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white hover:bg-zinc-50 shadow-sm text-zinc-900 placeholder-zinc-400"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 mb-6 border-b border-zinc-200">
                <button
                  onClick={() => setActiveTab("foryou")}
                  className={`pb-3 px-1 text-sm font-semibold transition-colors ${
                    activeTab === "foryou"
                      ? "text-zinc-900 border-b-2 border-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  For you
                </button>
                <button
                  onClick={() => setActiveTab("featured")}
                  className={`pb-3 px-1 text-sm font-semibold transition-colors ${
                    activeTab === "featured"
                      ? "text-zinc-900 border-b-2 border-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  Featured
                </button>
              </div>

              {/* Informational Banner */}
              {showBanner && (
                <div className="mb-6 p-4 bg-zinc-100 rounded-xl flex items-center justify-between border border-zinc-200">
                  <p className="text-sm text-zinc-700">
                    "Following" and your topics are now part of the new Following page, which you can find from the sidebar.
                  </p>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="ml-4 px-4 py-1.5 text-sm font-medium text-zinc-900 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors whitespace-nowrap"
                  >
                    Okay, got it
                  </button>
                </div>
              )}

              {/* Blog List */}
              <div className="space-y-6">
              {blogs
                .filter((blog) => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    blog.title.toLowerCase().includes(query) ||
                    blog.excerpt.toLowerCase().includes(query) ||
                    blog.category.toLowerCase().includes(query) ||
                    blog.author.toLowerCase().includes(query)
                  );
                })
                .map((blog) => (
            <article
              key={blog.id}
              className="group flex items-start gap-6 py-6 border-b border-zinc-100 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                {/* Author/Context */}
                <div className="flex items-center gap-2 mb-3 text-sm text-zinc-600">
                  <span className="font-medium">In {blog.category}</span>
                  <span>by</span>
                  <span className="font-medium">{blog.author}</span>
                  {blog.authorVerified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-zinc-700 transition-colors leading-tight">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-base text-zinc-600 mb-4 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-40 h-40 bg-zinc-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                  <svg className="w-16 h-16 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
              </div>
            </div>

            {/* Right Side - AI Updates (30%) */}
            <div className="flex-[0.3] flex-shrink-0">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-lg p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-zinc-900 mb-4">AI Updates</h2>
                <p className="text-sm text-zinc-600 mb-6">
                  Latest AI-powered insights and automated content recommendations
                </p>
                
                <div className="space-y-4">
                  {/* AI Update Items */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">AI Content Generated</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          New article on "AI-Powered Diagnostics" has been automatically generated and published.
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">Trending Topic</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          "Telemedicine Solutions" is trending with 45% increase in reader engagement.
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">5 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">New Author Detected</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          AI identified a new expert contributor in "Clinical Decision Support" category.
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">1 day ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">Content Performance</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          Analytics show 32% higher engagement on AI-recommended articles this week.
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">2 days ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">Smart Recommendations</h3>
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          Based on your reading history, 3 new articles match your interests.
                        </p>
                        <span className="text-xs text-zinc-500 mt-1 block">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl transition-colors text-sm font-semibold">
                  View All Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

