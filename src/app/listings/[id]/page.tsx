"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";

interface Listing {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredFeatures: string[];
  preferredFeatures: string[];
  technicalRequirements: string[];
  integrationRequirements: string[];
  complianceRequirements: string[];
  budgetRange: string;
  timeline: string;
  contractType: string[];
  deploymentPreference: string[];
  institutionName?: string;
  institutionType?: string;
  medicalSpecialties?: string[];
  currentSystems?: string[];
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactTitle?: string;
  status: string;
  proposalsCount: number;
  viewsCount: number;
  proposals?: Array<{
    vendorUserId: string;
    vendorName: string;
    proposalText: string;
    proposedPrice?: string;
    proposedTimeline?: string;
    submittedAt: string;
    status: string;
  }>;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  high: 'bg-amber-100 text-amber-700 border-amber-300',
  urgent: 'bg-red-100 text-red-700 border-red-300',
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalText, setProposalText] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);

  const listingId = params.id as string;
  const isOwner = user?.id === listing?.userId;

  useEffect(() => {
    async function fetchListing() {
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }
        const data = await response.json();
        if (data.success && data.data) {
          setListing(data.data);
        } else {
          throw new Error("Listing not found");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setLoading(false);
      }
    }

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalText.trim()) {
      alert("Please provide a proposal description");
      return;
    }

    setSubmittingProposal(true);
    try {
      const response = await fetch(`/api/listings/${listingId}/proposals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalText,
          proposedPrice,
          proposedTimeline,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Proposal submitted successfully!");
        setShowProposalForm(false);
        setProposalText("");
        setProposedPrice("");
        setProposedTimeline("");
        // Refresh listing to show new proposal
        const refreshResponse = await fetch(`/api/listings/${listingId}`);
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success && refreshData.data) {
            setListing(refreshData.data);
          }
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Error submitting proposal:", err);
      alert("Failed to submit proposal. Please try again.");
    } finally {
      setSubmittingProposal(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="flex items-center justify-center min-h-screen pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-zinc-600">Loading listing...</p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="flex items-center justify-center min-h-screen pt-8">
          <div className="text-red-600">Error: {error || "Listing not found"}</div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onCollapseToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg border border-zinc-300 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-zinc-900">{listing.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[listing.priority]}`}>
                    {listing.priority}
                  </span>
                </div>
                {listing.category.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.category.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isOwner && (
                <button
                  onClick={() => router.push(`/listings/${listingId}/edit`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            
            <p className="text-zinc-700 text-lg leading-relaxed mb-4">{listing.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600 pt-4 border-t border-zinc-200">
              {listing.budgetRange && listing.budgetRange !== 'Not specified' && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {listing.budgetRange}
                </span>
              )}
              {listing.timeline && (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {listing.timeline}
                </span>
              )}
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {listing.viewsCount} views
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {listing.proposalsCount} proposals
              </span>
            </div>
          </div>

          {/* Single Column Layout */}
          <div className="space-y-6">
              {/* Requirements */}
              <div className="bg-white rounded-lg border border-zinc-300 p-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Requirements</h2>
                
                {listing.requiredFeatures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">Required Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600">
                      {listing.requiredFeatures.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {listing.preferredFeatures.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">Preferred Features</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600">
                      {listing.preferredFeatures.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {listing.technicalRequirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">Technical Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600">
                      {listing.technicalRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {listing.integrationRequirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">Integration Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-600">
                      {listing.integrationRequirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {listing.complianceRequirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-700 mb-2">Compliance Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.complianceRequirements.map((req, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm border border-blue-300">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Institution Context */}
              {(listing.institutionName || listing.medicalSpecialties?.length || listing.currentSystems?.length) && (
                <div className="bg-white rounded-lg border border-zinc-300 p-6">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">Institution Context</h2>
                  
                  {listing.institutionName && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-zinc-700">Institution: </span>
                      <span className="text-zinc-600">{listing.institutionName}</span>
                      {listing.institutionType && (
                        <span className="text-zinc-500"> ({listing.institutionType})</span>
                      )}
                    </div>
                  )}
                  
                  {listing.medicalSpecialties && listing.medicalSpecialties.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-zinc-700 mb-2">Medical Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {listing.medicalSpecialties.map((specialty, idx) => (
                          <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {listing.currentSystems && listing.currentSystems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-700 mb-2">Current Systems</h3>
                      <div className="flex flex-wrap gap-2">
                        {listing.currentSystems.map((system, idx) => (
                          <span key={idx} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm border border-zinc-300">
                            {system}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Notes */}
                <div className="bg-white rounded-lg border border-zinc-300 p-6">
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">Additional Notes</h2>
              {listing.additionalNotes ? (
                  <p className="text-zinc-600 whitespace-pre-wrap">{listing.additionalNotes}</p>
              ) : (
                <p className="text-zinc-500 italic">No additional notes provided.</p>
              )}
            </div>

            {/* Contact */}
              <div className="bg-white rounded-lg border border-zinc-300 p-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Contact</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-zinc-700">Name: </span>
                    <span className="text-zinc-600">{listing.contactName}</span>
                  </div>
                  {listing.contactTitle && (
                    <div>
                      <span className="font-medium text-zinc-700">Title: </span>
                      <span className="text-zinc-600">{listing.contactTitle}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-zinc-700">Email: </span>
                    <a href={`mailto:${listing.contactEmail}`} className="text-blue-600 hover:underline">
                      {listing.contactEmail}
                    </a>
                  </div>
                  {listing.contactPhone && (
                    <div>
                      <span className="font-medium text-zinc-700">Phone: </span>
                      <a href={`tel:${listing.contactPhone}`} className="text-blue-600 hover:underline">
                        {listing.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-white rounded-lg border border-zinc-300 p-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Business Details</h2>
                <div className="space-y-3 text-sm">
                  {listing.contractType.length > 0 && (
                    <div>
                      <span className="font-medium text-zinc-700">Contract Type: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {listing.contractType.map((type, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {listing.deploymentPreference.length > 0 && (
                    <div>
                      <span className="font-medium text-zinc-700">Deployment: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {listing.deploymentPreference.map((pref, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-xs">
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Proposal (Vendors only) */}
              {user && !isOwner && listing.status === 'active' && (
                <div className="bg-white rounded-lg border border-zinc-300 p-6">
                  {!showProposalForm ? (
                    <button
                      onClick={() => setShowProposalForm(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium"
                    >
                      Submit Proposal
                    </button>
                  ) : (
                    <form onSubmit={handleSubmitProposal} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          Proposal Description *
                        </label>
                        <textarea
                          value={proposalText}
                          onChange={(e) => setProposalText(e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe how your solution meets their requirements..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          Proposed Price (optional)
                        </label>
                        <input
                          type="text"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., $50,000 - $100,000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          Proposed Timeline (optional)
                        </label>
                        <input
                          type="text"
                          value={proposedTimeline}
                          onChange={(e) => setProposedTimeline(e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 3-6 months"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={submittingProposal}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50"
                        >
                          {submittingProposal ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowProposalForm(false);
                            setProposalText("");
                            setProposedPrice("");
                            setProposedTimeline("");
                          }}
                          className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            {/* Proposals (Owner only) */}
            {isOwner && listing.proposals && listing.proposals.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-300 p-6">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Proposals ({listing.proposals.length})</h2>
                <div className="space-y-4">
                  {listing.proposals.map((proposal, idx) => (
                    <div key={idx} className="border border-zinc-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-zinc-900">{proposal.vendorName}</h3>
                          <p className="text-sm text-zinc-500">
                            {new Date(proposal.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-zinc-600 mb-3">{proposal.proposalText}</p>
                      {(proposal.proposedPrice || proposal.proposedTimeline) && (
                        <div className="flex gap-4 text-sm text-zinc-600">
                          {proposal.proposedPrice && (
                            <span>Price: {proposal.proposedPrice}</span>
                          )}
                          {proposal.proposedTimeline && (
                            <span>Timeline: {proposal.proposedTimeline}</span>
                          )}
                        </div>
                      )}
                      <div className="mt-3">
                        <button
                          onClick={() => router.push(`/vendor/${proposal.vendorUserId}`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Vendor Profile →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

