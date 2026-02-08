import { z } from "zod";
import { genai, MODEL } from "./gemini.js";
import {
  RecipeExtractionSchema,
  type RecipeExtraction,
} from "./schemas.js";
import {
  EXTRACTION_SYSTEM_PROMPT,
  extractionUserPrompt,
} from "./prompts.js";
import { sleep } from "./utils.js";

/**
 * Steps 2-3: Core Data + Steps Extraction
 *
 * Single call that extracts meat, seasonings, cookingOverview, and steps together
 * from the YouTube video.
 */
export async function runExtraction(
  youtubeUrl: string,
  previousIssues?: string,
): Promise<RecipeExtraction> {
  console.log(
    previousIssues
      ? "🔄 Re-extracting recipe data with corrections..."
      : "📝 Steps 2-3: Extracting recipe data...",
  );

  const jsonSchema = z.toJSONSchema(RecipeExtractionSchema);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await genai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { fileData: { fileUri: youtubeUrl } },
              {
                text: extractionUserPrompt(youtubeUrl, previousIssues),
              },
            ],
          },
        ],
        config: {
          systemInstruction: EXTRACTION_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: jsonSchema as any,
          thinkingConfig: { thinkingBudget: 10000 },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = JSON.parse(text);
      const result = RecipeExtractionSchema.parse(parsed);

      console.log(`   ✅ Title: ${result.title}`);
      console.log(`   🥩 Meat: ${result.meat.cutDisplay} (${result.meat.type})`);
      console.log(`   🧂 Seasonings: ${result.seasonings.length} found`);
      console.log(`   📋 Steps: ${result.steps.length} extracted`);
      console.log(
        `   🌡️ Temperature phases: ${result.cookingOverview.temperaturePhases.length}`,
      );

      return result;
    } catch (error) {
      if (attempt === 0) {
        console.warn(
          `   ⚠️ Extraction attempt failed, retrying in 3s...`,
          error instanceof Error ? error.message : error,
        );
        await sleep(3000);
      } else {
        throw error;
      }
    }
  }

  throw new Error("Recipe extraction failed after 2 attempts");
}
