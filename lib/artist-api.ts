import { z } from "zod";
import {
  artistDetailSchema,
  artistSchema,
} from "@/lib/schemas";
import { Artist } from "@/music/data";

export type ArtistDetail = z.infer<typeof artistDetailSchema>;

const BASE_URL = "/api";

const artistResponseSchema = z.object({
  success: z.literal(true),
  data: artistDetailSchema,
});

const artistSearchResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number(),
    start: z.number(),
    results: z.array(artistSchema),
  }),
});

export async function getArtistDetail(
  id: string,
  limit = 10,
): Promise<ArtistDetail> {
  const url = `${BASE_URL}/artist?id=${encodeURIComponent(id)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch artist: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = artistResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Failed to fetch artist");
  }

  return parsed.data.data;
}

export async function searchArtists(
  query: string,
  limit = 10,
): Promise<Artist[]> {
  const url = `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search artists: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = artistSearchResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Failed to search artists");
  }

  return parsed.data.data.results;
}
