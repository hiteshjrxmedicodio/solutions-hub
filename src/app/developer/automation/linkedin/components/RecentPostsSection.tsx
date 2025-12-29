"use client";

import { LinkedInPost } from "../types";

interface RecentPostsSectionProps {
  posts: LinkedInPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 bg-green-100 rounded-xl">
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Recent Posts</h1>
            <p className="text-sm text-zinc-500 mt-1">
              View your published and scheduled LinkedIn posts
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          {posts.length > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          )}
        </div>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-zinc-400"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p className="text-zinc-500 font-medium mb-1">No posts yet</p>
              <p className="text-sm text-zinc-400">
                Create your first LinkedIn post above
              </p>
            </div>
          ) : (
            posts.map((post, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-zinc-50 to-white rounded-xl p-5 border border-zinc-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-900 text-sm">
                        {post.listingTitle || "Custom Post"}
                      </h3>
                      {post.status === "scheduled" && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                          Scheduled
                        </span>
                      )}
                      {post.status === "published" && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {post.linkedInUrl && (
                    <a
                      href={post.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View on LinkedIn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                </div>
                {(post.header || post.body || post.content) && (
                  <div className="mb-3">
                    {post.header && (
                      <p className="text-sm font-semibold text-zinc-900 mb-2">
                        {post.header}
                      </p>
                    )}
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {post.body || post.content}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-500">
                  {post.mentions && post.mentions.length > 0 && (
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      <span>
                        {post.mentions.length} mention{post.mentions.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {post.scheduledTime && (
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>
                        {new Date(post.scheduledTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

