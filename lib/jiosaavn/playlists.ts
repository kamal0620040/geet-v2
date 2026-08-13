import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import {
  createPlaylistPayload,
  createSearchPlaylistPayload,
} from "@/lib/jiosaavn/mappers";
import {
  rawPlaylistDetailsSchema,
  rawPlaylistSearchResponseSchema,
} from "@/lib/jiosaavn/schemas";
import {
  JiosaavnSearchArgs,
  PlaylistCatalogItem,
  PlaylistDetail,
} from "@/lib/jiosaavn/types";

export async function searchPlaylists({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<{
  total: number;
  start: number;
  results: PlaylistCatalogItem[];
}> {
  const data = await fetchFromJiosaavn(
    endpoints.searchPlaylists,
    {
      q: query,
      p: page,
      n: limit,
    },
    rawPlaylistSearchResponseSchema,
  );

  return {
    total: data.total,
    start: data.start,
    results: data.results.map(createSearchPlaylistPayload),
  };
}

export async function getPlaylist({
  id,
  page,
  limit,
}: {
  id: string;
  page: number;
  limit: number;
}): Promise<PlaylistDetail> {
  const data = await fetchFromJiosaavn(
    endpoints.playlistDetails,
    {
      listid: id,
      n: limit,
      p: page,
    },
    rawPlaylistDetailsSchema,
  );

  return createPlaylistPayload(data, limit);
}
