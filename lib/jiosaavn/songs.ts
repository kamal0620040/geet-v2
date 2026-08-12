import { Song } from "@/music/data";
import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import { createSongPayload } from "@/lib/jiosaavn/mappers";
import {
  JiosaavnSearchArgs,
  JiosaavnSearchResult,
  RawSearchResponse,
  RawSuggestionsResponse,
} from "@/lib/jiosaavn/types";

export async function searchSongs({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<JiosaavnSearchResult> {
  const data = await fetchFromJiosaavn<RawSearchResponse>(endpoints.search, {
    q: query,
    p: page,
    n: limit,
  });

  return {
    total: data.total ?? 0,
    start: data.start ?? 0,
    results: (data.results ?? []).map(createSongPayload).slice(0, limit),
  };
}

export async function getSongSuggestions({
  songId,
  limit,
}: {
  songId: string;
  limit: number;
}): Promise<Song[]> {
  const data = await fetchFromJiosaavn<RawSuggestionsResponse>(
    endpoints.songSuggestions,
    {
      pid: songId,
      n: limit,
    },
    "android",
  );

  return (data[songId] ?? [])
    .map(createSongPayload)
    .slice(0, limit);
}
