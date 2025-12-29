"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isClosable?: boolean;
  showShadow?: boolean;
}

// Helper function to check if user logged in within last 24 hours
const isUserActiveLast24Hours = (lastLoginAt?: Date): boolean => {
  if (!lastLoginAt) return false;
  const lastLogin = new Date(lastLoginAt);
  const now = new Date();
  const hoursSinceLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
  return hoursSinceLogin <= 24;
};

export function HamburgerMenu({ isOpen, onToggle, onClose, isClosable = true, showShadow = false }: HamburgerMenuProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastCachedUserIdRef = useRef<string | null>(null);
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { userData } = useUserData();
  const userRole = userData?.role;

  // Track if component is mounted (client-side only) to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Get cached display info on mount - start with null to avoid hydration mismatch
  // Load from cache only on client side after mount
  const [cachedDisplay, setCachedDisplay] = useState<{ email: string; initial: string; imageUrl?: string } | null>(null);
  
  // Load cache on client side only (after hydration)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = getCachedUserDisplay();
      if (cached) {
        setCachedDisplay(cached);
      }
    }
  }, []);

  // Update cache when Clerk user loads (only if user ID changed or data is different)
  useEffect(() => {
    if (isUserLoaded && user?.id) {
      // Skip if we already cached this user
      if (lastCachedUserIdRef.current === user.id) {
        return;
      }
      
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
      lastCachedUserIdRef.current = user.id;
    }
  }, [isUserLoaded, user?.id]);

  // Get user's initial or avatar - prefer Clerk, fallback to cache
  const getUserInitial = () => {
    if (isUserLoaded && user) {
      if (user.firstName || user.lastName) {
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        return first + last || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
      }
      return user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
    }
    
    // If Clerk not loaded, use cache
    return cachedDisplay?.initial || "U";
  };

  // Get user email - prefer Clerk, fallback to cache
  const getUserEmail = () => {
    if (isUserLoaded && user?.emailAddresses[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    return cachedDisplay?.email || "";
  };

  // Get user image URL - prefer Clerk, fallback to cache
  const getUserImageUrl = () => {
    if (isUserLoaded && user?.imageUrl) {
      return user.imageUrl;
    }
    return cachedDisplay?.imageUrl;
  };

  // Get user data - use Clerk data if available, otherwise use cache (only after mount to avoid hydration mismatch)
  const getUserEmailValue = () => {
    if (isUserLoaded && user?.emailAddresses[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    // Only use cache after mount to avoid hydration mismatch
    if (isMounted && cachedDisplay?.email) {
      return cachedDisplay.email;
    }
    return "";
  };

  const getUserImageUrlValue = () => {
    if (isUserLoaded && user?.imageUrl) {
      return user.imageUrl;
    }
    // Only use cache after mount to avoid hydration mismatch
    if (isMounted && cachedDisplay?.imageUrl) {
      return cachedDisplay.imageUrl;
    }
    return undefined;
  };

  const getUserInitialValue = () => {
    if (isUserLoaded && user) {
      if (user.firstName || user.lastName) {
        const first = user.firstName?.[0]?.toUpperCase() || "";
        const last = user.lastName?.[0]?.toUpperCase() || "";
        return first + last || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
      }
      return user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || "U";
    }
    // Only use cache after mount to avoid hydration mismatch
    if (isMounted && cachedDisplay?.initial) {
      return cachedDisplay.initial;
    }
    return "U";
  };

  const userEmail = getUserEmailValue();
  const userImageUrl = getUserImageUrlValue();
  const userInitial = getUserInitialValue();
  
  // Only show profile button if we have user data from Clerk (to avoid hydration mismatch)
  // After mount, we can also show if we have cached data
  const hasUserData = (isUserLoaded && user) || (isMounted && cachedDisplay);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isProfileDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isProfileDropdownOpen, isOpen]);

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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfileClick = () => {
    // Special case: Link hitesh.ms24@gmail.com to seed-medicodio vendor page
    if (userEmail === "hitesh.ms24@gmail.com") {
      router.push("/vendor/seed-medicodio");
    } else if (userRole === "seller" && user?.id) {
      router.push(`/vendor/${user.id}`);
    } else if (userRole === "buyer") {
      router.push("/solutions-hub");
    }
    if (isClosable) {
      onClose();
    }
    setIsProfileDropdownOpen(false);
  };

  // Check if user is super admin (by email or role)
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superAdmin";

  return (
    <>
      {/* Backdrop overlay - Only show if closable, allows scroll through */}
      {isOpen && isClosable && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
          style={{ 
            pointerEvents: "auto",
            touchAction: "pan-y pinch-zoom"
          }}
          aria-hidden="true"
        />
      )}

      {/* Transformable Navigation - Circle to Horizontal Bar */}
      <nav
        className={`fixed top-6 z-50 transition-all duration-500 ease-in-out ${
          isOpen
            ? `w-[calc(100%-3rem)] left-6 h-16 rounded-2xl ${showShadow ? "shadow-2xl" : ""}`
            : `w-[53px] h-[53px] rounded-full left-6 ${showShadow ? "shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.2)]" : ""}`
        } backdrop-blur-xl bg-white/80 border border-zinc-900 overflow-hidden`}
        style={{
          transitionProperty: "width, height, border-radius, left, box-shadow",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Horizontal Navigation Content */}
        <div 
          className={`h-full flex items-center gap-4 px-6 transition-all duration-500 delay-100 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Planet Icon Button - Only show if closable */}
          {isClosable && (
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-zinc-900 hover:bg-zinc-50 transition-colors shrink-0"
              aria-label="Close navigation"
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-zinc-900"
            >
              {/* Planet with ring (Saturn-like) */}
              <circle cx="12" cy="10" r="3.5" fill="currentColor" />
              <ellipse cx="12" cy="10" rx="5.5" ry="1.2" fill="none" stroke="currentColor" />
            </svg>
          </button>
          )}

          {/* Navigation Links */}
          <div className="flex items-center gap-6 px-4">
            {/* Solutions Hub - Only visible to buyers */}
            {userRole !== "seller" && (
              <a
                href="/solutions-hub"
                className="text-zinc-900 hover:text-zinc-700 transition-colors font-medium text-sm"
                onClick={isClosable ? onClose : undefined}
              >
                Solutions Hub
              </a>
            )}
            {/* Listings - Only visible to buyers */}
            {userRole !== "seller" && (
              <a
                href="/listings"
                className="text-zinc-900 hover:text-zinc-700 transition-colors font-medium text-sm"
                onClick={isClosable ? onClose : undefined}
              >
                Listings
              </a>
            )}
            <a
              href="/blogs"
              className="text-zinc-900 hover:text-zinc-700 transition-colors font-medium text-sm"
              onClick={isClosable ? onClose : undefined}
            >
              Blogs
            </a>
            {/* Developer Mode - Only visible to super admin */}
            {isSuperAdmin && (
              <a
                href="/developer"
                className="text-zinc-900 hover:text-zinc-700 transition-colors font-medium text-sm"
                onClick={isClosable ? onClose : undefined}
              >
                Developer Mode
              </a>
            )}
          </div>

          {/* Email Field - Only show if we have Clerk user data (to avoid hydration mismatch) */}
          {isUserLoaded && userEmail && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-zinc-300 min-w-[200px] ml-auto">
              <span className="text-zinc-900 text-sm font-medium">{userEmail}</span>
            </div>
          )}

          {/* Profile Circle Button with Dropdown - Only show if we have Clerk user data (to avoid hydration mismatch) */}
          {isUserLoaded && hasUserData && (
            <div className="relative shrink-0">
              <button
                ref={buttonRef}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900 hover:bg-zinc-50 transition-colors overflow-hidden"
                aria-label="Profile"
                style={{
                  backgroundColor: userImageUrl ? "transparent" : "#7A8B5A", // muted olive green color
                }}
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
            </div>
          )}
        </div>

        {/* Hamburger Icon - Visible when closed, only if closable */}
        {isClosable && (
          <button
            onClick={onToggle}
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-label="Toggle navigation menu"
          >
          <div className="flex flex-col items-center justify-center gap-1.5 w-[22px] h-[22px]">
            <span className="block h-0.5 w-[22px] bg-zinc-900 rounded-full" />
            <span className="block h-0.5 w-[22px] bg-zinc-900 rounded-full" />
            <span className="block h-0.5 w-[22px] bg-zinc-900 rounded-full" />
          </div>
        </button>
        )}
      </nav>

      {/* Dropdown Menu - Rendered outside nav to avoid overflow clipping */}
      {isProfileDropdownOpen && isOpen && (
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg shadow-xl border border-zinc-300 py-2 z-[100] w-48"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          <button
            onClick={handleProfileClick}
            className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-50 transition-colors flex items-center gap-3"
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
    </>
  );
}

