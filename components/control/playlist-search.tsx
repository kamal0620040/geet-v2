"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { QueueItem } from "@/lib/queue-manager";
import { useMusicPlayer } from "@/lib/player-context";
import {
  searchPlaylists,
  getPlaylist,
  PlaylistCatalogItem,
  PlaylistDetail,
} from "@/lib/playlist-api";
import { SongItem } from "@/components/control/song-list";

export function PlaylistSearch() {
  const { musicManager, setSongs, toggleFavorite, isFavorite } = useMusicPlayer();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistCatalogItem[]>([]);
  const [detail, setDetail] = useState<PlaylistDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || searching) return;

    setSearching(true);
    setError(null);
    setPlaylists([]);
    try {
      const results = await searchPlaylists(q);
      setPlaylists(results);
    } catch (err) {
      console.error("Failed to search playlists:", err);
      setError("Failed to search playlists.");
    } finally {
      setSearching(false);
    }
  };

  const onSelect = async (playlist: PlaylistCatalogItem) => {
    setLoadingDetail(true);
    setError(null);
    try {
      const result = await getPlaylist(playlist.id);
      setDetail(result);
    } catch (err) {
      console.error("Failed to load playlist:", err);
      setError("Failed to load playlist.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const playSongs = (songs: QueueItem[]) => {
    if (!musicManager || songs.length === 0) return;
    musicManager.queueManager.setSongs(songs);
    setSongs(songs);
    musicManager.queueManager.setIndex(songs[0].id);
    void musicManager.play().catch(() => {});
  };

  const onPlaySong = (item: QueueItem) => {
    if (!musicManager || !detail?.songs?.length) return;
    musicManager.queueManager.setSongs(detail.songs);
    setSongs(detail.songs);
    musicManager.queueManager.setIndex(item.id);
    void musicManager.play().catch(() => {});
  };

  if (detail) {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setDetail(null)}
          className="self-start text-xs text-purple-200/60 hover:text-purple-200 transition-colors cursor-pointer"
        >
          &larr; Back to search
        </button>

        <div className="flex flex-row items-center gap-3 rounded-xl p-2">
          {detail.image && detail.image.length > 0 && (
            <Image
              src={detail.image[detail.image.length - 1].url}
              alt="cover"
              className="size-14 rounded-md shrink-0"
              width={56}
              height={56}
            />
          )}
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium truncate">{detail.name}</p>
            <p className="text-xs text-purple-200/70 truncate">
              {detail.songCount ?? detail.songs?.length ?? 0} songs
            </p>
          </div>
        </div>

        {detail.songs && detail.songs.length > 0 && (
          <button
            onClick={() => playSongs(detail.songs ?? [])}
            className="flex flex-row items-center justify-center gap-2 rounded-lg bg-purple-500/30 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-purple-500/40 transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Play All
          </button>
        )}

        <div className="scrollbar-purple flex flex-col max-h-60 overflow-y-auto -mx-1 pr-1">
          {(detail.songs ?? []).map((song) => (
            <SongItem
              key={song.id}
              song={song}
              playing={song.id === musicManager?.queueManager.getCurrentSong()?.id}
              favorited={isFavorite(song.id)}
              onPlay={onPlaySong}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                toggleFavorite(song);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={onSearch} className="flex flex-row gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search playlists..."
          className="min-w-0 flex-1 rounded-md bg-purple-200/10 px-3 py-2 text-sm outline-none placeholder:text-purple-200/50 focus:bg-purple-200/15"
        />
        <button
          type="submit"
          aria-label="Search playlists"
          className="rounded-md bg-purple-200/10 px-3 py-2 text-purple-200 transition-colors hover:bg-purple-200/20 focus-visible:outline-none cursor-pointer"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>

      {searching ? (
        <PlaylistSkeleton />
      ) : error ? (
        <p className="text-xs text-red-300">{error}</p>
      ) : loadingDetail ? (
        <PlaylistSkeleton />
      ) : (
        <div className="scrollbar-purple flex flex-col max-h-70 overflow-y-auto -mx-1 pr-1">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onSelect(playlist)}
              className="group flex flex-row items-center gap-3 rounded-xl p-2 transition-colors cursor-pointer hover:bg-purple-200/5"
            >
              {playlist.image.length > 0 && (
                <Image
                  alt="cover"
                  src={playlist.image[playlist.image.length - 1].url}
                  className={cn(
                    "size-12 shrink-0 rounded-md",
                    playlist.image.length > 1 && "bg-purple-200/10",
                  )}
                  width={48}
                  height={48}
                />
              )}
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-medium truncate">{playlist.name}</p>
                <p className="text-xs text-purple-200/70 truncate">
                  {playlist.songCount ?? "?"} songs
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-200/40"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
          {!searching && !playlists.length && (
            <p className="text-xs text-purple-200/50 text-center py-8">
              Search for playlists by name.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="scrollbar-purple flex flex-col max-h-70 overflow-y-auto -mx-1 pr-1">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-row items-center gap-4 rounded-xl p-2">
          <div className="animate-shimmer size-12 shrink-0 rounded-md" />
          <div className="flex flex-col gap-2">
            <div className="animate-shimmer h-3.5 w-36 rounded-md" />
            <div className="animate-shimmer h-3 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}