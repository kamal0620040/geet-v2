import { z } from "zod";
import type {
  RawArtist,
  RawArtistPageDetails,
  RawArtistSearchResponse,
  RawLyricsResponse,
  RawPlaylistCatalogItem,
  RawPlaylistDetails,
  RawPlaylistSearchResponse,
  RawSearchResponse,
  RawSong,
  RawSongMoreInfo,
  RawSuggestionsResponse,
} from "@/lib/jiosaavn/types";

export const rawArtistSchema: z.ZodType<RawArtist> = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  type: z.string(),
  image: z.string(),
  perma_url: z.string(),
});

export const rawSongMoreInfoSchema: z.ZodType<RawSongMoreInfo> = z.object({
  album: z.string(),
  album_id: z.string(),
  album_url: z.string(),
  label: z.string(),
  duration: z.string(),
  encrypted_media_url: z.string(),
  release_date: z.string().nullable(),
  has_lyrics: z.string(),
  lyrics_id: z.string().optional(),
  copyright_text: z.string(),
  artistMap: z.object({
    primary_artists: z.array(rawArtistSchema),
    featured_artists: z.array(rawArtistSchema),
    artists: z.array(rawArtistSchema),
  }),
});

export const rawSongSchema: z.ZodType<RawSong> = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string(),
  play_count: z.string(),
  explicit_content: z.string(),
  language: z.string(),
  perma_url: z.string(),
  image: z.string(),
  more_info: rawSongMoreInfoSchema,
});

export const rawSearchResponseSchema: z.ZodType<RawSearchResponse> = z.object({
  total: z.number(),
  start: z.number(),
  results: z.array(rawSongSchema),
});

export const rawArtistSearchResponseSchema: z.ZodType<RawArtistSearchResponse> =
  z.object({
    total: z.number(),
    start: z.number(),
    results: z.array(rawArtistSchema),
  });

export const rawSuggestionsResponseSchema: z.ZodType<RawSuggestionsResponse> =
  z.record(z.array(rawSongSchema));

export const rawPlaylistCatalogItemSchema: z.ZodType<RawPlaylistCatalogItem> =
  z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    image: z.string(),
    perma_url: z.string(),
    explicit_content: z.string(),
    more_info: z.object({
      song_count: z.string(),
      language: z.string(),
    }),
  });

export const rawPlaylistSearchResponseSchema: z.ZodType<RawPlaylistSearchResponse> =
  z.object({
    total: z.number(),
    start: z.number(),
    results: z.array(rawPlaylistCatalogItemSchema),
  });

export const rawPlaylistDetailsSchema: z.ZodType<RawPlaylistDetails> = z.object({
  id: z.string(),
  title: z.string(),
  header_desc: z.string(),
  type: z.string(),
  perma_url: z.string(),
  image: z.string(),
  language: z.string(),
  year: z.string(),
  play_count: z.string(),
  explicit_content: z.string(),
  list_count: z.string(),
  list: z.array(rawSongSchema),
  more_info: z.object({
    artists: z.array(rawArtistSchema),
  }),
});

export const rawLyricsResponseSchema: z.ZodType<RawLyricsResponse> = z.object({
  lyrics: z.string(),
  script_tracking_url: z.string(),
  lyrics_copyright: z.string(),
  snippet: z.string(),
});

export const rawArtistBioEntrySchema = z.object({
  text: z.string(),
  sequence: z.number(),
  title: z.string(),
});

export const rawArtistBioSchema = z.array(rawArtistBioEntrySchema);

export const rawArtistPageDetailsSchema: z.ZodType<RawArtistPageDetails> =
  z.object({
    artistId: z.string(),
    name: z.string(),
    image: z.string(),
    follower_count: z.string(),
    dominantLanguage: z.string(),
    bio: z.string(),
    topSongs: z.array(rawSongSchema),
  });
