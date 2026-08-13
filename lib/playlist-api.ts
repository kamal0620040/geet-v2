import { z } from "zod";
import {
  playlistCatalogItemSchema,
  playlistDetailSchema,
} from "@/lib/schemas";

export type ImageLink = z.infer<typeof playlistCatalogItemSchema>["image"][number];

export type PlaylistCatalogItem = z.infer<typeof playlistCatalogItemSchema>;

export type PlaylistArtist = NonNullable<
  z.infer<typeof playlistDetailSchema>["artists"]
>[number];

export type PlaylistDetail = z.infer<typeof playlistDetailSchema>;

const playlistSearchEnvelopeSchema = z.object({
  success: z.literal(true),
  data: z.object({
    total: z.number(),
    start: z.number(),
    results: z.array(playlistCatalogItemSchema),
  }),
});

const playlistDetailEnvelopeSchema = z.object({
  success: z.literal(true),
  data: playlistDetailSchema,
});

async function getJson<T extends z.ZodType<{ success: boolean; data: unknown }>>(
  url: string,
  schema: T,
): Promise<z.infer<T>["data"]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = await response.json();
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Request failed");
  }

  return parsed.data.data;
}

export async function searchPlaylists(
  query: string,
  limit = 10,
): Promise<PlaylistCatalogItem[]> {
  const data = await getJson(
    `/api/search/playlists?query=${encodeURIComponent(query)}&limit=${limit}`,
    playlistSearchEnvelopeSchema,
  );
  return data.results;
}

export async function getPlaylist(
  id: string,
  limit = 50,
): Promise<PlaylistDetail> {
  return getJson(
    `/api/playlist?id=${encodeURIComponent(id)}&limit=${limit}`,
    playlistDetailEnvelopeSchema,
  );
}
