import { useState, useCallback } from "react";
import { BlogPost } from "../types";

export interface ArticleSection {
  id: string;
  header: string;
  content: string;
  image: File | null;
}

interface UseBlogPostReturn {
  // State
  topic: string;
  selectedPlatform: "hubspot" | "medium";
  articleTitle: string;
  sections: ArticleSection[];
  articleImages: File[];
  tags: string;
  publishTime: string;
  isGenerating: boolean;
  isPublishing: boolean;
  
  // Actions
  setTopic: (value: string) => void;
  setSelectedPlatform: (value: "hubspot" | "medium") => void;
  setArticleTitle: (value: string) => void;
  setSectionHeader: (id: string, header: string) => void;
  setSectionContent: (id: string, content: string) => void;
  setSectionImage: (id: string, image: File | null) => void;
  addSection: () => void;
  removeSection: (id: string) => void;
  setTags: (value: string) => void;
  setPublishTime: (value: string) => void;
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  generatePost: () => Promise<{ success: boolean; error?: string }>;
  generateTitle: () => Promise<{ success: boolean; error?: string }>;
  generateSection: (id: string) => Promise<{ success: boolean; error?: string }>;
  publishPost: () => Promise<{ success: boolean; error?: string }>;
  resetForm: () => void;
}

const createDefaultSection = (): ArticleSection => ({
  id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  header: "",
  content: "",
  image: null,
});

export function useBlogPost(): UseBlogPostReturn {
  const [topic, setTopic] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"hubspot" | "medium">("medium");
  const [articleTitle, setArticleTitle] = useState("");
  const [sections, setSections] = useState<ArticleSection[]>([createDefaultSection()]);
  const [articleImages, setArticleImages] = useState<File[]>([]);
  const [tags, setTags] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const addSection = useCallback(() => {
    const newSection: ArticleSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      header: "",
      content: "",
      image: null,
    };
    setSections((prev) => [...prev, newSection]);
  }, []);

  const removeSection = useCallback((id: string) => {
    setSections((prev) => {
      // Always keep at least one section
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((section) => section.id !== id);
    });
  }, []);

  const setSectionHeader = useCallback((id: string, header: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, header } : section))
    );
  }, []);

  const setSectionContent = useCallback((id: string, content: string) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, content } : section))
    );
  }, []);

  const setSectionImage = useCallback((id: string, image: File | null) => {
    setSections((prev) =>
      prev.map((section) => (section.id === id ? { ...section, image } : section))
    );
  }, []);

  const addImages = useCallback((files: File[]) => {
    setArticleImages((prev) => [...prev, ...files]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setArticleImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const generatePost = useCallback(async () => {
    if (!topic.trim()) {
      return { success: false, error: "Please enter a topic" };
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/automation/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      if (data.success) {
        setArticleTitle(data.title || "");
        // Split generated content into sections (by paragraphs or newlines)
        const content = data.content || "";
        const contentSections = content.split(/\n\n+/).filter((s: string) => s.trim());
        
        if (contentSections.length > 0) {
          setSections(
            contentSections.map((sectionContent: string, index: number) => ({
              id: `section-${Date.now()}-${index}`,
              header: "",
              content: sectionContent.trim(),
              image: null,
            }))
          );
        } else {
          // If no clear sections, create one section with all content
          setSections([
            {
              id: `section-${Date.now()}`,
              header: "",
              content: content.trim(),
              image: null,
            },
          ]);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to generate blog post" };
      }
    } catch (error) {
      console.error("Error generating blog post:", error);
      return { success: false, error: "Failed to generate blog post" };
    } finally {
      setIsGenerating(false);
    }
  }, [topic]);

  const generateTitle = useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/automation/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic,
          type: "title",
          context: { articleTitle }
        }),
      });

      const data = await response.json();
      if (data.success && data.title) {
        setArticleTitle(data.title);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to generate title" };
      }
    } catch (error) {
      console.error("Error generating title:", error);
      return { success: false, error: "Failed to generate title" };
    } finally {
      setIsGenerating(false);
    }
  }, [topic, articleTitle]);

  const generateSectionHeader = useCallback(async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return { success: false, error: "Section not found" };

    setIsGenerating(true);
    try {
      const response = await fetch("/api/automation/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic,
          type: "header",
          context: { 
            sectionContent: section.content,
            articleTitle 
          }
        }),
      });

      const data = await response.json();
      if (data.success && data.header) {
        setSectionHeader(id, data.header);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to generate header" };
      }
    } catch (error) {
      console.error("Error generating section header:", error);
      return { success: false, error: "Failed to generate header" };
    } finally {
      setIsGenerating(false);
    }
  }, [topic, sections, articleTitle, setSectionHeader]);

  const generateSection = useCallback(async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return { success: false, error: "Section not found" };

    setIsGenerating(true);
    try {
      // Generate both header and content in parallel
      const [headerResponse, contentResponse] = await Promise.all([
        fetch("/api/automation/blog/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            topic,
            type: "header",
            context: { 
              sectionContent: section.content,
              articleTitle 
            }
          }),
        }),
        fetch("/api/automation/blog/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            topic,
            type: "content",
            context: { 
              sectionHeader: section.header,
              articleTitle 
            }
          }),
        }),
      ]);

      const headerData = await headerResponse.json();
      const contentData = await contentResponse.json();

      if (headerData.success && headerData.header) {
        setSectionHeader(id, headerData.header);
      }

      if (contentData.success && contentData.content) {
        setSectionContent(id, contentData.content);
      }

      if (headerData.success || contentData.success) {
        return { success: true };
      } else {
        return { success: false, error: headerData.error || contentData.error || "Failed to generate section" };
      }
    } catch (error) {
      console.error("Error generating section:", error);
      return { success: false, error: "Failed to generate section" };
    } finally {
      setIsGenerating(false);
    }
  }, [topic, sections, articleTitle, setSectionHeader, setSectionContent]);

  const publishPost = useCallback(async () => {
    if (!articleTitle.trim() || sections.length === 0 || sections.every((s) => !s.content.trim())) {
      return { success: false, error: "Please provide a title and at least one section with content" };
    }

    setIsPublishing(true);
    try {
      // Process article-level images
      const articleImagePromises = articleImages.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      const articleImageData = await Promise.all(articleImagePromises);

      // Process section images
      const sectionImagePromises = sections.map((section) => {
        if (section.image) {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(section.image!);
          });
        }
        return Promise.resolve(null);
      });
      const sectionImageData = await Promise.all(sectionImagePromises);

      // Combine all images (article images + section images)
      const allImages = [...articleImageData, ...sectionImageData.filter((img) => img !== null)];

      // Combine all sections into a single content string with headers
      const combinedContent = sections
        .map((section) => {
          const header = section.header.trim();
          const content = section.content.trim();
          if (!content) return "";
          return header ? `${header}\n\n${content}` : content;
        })
        .filter((content) => content.length > 0)
        .join("\n\n");

      const response = await fetch("/api/automation/blog/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleTitle,
          content: combinedContent,
          images: allImages,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          topic,
          platform: selectedPlatform,
          publishTime: publishTime || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to publish blog post" };
      }
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return { success: false, error: "Failed to publish blog post" };
    } finally {
      setIsPublishing(false);
    }
  }, [articleTitle, sections, articleImages, tags, topic, selectedPlatform, publishTime]);

  const resetForm = useCallback(() => {
    setTopic("");
    setSelectedPlatform("medium");
    setArticleTitle("");
    setSections([createDefaultSection()]);
    setArticleImages([]);
    setTags("");
    setPublishTime("");
  }, []);

  return {
    topic,
    selectedPlatform,
    articleTitle,
    sections,
    articleImages,
    tags,
    publishTime,
    isGenerating,
    isPublishing,
    setTopic,
    setSelectedPlatform,
    setArticleTitle,
    setSectionHeader,
    setSectionContent,
    setSectionImage,
    addSection,
    removeSection,
    setTags,
    setPublishTime,
    addImages,
    removeImage,
    generatePost,
    generateTitle,
    generateSection,
    publishPost,
    resetForm,
  };
}

