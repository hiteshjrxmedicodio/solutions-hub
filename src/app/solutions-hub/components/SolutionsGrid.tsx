"use client";

import { useEffect, useState } from "react";
import { SolutionCard } from "./SolutionCard";
import { SearchBarCard } from "./SearchBarCard";
import { ScrollableGrid } from "./ScrollableGrid";
import { Sidebar } from "@/components/Sidebar";

interface CardData {
  id: number;
  title: string;
  description: string;
  category?: string;
  categories?: string[];
  companyType?: string;
  companySize?: string;
  integrationCapabilities?: string[];
  deploymentOptions?: string[];
  targetInstitutionTypes?: string[];
  targetSpecialties?: string[];
  cols: number;
  rows: number;
  userId?: string; // Vendor userId for navigation
}

interface FilterState {
  category: string | null;
  companyType: string | null;
  integration: string | null;
  specialty: string | null;
}

export function SolutionsGrid() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    companyType: null,
    integration: null,
    specialty: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

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

  // Zone boundaries - split cards into top, middle, and bottom zones
  const TOP_ZONE_SIZE = 8; // First 8 cards in top zone
  const MIDDLE_ZONE_START = 8; // Middle zone starts after top
  const MIDDLE_ZONE_SIZE = 12; // 12 cards in middle zone (includes search bar area)
  const BOTTOM_ZONE_START = TOP_ZONE_SIZE + MIDDLE_ZONE_SIZE;

  // Constraint: Cards should be 20-25% of screen width or height
  // 20% of 12 columns = 2.4, 25% of 12 columns = 3
  // So allow 2-3 columns (16.67% to 25% width)
  // 20-25% of viewport height = 20-25vh, with rows at ~16.67vh, 1 row fits in range
  const MAX_COLS = 3; // 25% of 12 columns (max)
  const MIN_COLS = 2; // 16.67% of 12 columns (closer to 20%)
  const MAX_ROWS = 1; // ~16.67vh per row (fits in 20-25% range)

  // Available sizes in 20-25% range
  const AVAILABLE_COLS = [2, 3]; // 16.67% and 25% width
  const AVAILABLE_ROWS = [1]; // ~16.67vh

  // Simple hash function for deterministic but varied assignment
  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Distribute columns among cards in a row to fill 12 columns, but not equally
  const distributeColumns = (cards: CardData[], startIndex: number = 0): number[] => {
    const numCards = cards.length;
    if (numCards === 0) return [];
    if (numCards === 1) return [12]; // Single card takes all
    
    // Start with minimum distribution (all MIN_COLS)
    const distributions: number[] = new Array(numCards).fill(MIN_COLS);
    let totalAssigned = MIN_COLS * numCards;
    let remaining = 12 - totalAssigned;
    
    // If we can't even fill with minimums, something's wrong
    if (remaining < 0) {
      // This shouldn't happen with MIN_COLS=2, but handle it
      return new Array(numCards).fill(Math.floor(12 / numCards));
    }
    
    // Create variety by distributing remaining columns unevenly
    // Use card hash to determine which cards get extra columns
    const cardHashes = cards.map((card, idx) => ({
      index: idx,
      hash: hash(`${card.id}-${startIndex + idx}`),
    })).sort((a, b) => a.hash - b.hash);
    
    // Distribute remaining columns to create variety
    // Strategy: Give some cards MAX_COLS, keep others at MIN_COLS
    // This ensures variety while maintaining sum of 12
    let idx = 0;
    while (remaining > 0 && idx < cardHashes.length) {
      const cardIdx = cardHashes[idx].index;
      const currentVal = distributions[cardIdx];
      
      // Calculate how much we can add (up to MAX_COLS)
      const maxAdd = MAX_COLS - currentVal;
      if (maxAdd > 0) {
        const toAdd = Math.min(remaining, maxAdd);
        distributions[cardIdx] += toAdd;
        remaining -= toAdd;
      }
      idx++;
    }
    
    // If there's still remainder, distribute it as evenly as possible
    // but maintain variety by not making all equal
    if (remaining > 0) {
      // Find cards that can still take more (but stay under MAX_COLS)
      const availableCards = distributions
        .map((val, idx) => ({ val, idx }))
        .filter(item => item.val < MAX_COLS)
        .sort((a, b) => a.val - b.val); // Prioritize smaller values
      
      for (const item of availableCards) {
        if (remaining <= 0) break;
        const canAdd = MAX_COLS - item.val;
        const toAdd = Math.min(remaining, canAdd);
        distributions[item.idx] += toAdd;
        remaining -= toAdd;
      }
    }
    
    // Final verification: ensure sum is exactly 12
    const currentSum = distributions.reduce((sum, val) => sum + val, 0);
    if (currentSum !== 12) {
      const diff = 12 - currentSum;
      if (diff > 0) {
        // Add to smallest values first
        const sorted = distributions.map((val, idx) => ({ val, idx }))
          .sort((a, b) => a.val - b.val);
        for (let i = 0; i < diff && i < sorted.length; i++) {
          if (distributions[sorted[i].idx] < MAX_COLS) {
            distributions[sorted[i].idx]++;
          }
        }
      } else {
        // Subtract from largest values
        const sorted = distributions.map((val, idx) => ({ val, idx }))
          .sort((a, b) => b.val - a.val);
        for (let i = 0; i < Math.abs(diff) && i < sorted.length; i++) {
          if (distributions[sorted[i].idx] > MIN_COLS) {
            distributions[sorted[i].idx]--;
      }
        }
      }
    }
    
    // Clamp all values to 2-3 range and verify sum
    const clamped = distributions.map(cols => 
      Math.max(MIN_COLS, Math.min(cols, MAX_COLS))
    );
    
    // Final sum check - if not 12, adjust
    const finalSum = clamped.reduce((sum, val) => sum + val, 0);
    if (finalSum !== 12) {
      const diff = 12 - finalSum;
      if (diff > 0) {
        // Add to cards that can take more
        const sorted = clamped.map((val, idx) => ({ val, idx }))
          .sort((a, b) => a.val - b.val);
        for (let i = 0; i < diff && i < sorted.length; i++) {
          if (clamped[sorted[i].idx] < MAX_COLS) {
            clamped[sorted[i].idx]++;
          }
        }
      } else {
        // Subtract from cards that can give
        const sorted = clamped.map((val, idx) => ({ val, idx }))
          .sort((a, b) => b.val - a.val);
        for (let i = 0; i < Math.abs(diff) && i < sorted.length; i++) {
          if (clamped[sorted[i].idx] > MIN_COLS) {
            clamped[sorted[i].idx]--;
          }
        }
      }
    }
    
    return clamped;
  };

  // Assign sizes for cards in a group (ensures they fill the row)
  const getSizesForGroup = (cards: CardData[], startIndex: number = 0): Array<{ cols: number; rows: number }> => {
    const colDistributions = distributeColumns(cards, startIndex);
    return colDistributions.map((cols, idx) => ({
      cols,
      rows: MAX_ROWS, // Always 1 row
    }));
  };

  // Filter cards based on search query and all filters
  const filteredCards = cards.filter((card) => {
    const matchesSearch = searchQuery === "" || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filters.category || 
      card.category === filters.category || 
      card.categories?.includes(filters.category);
    const matchesCompanyType = !filters.companyType || card.companyType === filters.companyType;
    const matchesIntegration = !filters.integration || 
      card.integrationCapabilities?.includes(filters.integration);
    const matchesSpecialty = !filters.specialty || 
      card.targetSpecialties?.includes(filters.specialty);
    
    return matchesSearch && matchesCategory && matchesCompanyType && 
           matchesIntegration && matchesSpecialty;
  });

  // Extract unique values for filter options
  const categories = Array.from(new Set(
    cards.flatMap(card => card.categories || (card.category ? [card.category] : []))
  )).sort() as string[];
  
  const companyTypes = Array.from(new Set(
    cards.map(card => card.companyType).filter(Boolean)
  )).sort() as string[];
  
  const integrations = Array.from(new Set(
    cards.flatMap(card => card.integrationCapabilities || [])
  )).sort() as string[];
  
  const specialties = Array.from(new Set(
    cards.flatMap(card => card.targetSpecialties || [])
  )).sort() as string[];

  const handleFilterChange = (filterKey: keyof FilterState, value: string | null) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  // Split filtered cards into zones
  const topZoneCards = filteredCards.slice(0, TOP_ZONE_SIZE);
  const middleZoneCards = filteredCards.slice(MIDDLE_ZONE_START, BOTTOM_ZONE_START);
  const bottomZoneCards = filteredCards.slice(BOTTOM_ZONE_START);

  // Calculate equal split around search bar
  // Total cards in middle zone (excluding search bar)
  const totalMiddleCards = middleZoneCards.length;
  // Split equally: if odd, put extra card above
  const cardsBeforeSearchBar = Math.ceil(totalMiddleCards / 2);
  const cardsAfterSearchBar = Math.floor(totalMiddleCards / 2);

  return (
    <main className="fixed inset-0 bg-white flex" style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, maxWidth: "100vw", overflow: "hidden", position: "relative" }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div 
        className="transition-all duration-300 overflow-hidden"
        style={{
          marginLeft: isSidebarCollapsed ? '4rem' : '16rem',
          width: isSidebarCollapsed ? 'calc(100vw - 4rem)' : 'calc(100vw - 16rem)',
          minWidth: 0,
          height: '100vh',
          pointerEvents: !isSidebarCollapsed ? 'none' : 'auto',
          position: 'relative',
        }}
      >
        <ScrollableGrid>
        <div className="flex flex-col">
          {/* Top Zone - Irregular layout */}
        <div
            className="grid border-t border-l border-r border-zinc-600 transition-all duration-300"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridAutoRows: "minmax(calc(33.33vh / 2), auto)",
              gridAutoFlow: "row",
              gap: "1px",
              width: "100%",
              boxSizing: "border-box",
              padding: "1px",
            }}
          >
            {topZoneCards.map((card, index) => {
              // Calculate sizes for all top cards to fill the row
              const allSizes = getSizesForGroup(topZoneCards, 0);
              const size = allSizes[index];
              return (
                <SolutionCard
                  key={`top-${card.id}`}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  category={card.category}
                  cols={size.cols}
                  rows={size.rows}
                  isBlank={false}
                  userId={card.userId}
                />
              );
            })}
          </div>

          {/* Middle Zone - Perfectly packed, no gaps */}
          <div
            className="grid border-l border-r border-zinc-600 transition-all duration-300"
          style={{
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "minmax(calc(33.33vh / 2), auto)",
            gridAutoFlow: "row dense",
            gap: "1px",
            width: "100%",
            boxSizing: "border-box",
            padding: "1px",
          }}
        >
            {/* Cards before search bar in middle zone */}
            {middleZoneCards.slice(0, cardsBeforeSearchBar).map((card, index) => {
              // Calculate sizes for all cards before search bar to fill the row
              const cardsBefore = middleZoneCards.slice(0, cardsBeforeSearchBar);
              const allSizes = getSizesForGroup(cardsBefore, 0);
              const size = allSizes[index];
            return (
              <SolutionCard
                  key={`mid-before-${card.id}`}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  category={card.category}
                  cols={size.cols}
                  rows={size.rows}
                  isBlank={false}
                  userId={card.userId}
              />
            );
          })}

            {/* Search bar card - integrated in middle zone */}
          <SearchBarCard 
            cols={8} 
            rows={2} 
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFilterChange={handleFilterChange}
            filterOptions={{
              categories,
              companyTypes,
              integrations,
              specialties,
            }}
          />

            {/* Cards after search bar in middle zone */}
            {middleZoneCards.slice(cardsBeforeSearchBar).map((card, index) => {
              // Calculate sizes for all cards after search bar to fill the row
              const cardsAfter = middleZoneCards.slice(cardsBeforeSearchBar);
              const allSizes = getSizesForGroup(cardsAfter, cardsBeforeSearchBar);
              const size = allSizes[index];
              return (
                <SolutionCard
                  key={`mid-after-${card.id}`}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  category={card.category}
                  cols={size.cols}
                  rows={size.rows}
                  isBlank={false}
                  userId={card.userId}
                />
              );
            })}
          </div>

          {/* Bottom Zone - Irregular layout */}
          <div
            className="grid border-l border-r border-b border-zinc-600 transition-all duration-300"
            style={{
              gridTemplateColumns: "repeat(12, 1fr)",
              gridAutoRows: "minmax(calc(33.33vh / 2), auto)",
              gridAutoFlow: "row",
              gap: "1px",
              width: "100%",
              boxSizing: "border-box",
              padding: "1px",
            }}
          >
            {bottomZoneCards.map((card, index) => {
              // Calculate sizes for all bottom cards to fill the row
              const allSizes = getSizesForGroup(bottomZoneCards, BOTTOM_ZONE_START);
              const size = allSizes[index];
            return (
              <SolutionCard
                  key={`bottom-${card.id}`}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  category={card.category}
                  cols={size.cols}
                  rows={size.rows}
                  isBlank={false}
                  userId={card.userId}
              />
            );
          })}
          </div>
        </div>
      </ScrollableGrid>
      </div>
    </main>
  );
}

