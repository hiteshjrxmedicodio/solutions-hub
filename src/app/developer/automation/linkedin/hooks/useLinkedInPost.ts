import { useState, useCallback } from "react";
import { SolutionCard, LinkedInPost } from "../types";

interface UseLinkedInPostReturn {
  // State
  postHeader: string;
  postBody: string;
  postImages: File[];
  mentions: string;
  scheduledTime: string;
  selectedListingTitle: string;
  isGenerating: boolean;
  isPosting: boolean;
  
  // Actions
  setPostHeader: (value: string) => void;
  setPostBody: (value: string) => void;
  setPostImages: (files: File[]) => void;
  setMentions: (value: string) => void;
  setScheduledTime: (value: string) => void;
  setSelectedListingTitle: (value: string) => void;
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  generatePost: (listings: SolutionCard[]) => Promise<{ success: boolean; error?: string }>;
  generatePostContent: () => Promise<{ success: boolean; error?: string }>;
  publishPost: (listings: SolutionCard[]) => Promise<{ success: boolean; error?: string }>;
  resetForm: () => void;
}

export function useLinkedInPost(): UseLinkedInPostReturn {
  const [postHeader, setPostHeader] = useState("");
  const [postBody, setPostBody] = useState("");
  const [postImages, setPostImages] = useState<File[]>([]);
  const [mentions, setMentions] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedListingTitle, setSelectedListingTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const addImages = useCallback((files: File[]) => {
    setPostImages((prev) => [...prev, ...files]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const generatePost = useCallback(async (listings: SolutionCard[]) => {
    if (!selectedListingTitle) {
      return { success: false, error: "Please select a listing" };
    }

    setIsGenerating(true);
    try {
      const listing = listings.find((l) => l.title === selectedListingTitle);
      if (!listing) {
        return { success: false, error: "Listing not found" };
      }

      const response = await fetch("/api/automation/linkedin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: listing.title,
          description: listing.description,
          category: listing.category,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPostHeader(data.header || "");
        setPostBody(data.body || data.post || "");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to generate post" };
      }
    } catch (error) {
      console.error("Error generating post:", error);
      return { success: false, error: "Failed to generate post" };
    } finally {
      setIsGenerating(false);
    }
  }, [selectedListingTitle]);

  const generatePostContent = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Generate both header and body in parallel
      const [headerResponse, bodyResponse] = await Promise.all([
        fetch("/api/automation/linkedin/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "header",
            context: { postBody },
          }),
        }),
        fetch("/api/automation/linkedin/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "body",
            context: { postHeader },
          }),
        }),
      ]);

      const headerData = await headerResponse.json();
      const bodyData = await bodyResponse.json();

      if (headerData.success && headerData.header) {
        setPostHeader(headerData.header);
      }

      if (bodyData.success && bodyData.body) {
        setPostBody(bodyData.body);
      }

      if (headerData.success || bodyData.success) {
        return { success: true };
      } else {
        return { success: false, error: headerData.error || bodyData.error || "Failed to generate post content" };
      }
    } catch (error) {
      console.error("Error generating post content:", error);
      return { success: false, error: "Failed to generate post content" };
    } finally {
      setIsGenerating(false);
    }
  }, [postHeader, postBody]);

  const publishPost = useCallback(async (listings: SolutionCard[]) => {
    if (!postHeader && !postBody) {
      return { success: false, error: "Please provide at least a header or body for the post" };
    }

    setIsPosting(true);
    try {
      const listing = listings.find((l) => l.title === selectedListingTitle);

      const imagePromises = postImages.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      const imageData = await Promise.all(imagePromises);

      const response = await fetch("/api/automation/linkedin/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          header: postHeader,
          body: postBody,
          images: imageData,
          mentions: mentions.split(",").map((m) => m.trim()).filter(Boolean),
          scheduledTime: scheduledTime || null,
          listingId: listing?.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to post to LinkedIn" };
      }
    } catch (error) {
      console.error("Error posting to LinkedIn:", error);
      return { success: false, error: "Failed to post to LinkedIn" };
    } finally {
      setIsPosting(false);
    }
  }, [postHeader, postBody, postImages, mentions, scheduledTime, selectedListingTitle]);

  const resetForm = useCallback(() => {
    setPostHeader("");
    setPostBody("");
    setPostImages([]);
    setMentions("");
    setScheduledTime("");
    setSelectedListingTitle("");
  }, []);

  return {
    postHeader,
    postBody,
    postImages,
    mentions,
    scheduledTime,
    selectedListingTitle,
    isGenerating,
    isPosting,
    setPostHeader,
    setPostBody,
    setPostImages,
    setMentions,
    setScheduledTime,
    setSelectedListingTitle,
    addImages,
    removeImage,
    generatePost,
    generatePostContent,
    publishPost,
    resetForm,
  };
}

