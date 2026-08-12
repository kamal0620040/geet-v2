import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import {
  createPlaylistPayload,
  createSearchPlaylistPayload,
} from "@/lib/jiosaavn/mappers";
import {
  JiosaavnSearchArgs,
  PlaylistCatalogItem,
  PlaylistDetail,
  RawPlaylistDetails,
  RawPlaylistSearchResponse,
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
  const data = await fetchFromJiosaavn<RawPlaylistSearchResponse>(
    endpoints.searchPlaylists,
    {
      q: query,
      p: page,
      n: limit,
    },
  );

  return {
    total: data.total ?? 0,
    start: data.start ?? 0,
    results: (data.results ?? []).map(createSearchPlaylistPayload),
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
  const data = await fetchFromJiosaavn<RawPlaylistDetails>(
    endpoints.playlistDetails,
    {
      listid: id,
      n: limit,
      p: page,
    },
  );

  return createPlaylistPayload(data, limit);
}
