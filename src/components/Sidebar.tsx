"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { SettingsModal } from "@/components/SettingsModal";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function Sidebar({ isOpen, onToggle, onClose, isCollapsed = false, onCollapseToggle }: SidebarProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onToggleRef = useRef(onToggle);
  const onCollapseToggleRef = useRef(onCollapseToggle);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { userData, actingAs } = useUserData();
  const userRole = userData?.role;
  // Use actingAs role if set, otherwise use actual role
  const effectiveRole = actingAs || userRole;

  // Keep refs updated
  useEffect(() => {
    onToggleRef.current = onToggle;
    onCollapseToggleRef.current = onCollapseToggle;
  }, [onToggle, onCollapseToggle]);

  // Track if component is mounted (client-side only) to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch unread notification count
  useEffect(() => {
    if (!user?.id) {
      setUnreadNotificationCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications?filter=unread");
        
        if (!response.ok) {
          // If response is not OK, don't throw but log and set count to 0
          console.warn(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
          setUnreadNotificationCount(0);
          return;
        }

        const data = await response.json();
        if (data.success) {
          setUnreadNotificationCount(data.notifications?.length || 0);
        } else {
          setUnreadNotificationCount(0);
        }
      } catch (error) {
        // Silently handle network errors - don't spam console
        // Only log if it's not a network error
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          // Network error - likely server not running or CORS issue
          setUnreadNotificationCount(0);
        } else {
          console.error("Error fetching unread notification count:", error);
          setUnreadNotificationCount(0);
        }
      }
    };

    // Initial fetch
    fetchUnreadCount();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Also refresh when window regains focus
    const handleFocus = () => fetchUnreadCount();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id]);

  // Cache user display info in localStorage
  const USER_DISPLAY_CACHE_KEY = "user_display_cache";
  
  // Get cached user display info
  const getCachedUserDisplay = () => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem(USER_DISPLAY_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // Invalid cache
    }
    return null;
  };

  // Cache user display info
  const cacheUserDisplay = (email: string, initial: string, imageUrl?: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_DISPLAY_CACHE_KEY, JSON.stringify({ email, initial, imageUrl }));
    } catch (e) {
      // Failed to cache
    }
  };

  // Get cached display info on mount
  const [cachedDisplay, setCachedDisplay] = useState<{ email: string; initial: string; imageUrl?: string } | null>(null);
  
  // Load cache on client side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = getCachedUserDisplay();
      if (cached) {
        setCachedDisplay(cached);
      }
    }
  }, []);

  // Update cache when Clerk user loads
  useEffect(() => {
    if (isUserLoaded && user?.id) {
      let initial = "U";
      if (user.firstName || user.lastName) {
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        initial = first + last || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
      } else {
        initial = user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
      }
      
      const email = user.emailAddresses[0]?.emailAddress || "";
      const imageUrl = user.imageUrl;
      
      const displayInfo = {
        email,
        initial,
        imageUrl,
      };
      
      cacheUserDisplay(displayInfo.email, displayInfo.initial, displayInfo.imageUrl);
      setCachedDisplay(displayInfo);
    }
  }, [isUserLoaded, user?.id]);

  // Get user's initial or avatar
  const getUserInitial = () => {
    if (isUserLoaded && user) {
      if (user.firstName || user.lastName) {
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        return first + last || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
      }
      return user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
    }
    return cachedDisplay?.initial || "U";
  };

  // Get user email
  const getUserEmail = () => {
    if (isUserLoaded && user?.emailAddresses[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    return cachedDisplay?.email || "";
  };

  // Get user image URL
  const getUserImageUrl = () => {
    if (isUserLoaded && user?.imageUrl) {
      return user.imageUrl;
    }
    return cachedDisplay?.imageUrl;
  };

  const userEmail = getUserEmail();
  const userImageUrl = getUserImageUrl();
  const userInitial = getUserInitial();
  const hasUserData = (isUserLoaded && user) || (isMounted && cachedDisplay);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Keyboard shortcut: Cmd/Ctrl + S to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+S (Mac) or Ctrl+S (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault(); // Prevent browser save dialog
        
        // On desktop, toggle collapsed state; on mobile, toggle open/close
        if (onCollapseToggleRef.current && window.innerWidth >= 1024) {
          // Desktop: toggle collapsed state
          onCollapseToggleRef.current();
        } else {
          // Mobile: toggle open/close
          onToggleRef.current();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // Using refs so we don't need dependencies - but include them to keep array size constant
  }, [onToggle, onCollapseToggle]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileClick = (profileType?: "vendor" | "customer") => {
    // For super admin, allow choosing between vendor and customer profiles
    if (isSuperAdmin && user?.id) {
      if (profileType === "customer") {
        router.push(`/customer/${user.id}`);
      } else {
        // Default to vendor profile for super admin
        router.push("/vendor/seed-medicodio");
      }
    } else if (userEmail === "hitesh.ms24@gmail.com") {
      router.push("/vendor/seed-medicodio");
    } else if (userRole === "vendor" && user?.id) {
      router.push(`/vendor/${user.id}`);
    } else if (userRole === "customer" && user?.id) {
      router.push(`/customer/${user.id}`);
    } else if (userRole === "customer") {
      router.push("/solutions-hub");
    }
    onClose();
    setIsProfileDropdownOpen(false);
  };

  // Check if user is super admin
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";

  const navLinks: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
    visible: boolean;
    hasNotification?: boolean;
    onClick?: (e: React.MouseEvent) => void;
  }> = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-shrink-0">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </div>
      ),
      visible: true,
      hasNotification: unreadNotificationCount > 0,
    },
    {
      name: "Solutions Hub",
      href: "/solutions-hub",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-shrink-0">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      visible: true,
    },
    {
      name: "Listings",
      href: "/listings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      visible: effectiveRole !== "vendor" || isSuperAdmin,
    },
    {
      name: "Proposals",
      href: "/proposals",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-shrink-0">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      visible: effectiveRole === "customer" || isSuperAdmin,
    },
    {
      name: "Developer Mode",
      href: "/developer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 flex-shrink-0">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      visible: isSuperAdmin,
    },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-zinc-200 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isCollapsed ? "lg:w-16" : "lg:w-64"} flex flex-col`}
      >
        {/* Header */}
        <div className={`border-b border-zinc-200 ${isCollapsed ? "p-4" : "p-6"}`}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-zinc-900">Astro Vault</h2>
            )}
            <div className="flex items-center gap-2">
              {onCollapseToggle && (
                <button
                  onClick={onCollapseToggle}
                  className="hidden lg:flex p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 rounded-lg transition-colors"
                  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    {isCollapsed ? (
                      <polyline points="9 18 15 12 9 6" />
                    ) : (
                      <polyline points="15 18 9 12 15 6" />
                    )}
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navLinks
              .filter((link) => link.visible)
              .map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                const Component = link.onClick ? 'button' : Link;
                const linkProps = link.onClick 
                  ? { onClick: (e: React.MouseEvent) => { e.preventDefault(); link.onClick!(e); onClose(); } }
                  : { href: link.href, onClick: onClose };
                
                return (
                  <li key={link.href}>
                    <Component
                      {...linkProps}
                      className={`w-full flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3 rounded-lg transition-colors relative ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-teal-50 text-zinc-900 font-medium"
                          : "text-zinc-600 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 hover:text-zinc-900"
                      }`}
                      title={isCollapsed ? link.name : undefined}
                    >
                      <div className={isCollapsed ? "flex items-center justify-center" : ""}>
                        {link.icon}
                      </div>
                      {!isCollapsed && (
                        <span className="flex-1">{link.name}</span>
                      )}
                    </Component>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* User Info Footer */}
        {hasUserData && (
          <div className={`border-t border-zinc-200 ${isCollapsed ? "p-4" : "p-6"}`}>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors overflow-hidden"
                  style={{
                    backgroundColor: userImageUrl ? "transparent" : "#7A8B5A",
                  }}
                  title={isCollapsed ? userEmail : undefined}
                >
                  {userImageUrl ? (
                    <img
                      src={userImageUrl}
                      alt={user?.firstName || cachedDisplay?.email || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {userInitial}
                    </span>
                  )}
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`absolute ${isCollapsed ? "left-16" : "left-0"} bottom-12 bg-white rounded-lg shadow-xl border border-zinc-300 py-2 z-[100] w-48`}
                  >
                    {/* Super Admin: Show profile based on acting role */}
                    {isSuperAdmin && user?.id ? (
                      <>
                        {/* Show single Profile button if acting as a role */}
                        {actingAs === "vendor" ? (
                          <button
                            onClick={() => handleProfileClick("vendor")}
                            className="w-full px-4 py-2.5 text-left text-sm bg-gradient-to-r from-blue-50 to-teal-50 text-zinc-900 font-medium transition-colors flex items-center gap-3"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span>Profile</span>
                            <span className="ml-auto text-xs text-blue-600 font-medium">Active</span>
                          </button>
                        ) : actingAs === "customer" ? (
                          <button
                            onClick={() => handleProfileClick("customer")}
                            className="w-full px-4 py-2.5 text-left text-sm bg-gradient-to-r from-blue-50 to-teal-50 text-zinc-900 font-medium transition-colors flex items-center gap-3"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <span>Profile</span>
                            <span className="ml-auto text-xs text-blue-600 font-medium">Active</span>
                          </button>
                        ) : (
                          /* Show both profiles if not acting as any role */
                          <>
                            <button
                              onClick={() => handleProfileClick("vendor")}
                              className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors flex items-center gap-3"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                              <span>Vendor Profile</span>
                            </button>
                            <button
                              onClick={() => handleProfileClick("customer")}
                              className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors flex items-center gap-3"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <span>Customer Profile</span>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                    <button
                        onClick={() => handleProfileClick()}
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors flex items-center gap-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    )}
                    {/* Settings option for superadmin */}
                    {isSuperAdmin && (
                      <>
                        <div className="border-t border-zinc-200 my-1" />
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsSettingsOpen(true);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors flex items-center gap-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                          </svg>
                          <span>Settings</span>
                        </button>
                      </>
                    )}
                    <div className="border-t border-zinc-200 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{userEmail}</p>
                  <p className="text-xs text-zinc-500">
                    {isSuperAdmin 
                      ? "Super Admin" 
                      : userRole === "vendor" 
                        ? "Vendor" 
                        : userRole === "customer" 
                          ? "Customer" 
                          : "User"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Toggle Button - Only show on mobile when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-6 left-6 z-50 lg:hidden p-3 bg-white border border-zinc-200 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-50 hover:via-teal-50 hover:to-emerald-50 transition-colors"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

