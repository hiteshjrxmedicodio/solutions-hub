"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { Sidebar } from "@/components/Sidebar";
import { ListingCard } from "./components/ListingCard";
import { CreateListingModal } from "./components/CreateListingModal";
import { ListingDetailModal } from "./components/ListingDetailModal";

interface Listing {
  _id: string;
  title: string;
  description: string;
  category: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budgetRange?: string;
  timeline?: string;
  proposalsCount: number;
  viewsCount: number;
  status: string;
  createdAt: string;
}

function ListingsContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData } = useUserData();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my' | 'active'>('active');
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [budgetFilter, setBudgetFilter] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

  const userRole = userData?.role;
  
  // Get unique categories from listings
  const allCategories = Array.from(
    new Set(listings.flatMap(listing => listing.category))
  ).sort();

  useEffect(() => {
    // Redirect vendors away from listings page
    if (isLoaded && !isLoadingUserData && user && userRole === "seller" && user.id) {
      router.push(`/vendor/${user.id}`);
    }
  }, [isLoaded, isLoadingUserData, user, userRole, router]);

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        let endpoint = '/api/listings';
        
        if (filter === 'my' && user?.id) {
          endpoint = `/api/listings?userId=${user.id}`;
        } else if (filter === 'active') {
          endpoint = '/api/listings?status=active';
        } else if (filter === 'all') {
          endpoint = '/api/listings';
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setListings(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err instanceof Error ? err.message : "Failed to load listings");
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && !isLoadingUserData) {
      fetchListings();
    }
  }, [isLoaded, isLoadingUserData, filter, user?.id]);

  // Filter listings by search query and filters
  const filteredListings = listings.filter((listing) => {
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.category.some(cat => cat.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (categoryFilter && !listing.category.includes(categoryFilter)) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter && listing.priority !== priorityFilter) {
      return false;
    }
    
    // Budget filter
    if (budgetFilter && listing.budgetRange !== budgetFilter) {
      return false;
    }
    
    return true;
  });

  // Show loading while checking user role
  if (!isLoaded || isLoadingUserData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If vendor, don't render (will redirect)
  if (userRole === "seller") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-300 border-t-zinc-900 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading listings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} flex items-center justify-center`}>
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 transition-all duration-300 overflow-y-auto h-screen ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="pt-8 pb-12 px-8 h-full">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-zinc-50 to-white rounded-2xl border border-zinc-200 shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-zinc-900 mb-3 tracking-tight">Project Requests</h1>
                <p className="text-zinc-600 text-lg">
                  Post your project requirements and connect with vendors who can help
                </p>
              </div>
              {user && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2.5 transform hover:scale-105 active:scale-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Request
                </button>
              )}
            </div>
          </div>
          
          {/* Main Content with Filters on Right */}
          <div className="flex gap-6">
            {/* Listings Grid - Left Side */}
            <div className="flex-1">
              {/* Search Bar - Above all listings, matching first listing card width */}
              <div className="mb-6">
                <div className="relative w-full lg:w-[calc((100%-3rem)/3)]">
                  <input
                    type="text"
                    placeholder="Search project requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-11 text-sm border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 transition-all bg-white hover:bg-zinc-50 shadow-sm"
                  />
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {filteredListings.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-zinc-50 to-white rounded-2xl border border-zinc-200">
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">No requests found</h3>
                  <p className="text-zinc-600 mb-8 text-lg max-w-md mx-auto">
                    {searchQuery || categoryFilter || priorityFilter || budgetFilter
                      ? 'Try adjusting your filters to see more results'
                      : 'Be the first to create a project request and connect with vendors'}
                  </p>
                  {user && !searchQuery && (
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-100"
                    >
                      Create Request
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing._id}
                      id={listing._id}
                      title={listing.title}
                      description={listing.description}
                      category={listing.category}
                      priority={listing.priority}
                      budgetRange={listing.budgetRange}
                      timeline={listing.timeline}
                      proposalsCount={listing.proposalsCount}
                      viewsCount={listing.viewsCount}
                      status={listing.status}
                      createdAt={listing.createdAt}
                      onClick={(id) => setSelectedListingId(id)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Filters Sidebar - Right Side */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-zinc-900 mb-6">Filters</h2>
                
                <div className="space-y-6">
                  {/* Status Filter Tabs */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-3">
                      Status
                    </label>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2.5 text-left font-medium text-sm transition-all rounded-xl ${
                          filter === 'active'
                            ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                            : 'bg-blue-50 text-zinc-700 hover:bg-blue-100'
                        }`}
                      >
                        Active
                      </button>
                      {user && (
                        <button
                          onClick={() => setFilter('my')}
                          className={`px-4 py-2.5 text-left font-medium text-sm transition-all rounded-xl ${
                            filter === 'my'
                              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                              : 'bg-blue-50 text-zinc-700 hover:bg-blue-100'
                          }`}
                        >
                          My Requests
                        </button>
                      )}
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2.5 text-left font-medium text-sm transition-all rounded-xl ${
                          filter === 'all'
                            ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-md'
                            : 'bg-blue-50 text-zinc-700 hover:bg-blue-100'
                        }`}
                      >
                        All
                      </button>
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-3">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 text-sm bg-white hover:bg-zinc-50 transition-colors"
                    >
                      <option value="">All Categories</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-3">
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 text-sm bg-white hover:bg-zinc-50 transition-colors"
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-3">
                      Budget Range
                    </label>
                    <select
                      value={budgetFilter}
                      onChange={(e) => setBudgetFilter(e.target.value)}
                      className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-zinc-400 text-sm bg-white hover:bg-zinc-50 transition-colors"
                    >
                      <option value="">All Budgets</option>
                      <option value="$0 - $50,000">$0 - $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                      <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                      <option value="$1,000,000+">$1,000,000+</option>
                    </select>
                  </div>
                  
                  {/* Clear Filters */}
                  {(categoryFilter || priorityFilter || budgetFilter) && (
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setPriorityFilter("");
                        setBudgetFilter("");
                      }}
                      className="w-full px-4 py-2.5 border-2 border-zinc-300 rounded-xl hover:bg-zinc-50 hover:border-zinc-400 transition-all text-sm font-semibold text-zinc-700"
                    >
                      Clear Filters
                    </button>
                  )}
                  
                  {/* Results Count */}
                  <div className="pt-5 border-t border-zinc-200">
                    <p className="text-sm text-zinc-600">
                      Showing <span className="font-bold text-zinc-900">{filteredListings.length}</span> of{' '}
                      <span className="font-bold text-zinc-900">{listings.length}</span> requests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateListingModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <ListingDetailModal
        isOpen={selectedListingId !== null}
        onClose={() => setSelectedListingId(null)}
        listingId={selectedListingId}
      />
    </div>
  );
}

export default function ListingsPage() {
  return (
    <OnboardingGuard>
      <ListingsContent />
    </OnboardingGuard>
  );
}

