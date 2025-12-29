"use client";

import { BlogPost } from "../types";

interface RecentPostsSectionProps {
  posts: BlogPost[];
}

export function RecentPostsSection({ posts }: RecentPostsSectionProps) {
  return (
    <section>
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-3 bg-blue-100 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600"
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
              View your published and scheduled blog posts
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          {posts.length > 0 && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
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
                Create your first blog post above
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="group bg-gradient-to-br from-zinc-50 to-white rounded-xl p-5 border border-zinc-200 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-900 text-sm">
                        {post.title}
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
                      Topic: {post.topic} • Platform: {post.platform}
                    </p>
                  </div>
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title={`View on ${post.platform === "hubspot" ? "HubSpot" : "Medium"}`}
                    >
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
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
                {post.content && (
                  <div className="mb-3">
                    <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap text-xs text-zinc-500">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.publishTime && (
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
                        Scheduled: {new Date(post.publishTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {post.images && post.images.length > 0 && (
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
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>
                        {post.images.length} image{post.images.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  {post.publishedAt
                    ? `Published: ${new Date(post.publishedAt).toLocaleDateString()}`
                    : `Created: ${new Date(post.createdAt).toLocaleDateString()}`}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

