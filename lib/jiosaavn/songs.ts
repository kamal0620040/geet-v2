import { Song } from "@/music/data";
import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import { createSongPayload } from "@/lib/jiosaavn/mappers";
import {
  rawSearchResponseSchema,
  rawSuggestionsResponseSchema,
} from "@/lib/jiosaavn/schemas";
import {
  JiosaavnSearchArgs,
  JiosaavnSearchResult,
} from "@/lib/jiosaavn/types";

export async function searchSongs({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<JiosaavnSearchResult> {
  const data = await fetchFromJiosaavn(
    endpoints.search,
    {
      q: query,
      p: page,
      n: limit,
    },
    rawSearchResponseSchema,
  );

  return {
    total: data.total,
    start: data.start,
    results: data.results.map(createSongPayload).slice(0, limit),
  };
}

export async function getSongSuggestions({
  songId,
  limit,
}: {
  songId: string;
  limit: number;
}): Promise<Song[]> {
  const data = await fetchFromJiosaavn(
    endpoints.songSuggestions,
    {
      pid: songId,
      n: limit,
    },
    rawSuggestionsResponseSchema,
    "android",
  );

  return data[songId].map(createSongPayload).slice(0, limit);
}
