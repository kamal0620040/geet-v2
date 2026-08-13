import { fetchFromJiosaavn, endpoints } from "@/lib/jiosaavn/client";
import {
  createArtistDetailPayload,
  createArtistMapPayload,
} from "@/lib/jiosaavn/mappers";
import { Artist } from "@/music/data";
import {
  rawArtistPageDetailsSchema,
  rawArtistSearchResponseSchema,
} from "@/lib/jiosaavn/schemas";
import { ArtistDetail, JiosaavnSearchArgs } from "@/lib/jiosaavn/types";

export async function searchArtists({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<{
  total: number;
  start: number;
  results: Artist[];
}> {
  const data = await fetchFromJiosaavn(
    endpoints.searchArtists,
    {
      q: query,
      p: page,
      n: limit,
    },
    rawArtistSearchResponseSchema,
  );

  return {
    total: data.total,
    start: data.start,
    results: data.results.map(createArtistMapPayload),
  };
}

export async function getArtistById({
  id,
  limit,
}: {
  id: string;
  limit: number;
}): Promise<ArtistDetail> {
  const data = await fetchFromJiosaavn(
    endpoints.artistDetails,
    {
      artistId: id,
      n_songs: limit,
      n_albums: 10,
      n_charts: 10,
    },
    rawArtistPageDetailsSchema,
  );

  return createArtistDetailPayload(data);
}