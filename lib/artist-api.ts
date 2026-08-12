import { Song, Artist } from "@/music/data";

export type ArtistDetail = {
  id: string;
  name: string;
  image: { quality: string; url: string }[];
  followerCount: string;
  dominentLanguage: string;
  description: string | null;
  topSongs: Song[];
};

const BASE_URL = "/api";

interface ArtistResponse {
  success: boolean;
  data: ArtistDetail;
}

interface ArtistSearchResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Artist[];
  };
}

export async function getArtistDetail(
  id: string,
  limit = 10,
): Promise<ArtistDetail> {
  const url = `${BASE_URL}/artist?id=${encodeURIComponent(id)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch artist: ${response.status}`);
  }

  const data = (await response.json()) as ArtistResponse;
  if (!data.success) {
    throw new Error("Failed to fetch artist");
  }

  return data.data;
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

  const data = (await response.json()) as ArtistSearchResponse;
  return data.data.results;
}