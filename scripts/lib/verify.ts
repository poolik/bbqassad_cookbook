import { z } from "zod";
import { genai, MODEL, MAX_JUDGE_RETRIES } from "./gemini.js";
import {
  JudgeResultSchema,
  type JudgeResult,
  type RecipeExtraction,
} from "./schemas.js";
import { JUDGE_SYSTEM_PROMPT, judgeUserPrompt } from "./prompts.js";
import { runExtraction } from "./extract.js";
import { sleep } from "./utils.js";

/**
 * Run a single judge verification call.
 */
async function runJudge(
  youtubeUrl: string,
  extraction: RecipeExtraction,
): Promise<JudgeResult> {
  const jsonSchema = z.toJSONSchema(JudgeResultSchema);
  const extractedJson = JSON.stringify(extraction, null, 2);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await genai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { fileData: { fileUri: youtubeUrl } },
              { text: judgeUserPrompt(youtubeUrl, extractedJson) },
            ],
          },
        ],
        config: {
          systemInstruction: JUDGE_SYSTEM_PROMPT,
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
      return JudgeResultSchema.parse(parsed);
    } catch (error) {
      if (attempt === 0) {
        console.warn(
          `   ⚠️ Judge attempt failed, retrying in 2s...`,
          error instanceof Error ? error.message : error,
        );
        await sleep(2000);
      } else {
        throw error;
      }
    }
  }

  throw new Error("Judge verification failed after 2 attempts");
}

/**
 * Format judge issues into a human-readable string for re-extraction feedback.
 */
function formatIssues(result: JudgeResult): string {
  return result.issues
    .map(
      (issue, i) =>
        `${i + 1}. [${issue.severity.toUpperCase()}] Field: ${issue.field}\n   Problem: ${issue.description}\n   Suggested fix: ${issue.suggestion}`,
    )
    .join("\n\n");
}

/**
 * Steps 4-5: LLM-as-Judge Verification with Refinement Loop
 *
 * A fresh context window reviews the extracted data against the video.
 * If critical issues are found, feeds them back to extraction and re-verifies.
 * Maximum MAX_JUDGE_RETRIES refinement iterations.
 */
export async function runVerification(
  youtubeUrl: string,
  initialExtraction: RecipeExtraction,
): Promise<{ extraction: RecipeExtraction; judgeResult: JudgeResult }> {
  let currentExtraction = initialExtraction;

  for (let iteration = 0; iteration <= MAX_JUDGE_RETRIES; iteration++) {
    console.log(
      `\n🔎 Step 4: Judge verification (iteration ${iteration + 1}/${MAX_JUDGE_RETRIES + 1})...`,
    );

    const judgeResult = await runJudge(youtubeUrl, currentExtraction);

    console.log(
      `   ${judgeResult.approved ? "✅ Approved" : "❌ Not approved"}`,
    );
    console.log(`   Score: ${judgeResult.overallScore}/10`);
    console.log(`   Issues: ${judgeResult.issues.length}`);

    if (judgeResult.issues.length > 0) {
      for (const issue of judgeResult.issues) {
        console.log(
          `   - [${issue.severity}] ${issue.field}: ${issue.description}`,
        );
      }
    }

    // If approved, we're done
    if (judgeResult.approved) {
      return { extraction: currentExtraction, judgeResult };
    }

    // Check for critical issues
    const criticalIssues = judgeResult.issues.filter(
      (i) => i.severity === "critical",
    );

    if (criticalIssues.length === 0) {
      // Only minor issues -- accept as-is
      console.log(
        "   ℹ️ Only minor issues found, accepting extraction as-is.",
      );
      return { extraction: currentExtraction, judgeResult };
    }

    // If we've used all retries, warn and return best result
    if (iteration === MAX_JUDGE_RETRIES) {
      console.error(
        `\n⚠️ WARNING: Extraction still has critical issues after ${MAX_JUDGE_RETRIES} refinement(s).`,
      );
      console.error("   Writing best available result with issues noted.");
      return { extraction: currentExtraction, judgeResult };
    }

    // Re-extract with issues feedback
    console.log("\n🔄 Step 5: Refining extraction based on judge feedback...");
    const issuesText = formatIssues(judgeResult);
    currentExtraction = await runExtraction(youtubeUrl, issuesText);
  }

  // Should never reach here, but TypeScript needs it
  throw new Error("Unexpected end of verification loop");
}
