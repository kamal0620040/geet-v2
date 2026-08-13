import { z } from "zod";
import { songSchema } from "@/lib/schemas";
import { Song } from "@/music/data";

const BASE_URL = "/api";

export const DEFAULT_QUERY = "top song";

const searchSongsEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number(),
    start: z.number(),
    results: z.array(songSchema),
  }),
});

const suggestionsEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.array(songSchema),
});

export async function searchSongs(query: string, limit = 10): Promise<Song[]> {
  const url = `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search songs: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = searchSongsEnvelopeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid search songs response");
  }
  return parsed.data.data.results;
}

export async function getSongSuggestions(
  songId: string,
  limit = 20,
): Promise<Song[]> {
  const url = `${BASE_URL}/suggestions?id=${encodeURIComponent(songId)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch song suggestions: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = suggestionsEnvelopeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Failed to fetch song suggestions");
  }
  return parsed.data.data;
}
