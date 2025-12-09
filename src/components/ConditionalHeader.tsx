"use client";

import { usePathname } from "next/navigation";

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on sign-in and sign-up pages
  // Profile button is now only in the navigation bar (HamburgerMenu)
  // So this header is no longer needed
  return null;
}

