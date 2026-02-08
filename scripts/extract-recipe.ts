#!/usr/bin/env tsx
/**
 * BBQ Ässad Recipe Extraction Pipeline
 *
 * Usage:
 *   npm run extract -- "https://www.youtube.com/watch?v=VIDEO_ID"
 *
 * Requires GEMINI_API_KEY environment variable (or .env file).
 */

import { writeFileSync } from "fs";
import { join } from "path";
import { parseYouTubeUrl, generateSlug, todayISO } from "./lib/utils.js";
import { runGate } from "./lib/gate.js";
import { runExtraction } from "./lib/extract.js";
import { runVerification } from "./lib/verify.js";
import type { RecipeExtraction } from "./lib/schemas.js";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  video: {
    youtubeId: string;
    url: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    publishedAt: string;
  };
  meat: RecipeExtraction["meat"];
  seasonings: RecipeExtraction["seasonings"];
  equipment: RecipeExtraction["equipment"];
  cookingOverview: RecipeExtraction["cookingOverview"];
  steps: Array<
    RecipeExtraction["steps"][number] & { thumbnailUrl: string }
  >;
  tags: RecipeExtraction["tags"];
  relatedRecipes: string[];
  createdAt: string;
  updatedAt: string;
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error(
      "Usage: npm run extract -- <youtube-url>\n" +
        'Example: npm run extract -- "https://www.youtube.com/watch?v=VIDEO_ID"',
    );
    process.exit(1);
  }

  console.log("🔥 BBQ Ässad Recipe Extraction Pipeline\n");
  console.log(`   Input URL: ${url}\n`);

  // Parse and validate YouTube URL
  let videoId: string;
  let canonicalUrl: string;
  try {
    const parsed = parseYouTubeUrl(url);
    videoId = parsed.videoId;
    canonicalUrl = parsed.url;
    console.log(`   Video ID: ${videoId}\n`);
  } catch (error) {
    console.error(
      `❌ ${error instanceof Error ? error.message : "Invalid YouTube URL"}`,
    );
    process.exit(1);
  }

  // Step 1: Gate
  const gateResult = await runGate(canonicalUrl);

  if (!gateResult.isRecipe || gateResult.confidence < 0.6) {
    console.log(
      `\n❌ Video rejected: Not a BBQ recipe (confidence: ${(gateResult.confidence * 100).toFixed(0)}%)`,
    );
    console.log(`   Reason: ${gateResult.reason}`);
    process.exit(0);
  }

  console.log("\n✅ Video accepted as BBQ recipe\n");

  // Steps 2-3: Extract
  const extraction = await runExtraction(canonicalUrl);

  // Steps 4-5: Verify with refinement loop
  const { extraction: verifiedExtraction, judgeResult } =
    await runVerification(canonicalUrl, extraction);

  // Step 6: Assemble and write JSON
  console.log("\n📄 Step 6: Assembling final recipe JSON...");

  const slug = generateSlug(verifiedExtraction.title);
  const today = todayISO();

  const recipe: Recipe = {
    id: slug,
    title: verifiedExtraction.title,
    slug,
    description: verifiedExtraction.description,
    video: {
      youtubeId: videoId,
      url: canonicalUrl,
      title: verifiedExtraction.title,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: "", // can be enriched later via YouTube Data API
      publishedAt: "", // can be enriched later via YouTube Data API
    },
    meat: verifiedExtraction.meat,
    seasonings: verifiedExtraction.seasonings,
    equipment: verifiedExtraction.equipment,
    cookingOverview: verifiedExtraction.cookingOverview,
    steps: verifiedExtraction.steps.map((step) => ({
      ...step,
      thumbnailUrl: `/images/recipes/${slug}/step-${step.stepNumber}.jpg`,
    })),
    tags: verifiedExtraction.tags,
    relatedRecipes: [],
    createdAt: today,
    updatedAt: today,
  };

  const outputPath = join(
    process.cwd(),
    "content",
    "recipes",
    `${slug}.json`,
  );
  writeFileSync(outputPath, JSON.stringify(recipe, null, 2) + "\n", "utf-8");

  console.log(`\n🎉 Recipe saved to: ${outputPath}`);
  console.log(`   Title: ${recipe.title}`);
  console.log(`   Slug: ${recipe.slug}`);
  console.log(`   Judge score: ${judgeResult.overallScore}/10`);
  console.log(
    `   Judge approved: ${judgeResult.approved ? "✅" : "⚠️ (best effort)"}`,
  );
}

main().catch((error) => {
  console.error("\n❌ Pipeline failed:", error);
  process.exit(1);
});
