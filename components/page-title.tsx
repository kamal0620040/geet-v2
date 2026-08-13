"use client";

import { useEffect } from "react";
import { useMusicPlayer } from "@/lib/player-context";

const DEFAULT_TITLE = "Geet — Neon Music Player";

export function PageTitle() {
  const { currentSong } = useMusicPlayer();

  useEffect(() => {
    if (!currentSong) return;
    const artists = currentSong.artists?.primary?.length
      ? currentSong.artists.primary.map((a) => a.name).join(", ")
      : undefined;
    document.title = artists
      ? `${currentSong.name} — ${artists} · Geet`
      : `${currentSong.name} · Geet`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [currentSong]);

  return null;
}
