import { z } from "zod";
import { songLyricsSchema } from "@/lib/schemas";

const lyricsEnvelopeSchema = z.object({
  success: z.literal(true),
  data: songLyricsSchema,
});

export async function getSongLyrics(lyricsId: string): Promise<string> {
  const response = await fetch(`/api/lyrics?id=${encodeURIComponent(lyricsId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch lyrics: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = lyricsEnvelopeSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Failed to fetch lyrics");
  }

  return parsed.data.data.lyrics;
}
