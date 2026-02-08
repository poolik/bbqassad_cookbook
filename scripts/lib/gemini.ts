import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

export const MODEL = "gemini-3-flash-preview";
export const MAX_JUDGE_RETRIES = 2;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "❌ GEMINI_API_KEY environment variable is required.\n" +
      "   Set it via: export GEMINI_API_KEY=your-key\n" +
      "   Or create a .env file with GEMINI_API_KEY=your-key",
  );
  process.exit(1);
}

export const genai = new GoogleGenAI({ apiKey });
