// ===== Prompt Templates =====

import { readFileSync } from "fs";
import { join } from "path";

// Load meta.json for brand matching
const metaPath = join(process.cwd(), "content", "meta.json");
const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

const brandList = meta.brands
  .map((b: { id: string; label: string }) => `- ${b.label} (slug: ${b.id})`)
  .join("\n");

const meatTypes = meta.meatTypes
  .map((m: { id: string; label: string }) => m.id)
  .join(", ");

const meatCuts = meta.meatCuts
  .map((c: { id: string; label: string }) => `${c.id} (${c.label})`)
  .join(", ");

// ===== Gate Prompts =====

export const GATE_SYSTEM_PROMPT = `You are a video classifier for BBQ Ässad, an Estonian BBQ cooking channel. Your job is to determine if a YouTube video is primarily a BBQ/grilling meat cooking recipe or something else.

What counts as a recipe video:
- Smoking brisket, ribs, pulled pork
- Grilling chicken wings, steaks, burgers
- Any video where meat is prepared, seasoned, and cooked on a grill/smoker
- The video shows the full or partial cooking process

What does NOT count:
- Product unboxing / review videos
- Q&A sessions or podcasts
- Grill/smoker assembly or setup tutorials
- Shop promotions or sales announcements
- Competition recaps without actual cooking
- Videos primarily about side dishes or desserts (no meat)

Analyze the video carefully and provide your classification.`;

export function gateUserPrompt(youtubeUrl: string): string {
  return `Classify this YouTube video: Is it a BBQ/grilling meat cooking recipe video?

Video: ${youtubeUrl}`;
}

// ===== Extraction Prompts =====

export const EXTRACTION_SYSTEM_PROMPT = `You are a recipe data extraction tool for BBQ Ässad Kokaraamat (cookbook). Your job is to watch a BBQ cooking video and extract structured recipe data.

CRITICAL RULES:
1. ALL text output MUST be in ESTONIAN (titles, descriptions, tips, step descriptions, etc.)
2. Extract EVERY step shown in the video. Include ALL of these step types when present:
   - ettevalmistus (prep) – meat preparation, trimming, patting dry
   - maitsestamine (seasoning) – applying rubs, marinades, injections
   - grilli/ahi ettevalmistus (grill setup) – setting up temperature, adding wood
   - suitsutamine/grillimine (cooking) – the main cooking phase(s)
   - mähkimine (wrapping) – if the meat is wrapped in butcher paper/foil
   - puhkamine (resting) – resting period after cooking
   - kastme valmistamine (sauce prep) – if a sauce is made
   - lõikamine/rebimine (slicing/pulling) – slicing brisket, pulling pork, etc.
   - serveerimine (serving) – final plating and serving
3. Pay close attention to TEMPERATURE CHANGES throughout the cook:
   - If the cook starts at one temperature and is raised or lowered at any point (e.g., start at 110°C, raise to 125°C after wrapping, bump to 150°C for bark), capture EACH distinct phase in cookingOverview.temperaturePhases
   - Also record the per-step temperature in each steps[].temperature field whenever a specific temperature is mentioned
4. Video timestamps should be approximate seconds into the video where each step begins

KNOWN BRANDS (for shopUrl matching on bbqassad.ee):
${brandList}

When you recognize a product from one of these brands, set shopUrl to: https://bbqassad.ee/toode/{product-slug}/
If the brand is unknown or you can't determine the exact product page, set shopUrl to empty string "".

MEAT TYPES (normalized IDs): ${meatTypes}
MEAT CUTS (normalized IDs): ${meatCuts}

Estonian cooking term examples:
- sool ja pipar = salt and pepper
- maitseainesegu = rub/seasoning blend
- kaste = sauce
- marinaad = marinade
- suitsutamine = smoking
- grillimine = grilling
- kaudne kuumus = indirect heat
- otsene kuumus = direct heat
- bark = bark (crust on meat)
- sisetemperatuur = internal temperature`;

export function extractionUserPrompt(
  youtubeUrl: string,
  previousIssues?: string,
): string {
  let prompt = `Watch this BBQ cooking video carefully and extract the complete recipe data.

Video: ${youtubeUrl}

Extract:
1. Recipe title and description (in Estonian)
2. Meat details (type, cut, weight)
3. All seasonings/rubs/sauces used with brand names
4. Equipment needed
5. Cooking overview with total/prep/cook/rest times, temperature phases, difficulty, servings
6. ALL cooking steps in chronological order with timestamps, temperatures, and tips
7. Relevant tags for search`;

  if (previousIssues) {
    prompt += `

⚠️ IMPORTANT: A previous extraction of this video had the following issues that MUST be corrected:
${previousIssues}

Please pay special attention to fixing these issues in your extraction.`;
  }

  return prompt;
}

// ===== Judge Prompts =====

export const JUDGE_SYSTEM_PROMPT = `You are a quality assurance reviewer for BBQ Ässad Kokaraamat (cookbook). Your job is to watch a BBQ cooking video and verify that extracted recipe data accurately represents the video content.

You must check for:
1. FACTUAL ACCURACY: Is the meat type and cut correctly identified?
2. SEASONINGS: Are all seasonings correctly identified with correct brand names? Are any missing?
3. TEMPERATURES & TIMES: Do cooking temperatures and times match the video? Check for ALL temperature transitions/phases (starting temp, any mid-cook raises or drops, finishing temp). Verify temperaturePhases in cookingOverview captures every distinct temperature change.
4. STEP COMPLETENESS: Are any steps missing? Does the extraction cover prep, seasoning, cooking, wrapping (if any), resting, sauce prep (if any), slicing/pulling, and serving?
5. STEP ORDERING: Are all steps in the correct chronological order?
6. VIDEO TIMESTAMPS: Are timestamps roughly accurate (within ~30 seconds)?
7. LANGUAGE: Is all text in Estonian?
8. TAGS: Are tags appropriate and helpful for search?

Be thorough but fair. Minor formatting differences are acceptable. Focus on factual accuracy and completeness.`;

export function judgeUserPrompt(
  youtubeUrl: string,
  extractedData: string,
): string {
  return `Watch this video and verify the accuracy of the extracted recipe data below.

Video: ${youtubeUrl}

Extracted recipe data:
${extractedData}

Compare the extracted data against the video and provide your assessment. Mark as approved only if the data is accurate and complete.`;
}
