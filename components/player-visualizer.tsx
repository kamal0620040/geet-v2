"use client";

import { RefObject } from "react";
import { MusicVisualizer } from "@/components/music-visualizer";
import { useMusicPlayer } from "@/lib/player-context";

interface PlayerVisualizerProps {
  timeLabelRef: RefObject<HTMLParagraphElement | null>;
}

export function PlayerVisualizer({ timeLabelRef }: PlayerVisualizerProps) {
  const { musicManager, visualizerMode } = useMusicPlayer();

  return (
    <div className="w-full max-w-62.5">
      {musicManager && (
        <MusicVisualizer
          className="w-full h-37.5"
          analyser={musicManager.analyser}
          mode={visualizerMode}
          barWidth={2}
          gap={6}
        />
      )}
      {/* Direct DOM ref write from onTimeUpdate bypasses React re-renders */}
      <p ref={timeLabelRef} className="text-xs text-blue-200 mt-2">
        --:--
      </p>
    </div>
  );
}
