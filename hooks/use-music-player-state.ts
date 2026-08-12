"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { createMusicManager, MusicManager, EqSettings } from "@/lib/music-manager";
import { createShortcutManager } from "@/lib/shortcut-manager";
import { formatSeconds } from "@/lib/format";
import { QueueItem } from "@/lib/queue-manager";
import { searchSongs, DEFAULT_QUERY } from "@/lib/song-api";
import { DurationControl } from "@/components/control/timeline";
import { setupMediaSession, updateMediaSessionMetadata } from "@/lib/media-session";
import { VisualizerMode } from "@/components/music-visualizer";
import { extractColorsFromSong, generatePaletteFromSeed } from "@/lib/color-extractor";

export function useMusicPlayerState() {
  const timelineRef = useRef<DurationControl | undefined>(undefined);
  const timeLabelRef = useRef<HTMLParagraphElement>(null);

  const [currentIndex, setCurrentIndex] = useState("-1");
  const [paused, setPaused] = useState(true);
  const [musicManager, setMusicManager] = useState<MusicManager>();
  const [songs, setSongs] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>("spectrum");
  const [eq, setEqState] = useState<EqSettings>({ bass: 0, mid: 0, treble: 0 });
  const [favoriteSongs, setFavoriteSongs] = useState<QueueItem[]>([]);

  const [gradientColors, setGradientColors] = useState<[string, string, string]>(() =>
    generatePaletteFromSeed(DEFAULT_QUERY)
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("neon_wave_favorite_songs");
      if (savedFavs) {
        try {
          const parsed = JSON.parse(savedFavs);
          if (Array.isArray(parsed)) setFavoriteSongs(parsed);
        } catch {}
      }
      const savedMode = localStorage.getItem("neon_wave_vis_mode") as VisualizerMode;
      if (savedMode) setVisualizerMode(savedMode);
    }
  }, []);

  useEffect(() => {
    const manager = createMusicManager({
      onStateChange: () => {
        setPaused(manager.isPaused());
      },
      onTimeUpdate: (currentTime, duration) => {
        if (timeLabelRef.current) {
          timeLabelRef.current.innerText = formatSeconds(currentTime);
        }
        timelineRef.current?.((currentTime / duration) * 100);
      },
      onNext: (song) => {
        setCurrentIndex(song?.id ?? "-1");
        updateMediaSessionMetadata(song);
      },
    });

    setupMediaSession(manager);
    const shortcut = createShortcutManager({ musicManager: manager });
    shortcut.bind();
    setMusicManager(manager);

    let cancelled = false;
    searchSongs(DEFAULT_QUERY, 20)
      .then((results) => {
        if (cancelled) return;
        manager.queueManager.setSongs(results);
        manager.queueManager.setIndex(results[0]?.id ?? "");
        setSongs(results);
        updateMediaSessionMetadata(results[0]);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Initial song fetch failed:", err);
        setError("Failed to load songs. Please try searching for a track.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      shortcut.destroy();
      manager.destroy();
    };
  }, []);

  const currentSong = musicManager?.queueManager.songs.find(
    (song) => song.id === currentIndex,
  );

  useEffect(() => {
    if (!currentSong) return;
    const coverUrl = currentSong.image?.[currentSong.image.length - 1]?.url;
    extractColorsFromSong(coverUrl, currentSong.id || currentSong.name).then((colors) => {
      setGradientColors(colors);
    });
  }, [currentSong]);

  const handleSetEq = (newEq: EqSettings) => {
    setEqState(newEq);
    musicManager?.setEq(newEq.bass, newEq.mid, newEq.treble);
  };

  const handleSetVisualizerMode = (mode: VisualizerMode) => {
    setVisualizerMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("neon_wave_vis_mode", mode);
    }
  };

  const toggleFavorite = (song: QueueItem) => {
    setFavoriteSongs((prev) => {
      const exists = prev.some((s) => s.id === song.id);
      const next = exists
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song];

      if (typeof window !== "undefined") {
        localStorage.setItem("neon_wave_favorite_songs", JSON.stringify(next));
      }
      return next;
    });
  };

  const isFavorite = (songId: string) => favoriteSongs.some((s) => s.id === songId);

  const handleCanvasClick = (e: MouseEvent) => {
    if (!musicManager || e.button !== 0) return;

    const target = e.target as Element;
    const isInteractive = target.closest(
      "button, input, a, [role='dialog'], [data-radix-popper-content-wrapper], .cursor-pointer, .lyrics-panel"
    );

    if (isInteractive) return;

    if (musicManager.isPaused()) void musicManager.play();
    else musicManager.pause();
    e.preventDefault();
  };

  return {
    timelineRef,
    timeLabelRef,
    paused,
    musicManager,
    songs,
    setSongs,
    loading,
    error,
    currentSong,
    visualizerMode,
    setVisualizerMode: handleSetVisualizerMode,
    eq,
    setEq: handleSetEq,
    favoriteSongs,
    toggleFavorite,
    isFavorite,
    gradientColors,
    handleCanvasClick,
  };
}
