import { z } from "zod";

// ===== Step 1: Gate Schema =====

export const GateResultSchema = z.object({
  isRecipe: z
    .boolean()
    .describe(
      "True if this video is primarily about cooking/grilling a meat dish",
    ),
  confidence: z.number().min(0).max(1).describe("Confidence score 0-1"),
  reason: z
    .string()
    .describe("Brief explanation of why this is/isn't a recipe"),
  detectedLanguage: z
    .string()
    .describe("Primary language spoken in the video"),
});

export type GateResult = z.infer<typeof GateResultSchema>;

// ===== Steps 2-3: Extraction Schemas =====

export const MeatSchema = z.object({
  type: z
    .string()
    .describe(
      "Normalized lowercase meat type: veis, siga, kana, lammas, kala",
    ),
  cut: z
    .string()
    .describe(
      "Normalized lowercase cut: brisket, ribid, pulled-pork, tiivad, välisfilee",
    ),
  cutDisplay: z.string().describe("Human-readable Estonian name for the cut"),
  weight: z.string().describe("Approximate weight or quantity mentioned"),
  notes: z
    .string()
    .optional()
    .describe("Any special notes about the meat selection"),
});

export const SeasoningSchema = z.object({
  name: z.string().describe("Full product name as mentioned/shown in video"),
  type: z.enum(["rub", "sauce", "marinade", "injection", "muu"]),
  brand: z.string().describe("Brand name"),
  amount: z.string().describe("Approximate amount used"),
  shopUrl: z
    .string()
    .describe("URL on bbqassad.ee if recognizable brand, otherwise empty"),
  optional: z.boolean().describe("Whether this seasoning is optional"),
});

export const TemperaturePhaseSchema = z.object({
  temperature: z.string().describe("Target temperature, e.g. '110°C'"),
  duration: z
    .string()
    .optional()
    .describe("How long this phase lasts, e.g. '5-6 tundi'"),
  description: z
    .string()
    .describe(
      "What happens at this temperature, e.g. 'Suitsutamine kuni bark tekib'",
    ),
});

export const CookingOverviewSchema = z.object({
  totalTime: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  restTime: z.string(),
  temperature: z
    .string()
    .describe("Overall temperature range summary, e.g. '110-135°C'"),
  temperaturePhases: z
    .array(TemperaturePhaseSchema)
    .describe(
      "Ordered list of distinct temperature phases during cooking. E.g. start at 110°C for smoking, raise to 135°C after wrapping, finish at 150°C for bark. Include each change mentioned in the video.",
    ),
  difficulty: z.enum(["lihtne", "keskmine", "keeruline"]),
  servings: z.number(),
});

export const StepSchema = z.object({
  stepNumber: z.number(),
  title: z.string().describe("Short Estonian title for this step"),
  description: z
    .string()
    .describe("Detailed Estonian description of what happens"),
  temperature: z.string().nullable(),
  duration: z.string(),
  videoTimestamp: z
    .number()
    .describe("Approximate seconds into the video where this step starts"),
  tips: z.array(z.string()).describe("Practical tips mentioned for this step"),
});

export const RecipeExtractionSchema = z.object({
  title: z.string().describe("Recipe title in Estonian"),
  description: z.string().describe("2-3 sentence Estonian description"),
  meat: MeatSchema,
  seasonings: z.array(SeasoningSchema),
  equipment: z.array(z.string()),
  cookingOverview: CookingOverviewSchema,
  steps: z
    .array(StepSchema)
    .describe(
      "All cooking steps in order, including prep, cooking, wrapping, resting, sauce making, and serving",
    ),
  tags: z
    .array(z.string())
    .describe("Lowercase tags for search: meat type, cut, technique, brands"),
});

export type RecipeExtraction = z.infer<typeof RecipeExtractionSchema>;

// ===== Steps 4-5: Judge Schema =====

export const JudgeIssueSchema = z.object({
  field: z
    .string()
    .describe(
      "JSON path of the problematic field, e.g. 'meat.type' or 'steps[2].description'",
    ),
  severity: z.enum(["critical", "minor"]),
  description: z.string().describe("What is wrong"),
  suggestion: z.string().describe("What the correct value should be"),
});

export const JudgeResultSchema = z.object({
  approved: z
    .boolean()
    .describe("True if extraction accurately represents the video"),
  overallScore: z.number().min(1).max(10).describe("Quality score 1-10"),
  issues: z.array(JudgeIssueSchema),
});

export type JudgeResult = z.infer<typeof JudgeResultSchema>;
