import forge from "node-forge";
import { Song } from "@/music/data";

interface JiosaavnSearchArgs {
  query: string;
  page: number;
  limit: number;
}

export interface JiosaavnSearchResult {
  total: number;
  start: number;
  results: Song[];
}

interface RawArtist {
  id?: string;
  name?: string;
  role?: string;
  type?: string;
  image?: string;
  perma_url?: string;
}

interface RawSong {
  id?: string;
  title?: string;
  perma_url?: string;
  image?: string;
  language?: string;
  year?: string;
  play_count?: string;
  explicit_content?: string;
  type?: string;
  more_info?: {
    album?: string;
    album_id?: string;
    album_url?: string;
    label?: string;
    duration?: string;
    encrypted_media_url?: string;
    release_date?: string;
    has_lyrics?: string;
    lyrics_id?: string;
    lyrics_snippet?: string;
    copyright_text?: string;
    artistMap?: {
      primary_artists?: RawArtist[];
      featured_artists?: RawArtist[];
      artists?: RawArtist[];
    };
  };
}

interface RawSearchResponse {
  total?: number;
  start?: number;
  results?: RawSong[];
}

const API_URL = "https://www.jiosaavn.com/api.php";
const SEARCH_ENDPOINT = "search.getResults";
const SEARCH_PLAYLISTS_ENDPOINT = "search.getPlaylistResults";
const PLAYLIST_DETAILS_ENDPOINT = "playlist.getDetails";
const LYRICS_ENDPOINT = "lyrics.getLyrics";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 OPR/117.0.0.0",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
  "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) obsidian/1.8.4 Chrome/130.0.6723.191 Electron/33.3.2 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/134.0.6998.99 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0",
];

const randomUserAgent = () =>
  userAgents[Math.floor(Math.random() * userAgents.length)];

const fetchFromJiosaavn = async <T>(
  endpoint: string,
  params: Record<string, string | number>,
): Promise<T> => {
  const url = new URL(API_URL);
  url.searchParams.append("__call", endpoint);
  url.searchParams.append("_format", "json");
  url.searchParams.append("_marker", "0");
  url.searchParams.append("api_version", "4");
  url.searchParams.append("ctx", "web6dot0");

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, String(params[key])),
  );

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": randomUserAgent() },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`JioSaavn API responded with ${response.status}`);
  }

  return (await response.json()) as T;
};

const createDownloadLinks = (encryptedMediaUrl: string) => {
  if (!encryptedMediaUrl) return [];

  const qualities = [
    { id: "_12", bitrate: "12kbps" },
    { id: "_48", bitrate: "48kbps" },
    { id: "_96", bitrate: "96kbps" },
    { id: "_160", bitrate: "160kbps" },
    { id: "_320", bitrate: "320kbps" },
  ];

  const key = "38346591";
  const iv = "00000000";

  const encrypted = forge.util.decode64(encryptedMediaUrl);
  const decipher = forge.cipher.createDecipher(
    "DES-ECB",
    forge.util.createBuffer(key),
  );
  decipher.start({ iv: forge.util.createBuffer(iv) });
  decipher.update(forge.util.createBuffer(encrypted));
  decipher.finish();
  const decryptedLink = decipher.output.getBytes();

  return qualities.map((quality) => ({
    quality: quality.bitrate,
    url: decryptedLink.replace("_96", quality.id),
  }));
};

const createImageLinks = (link: string) => {
  if (!link) return [];

  const qualities = ["50x50", "150x150", "500x500"];
  const qualityRegex = /150x150|50x50/;
  const protocolRegex = /^http:\/\//;

  return qualities.map((quality) => ({
    quality,
    url: link.replace(qualityRegex, quality).replace(protocolRegex, "https://"),
  }));
};

const createArtistMapPayload = (artist: RawArtist) => ({
  id: artist.id ?? "",
  name: artist.name ?? "",
  role: artist.role ?? "",
  image: createImageLinks(artist.image ?? ""),
  type: "artist" as const,
  url: artist.perma_url ?? "",
});

const createSongPayload = (song: RawSong): Song => ({
  id: song.id ?? "",
  name: song.title ?? "",
  type: "song",
  year: song.year ?? "",
  releaseDate: song.more_info?.release_date ?? null,
  duration: song.more_info?.duration
    ? Number(song.more_info.duration)
    : 0,
  label: song.more_info?.label ?? "",
  explicitContent: song.explicit_content === "1",
  playCount: song.play_count ? Number(song.play_count) : 0,
  language: song.language ?? "",
  hasLyrics: song.more_info?.has_lyrics === "true",
  lyricsId:
    song.more_info?.lyrics_id ||
    (song.more_info?.has_lyrics === "true" ? song.id ?? null : null),
  url: song.perma_url ?? "",
  copyright: song.more_info?.copyright_text ?? "",
  album: {
    id: song.more_info?.album_id ?? "",
    name: song.more_info?.album ?? "",
    url: song.more_info?.album_url ?? "",
  },
  artists: {
    primary: (song.more_info?.artistMap?.primary_artists ?? []).map(
      createArtistMapPayload,
    ),
    featured: (song.more_info?.artistMap?.featured_artists ?? []).map(
      createArtistMapPayload,
    ),
    all: (song.more_info?.artistMap?.artists ?? []).map(
      createArtistMapPayload,
    ),
  },
  image: createImageLinks(song.image ?? ""),
  downloadUrl: createDownloadLinks(song.more_info?.encrypted_media_url ?? ""),
});

export async function searchSongs({
  query,
  page,
  limit,
}: JiosaavnSearchArgs): Promise<JiosaavnSearchResult> {
  const data = await fetchFromJiosaavn<RawSearchResponse>(SEARCH_ENDPOINT, {
    q: query,
    p: page,
    n: limit,
  });

  return {
    total: data.total ?? 0,
    start: data.start ?? 0,
    results: (data.results ?? []).map(createSongPayload).slice(0, limit),
  };
}

export type ImageLink = { quality: string; url: string };

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

interface RawPlaylistCatalogItem {
  id?: string;
  title?: string;
  type?: string;
  image?: string;
  perma_url?: string;
  explicit_content?: string;
  more_info?: {
    song_count?: string;
    language?: string;
  };
}

interface RawPlaylistSearchResponse {
  total?: number;
  start?: number;
  results?: RawPlaylistCatalogItem[];
}

interface RawPlaylistSong {
  id?: string;
  title?: string;
  perma_url?: string;
  language?: string;
  more_info?: {
    album?: string;
    album_id?: string;
    album_url?: string;
    label?: string;
    duration?: string;
    encrypted_media_url?: string;
    lyrics_id?: string;
  };
}

interface RawPlaylistDetails {
  id?: string;
  title?: string;
  header_desc?: string;
  type?: string;
  perma_url?: string;
  image?: string;
  language?: string;
  year?: string;
  play_count?: string;
  explicit_content?: string;
  list_count?: string;
  list?: RawPlaylistSong[];
  more_info?: {
    artists?: RawArtist[];
  };
}

interface RawLyricsResponse {
  lyrics?: string;
  snippet?: string;
  lyrics_copyright?: string;
}

const createSearchPlaylistPayload = (
  playlist: RawPlaylistCatalogItem,
): PlaylistCatalogItem => ({
  id: playlist.id ?? "",
  name: playlist.title ?? "",
  type: playlist.type ?? "",
  image: createImageLinks(playlist.image ?? ""),
  url: playlist.perma_url ?? "",
  songCount: playlist.more_info?.song_count
    ? Number(playlist.more_info.song_count)
    : null,
  language: playlist.more_info?.language ?? "",
  explicitContent: playlist.explicit_content === "1",
});

const createPlaylistPayload = (
  playlist: RawPlaylistDetails,
  limit: number,
): PlaylistDetail => ({
  id: playlist.id ?? "",
  name: playlist.title ?? "",
  description: playlist.header_desc ?? null,
  year: playlist.year ? Number(playlist.year) : null,
  type: playlist.type ?? "",
  playCount: playlist.play_count ? Number(playlist.play_count) : null,
  language: playlist.language ?? "",
  explicitContent: playlist.explicit_content === "1",
  songCount: playlist.list_count ? Number(playlist.list_count) : null,
  url: playlist.perma_url ?? "",
  image: createImageLinks(playlist.image ?? ""),
  songs: (playlist.list ?? []).slice(0, limit).map(createSongPayload),
  artists: (playlist.more_info?.artists ?? []).map(createArtistMapPayload) ?? null,
});

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
    SEARCH_PLAYLISTS_ENDPOINT,
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
    PLAYLIST_DETAILS_ENDPOINT,
    {
      listid: id,
      n: limit,
      p: page,
    },
  );

  return createPlaylistPayload(data, limit);
}

export async function getLyrics(
  lyricsId: string,
): Promise<{ lyrics: string; snippet: string | null }> {
  const data = await fetchFromJiosaavn<RawLyricsResponse>(LYRICS_ENDPOINT, {
    lyrics_id: lyricsId,
  });

  return {
    lyrics: data.lyrics ?? "",
    snippet: data.snippet ?? null,
  };
}