# Vendor Questionnaire Extraction Prompts

This folder contains individual prompts for extracting vendor information from websites. Each prompt is designed to extract data for a specific section of the vendor questionnaire.

## Prompt Structure

Each prompt file follows a standardized format with the following sections:

- **ROLE**: Defines what the AI assistant is specialized in
- **TASK**: Describes what the AI needs to accomplish
- **INSTRUCTIONS**: Step-by-step guidance on how to extract the data
- **CONSTRAINTS**: Rules and limitations for data extraction
- **OUTPUT FORMAT**: Expected JSON structure for the response

## Prompt Files

1. **01-company-overview.txt**: Extracts company name, type, location, and website details
2. **02-product-information.txt**: Extracts all products, solutions, and services offered
3. **03-integrations.txt**: Extracts and categorizes all integrations mentioned
4. **04-contact-information.txt**: Extracts primary contact details (name, title, email, phone)
5. **05-compliance-certifications.txt**: Extracts compliance and certification information

## Usage

The prompts are loaded dynamically by the API route `/api/automation/vendor/parse-website`. The extraction process:

1. Loads each prompt file sequentially
2. Replaces the `{{WEBSITE_CONTENT}}` placeholder with actual website content
3. Calls OpenAI API for each section in parallel for faster processing
4. Combines all results into a single vendor data object

## Placeholders

- `{{WEBSITE_CONTENT}}`: Will be replaced with the scraped website content at runtime

## Notes

- The old `vendor-website-extraction.txt` file is kept for reference but is no longer used
- Each prompt is designed to be independent and can be updated without affecting others
- Error handling ensures that if one section fails, others can still succeed

