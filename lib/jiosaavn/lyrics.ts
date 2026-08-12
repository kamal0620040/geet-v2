import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import { RawLyricsResponse, SongLyrics } from "@/lib/jiosaavn/types";

export async function getLyrics(
  lyricsId: string,
): Promise<SongLyrics> {
  const data = await fetchFromJiosaavn<RawLyricsResponse>(endpoints.lyrics, {
    lyrics_id: lyricsId,
  });

  return {
    lyrics: data.lyrics ?? "",
    snippet: data.snippet ?? null,
  };
}
