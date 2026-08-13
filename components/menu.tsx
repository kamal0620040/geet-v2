"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SongSearch } from "@/components/control/song-search";
import { FavoritesList } from "@/components/control/song-list";
import { PlaylistSearch } from "@/components/control/playlist-search";
import { TimeControls } from "@/components/control/time-controls";
import { RadioControl } from "@/components/control/radio-control";
import { Equalizer } from "@/components/control/equalizer";
import { useMusicPlayer } from "@/lib/player-context";
import { m, AnimatePresence } from "framer-motion";

type MenuTab = "tracks" | "favorites" | "playlists" | "settings";

export function Menu() {
  const { musicManager, favoriteSongs } = useMusicPlayer();
  const [activeTab, setActiveTab] = useState<MenuTab>("tracks");

  if (!musicManager) return null;

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Menu"
        className="inline-flex items-center gap-2 text-sm font-medium p-2 -m-2 rounded-md transition-colors hover:bg-purple-200/20 focus-visible:outline-none cursor-pointer max-md:absolute max-md:top-8 max-md:right-8"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        Menu
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-80 p-3 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-row gap-1 bg-purple-200/10 p-1 rounded-lg mb-3">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "tracks"
                ? "bg-purple-500/40 text-purple-100 shadow-sm"
                : "text-purple-200/60 hover:text-purple-200"
            }`}
          >
            Tracks
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === "favorites"
                ? "bg-purple-500/40 text-purple-100 shadow-sm"
                : "text-purple-200/60 hover:text-purple-200"
            }`}
          >
            Favorites
            {favoriteSongs.length > 0 && (
              <span className="text-[10px] bg-pink-500/40 px-1.5 py-0.2 rounded-full font-bold">
                {favoriteSongs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("playlists")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "playlists"
                ? "bg-purple-500/40 text-purple-100 shadow-sm"
                : "text-purple-200/60 hover:text-purple-200"
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-purple-500/40 text-purple-100 shadow-sm"
                : "text-purple-200/60 hover:text-purple-200"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Animated Height Container */}
        <m.div
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        >
          <AnimatePresence mode="wait">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "tracks" && <SongSearch />}
              {activeTab === "favorites" && <FavoritesList />}
              {activeTab === "playlists" && <PlaylistSearch />}
              {activeTab === "settings" && <Equalizer />}
            </m.div>
          </AnimatePresence>
        </m.div>

        {/* Persistent Bottom Time Controls */}
        <div className="border-t border-purple-200/10 pt-2 mt-3 flex justify-between items-center">
          <TimeControls />
          <RadioControl />
        </div>
      </PopoverContent>
    </Popover>
  );
}
