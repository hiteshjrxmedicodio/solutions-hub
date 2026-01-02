"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUserData } from "@/contexts/UserContext";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

interface Proposal {
  _id: string;
  listingId: string;
  listingTitle: string;
  listingUserId?: string; // Customer who created the listing
  vendorUserId: string;
  vendorName: string;
  proposalText: string;
  proposedPrice?: string;
  proposedTimeline?: string;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
  listingStatus: string;
}

interface Message {
  id: string;
  proposalId: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  senderRole: 'customer' | 'vendor';
  content: string;
  createdAt: string;
}

function ProposalsContent() {
  const { user, isLoaded } = useUser();
  const { userData, isLoading: isLoadingUserData, actingAs } = useUserData();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const userRole = userData?.role;
  const userEmail = user?.emailAddresses[0]?.emailAddress || "";
  const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || userRole === "superadmin";
  // Use actingAs role if set, otherwise use actual role
  const effectiveRole = actingAs || userRole;

  // No redirect - vendors can now see their proposals

  useEffect(() => {
    async function fetchProposals() {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // Determine vendor userId (for superadmin acting as vendor, use seed-medicodio)
        const vendorUserId = (isSuperAdmin && effectiveRole === "vendor") 
          ? "seed-medicodio" 
          : (effectiveRole === "vendor" ? user.id : null);
        
        let endpoint: string;
        if (effectiveRole === "vendor") {
          // For vendors: fetch all listings to find their proposals
          endpoint = isSuperAdmin ? '/api/listings?status=all' : '/api/listings?status=all';
        } else {
          // For customers: fetch only their listings
          endpoint = isSuperAdmin 
            ? '/api/listings?status=all'
            : `/api/listings?userId=${user.id}`;
        }
          
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        
        if (data.success && data.data) {
          // Extract proposals from listings
          const allProposals: Proposal[] = [];
          data.data.forEach((listing: any) => {
            if (listing.proposals && listing.proposals.length > 0) {
              listing.proposals.forEach((proposal: any) => {
                // For vendors: only show their own proposals
                // For customers: show all proposals for their listings
                if (effectiveRole === "vendor") {
                  if (proposal.vendorUserId === vendorUserId) {
                    allProposals.push({
                      _id: `${listing._id}-${proposal.vendorUserId}`,
                      listingId: listing._id,
                      listingTitle: listing.title,
                      listingUserId: listing.userId,
                      vendorUserId: proposal.vendorUserId,
                      vendorName: proposal.vendorName,
                      proposalText: proposal.proposalText,
                      proposedPrice: proposal.proposedPrice,
                      proposedTimeline: proposal.proposedTimeline,
                      status: proposal.status || "pending",
                      submittedAt: proposal.submittedAt,
                      listingStatus: listing.status,
                    });
                  }
                } else {
                  // Customer perspective: show all proposals for their listings
                  if (listing.userId === user.id || (isSuperAdmin && effectiveRole === "customer")) {
                    allProposals.push({
                      _id: `${listing._id}-${proposal.vendorUserId}`,
                      listingId: listing._id,
                      listingTitle: listing.title,
                      listingUserId: listing.userId,
                      vendorUserId: proposal.vendorUserId,
                      vendorName: proposal.vendorName,
                      proposalText: proposal.proposalText,
                      proposedPrice: proposal.proposedPrice,
                      proposedTimeline: proposal.proposedTimeline,
                      status: proposal.status || "pending",
                      submittedAt: proposal.submittedAt,
                      listingStatus: listing.status,
                    });
                  }
                }
              });
            }
          });
          
          // Sort by most recent first
          allProposals.sort((a, b) => {
            const dateA = new Date(a.submittedAt).getTime();
            const dateB = new Date(b.submittedAt).getTime();
            return dateB - dateA;
          });
          
          setProposals(allProposals);
          
          // Auto-select first proposal if available and none is selected
          if (allProposals.length > 0) {
            setSelectedProposal((prev) => prev || allProposals[0]);
          }
        } else {
          setProposals([]);
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(err instanceof Error ? err.message : "Failed to load proposals");
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && !isLoadingUserData && user?.id) {
      fetchProposals();
    }
  }, [isLoaded, isLoadingUserData, user?.id, isSuperAdmin, effectiveRole]);

  // No filtering - show all proposals
  const filteredProposals = proposals;

  // Fetch messages when proposal is selected
  useEffect(() => {
    async function fetchMessages() {
      if (!selectedProposal || !user?.id) return;

      try {
        const proposalId = encodeURIComponent(selectedProposal._id);
        const response = await fetch(`/api/proposals/${proposalId}/messages`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }

    fetchMessages();
  }, [selectedProposal?._id, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedProposal || sendingMessage) return;
    if (messageText.length > 5000) {
      alert("Message is too long. Please keep it under 5000 characters.");
      return;
    }

    setSendingMessage(true);
    try {
      const proposalId = encodeURIComponent(selectedProposal._id);
      const response = await fetch(`/api/proposals/${proposalId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: messageText.trim(),
          listingId: selectedProposal.listingId,
          vendorUserId: selectedProposal.vendorUserId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setMessageText("");
      } else {
        alert("Failed to send message: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "rejected":
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

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
  if (effectiveRole === "vendor" && !isSuperAdmin) {
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
            <p className="text-zinc-600">Loading proposals...</p>
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
      
      <div className={`flex-1 transition-all duration-300 overflow-hidden h-screen ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} flex flex-col bg-zinc-50`}>
        {/* Two Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Proposals List */}
          <div className="w-96 flex flex-col border-r border-zinc-200 bg-white">
            {/* Header - Width of Sidebar */}
            <div className="bg-white border-b border-zinc-200 px-6 py-5 flex-shrink-0 shadow-sm">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Proposals</h1>
              </div>
            </div>
            
            {/* Proposals List */}
            <div className="flex-1 overflow-y-auto">
              {filteredProposals.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">No proposals yet</h3>
                <p className="text-sm text-zinc-500 mb-6 max-w-xs mx-auto">
                  Create a project request to start receiving proposals from vendors
                </p>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-teal-700 transition-all shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Request
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredProposals.map((proposal) => {
                  const isSelected = selectedProposal?._id === proposal._id;
                  return (
                    <button
                      key={proposal._id}
                      onClick={() => setSelectedProposal(proposal)}
                      className={`w-full p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-teal-50 border-l-4 border-blue-600 shadow-sm"
                          : "hover:bg-zinc-50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="mb-1.5">
                        <h3 className={`font-semibold text-sm mb-0.5 truncate ${
                          isSelected ? "text-zinc-900" : "text-zinc-900"
                        }`}>
                          {effectiveRole === "vendor" ? proposal.listingTitle : proposal.vendorName}
                        </h3>
                        <p className="text-xs text-zinc-500 mb-1 truncate">
                          {effectiveRole === "vendor" ? "Your Proposal" : proposal.listingTitle}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-600 mb-1.5 leading-snug">
                        {proposal.proposalText.split(' ').slice(0, 3).join(' ')}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-zinc-400">
                          {formatDate(proposal.submittedAt)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          {/* Right Side - Conversational Interface */}
          <div className="flex-1 flex flex-col bg-zinc-50 overflow-hidden">
            {selectedProposal ? (
              <div className="flex flex-col h-full">
                {/* Minimal Header */}
                <div className="bg-white border-b border-zinc-200 px-6 py-5 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                        {effectiveRole === "vendor" 
                          ? selectedProposal.listingTitle.charAt(0).toUpperCase()
                          : selectedProposal.vendorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-zinc-900">
                          {effectiveRole === "vendor" 
                            ? selectedProposal.listingTitle
                            : selectedProposal.vendorName}
                        </h2>
                        <p className="text-xs text-zinc-500">
                          {formatDate(selectedProposal.submittedAt)} • {effectiveRole === "vendor" ? "Your Proposal" : selectedProposal.listingTitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border flex items-center gap-1.5 ${getStatusBadgeClass(
                          selectedProposal.status
                        )}`}
                      >
                        {getStatusIcon(selectedProposal.status)}
                        {selectedProposal.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversation Area */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50"
                >
                  {/* Proposal as First Message */}
                  <div className={`flex ${effectiveRole === "vendor" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[60%] bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                      {/* Proposal Header */}
                      <div className="px-5 py-4 border-b border-zinc-100 bg-gradient-to-r from-blue-50 to-teal-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-zinc-900 mb-1">Proposal</h3>
                            <p className="text-xs text-zinc-600 font-medium">
                              For: <span className="text-zinc-900">{selectedProposal.listingTitle}</span>
                            </p>
                          </div>
                          <Link
                            href={`/listings/${selectedProposal.listingId}`}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 ml-3"
                          >
                            View Listing
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                        <p className="text-xs text-zinc-600 mt-2">
                          {formatDate(selectedProposal.submittedAt)}
                        </p>
                      </div>
                      
                      {/* Proposal Content */}
                      <div className="px-5 py-4">
                        <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap mb-4">
                          {selectedProposal.proposalText}
                        </p>
                        
                        {/* Proposal Details */}
                        {(selectedProposal.proposedPrice || selectedProposal.proposedTimeline) && (
                          <div className="grid grid-cols-1 gap-3 pt-4 border-t border-zinc-100">
                            {selectedProposal.proposedPrice && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-zinc-500">Proposed Price</p>
                                  <p className="text-sm font-semibold text-zinc-900">{selectedProposal.proposedPrice}</p>
                                </div>
                              </div>
                            )}
                            {selectedProposal.proposedTimeline && (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-zinc-500">Proposed Timeline</p>
                                  <p className="text-sm font-semibold text-zinc-900">{selectedProposal.proposedTimeline}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Proposal Actions */}
                      <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center gap-2">
                        <Link
                          href={`/vendor/${selectedProposal.vendorUserId}`}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all text-sm font-semibold text-center"
                        >
                          View Vendor Profile
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  {messages.map((message) => {
                    // For vendors: messages they sent (vendor role) are on right, customer messages on left
                    // For customers: messages they sent (customer role) are on right, vendor messages on left
                    const isSent = effectiveRole === "vendor" 
                      ? message.senderRole === "vendor"
                      : message.senderRole === "customer";
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[60%] rounded-2xl px-4 py-3 ${
                            isSent
                              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                              : 'bg-white text-zinc-900 border border-zinc-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1.5 ${
                              isSent ? 'text-blue-100' : 'text-zinc-400'
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-zinc-200 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="p-4">
                    <div className="flex items-end gap-3 bg-zinc-50 rounded-2xl border border-zinc-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all shadow-sm hover:shadow-md">
                      <div className="flex-1 relative">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                          placeholder="Type your message..."
                          rows={1}
                          maxLength={5000}
                          className="w-full px-0 py-2 bg-transparent border-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none resize-none overflow-hidden max-h-32"
                          style={{ minHeight: '24px' }}
                          disabled={sendingMessage}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                          }}
                        />
                        <div className="absolute bottom-1 right-0 flex items-center gap-1.5">
                          <span className="text-xs text-zinc-400">
                            {messageText.length > 0 && `${messageText.length} / 5000`}
                          </span>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!messageText.trim() || sendingMessage}
                        className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-blue-700 hover:to-teal-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 disabled:transform-none"
                        title="Send message"
                      >
                        {sendingMessage ? (
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between px-1">
                      <p className="text-xs text-zinc-400">
                        Press <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-600 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-600 font-mono text-[10px]">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-300 rounded text-zinc-600 font-mono text-[10px]">Enter</kbd> for new line
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <svg
                      className="w-12 h-12 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 mb-2">Select a proposal</h3>
                  <p className="text-zinc-500 text-sm">
                    Choose a proposal from the list to view detailed information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProposalsPage() {
  return (
    <OnboardingGuard>
      <ProposalsContent />
    </OnboardingGuard>
  );
}
