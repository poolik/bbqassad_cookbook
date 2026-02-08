import { z } from "zod";
import { genai, MODEL } from "./gemini.js";
import { GateResultSchema, type GateResult } from "./schemas.js";
import { GATE_SYSTEM_PROMPT, gateUserPrompt } from "./prompts.js";
import { sleep } from "./utils.js";

/**
 * Step 1: Video Gate
 *
 * Quick validation call to determine if the video is a BBQ meat cooking recipe
 * or something else (shop promo, Q&A, tool review, etc.).
 */
export async function runGate(youtubeUrl: string): Promise<GateResult> {
  console.log("🔍 Step 1: Running video gate classification...");

  const jsonSchema = z.toJSONSchema(GateResultSchema);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await genai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { fileData: { fileUri: youtubeUrl } },
              { text: gateUserPrompt(youtubeUrl) },
            ],
          },
        ],
        config: {
          systemInstruction: GATE_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: jsonSchema as any,
          thinkingConfig: { thinkingBudget: 1024 },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = JSON.parse(text);
      const result = GateResultSchema.parse(parsed);

      console.log(`   Recipe: ${result.isRecipe ? "✅ Yes" : "❌ No"}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%`);
      console.log(`   Reason: ${result.reason}`);
      console.log(`   Language: ${result.detectedLanguage}`);

      return result;
    } catch (error) {
      if (attempt === 0) {
        console.warn(
          `   ⚠️ Gate attempt failed, retrying in 2s...`,
          error instanceof Error ? error.message : error,
        );
        await sleep(2000);
      } else {
        throw error;
      }
    }
  }

  throw new Error("Gate classification failed after 2 attempts");
}
