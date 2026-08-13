import { Song } from "@/music/data";

export interface JiosaavnSearchArgs {
  query: string;
  page: number;
  limit: number;
}

export interface JiosaavnSearchResult {
  total: number;
  start: number;
  results: Song[];
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

export interface ArtistDetail {
  id: string;
  name: string;
  image: ImageLink[];
  followerCount: string;
  dominentLanguage: string;
  description: string | null;
  topSongs: Song[];
}

export interface SongLyrics {
  lyrics: string;
  snippet: string | null;
}

export interface RawArtist {
  id: string;
  name: string;
  role: string;
  type: string;
  image: string;
  perma_url: string;
}

export interface RawSongMoreInfo {
  album: string;
  album_id: string;
  album_url: string;
  label: string;
  duration: string;
  encrypted_media_url: string;
  release_date: string | null;
  has_lyrics: string;
  lyrics_id?: string;
  copyright_text: string;
  artistMap: {
    primary_artists: RawArtist[];
    featured_artists: RawArtist[];
    artists: RawArtist[];
  };
}

export interface RawSong {
  id: string;
  title: string;
  year: string;
  play_count: string;
  explicit_content: string;
  language: string;
  perma_url: string;
  image: string;
  more_info: RawSongMoreInfo;
}

export interface RawSearchResponse {
  total: number;
  start: number;
  results: RawSong[];
}

export interface RawArtistSearchResponse {
  total: number;
  start: number;
  results: RawArtist[];
}

export interface RawSuggestionsResponse {
  [songId: string]: RawSong[];
}

export interface RawPlaylistCatalogItem {
  id: string;
  title: string;
  type: string;
  image: string;
  perma_url: string;
  explicit_content: string;
  more_info: {
    song_count: string;
    language: string;
  };
}

export interface RawPlaylistSearchResponse {
  total: number;
  start: number;
  results: RawPlaylistCatalogItem[];
}

export interface RawPlaylistDetails {
  id: string;
  title: string;
  header_desc: string;
  type: string;
  perma_url: string;
  image: string;
  language: string;
  year: string;
  play_count: string;
  explicit_content: string;
  list_count: string;
  list: RawSong[];
  more_info: {
    artists: RawArtist[];
  };
}

export interface RawLyricsResponse {
  lyrics: string;
  script_tracking_url: string;
  lyrics_copyright: string;
  snippet: string;
}

export interface RawArtistPageDetails {
  artistId: string;
  name: string;
  image: string;
  follower_count: string;
  dominantLanguage: string;
  bio: string;
  topSongs: RawSong[];
}

