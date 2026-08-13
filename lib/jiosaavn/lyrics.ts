import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import { rawLyricsResponseSchema } from "@/lib/jiosaavn/schemas";
import { SongLyrics } from "@/lib/jiosaavn/types";

export async function getLyrics(
  lyricsId: string,
): Promise<SongLyrics> {
  const data = await fetchFromJiosaavn(
    endpoints.lyrics,
    {
      lyrics_id: lyricsId,
    },
    rawLyricsResponseSchema,
  );

  return {
    lyrics: data.lyrics,
    snippet: data.snippet,
  };
}
