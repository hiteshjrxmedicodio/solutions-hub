"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  unreadCount: number;
}

export function Sidebar({ unreadCount }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full static z-40">
      <div className="bg-white/90 backdrop-blur-xl border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Automation Center
            </h2>
            <p className="text-sm text-zinc-600">Manage automated workflows</p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/developer/automation/linkedin"
              className={`flex flex-col gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                pathname === "/developer/automation/linkedin"
                  ? "border-2 border-blue-400 bg-blue-100 text-blue-700 shadow-sm"
                  : "border-transparent hover:bg-blue-50 text-zinc-700 hover:text-blue-700 hover:border-blue-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div className="font-medium text-sm">LinkedIn Post Agent</div>
              </div>
              <div className="text-xs text-zinc-500 pl-11">
                Auto-create LinkedIn posts
              </div>
            </Link>
            <Link
              href="/developer/automation/blog"
              className={`flex flex-col gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                pathname === "/developer/automation/blog"
                  ? "border-2 border-green-400 bg-green-100 text-green-700 shadow-sm"
                  : "border-transparent hover:bg-green-50 text-zinc-700 hover:text-green-700 hover:border-green-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-200">
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
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div className="font-medium text-sm">Blog Post Agent</div>
              </div>
            </Link>
          </nav>

          <div className="mt-4 pt-4 border-t border-zinc-200">
            <Link
              href="/developer/automation/notifications"
              className={`flex flex-col gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                pathname === "/developer/automation/notifications"
                  ? "border-2 border-orange-400 bg-orange-100 text-orange-700 shadow-sm"
                  : "border-transparent hover:bg-orange-50 text-zinc-700 hover:border-orange-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-200 relative">
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
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <div className="font-medium text-sm">Notifications</div>
              </div>
            </Link>
          </div>

          <div className="mt-2">
            <Link
              href="/developer/automation/settings"
              className={`flex flex-col gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                pathname === "/developer/automation/settings"
                  ? "border-2 border-zinc-400 bg-zinc-100 text-zinc-700 shadow-sm"
                  : "border-transparent hover:bg-zinc-50 text-zinc-700 hover:border-zinc-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-zinc-200">
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
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="font-medium text-sm">Settings</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

