"use client";

import { useUserData } from "@/contexts/UserContext";
import { useUser } from "@clerk/nextjs";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useUser();
  const { userData, actingAs, setActingAs } = useUserData();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userData?.role === "superadmin";

  if (!isOpen || !isSuperAdmin) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-full max-w-md pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Close settings"
            >
              <svg
                className="w-5 h-5 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-3 uppercase tracking-wide">
                Role Switching
              </h3>
              <p className="text-sm text-zinc-600 mb-4">
                Switch between vendor and customer views to see the application from different perspectives.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setActingAs(actingAs === "vendor" ? null : "vendor");
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    actingAs === "vendor"
                      ? "border-blue-600 bg-gradient-to-r from-blue-50 to-teal-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          actingAs === "vendor"
                            ? "bg-gradient-to-r from-blue-600 to-teal-600"
                            : "bg-zinc-100"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            actingAs === "vendor" ? "text-white" : "text-zinc-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">Act as Vendor</p>
                        <p className="text-xs text-zinc-500">View vendor dashboard and features</p>
                      </div>
                    </div>
                    {actingAs === "vendor" && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActingAs(actingAs === "customer" ? null : "customer");
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    actingAs === "customer"
                      ? "border-blue-600 bg-gradient-to-r from-blue-50 to-teal-50"
                      : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          actingAs === "customer"
                            ? "bg-gradient-to-r from-blue-600 to-teal-600"
                            : "bg-zinc-100"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            actingAs === "customer" ? "text-white" : "text-zinc-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900">Act as Customer</p>
                        <p className="text-xs text-zinc-500">View customer dashboard and features</p>
                      </div>
                    </div>
                    {actingAs === "customer" && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>

                {actingAs && (
                  <button
                    onClick={() => {
                      setActingAs(null);
                    }}
                    className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
                  >
                    Clear Role Selection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

