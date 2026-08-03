"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { MusicManager, EqSettings } from "@/lib/music-manager";
import { QueueItem } from "@/lib/queue-manager";
import { VisualizerMode } from "@/components/music-visualizer";

export interface MusicPlayerContextValue {
  musicManager: MusicManager | null;
  songs: QueueItem[];
  setSongs: Dispatch<SetStateAction<QueueItem[]>>;
  loading: boolean;
  error: string | null;
  currentSong: QueueItem | undefined;

  visualizerMode: VisualizerMode;
  setVisualizerMode: (mode: VisualizerMode) => void;

  eq: EqSettings;
  setEq: (eq: EqSettings) => void;

  favoriteSongs: QueueItem[];
  toggleFavorite: (song: QueueItem) => void;
  isFavorite: (songId: string) => boolean;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MusicPlayerContextValue;
}) {
  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
