import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import Listing from "@/models/Listing";

// Create a simple message for proposals (not tied to Match)
interface ProposalMessage {
  proposalId: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  senderRole: 'customer' | 'vendor';
  content: string;
  createdAt: Date;
}

// For now, we'll use a simple approach - store messages in a collection
// or we can extend the Message model to support proposalId
// Let's create a simple ProposalMessage schema inline

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { proposalId: encodedProposalId } = await params;
    const proposalId = decodeURIComponent(encodedProposalId);
    const body = await request.json();
    const { content, listingId, vendorUserId, receiverId, senderRole } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content is required" },
        { status: 400 }
      );
    }

    if (!listingId || !vendorUserId) {
      return NextResponse.json(
        { success: false, error: "Listing ID and vendor user ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Get listing to verify access
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    // Determine sender role and verify access
    const actualSenderRole = senderRole || (listing.userId === user.id ? 'customer' : 'vendor');
    const actualReceiverId = receiverId || (actualSenderRole === 'customer' ? vendorUserId : listing.userId);

    // Verify user has access to this proposal
    if (actualSenderRole === 'customer') {
      // Customer must own the listing
      if (listing.userId !== user.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized - you can only send messages for your own listings" },
          { status: 403 }
        );
      }
    } else {
      // Vendor must be the one who submitted the proposal
      const proposal = listing.proposals?.find((p: any) => p.vendorUserId === vendorUserId);
      const userEmail = user.emailAddresses[0]?.emailAddress || "";
      const isSuperAdmin = userEmail === "hitesh.ms24@gmail.com" || user.publicMetadata?.role === "superadmin";
      
      // Check if user is the vendor who submitted this proposal
      const isVendorOwner = proposal && (
        proposal.vendorUserId === user.id || 
        (isSuperAdmin && (vendorUserId === "seed-medicodio" || vendorUserId === "medicodio"))
      );
      
      if (!isVendorOwner) {
        return NextResponse.json(
          { success: false, error: "Unauthorized - you can only send messages for your own proposals" },
          { status: 403 }
        );
      }
    }

    const senderId = user.id;

    // Create message (we'll store it in a simple format)
    // For simplicity, we'll create a notification with the message content
    // and store the message in a way that can be retrieved
    
    // Get sender name for notification
    const senderName = user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || (actualSenderRole === 'customer' ? 'Customer' : 'Vendor');
    
    // Create notification for receiver
    const notification = new Notification({
      userId: actualReceiverId,
      type: 'message',
      title: `New message from ${senderName}`,
      message: content.length > 100 ? content.substring(0, 100) + '...' : content,
      isRead: false,
      actionUrl: `/proposals?proposalId=${proposalId}`,
      actionLabel: "View Message",
    });
    await notification.save();

    // Store message in a simple format - we can create a ProposalMessage collection
    // For now, let's use a simple approach with a custom schema
    const mongoose = (await import('mongoose')).default;
    
    // Check if ProposalMessage model exists, if not create it
    let ProposalMessage;
    if (mongoose.models.ProposalMessage) {
      ProposalMessage = mongoose.models.ProposalMessage;
    } else {
      const ProposalMessageSchema = new mongoose.Schema({
        proposalId: { type: String, required: true, index: true },
        listingId: { type: String, required: true, index: true },
        senderId: { type: String, required: true, index: true },
        receiverId: { type: String, required: true, index: true },
        senderRole: { type: String, enum: ['customer', 'vendor'], required: true },
        content: { type: String, required: true, trim: true, maxlength: 5000 },
      }, { timestamps: true, collection: 'proposal_messages' });
      
      ProposalMessageSchema.index({ proposalId: 1, createdAt: -1 });
      ProposalMessageSchema.index({ senderId: 1, receiverId: 1 });
      
      ProposalMessage = mongoose.model('ProposalMessage', ProposalMessageSchema);
    }

    const message = new ProposalMessage({
      proposalId,
      listingId,
      senderId,
      receiverId: actualReceiverId,
      senderRole: actualSenderRole,
      content: content.trim(),
    });

    await message.save();

    return NextResponse.json({
      success: true,
      message: {
        id: message._id.toString(),
        proposalId,
        listingId,
        senderId,
        receiverId,
        senderRole,
        content: message.content,
        createdAt: message.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send message",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proposalId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { proposalId: encodedProposalId } = await params;
    const proposalId = decodeURIComponent(encodedProposalId);
    await connectDB();

    const mongoose = (await import('mongoose')).default;
    
    // Get ProposalMessage model
    let ProposalMessage;
    if (mongoose.models.ProposalMessage) {
      ProposalMessage = mongoose.models.ProposalMessage;
    } else {
      const ProposalMessageSchema = new mongoose.Schema({
        proposalId: { type: String, required: true, index: true },
        listingId: { type: String, required: true, index: true },
        senderId: { type: String, required: true, index: true },
        receiverId: { type: String, required: true, index: true },
        senderRole: { type: String, enum: ['customer', 'vendor'], required: true },
        content: { type: String, required: true, trim: true, maxlength: 5000 },
      }, { timestamps: true, collection: 'proposal_messages' });
      
      ProposalMessageSchema.index({ proposalId: 1, createdAt: -1 });
      ProposalMessageSchema.index({ senderId: 1, receiverId: 1 });
      
      ProposalMessage = mongoose.model('ProposalMessage', ProposalMessageSchema);
    }

    // Fetch all messages for this proposal
    const messages = await ProposalMessage.find({ proposalId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      messages: messages.map((m: any) => ({
        id: m._id.toString(),
        proposalId: m.proposalId,
        listingId: m.listingId,
        senderId: m.senderId,
        receiverId: m.receiverId,
        senderRole: m.senderRole,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch messages",
      },
      { status: 500 }
    );
  }
}

