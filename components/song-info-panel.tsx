"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMusicPlayer } from "@/lib/player-context";
import { SongDisplay, SongDisplaySkeleton } from "@/components/song-display";
import { Timeline, DurationControl } from "@/components/control/timeline";
import { LyricsPanel } from "@/components/control/lyrics";
import { RefObject } from "react";

interface SongInfoPanelProps {
  timelineRef: RefObject<DurationControl | undefined>;
}

export function SongInfoPanel({ timelineRef }: SongInfoPanelProps) {
  const { musicManager, loading, error, currentSong } = useMusicPlayer();
  const [showLyrics, setShowLyrics] = useState(false);
  const [songInfo, setSongInfo] = useState<{ id?: string; changed: boolean }>({
    id: currentSong?.id,
    changed: false,
  });

  if (currentSong?.id !== songInfo.id) {
    setSongInfo({ id: currentSong?.id, changed: true });
  }

  const songChanged = songInfo.changed;

  return (
    <div className="w-full max-w-125 mt-6">
      <Timeline musicManager={musicManager ?? undefined} durationRef={timelineRef} />

      <div className="flex flex-row items-start justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <SongDisplaySkeleton />
          ) : currentSong ? (
            <SongDisplay key={currentSong.id} song={currentSong} />
          ) : error ? (
            <p key="error" className="text-sm text-red-300 mt-4">{error}</p>
          ) : null}
        </AnimatePresence>

        {currentSong && (
          <button
            onClick={() => {
              setShowLyrics((v) => !v);
              setSongInfo((s) => ({ ...s, changed: false }));
            }}
            aria-pressed={showLyrics}
            className="mt-4 shrink-0 rounded-md bg-purple-200/10 px-2.5 py-1.5 text-[11px] font-medium text-purple-200 transition-colors hover:bg-purple-200/20 cursor-pointer"
          >
            {showLyrics ? "Hide Lyrics" : "Lyrics"}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showLyrics && currentSong && (
          <motion.div
            key={currentSong.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: songChanged ? 0.35 : 0,
            }}
            className="overflow-hidden"
          >
            <LyricsPanel song={currentSong} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
