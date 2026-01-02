import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPER_ADMIN_EMAIL = "hitesh.ms24@gmail.com";

// Dynamic import of puppeteer (only when needed)
export async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Dynamically import puppeteer
    const puppeteer = await import('puppeteer');
    
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    // Set a reasonable timeout
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Extract text content from the page
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, nav, footer, header');
      scripts.forEach(el => el.remove());
      
      // Get main content
      const body = document.body.innerText || '';
      const title = document.title || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      // Try to find product-specific sections
      const productSections: string[] = [];
      const productSelectors = [
        '[class*="product"]',
        '[class*="solution"]',
        '[class*="service"]',
        '[id*="product"]',
        '[id*="solution"]',
        '[id*="service"]',
        'section h2, section h3',
      ];
      
      productSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && text.length > 20 && text.length < 500) {
              productSections.push(text);
            }
          });
        } catch (e) {
          // Ignore selector errors
        }
      });
      
      return {
        title,
        metaDescription,
        body: body.substring(0, 15000), // Increased to 15k characters for better product detection
        productSections: productSections.slice(0, 20), // Limit to 20 product sections
      };
    });
    
    await browser.close();
    
    return JSON.stringify(content);
  } catch (error: any) {
    console.error("Error scraping website:", error);
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

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

export async function extractSectionData(
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

async function extractVendorData(websiteContent: string): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  console.log("Starting streamlined vendor data extraction...");

  // Extract data from each section sequentially (streamlined approach)
  const sections = [
    { promptName: '01-company-overview', sectionName: 'company-overview' },
    { promptName: '02-product-information', sectionName: 'product-information' },
    { promptName: '03-integrations', sectionName: 'integrations' },
    { promptName: '04-contact-information', sectionName: 'contact-information' },
    { promptName: '05-compliance-certifications', sectionName: 'compliance-certifications' },
  ];

  // Execute all extractions in parallel for faster processing
  const extractionPromises = sections.map(({ promptName, sectionName }) =>
    extractSectionData(websiteContent, promptName, sectionName)
  );

  const results = await Promise.all(extractionPromises);

  // Combine all results into a single object
  const combinedData = {
    ...results[0], // company-overview
    ...results[1], // product-information
    ...results[2], // integrations
    ...results[3], // contact-information
    ...results[4], // compliance-certifications
  };

  console.log("Completed vendor data extraction");
  return combinedData;
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
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
      return NextResponse.json(
        { success: false, error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Scrape website
    const websiteContent = await scrapeWebsite(validUrl.toString());

    // Extract vendor data using OpenAI
    const vendorData = await extractVendorData(websiteContent);

    // Ensure website field is set
    vendorData.website = validUrl.toString();

    // Convert old format (productName/productOverview) to new format (products array) if needed
    if (vendorData.productName && vendorData.productOverview && !vendorData.products) {
      vendorData.products = [{
        name: vendorData.productName,
        overview: vendorData.productOverview
      }];
      // Remove old fields
      delete vendorData.productName;
      delete vendorData.productOverview;
    } else if (!vendorData.products || vendorData.products.length === 0) {
      // If no products found, try to extract from website content more thoroughly
      // This is a fallback - the AI should have already extracted products
      vendorData.products = [];
    }

    // Ensure products array is valid and each product has required fields
    if (vendorData.products && Array.isArray(vendorData.products)) {
      vendorData.products = vendorData.products
        .filter((p: any) => p && (p.name || p.overview)) // Filter out invalid products
        .map((p: any) => ({
          name: p.name || "Unnamed Product",
          overview: p.overview || p.description || "",
          url: p.url || "" // Include product URL if available
        }))
        .filter((p: any) => p.overview.length >= 50); // Only include products with sufficient description
    } else {
      vendorData.products = [];
    }

    // Process integrationCategories - ensure it's properly formatted
    if (!vendorData.integrationCategories) {
      vendorData.integrationCategories = {};
    }

    // Ensure each category is an array and filter out empty values
    const categories = ["EHRs", "Payments", "Forms", "Communication", "Analytics"];
    categories.forEach((category) => {
      if (!vendorData.integrationCategories[category]) {
        vendorData.integrationCategories[category] = [];
      } else if (!Array.isArray(vendorData.integrationCategories[category])) {
        // Convert to array if it's not
        vendorData.integrationCategories[category] = [vendorData.integrationCategories[category]];
      }
      // Filter out empty strings and normalize
      vendorData.integrationCategories[category] = vendorData.integrationCategories[category]
        .filter((item: any) => item && typeof item === "string" && item.trim().length > 0)
        .map((item: any) => item.trim());
    });

    // Handle backward compatibility: if integrationsRequired exists but integrationCategories doesn't have data
    if (vendorData.integrationsRequired && Array.isArray(vendorData.integrationsRequired) && 
        Object.values(vendorData.integrationCategories).every((arr: any) => Array.isArray(arr) && arr.length === 0)) {
      // Try to categorize old format integrations
      const ehrKeywords = ["epic", "cerner", "allscripts", "nextgen", "eclinicalworks", "athenahealth", "meditech"];
      const paymentKeywords = ["stripe", "square", "paypal", "authorize", "braintree", "adyen"];
      
      vendorData.integrationsRequired.forEach((integration: string) => {
        const lowerIntegration = integration.toLowerCase();
        if (ehrKeywords.some(keyword => lowerIntegration.includes(keyword))) {
          vendorData.integrationCategories.EHRs.push(integration);
        } else if (paymentKeywords.some(keyword => lowerIntegration.includes(keyword))) {
          vendorData.integrationCategories.Payments.push(integration);
        }
      });
    }
    
    // If otherIntegrations is provided directly, ensure it's a string
    if (vendorData.otherIntegrations && Array.isArray(vendorData.otherIntegrations)) {
      vendorData.otherIntegrations = vendorData.otherIntegrations.join(", ");
    }
    
    // Post-process: Move integrations from otherIntegrations to correct categories if they're mis-categorized
    // Also fetch actual integration names from database for better matching
    try {
      const { default: connectDB } = await import("@/lib/db");
      const { default: Integration } = await import("@/models/Integration");
      await connectDB();
      
      const allIntegrations = await Integration.find({}).sort({ name: 1 });
      const integrationsByCategory: Record<string, string[]> = {
        EHRs: [],
        Payments: [],
        Forms: [],
        Communication: [],
        Analytics: []
      };
      
      allIntegrations.forEach((integration: any) => {
        const category = integration.category;
        if (integrationsByCategory[category]) {
          integrationsByCategory[category].push(integration.name.toLowerCase());
        }
      });
      
      if (vendorData.otherIntegrations && typeof vendorData.otherIntegrations === "string") {
        const otherIntegrationsList = vendorData.otherIntegrations.split(",").map((item: string) => item.trim()).filter(Boolean);
        const remainingOther: string[] = [];
        
        otherIntegrationsList.forEach((integration: string) => {
          const lowerIntegration = integration.toLowerCase();
          let categorized = false;
          
          // Check each category for matches
          for (const [category, integrationNames] of Object.entries(integrationsByCategory)) {
            const match = integrationNames.find((name: string) => 
              lowerIntegration === name || 
              lowerIntegration.includes(name) || 
              name.includes(lowerIntegration) ||
              // Handle variations like "athenahealth" vs "athena health"
              lowerIntegration.replace(/\s+/g, '') === name.replace(/\s+/g, '') ||
              name.replace(/\s+/g, '') === lowerIntegration.replace(/\s+/g, '')
            );
            
            if (match) {
              // Find the original name from database to preserve correct casing
              const originalIntegration = allIntegrations.find((i: any) => 
                i.name.toLowerCase() === match || 
                i.name.toLowerCase().replace(/\s+/g, '') === lowerIntegration.replace(/\s+/g, '')
              );
              
              const normalizedName = originalIntegration ? originalIntegration.name : integration;
              
              if (!vendorData.integrationCategories[category].includes(normalizedName)) {
                vendorData.integrationCategories[category].push(normalizedName);
              }
              categorized = true;
              break;
            }
          }
          
          // If not categorized, keep it in otherIntegrations
          if (!categorized) {
            remainingOther.push(integration);
          }
        });
        
        // Update otherIntegrations with only uncategorized items
        vendorData.otherIntegrations = remainingOther.join(", ");
      }
    } catch (error) {
      console.error("Error fetching integrations for categorization:", error);
      // Fallback to basic keyword matching if database fetch fails
      if (vendorData.otherIntegrations && typeof vendorData.otherIntegrations === "string") {
        const otherIntegrationsList = vendorData.otherIntegrations.split(",").map((item: string) => item.trim()).filter(Boolean);
        const remainingOther: string[] = [];
        
        const ehrKeywords = ["epic", "cerner", "allscripts", "nextgen", "eclinicalworks", "athenahealth", "athena", "meditech", "greenway", "advancedmd", "carecloud", "drchrono", "kareo", "practice fusion", "veradigm", "altera", "medhost", "simplepractice", "therapynotes", "theranest"];
        const paymentKeywords = ["stripe", "square", "paypal", "authorize", "braintree", "adyen", "worldpay", "payline", "payment depot", "elavon"];
        const formsKeywords = ["jotform", "typeform", "formstack", "wufoo", "google forms", "microsoft forms", "formassembly", "123formbuilder", "cognito forms", "formsite"];
        const communicationKeywords = ["twilio", "vonage", "ringcentral", "zoom", "microsoft teams", "slack", "whatsapp", "telegram", "signal", "webex", "sendgrid", "mailchimp"];
        const analyticsKeywords = ["tableau", "power bi", "google analytics", "mixpanel", "amplitude", "looker", "qlik", "sisense", "domo", "chartio"];
        
        otherIntegrationsList.forEach((integration: string) => {
          const lowerIntegration = integration.toLowerCase();
          let categorized = false;
          
          // Check EHRs
          if (ehrKeywords.some((keyword: string) => lowerIntegration.includes(keyword) || keyword.includes(lowerIntegration))) {
            if (!vendorData.integrationCategories.EHRs.includes(integration)) {
              vendorData.integrationCategories.EHRs.push(integration);
            }
            categorized = true;
          }
          // Check Payments
          else if (paymentKeywords.some((keyword: string) => lowerIntegration.includes(keyword) || keyword.includes(lowerIntegration))) {
            if (!vendorData.integrationCategories.Payments.includes(integration)) {
              vendorData.integrationCategories.Payments.push(integration);
            }
            categorized = true;
          }
          // Check Forms
          else if (formsKeywords.some((keyword: string) => lowerIntegration.includes(keyword) || keyword.includes(lowerIntegration))) {
            if (!vendorData.integrationCategories.Forms.includes(integration)) {
              vendorData.integrationCategories.Forms.push(integration);
            }
            categorized = true;
          }
          // Check Communication
          else if (communicationKeywords.some((keyword: string) => lowerIntegration.includes(keyword) || keyword.includes(lowerIntegration))) {
            if (!vendorData.integrationCategories.Communication.includes(integration)) {
              vendorData.integrationCategories.Communication.push(integration);
            }
            categorized = true;
          }
          // Check Analytics
          else if (analyticsKeywords.some((keyword: string) => lowerIntegration.includes(keyword) || keyword.includes(lowerIntegration))) {
            if (!vendorData.integrationCategories.Analytics.includes(integration)) {
              vendorData.integrationCategories.Analytics.push(integration);
            }
            categorized = true;
          }
          
          if (!categorized) {
            remainingOther.push(integration);
          }
        });
        
        vendorData.otherIntegrations = remainingOther.join(", ");
      }
    }
    
    // Process otherIntegrationsByCategory - ensure it's properly formatted
    if (!vendorData.otherIntegrationsByCategory) {
      vendorData.otherIntegrationsByCategory = {};
    }
    
    // Ensure each category has a string value
    categories.forEach((category) => {
      if (!vendorData.otherIntegrationsByCategory[category]) {
        vendorData.otherIntegrationsByCategory[category] = "";
      } else if (Array.isArray(vendorData.otherIntegrationsByCategory[category])) {
        // Convert array to comma-separated string
        vendorData.otherIntegrationsByCategory[category] = vendorData.otherIntegrationsByCategory[category]
          .filter((item: any) => item && typeof item === "string" && item.trim().length > 0)
          .map((item: any) => item.trim())
          .join(", ");
      } else if (typeof vendorData.otherIntegrationsByCategory[category] !== "string") {
        vendorData.otherIntegrationsByCategory[category] = String(vendorData.otherIntegrationsByCategory[category] || "").trim();
      }
    });
    
    // Clean up old fields
    delete vendorData.integrationsRequired;

    return NextResponse.json({
      success: true,
      data: vendorData,
    });
  } catch (error: any) {
    console.error("Error parsing vendor website:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to parse vendor website",
      },
      { status: 500 }
    );
  }
}

