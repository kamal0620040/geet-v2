import { Song } from "@/music/data";

const BASE_URL = "/api";

export const DEFAULT_QUERY = "top song";

interface SearchSongsResponse {
  success: boolean;
  data: {
    total: number;
    start: number;
    results: Song[];
  };
}

export async function searchSongs(query: string, limit = 10): Promise<Song[]> {
  const url = `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search songs: ${response.status}`);
  }

  const data = (await response.json()) as SearchSongsResponse;
  return data.data.results;
}
