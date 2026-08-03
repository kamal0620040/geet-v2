"use client";

import { FormEvent, useState } from "react";
import { searchSongs } from "@/lib/song-api";
import { SongList } from "@/components/control/song-list";
import { useMusicPlayer } from "@/lib/player-context";

export function SongSearch() {
  const { musicManager, songs, setSongs } = useMusicPlayer();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || searching || !musicManager) return;

    setSearching(true);
    try {
      const [found] = await Promise.all([
        searchSongs(q),
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);
      musicManager.queueManager.setSongs(found);
      musicManager.queueManager.setIndex(found[0]?.id ?? "");
      setSongs(found);
      void musicManager.play().catch(() => {});
    } catch (err) {
      console.error("Failed to search songs:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={onSearch} className="flex flex-row gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs..."
          className="min-w-0 flex-1 rounded-md bg-purple-200/10 px-3 py-2 text-sm outline-none placeholder:text-purple-200/50 focus:bg-purple-200/15"
        />
        <button
          type="submit"
          aria-label="Search"
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
      {searching ? <SongSkeleton /> : <SongList />}
    </div>
  );
}

function SongSkeleton() {
  return (
    <div className="scrollbar-purple flex flex-col max-h-70 overflow-y-auto -mx-1 pr-1">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="flex flex-row items-center gap-4 rounded-xl p-2"
        >
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
