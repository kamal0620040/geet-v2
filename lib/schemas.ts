import { z } from "zod";

export const imageSchema = z.object({
  quality: z.string(),
  url: z.string(),
});

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.array(imageSchema),
  type: z.literal("artist"),
  url: z.string(),
});

export const albumSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

export const songSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal("song"),
  year: z.string(),
  releaseDate: z.string().nullable(),
  duration: z.number(),
  label: z.string(),
  explicitContent: z.boolean(),
  playCount: z.number(),
  language: z.string(),
  hasLyrics: z.boolean(),
  lyricsId: z.string().nullable(),
  url: z.string(),
  copyright: z.string(),
  album: albumSchema,
  artists: z.object({
    primary: z.array(artistSchema),
    featured: z.array(artistSchema),
    all: z.array(artistSchema),
  }),
  image: z.array(imageSchema),
  downloadUrl: z.array(imageSchema),
});

export const songLyricsSchema = z.object({
  lyrics: z.string(),
  snippet: z.string().nullable(),
});

export const artistDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.array(imageSchema),
  followerCount: z.string(),
  dominentLanguage: z.string(),
  description: z.string().nullable(),
  topSongs: z.array(songSchema),
});

export const playlistArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  image: z.array(imageSchema),
  type: z.string(),
  url: z.string(),
});

export const playlistCatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  image: z.array(imageSchema),
  url: z.string(),
  songCount: z.number().nullable(),
  language: z.string(),
  explicitContent: z.boolean(),
});

export const playlistDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  year: z.number().nullable(),
  type: z.string(),
  playCount: z.number().nullable(),
  language: z.string(),
  explicitContent: z.boolean(),
  songCount: z.number().nullable(),
  url: z.string(),
  image: z.array(imageSchema),
  songs: z.array(songSchema).nullable(),
  artists: z.array(playlistArtistSchema).nullable(),
});
