"use client";

import { useState } from "react";
import { HamburgerMenu } from "@/components/HamburgerMenu";

export default function BlogsPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"foryou" | "featured">("foryou");
  const [showBanner, setShowBanner] = useState(true);

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
    <main className="min-h-screen bg-white overflow-y-auto" style={{ height: "100vh", overflowY: "auto" }}>
      {/* Navigation Bar - Collapsible */}
      <HamburgerMenu 
        isOpen={isNavOpen} 
        onToggle={() => setIsNavOpen(!isNavOpen)}
        onClose={() => setIsNavOpen(false)}
        showShadow={true}
      />
      
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24">
        {/* Tabs */}
        <div className="flex items-center gap-8 mb-6 border-b border-zinc-200">
          <button
            onClick={() => setActiveTab("foryou")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === "foryou"
                ? "text-zinc-900 border-b-2 border-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
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
          <div className="mb-6 p-4 bg-zinc-100 rounded-lg flex items-center justify-between">
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
        <div className="space-y-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group flex items-start gap-6 py-4"
            >
              <div className="flex-1 min-w-0">
                {/* Author/Context */}
                <div className="flex items-center gap-2 mb-2 text-sm text-zinc-600">
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
                <h2 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-zinc-700 transition-colors leading-tight">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-zinc-600 mb-3 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.707.707l3.546-3.546a1 1 0 00.293-.707V10.333a1 1 0 00-1.707-.707L7 10.333a1 1 0 00-.293.707zM15.198 15.5a1.5 1.5 0 01-3 0v-6a1.5 1.5 0 113 0v6z" />
                    </svg>
                    <span>{blog.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span>{blog.comments}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors">
                      <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-32 h-32 bg-zinc-200 rounded overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

