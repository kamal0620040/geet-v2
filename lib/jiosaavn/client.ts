const API_URL = "https://www.jiosaavn.com/api.php";
const SEARCH_ENDPOINT = "search.getResults";
const SEARCH_PLAYLISTS_ENDPOINT = "search.getPlaylistResults";
const SEARCH_ARTISTS_ENDPOINT = "search.getArtistResults";
const PLAYLIST_DETAILS_ENDPOINT = "playlist.getDetails";
const ARTIST_DETAILS_ENDPOINT = "artist.getArtistPageDetails";
const LYRICS_ENDPOINT = "lyrics.getLyrics";
const SONG_SUGGESTIONS_ENDPOINT = "reco.getreco";

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

export const fetchFromJiosaavn = async <T>(
  endpoint: string,
  params: Record<string, string | number>,
  ctx: string = "web6dot0",
): Promise<T> => {
  const url = new URL(API_URL);
  url.searchParams.append("__call", endpoint);
  url.searchParams.append("_format", "json");
  url.searchParams.append("_marker", "0");
  url.searchParams.append("api_version", "4");
  url.searchParams.append("ctx", ctx);

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

export const endpoints = {
  search: SEARCH_ENDPOINT,
  searchPlaylists: SEARCH_PLAYLISTS_ENDPOINT,
  searchArtists: SEARCH_ARTISTS_ENDPOINT,
  playlistDetails: PLAYLIST_DETAILS_ENDPOINT,
  artistDetails: ARTIST_DETAILS_ENDPOINT,
  lyrics: LYRICS_ENDPOINT,
  songSuggestions: SONG_SUGGESTIONS_ENDPOINT,
} as const;
