"use client";

import { cn, decodeHtmlEntities } from "@/lib/utils";
import { QueueItem } from "@/lib/queue-manager";
import Image from "next/image";
import { useMusicPlayer } from "@/lib/player-context";
import { MouseEvent } from "react";

export function SongList() {
  const { musicManager, songs, toggleFavorite, isFavorite } = useMusicPlayer();

  if (!musicManager) return null;

  const currentSong = musicManager.queueManager.getCurrentSong();
  const onPlay = (item: QueueItem) => {
    musicManager.queueManager.setIndex(item.id);
    musicManager.play();
  };

  return (
    <div className="scrollbar-purple flex flex-col max-h-70 overflow-y-auto -mx-1 pr-1">
      {songs.map((song) => (
        <Item
          key={song.id}
          song={song}
          playing={song.id === currentSong?.id}
          favorited={isFavorite(song.id)}
          onPlay={onPlay}
          onToggleFavorite={(e) => {
            e.stopPropagation();
            toggleFavorite(song);
          }}
        />
      ))}
    </div>
  );
}

export function FavoritesList() {
  const { musicManager, favoriteSongs, toggleFavorite, isFavorite, setSongs } = useMusicPlayer();

  if (!musicManager) return null;

  const currentSong = musicManager.queueManager.getCurrentSong();

  const onPlayFavorite = (item: QueueItem) => {
    // Load ALL favorite songs into the queue so they play sequentially
    musicManager.queueManager.setSongs(favoriteSongs);
    setSongs(favoriteSongs);
    musicManager.queueManager.setIndex(item.id);
    void musicManager.play().catch(() => {});
  };

  const onPlayAll = () => {
    if (favoriteSongs.length === 0) return;
    musicManager.queueManager.setSongs(favoriteSongs);
    setSongs(favoriteSongs);
    musicManager.queueManager.setIndex(favoriteSongs[0].id);
    void musicManager.play().catch(() => {});
  };

  if (favoriteSongs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center px-4">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-purple-200/40 mb-2"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <p className="text-xs font-medium text-purple-200/80">No Favorites Yet</p>
        <p className="text-[11px] text-purple-200/50 mt-1">
          Click the heart icon on any song to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Play All Favorites Button */}
      <button
        onClick={onPlayAll}
        className="flex flex-row items-center justify-center gap-2 rounded-lg bg-purple-500/30 px-3 py-1.5 text-xs font-medium text-purple-100 hover:bg-purple-500/40 transition-colors cursor-pointer"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        Play All Favorites
      </button>

      <div className="scrollbar-purple flex flex-col max-h-60 overflow-y-auto -mx-1 pr-1">
        {favoriteSongs.map((song) => (
          <Item
            key={song.id}
            song={song}
            playing={song.id === currentSong?.id}
            favorited={isFavorite(song.id)}
            onPlay={onPlayFavorite}
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

function Item({
  song,
  playing,
  favorited,
  onPlay,
  onToggleFavorite,
}: {
  song: QueueItem;
  playing: boolean;
  favorited: boolean;
  onPlay: (item: QueueItem) => void;
  onToggleFavorite: (e: MouseEvent) => void;
}) {
  return (
    <div
      className={cn(
        "group flex flex-row items-center gap-3 rounded-xl p-2 transition-colors cursor-pointer",
        playing ? "bg-purple-400/20" : "hover:bg-purple-200/5",
      )}
      onClick={() => onPlay(song)}
    >
      {song.image && (
        <Image
          alt="cover"
          src={song.image[song.image.length - 1].url}
          className="size-12 rounded-md shrink-0"
          width={48}
          height={48}
        />
      )}
      <div className="min-w-0 flex-1 text-left">
        <p className="text-sm font-medium truncate">
          {decodeHtmlEntities(song.name)}
        </p>
        <p className="text-xs text-purple-200/70 truncate">
          {song.artists?.primary
            ?.slice(0, 2)
            ?.map((e) => e.name)
            ?.join(", ")}
        </p>
      </div>
      <button
        type="button"
        aria-label="Favorite song"
        onClick={onToggleFavorite}
        className="p-1 text-purple-200/40 hover:text-pink-400 transition-colors cursor-pointer"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={favorited ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={favorited ? "text-pink-400" : ""}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>
    </div>
  );
}