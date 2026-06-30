"use client";

import { useEffect, useRef, useState } from "react";
import Gradient from "@/components/gradient";
import { Song } from "@/music/data";
import { createMusicManager, MusicManager } from "@/lib/music-manager";
import { createShortcutManager } from "@/lib/shortcut-manager";
import { MusicVisualizer } from "@/components/music-visualizer";
import Image from "next/image";

export default function MusicPlayer() {
  const durationRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<MusicManager | null>(null);

  const [song, setSong] = useState<Song>();
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const duration = durationRef.current;

    if (!duration) {
      return;
    }

    const manager = createMusicManager({
      duration,
      onNext: setSong,
    });

    const shortcut = createShortcutManager({
      musicManager: manager,
    });

    managerRef.current = manager;

    manager.init();
    shortcut.bind();

    setAnalyser(manager.analyser);

    return () => {
      shortcut.destroy();
      manager.destroy();

      managerRef.current = null;
      setAnalyser(null);
    };
  }, []);

  const onClick = () => {
    const manager = managerRef.current;

    if (!manager) {
      return;
    }

    if (manager.isPaused()) {
      manager.play();
    } else {
      manager.pause();
    }
  };

  return (
    <main
      className="relative flex h-screen flex-col p-12 text-purple-100 z-2 sm:p-24"
      onClick={onClick}
    >
      <h1 className="text-9xl font-light leading-[0.9] -tracking-widest">
        Neon Wave
      </h1>

      <div className="mt-2 w-full max-w-120">
        <div className="h-1 border border-purple-100/30">
          <div
            ref={durationRef}
            className="h-full w-0 bg-purple-100"
          />
        </div>

        {song && (
          <div className="mt-2 flex items-center gap-4 rounded-xl p-3">
            {song.image && (
              <Image src={song.image[song.image.length - 1].url} alt="cover" className="size-14 rounded-md" width={56} height={56} />
            )}
            <div>
              <p className="font-medium">{song.name}</p>
              <p className="text-xs text-purple-200">
                {song.artists.primary.map((e) => e.name).join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto ml-auto w-full max-w-100">
        {analyser && (
          <MusicVisualizer
            analyser={analyser}
            barWidth={3}
            gap={2}
          />
        )}
      </div>

      <Gradient />
    </main>
  );
}