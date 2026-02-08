/**
 * Parse a YouTube URL and extract the video ID.
 * Supports formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 */
export function parseYouTubeUrl(url: string): {
  videoId: string;
  url: string;
} {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];
      return {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
  }

  throw new Error(
    `Invalid YouTube URL: ${url}\n` +
      `Supported formats:\n` +
      `  - https://www.youtube.com/watch?v=VIDEO_ID\n` +
      `  - https://youtu.be/VIDEO_ID\n` +
      `  - https://www.youtube.com/embed/VIDEO_ID`,
  );
}

/**
 * Generate a URL-safe slug from an Estonian title.
 * Handles Estonian characters (ä, ö, ü, õ, š, ž) by transliterating them.
 */
export function generateSlug(title: string): string {
  const charMap: Record<string, string> = {
    ä: "a",
    ö: "o",
    ü: "u",
    õ: "o",
    š: "s",
    ž: "z",
    Ä: "a",
    Ö: "o",
    Ü: "u",
    Õ: "o",
    Š: "s",
    Ž: "z",
  };

  return title
    .toLowerCase()
    .split("")
    .map((char) => charMap[char] || char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
    .replace(/-{2,}/g, "-"); // collapse multiple hyphens
}

/**
 * Get today's date in ISO format (YYYY-MM-DD).
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
