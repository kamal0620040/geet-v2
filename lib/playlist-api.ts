import { Song } from "@/music/data";

export interface ImageLink {
  quality: string;
  url: string;
}

export interface PlaylistCatalogItem {
  id: string;
  name: string;
  type: string;
  image: ImageLink[];
  url: string;
  songCount: number | null;
  language: string;
  explicitContent: boolean;
}

export interface PlaylistArtist {
  id: string;
  name: string;
  role: string;
  image: ImageLink[];
  type: string;
  url: string;
}

export interface PlaylistDetail {
  id: string;
  name: string;
  description: string | null;
  year: number | null;
  type: string;
  playCount: number | null;
  language: string;
  explicitContent: boolean;
  songCount: number | null;
  url: string;
  image: ImageLink[];
  songs: Song[] | null;
  artists: PlaylistArtist[] | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new Error("Request failed");
  }

  return json.data;
}

export async function searchPlaylists(
  query: string,
  limit = 10,
): Promise<PlaylistCatalogItem[]> {
  const data = await getJson<{ total: number; start: number; results: PlaylistCatalogItem[] }>(
    `/api/search/playlists?query=${encodeURIComponent(query)}&limit=${limit}`,
  );
  return data.results;
}

export async function getPlaylist(
  id: string,
  limit = 50,
): Promise<PlaylistDetail> {
  return getJson<PlaylistDetail>(
    `/api/playlist?id=${encodeURIComponent(id)}&limit=${limit}`,
  );
}