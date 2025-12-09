"use client";

import { useEffect, useState } from "react";
import { SolutionCard } from "./SolutionCard";
import { SearchBarCard } from "./SearchBarCard";
import { ScrollableGrid } from "./ScrollableGrid";
import { HamburgerMenu } from "./HamburgerMenu";
import { NavigationBar } from "./NavigationBar";

interface CardData {
  id: number;
  title: string;
  description: string;
  category?: string;
  cols: number;
  rows: number;
}

export function SolutionsGrid() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch("/api/solutions");
        if (!response.ok) {
          throw new Error("Failed to fetch cards");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setCards(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching cards:", err);
        setError(err instanceof Error ? err.message : "Failed to load cards");
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, []);

  if (loading) {
    return (
      <main className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center" style={{ width: "100vw", height: "100vh" }}>
        <div className="text-zinc-600">Loading solutions...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="fixed inset-0 bg-white overflow-hidden flex items-center justify-center" style={{ width: "100vw", height: "100vh" }}>
        <div className="text-red-600">Error: {error}</div>
      </main>
    );
  }

  // Search bar is positioned after the first 17 cards
  const SEARCH_BAR_POSITION = 17;

  // Calculate distance from search bar for each card position
  // Cards closer to search bar get priority
  // Search bar is between positions 16 and 17, so both have distance 1
  const getCardDistance = (index: number): number => {
    if (index < SEARCH_BAR_POSITION) {
      // Cards before search bar: distance increases as index decreases
      return SEARCH_BAR_POSITION - index;
    } else {
      // Cards after search bar: distance increases as index increases
      return index - SEARCH_BAR_POSITION + 1; // +1 because first card after is also distance 1
    }
  };

  // Create a map to assign card content to positions
  const positionToCardMap = new Map<number, CardData | null>();
  
  if (searchQuery.trim() === "") {
    // No search: use original card data
    cards.forEach((card, index) => {
      positionToCardMap.set(index, card);
    });
  } else {
    // Search active: preserve cards with matching content near search bar, fill blanks
    const searchLower = searchQuery.toLowerCase();
    
    // First, check which cards already match and are near the search bar
    // Preserve their positions
    const matchingCardIds = new Set<number>();
    const cardsWithContent = new Map<number, CardData>();
    
    cards.forEach((card, index) => {
      const isMatch = card.title.toLowerCase().includes(searchLower);
      if (isMatch) {
        matchingCardIds.add(card.id);
        // Check if this card is near the search bar (within a certain distance)
        const distance = getCardDistance(index);
        // Consider cards within distance 3 as "surrounding" the search bar
        if (distance <= 3) {
          cardsWithContent.set(index, card);
        }
      }
    });

    // Initialize all positions
    cards.forEach((card, index) => {
      // If this position already has matching content near search bar, keep it
      if (cardsWithContent.has(index)) {
        positionToCardMap.set(index, cardsWithContent.get(index)!);
      } else if (matchingCardIds.has(card.id)) {
        // This card matches but is not near search bar - make it blank
        positionToCardMap.set(index, null);
      } else {
        // This card doesn't match - make it blank
        positionToCardMap.set(index, null);
      }
    });

    // Now fill blank positions with remaining matching cards
    // Get all matching cards that weren't already placed
    const remainingMatchingCards = cards.filter(
      (card) => matchingCardIds.has(card.id) && !Array.from(cardsWithContent.values()).some(c => c.id === card.id)
    );

    // Get all blank positions, sorted by distance from search bar
    const blankPositions = Array.from({ length: cards.length }, (_, i) => i)
      .filter(index => positionToCardMap.get(index) === null)
      .map(index => ({ index, distance: getCardDistance(index) }))
      .sort((a, b) => a.distance - b.distance);

    // Fill blank positions with remaining matching cards
    remainingMatchingCards.forEach((card, matchIndex) => {
      if (matchIndex < blankPositions.length) {
        const position = blankPositions[matchIndex].index;
        positionToCardMap.set(position, card);
      }
    });
  }

  return (
    <main className="fixed inset-0 bg-white" style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, maxWidth: "100vw", overflow: "hidden", position: "relative" }}>
      {/* Hamburger Menu - Transforms into Sidebar */}
      <HamburgerMenu 
        isOpen={isNavOpen} 
        onToggle={() => setIsNavOpen(!isNavOpen)}
        onClose={() => setIsNavOpen(false)}
        showShadow={true}
      />
      
      <ScrollableGrid>
        <div
          className="solutions-grid grid border-t border-l border-r border-b border-zinc-600 p-0 m-0"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "minmax(calc(33.33vh / 2), auto)",
            gridAutoFlow: "row dense",
            gap: 0,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            alignContent: "start",
            overflow: "visible",
          }}
        >
          {/* Cards before search bar */}
          {cards.slice(0, SEARCH_BAR_POSITION).map((originalCard, index) => {
            const assignedCard = positionToCardMap.get(index);
            const isBlank = assignedCard === null;
            return (
              <SolutionCard
                key={`card-${index}`}
                id={assignedCard?.id ?? originalCard.id}
                title={assignedCard?.title ?? ""}
                description={assignedCard?.description ?? ""}
                category={assignedCard?.category}
                cols={originalCard.cols}
                rows={originalCard.rows}
                isBlank={isBlank}
              />
            );
          })}

          {/* Search bar card - integrated in grid, spans 8 columns, 2 rows, centered */}
          <SearchBarCard 
            cols={8} 
            rows={2} 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Cards after search bar */}
          {cards.slice(SEARCH_BAR_POSITION).map((originalCard, index) => {
            const positionIndex = index + SEARCH_BAR_POSITION;
            const assignedCard = positionToCardMap.get(positionIndex);
            const isBlank = assignedCard === null;
            return (
              <SolutionCard
                key={`card-${positionIndex}`}
                id={assignedCard?.id ?? originalCard.id}
                title={assignedCard?.title ?? ""}
                description={assignedCard?.description ?? ""}
                category={assignedCard?.category}
                cols={originalCard.cols}
                rows={originalCard.rows}
                isBlank={isBlank}
              />
            );
          })}
        </div>
      </ScrollableGrid>
    </main>
  );
}

