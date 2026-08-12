import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import {
  createArtistDetailPayload,
  createArtistMapPayload,
} from "@/lib/jiosaavn/mappers";
import { Artist } from "@/music/data";
import {
  ArtistDetail,
  JiosaavnSearchArgs,
  RawArtist,
  RawArtistPageDetails,
} from "@/lib/jiosaavn/types";

interface RawArtistSearchResponse {
  total?: number;
  start?: number;
  results?: RawArtist[];
}

export async function searchArtists({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<{
  total: number;
  start: number;
  results: Artist[];
}> {
  const data = await fetchFromJiosaavn<RawArtistSearchResponse>(
    endpoints.searchArtists,
    {
      q: query,
      p: page,
      n: limit,
    },
  );

  return {
    total: data.total ?? 0,
    start: data.start ?? 0,
    results: (data.results ?? []).map(createArtistMapPayload),
  };
}

export async function getArtistById({
  id,
  limit,
}: {
  id: string;
  limit: number;
}): Promise<ArtistDetail> {
  const data = await fetchFromJiosaavn<RawArtistPageDetails>(
    endpoints.artistDetails,
    {
      artistId: id,
      n_songs: limit,
      n_albums: 10,
      n_charts: 10,
    },
  );

  return createArtistDetailPayload(data);
}