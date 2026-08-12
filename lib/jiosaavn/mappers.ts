import forge from "node-forge";
import { Song } from "@/music/data";
import { decodeHtmlEntities } from "@/lib/utils";
import {
  PlaylistCatalogItem,
  PlaylistDetail,
  RawArtist,
  RawPlaylistCatalogItem,
  RawPlaylistDetails,
  RawSong,
} from "@/lib/jiosaavn/types";

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
  name: decodeHtmlEntities(artist.name ?? ""),
  role: artist.role ?? "",
  image: createImageLinks(artist.image ?? ""),
  type: "artist" as const,
  url: artist.perma_url ?? "",
});

const createAlbumLabel = (text?: string) => decodeHtmlEntities(text ?? "");

const createSongPayload = (song: RawSong): Song => ({
  id: song.id ?? "",
  name: decodeHtmlEntities(song.title ?? ""),
  type: "song",
  year: song.year ?? "",
  releaseDate: song.more_info?.release_date ?? null,
  duration: song.more_info?.duration
    ? Number(song.more_info.duration)
    : 0,
  label: createAlbumLabel(song.more_info?.label),
  explicitContent: song.explicit_content === "1",
  playCount: song.play_count ? Number(song.play_count) : 0,
  language: song.language ?? "",
  hasLyrics: song.more_info?.has_lyrics === "true",
  lyricsId:
    song.more_info?.lyrics_id ||
    (song.more_info?.has_lyrics === "true" ? song.id ?? null : null),
  url: song.perma_url ?? "",
  copyright: createAlbumLabel(song.more_info?.copyright_text),
  album: {
    id: song.more_info?.album_id ?? "",
    name: createAlbumLabel(song.more_info?.album),
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

const createSearchPlaylistPayload = (
  playlist: RawPlaylistCatalogItem,
): PlaylistCatalogItem => ({
  id: playlist.id ?? "",
  name: decodeHtmlEntities(playlist.title ?? ""),
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
  name: decodeHtmlEntities(playlist.title ?? ""),
  description: playlist.header_desc
    ? decodeHtmlEntities(playlist.header_desc)
    : null,
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

export {
  createArtistMapPayload,
  createDownloadLinks,
  createImageLinks,
  createPlaylistPayload,
  createSearchPlaylistPayload,
  createSongPayload,
};
