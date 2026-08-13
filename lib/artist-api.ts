import { z } from "zod";
import { artistDetailSchema } from "@/lib/schemas";

export type ArtistDetail = z.infer<typeof artistDetailSchema>;

const BASE_URL = "/api";

const artistResponseSchema = z.object({
  success: z.literal(true),
  data: artistDetailSchema,
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
