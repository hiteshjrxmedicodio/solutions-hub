import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is super admin
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== "hitesh.ms24@gmail.com") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, type, context } = body;

    // Handle different generation types
    if (type === "title") {
      const prompt = topic
        ? `Generate a compelling and engaging blog post title about "${topic}". The title should be professional, clear, and capture the reader's attention. Return only the title, no additional text.`
        : `Generate a compelling and engaging blog post title. The title should be professional, clear, and capture the reader's attention. Return only the title, no additional text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional blog content writer. Generate high-quality, engaging titles for blog posts.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const generatedTitle = completion.choices[0]?.message?.content?.trim() || "Untitled Article";
      
      return NextResponse.json({
        success: true,
        title: generatedTitle,
      });
    }

    if (type === "header") {
      const prompt = topic
        ? `Generate a concise and engaging section header for a blog post about "${topic}". The header should be 3-8 words and clearly indicate what the section covers. Return only the header text, no additional formatting.`
        : context?.sectionContent
          ? `Generate a concise and engaging section header for a blog section with the following content: "${context.sectionContent.substring(0, 200)}". The header should be 3-8 words and clearly indicate what the section covers. Return only the header text, no additional formatting.`
          : `Generate a concise and engaging section header for a blog post. The header should be 3-8 words. Return only the header text, no additional formatting.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional blog content writer. Generate concise, clear section headers.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      });

      const generatedHeader = completion.choices[0]?.message?.content?.trim() || "Section Header";
      
      return NextResponse.json({
        success: true,
        header: generatedHeader,
      });
    }

    if (type === "content") {
      const prompt = topic
        ? `Write a comprehensive and engaging blog post section about "${topic}". The content should be informative, well-structured, and approximately 150-200 words. Write in a professional yet accessible tone.`
        : context?.sectionHeader
          ? `Write a comprehensive and engaging blog post section with the header "${context.sectionHeader}". The content should be informative, well-structured, and approximately 150-200 words. Write in a professional yet accessible tone.`
          : `Write a comprehensive and engaging blog post section. The content should be informative, well-structured, and approximately 150-200 words. Write in a professional yet accessible tone.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional blog content writer. Generate high-quality, informative blog post content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      const generatedContent = completion.choices[0]?.message?.content?.trim() || "Content generation failed. Please try again.";
      
      return NextResponse.json({
        success: true,
        content: generatedContent,
      });
    }

    // Default: full post generation (backward compatibility)
    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    const prompt = `Write a comprehensive blog post about "${topic}". The post should include:
1. A compelling title
2. An introduction section
3. Multiple well-structured sections covering key concepts, practical applications, benefits, and future outlook
4. A conclusion

Format the content with clear section headers using markdown (## for main sections, ### for subsections). The total length should be approximately 800-1200 words. Write in a professional yet accessible tone.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional blog content writer. Generate comprehensive, well-structured blog posts with clear sections and engaging content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const generatedContent = completion.choices[0]?.message?.content?.trim() || "";
    
    // Extract title and content
    const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : `Exploring ${topic}: A Comprehensive Guide`;
    const content = generatedContent.replace(/^#\s+.+$/m, "").trim();

    return NextResponse.json({
      success: true,
      title,
      content,
    });
  } catch (error: any) {
    console.error("Error generating blog post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate blog post",
      },
      { status: 500 }
    );
  }
}

