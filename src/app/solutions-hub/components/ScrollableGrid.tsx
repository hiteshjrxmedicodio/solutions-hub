"use client";

import { useEffect, useRef } from "react";

interface ScrollableGridProps {
  children: React.ReactNode;
}

export function ScrollableGrid({ children }: ScrollableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the search bar on initial load
    const scrollToSearchBar = () => {
      if (containerRef.current) {
        const searchBarElement = document.getElementById("search-bar-card");
        if (searchBarElement && containerRef.current) {
          // Get the position of the search bar relative to the container
          const containerRect = containerRef.current.getBoundingClientRect();
          const searchBarRect = searchBarElement.getBoundingClientRect();
          
          // Calculate scroll position to center the search bar in the viewport
          const scrollTop = 
            searchBarElement.offsetTop - 
            containerRef.current.offsetTop - 
            (containerRef.current.clientHeight / 2) + 
            (searchBarRect.height / 2);
          
          containerRef.current.scrollTop = Math.max(0, scrollTop);
        } else {
          // Fallback: scroll to center if search bar not found
          const scrollHeight = containerRef.current.scrollHeight;
          const clientHeight = containerRef.current.clientHeight;
          containerRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
        }
      }
    };

    // Try immediately, then again after a short delay to ensure DOM is ready
    scrollToSearchBar();
    const timeout = setTimeout(scrollToSearchBar, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className="p-0"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}

