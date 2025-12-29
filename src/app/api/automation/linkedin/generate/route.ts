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
    const { title, description, category, type, context } = body;

    // Handle different generation types
    if (type === "header") {
      const prompt = title
        ? `Generate an engaging LinkedIn post header about "${title}". The header should be attention-grabbing, professional, and include an appropriate emoji. Keep it concise (under 100 characters). Return only the header text.`
        : context?.postBody
          ? `Generate an engaging LinkedIn post header based on this post body: "${context.postBody.substring(0, 200)}". The header should be attention-grabbing, professional, and include an appropriate emoji. Keep it concise (under 100 characters). Return only the header text.`
          : `Generate an engaging LinkedIn post header. The header should be attention-grabbing, professional, and include an appropriate emoji. Keep it concise (under 100 characters). Return only the header text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional LinkedIn content writer. Generate engaging, professional LinkedIn post headers with appropriate emojis.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.8,
      });

      const generatedHeader = completion.choices[0]?.message?.content?.trim() || "🚀 Exciting Update";
      
      return NextResponse.json({
        success: true,
        header: generatedHeader,
      });
    }

    if (type === "body") {
      const prompt = description
        ? `Write a professional LinkedIn post body about: "${description}". ${category ? `The category is: ${category}.` : ""} The post should be engaging, informative, and include relevant hashtags. Include hashtags like #HealthcareAI #DigitalHealth #Innovation #HealthTech. Keep it between 200-300 words. Write in a professional yet conversational tone suitable for LinkedIn.`
        : context?.postHeader
          ? `Write a professional LinkedIn post body that complements this header: "${context.postHeader}". The post should be engaging, informative, and include relevant hashtags. Include hashtags like #HealthcareAI #DigitalHealth #Innovation #HealthTech. Keep it between 200-300 words. Write in a professional yet conversational tone suitable for LinkedIn.`
          : `Write a professional LinkedIn post body. The post should be engaging, informative, and include relevant hashtags. Include hashtags like #HealthcareAI #DigitalHealth #Innovation #HealthTech. Keep it between 200-300 words. Write in a professional yet conversational tone suitable for LinkedIn.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional LinkedIn content writer. Generate engaging, professional LinkedIn posts with appropriate hashtags.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 600,
        temperature: 0.8,
      });

      const generatedBody = completion.choices[0]?.message?.content?.trim() || "Content generation failed. Please try again.";
      
      return NextResponse.json({
        success: true,
        body: generatedBody,
      });
    }

    // Default: generate both (backward compatibility)
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const prompt = `Create a complete LinkedIn post about "${title}". Description: "${description}". ${category ? `Category: ${category}.` : ""}

Generate:
1. An engaging header (under 100 characters) with an appropriate emoji
2. A professional post body (200-300 words) that includes relevant hashtags like #HealthcareAI #DigitalHealth #Innovation #HealthTech${category ? ` and #${category.replace(/\s+/g, '')}` : ""}

Format the response as:
HEADER: [header text]
BODY: [body text]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional LinkedIn content writer. Generate engaging, professional LinkedIn posts with headers and bodies.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 700,
      temperature: 0.8,
    });

    const generatedContent = completion.choices[0]?.message?.content?.trim() || "";
    
    // Parse the response
    const headerMatch = generatedContent.match(/HEADER:\s*(.+?)(?:\n|BODY:)/i);
    const bodyMatch = generatedContent.match(/BODY:\s*([\s\S]+)/i);
    
    const header = headerMatch ? headerMatch[1].trim() : `🚀 Exciting News: ${title}`;
    const bodyText = bodyMatch ? bodyMatch[1].trim() : `${description}\n\n#HealthcareAI #DigitalHealth #Innovation #HealthTech`;

    return NextResponse.json({
      success: true,
      header,
      body: bodyText,
      post: `${header}\n\n${bodyText}`, // Keep for backward compatibility
    });
  } catch (error: any) {
    console.error("Error generating LinkedIn post:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate post",
      },
      { status: 500 }
    );
  }
}

