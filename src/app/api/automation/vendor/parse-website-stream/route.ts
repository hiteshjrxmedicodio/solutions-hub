import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { scrapeWebsite } from "../parse-website/route";
import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function loadPrompt(promptName: string): Promise<string> {
  try {
    const promptPath = join(process.cwd(), 'src', 'components', 'prompts', 'vendor-questionnaire', `${promptName}.txt`);
    const promptContent = readFileSync(promptPath, 'utf-8');
    return promptContent;
  } catch (error) {
    console.error(`Error loading prompt ${promptName}:`, error);
    throw new Error(`Failed to load prompt: ${promptName}`);
  }
}

async function extractSectionData(
  websiteContent: string,
  promptName: string,
  sectionName: string
): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    // Load section-specific prompt
    const promptTemplate = await loadPrompt(promptName);
    
    // Replace placeholder with actual website content
    const prompt = promptTemplate.replace('{{WEBSITE_CONTENT}}', websiteContent);

    console.log(`Extracting ${sectionName}...`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts structured data from website content. Always return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(responseText);
    
    console.log(`Successfully extracted ${sectionName}`);
    return parsedData;
  } catch (error: any) {
    console.error(`Error extracting ${sectionName}:`, error);
    // Return empty structure for this section if extraction fails
    return getEmptySectionData(sectionName);
  }
}

function getEmptySectionData(sectionName: string): any {
  switch (sectionName) {
    case 'company-overview':
      return {
        companyName: "",
        companyType: "",
        companyTypeOther: "",
        location: { state: "", country: "United States", countryOther: "" },
        website: "",
        address: ""
      };
    case 'product-information':
      return { products: [] };
    case 'integrations':
      return {
        integrationCategories: {
          EHRs: [],
          Payments: [],
          Forms: [],
          Communication: [],
          Analytics: []
        },
        otherIntegrationsByCategory: {
          EHRs: "",
          Payments: "",
          Forms: "",
          Communication: "",
          Analytics: ""
        },
        otherIntegrations: ""
      };
    case 'contact-information':
      return {
        primaryContact: {
          name: "",
          title: "",
          email: "",
          phone: ""
        }
      };
    case 'compliance-certifications':
      return {
        complianceCertifications: [],
        complianceCertificationsOther: ""
      };
    default:
      return {};
  }
}

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return new Response(
        JSON.stringify({ success: false, error: "Forbidden" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      if (!['http:', 'https:'].includes(validUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid URL format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (data: any) => {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        };

        try {
          // Scrape website first
          sendEvent({ type: 'status', message: 'Scraping website...' });
          const websiteContent = await scrapeWebsite(validUrl.toString());

          // Define sections in order
          const sections = [
            { promptName: '01-company-overview', sectionName: 'company-overview', displayName: 'Company Overview' },
            { promptName: '02-product-information', sectionName: 'product-information', displayName: 'Product Information' },
            { promptName: '03-integrations', sectionName: 'integrations', displayName: 'Integrations' },
            { promptName: '04-contact-information', sectionName: 'contact-information', displayName: 'Contact Information' },
            { promptName: '05-compliance-certifications', sectionName: 'compliance-certifications', displayName: 'Compliance' },
          ];

          // Process sections sequentially and stream results
          let combinedData: any = { website: validUrl.toString() };

          for (const section of sections) {
            sendEvent({ 
              type: 'status', 
              message: `Extracting ${section.displayName}...`,
              section: section.sectionName
            });

            try {
              const sectionData = await extractSectionData(
                websiteContent,
                section.promptName,
                section.sectionName
              );

              // Merge section data into combined data
              combinedData = { ...combinedData, ...sectionData };

              // Send the section data immediately
              sendEvent({
                type: 'section',
                section: section.sectionName,
                data: sectionData,
                displayName: section.displayName
              });
            } catch (error: any) {
              console.error(`Error extracting ${section.sectionName}:`, error);
              // Continue with other sections even if one fails
              sendEvent({
                type: 'error',
                section: section.sectionName,
                message: `Failed to extract ${section.displayName}`
              });
            }
          }

          // Send final complete data
          sendEvent({ type: 'complete', data: combinedData });
        } catch (error: any) {
          console.error("Error in streaming parse:", error);
          sendEvent({ 
            type: 'error', 
            message: error.message || "Failed to parse website" 
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("Error in parse-website-stream:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to parse website",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

