"use client";

import { motion } from "framer-motion";
import { MusicPlayerProvider } from "@/lib/player-context";
import { useMusicPlayerState } from "@/hooks/use-music-player-state";
import { AnimatedTitle } from "@/components/animated-title";
import { SongInfoPanel } from "@/components/song-info-panel";
import { PlayerVisualizer } from "@/components/player-visualizer";
import { DynamicBackground } from "@/components/dynamic-background";
import { FileDropzone } from "@/components/control/file-dropzone";
import { Menu } from "@/components/menu";

export default function MusicPlayer() {
  const {
    timeLabelRef,
    timelineRef,
    paused,
    musicManager,
    songs,
    setSongs,
    loading,
    error,
    currentSong,
    visualizerMode,
    setVisualizerMode,
    eq,
    setEq,
    favoriteSongs,
    toggleFavorite,
    isFavorite,
    radioActive,
    startRadio,
    stopRadio,
    gradientColors,
    handleCanvasClick,
  } = useMusicPlayerState();

  return (
    <MusicPlayerProvider
      value={{
        musicManager: musicManager ?? null,
        songs,
        setSongs,
        loading,
        error,
        currentSong,
        visualizerMode,
        setVisualizerMode,
        eq,
        setEq,
        favoriteSongs,
        toggleFavorite,
        isFavorite,
        radioActive,
        startRadio,
        stopRadio,
      }}
    >
      <FileDropzone />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        className="relative flex flex-col h-svh px-12 py-16 z-2 text-purple-100 md:p-24 select-none"
        onMouseDown={handleCanvasClick}
      >
        <AnimatedTitle text={paused ? "Click to Play" : "Geet"} />

        <SongInfoPanel timelineRef={timelineRef} />

        <div className="flex flex-row gap-4 mt-auto items-end justify-center md:justify-between">
          {musicManager && <Menu />}
          <PlayerVisualizer timeLabelRef={timeLabelRef} />
        </div>

        <DynamicBackground gradientColors={gradientColors} />
      </motion.main>
    </MusicPlayerProvider>
  );
}
