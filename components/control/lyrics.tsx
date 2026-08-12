"use client";

import { useEffect, useRef, useState } from "react";
import { cn, decodeHtmlEntities } from "@/lib/utils";
import { QueueItem } from "@/lib/queue-manager";
import { useMusicPlayer } from "@/lib/player-context";
import { getSongLyrics } from "@/lib/lyrics-api";

interface LyricLine {
  time: number;
  text: string;
}

function parseLyrics(lrc: string): LyricLine[] {
  if (!lrc) return [];

  const parsed: LyricLine[] = [];
  const lines = lrc.split("\n");

  for (const line of lines) {
    const text = line.replace(/\[[^\]]*\]/g, "").trim();
    const timestamps = [
      ...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g),
    ];

    if (timestamps.length === 0) {
      if (text) parsed.push({ time: -1, text });
      continue;
    }

    for (const match of timestamps) {
      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const fractional = (match[3] ?? "0").padEnd(3, "0");
      parsed.push({
        time: minutes * 60 + seconds + Number(fractional) / 1000,
        text,
      });
    }
  }

  return parsed.sort((a, b) => a.time - b.time);
}

type LyricsStatus = "loading" | "ready" | "empty" | "error";

export function LyricsPanel({ song }: { song: QueueItem }) {
  const { musicManager } = useMusicPlayer();
  const [status, setStatus] = useState<LyricsStatus>(
    song?.lyricsId ? "loading" : "empty",
  );
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [plainText, setPlainText] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    if (!song?.lyricsId) {
      return () => {
        cancelled = true;
      };
    }

    getSongLyrics(song.lyricsId)
      .then((lrc) => {
        if (cancelled) return;
        if (!lrc.trim()) {
          setStatus("empty");
          return;
        }
        const cleaned = lrc.replace(/<br\s*\/?>/gi, "\n");
        const parsed = parseLyrics(cleaned);
        setLines(parsed);
        if (parsed.length > 0) {
          setStatus("ready");
        } else {
          setPlainText(decodeHtmlEntities(cleaned));
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [song?.id, song?.lyricsId]);

  useEffect(() => {
    if (status !== "ready" || lines.length === 0) return;

    const id = setInterval(() => {
      setCurrentTime(musicManager?.getTime() ?? 0);
    }, 250);

    return () => clearInterval(id);
  }, [status, lines, musicManager]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentTime, status]);

  let activeIndex = -1;
  if (status === "ready" && lines.length > 0) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].time >= 0 && lines[i].time <= currentTime + 0.25) {
        activeIndex = i;
        break;
      }
    }
  }

  return (
    <div className="lyrics-panel mt-3 rounded-md border border-purple-200/10 bg-purple-950/40 p-3 shadow-lg backdrop-blur-lg">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-200/80">
        Lyrics
      </span>

      {status === "loading" && (
        <div className="mt-2 flex flex-col gap-1.5 py-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="animate-shimmer h-3.5 w-40 rounded-md"
              style={{ width: `${70 - i * 10}%` }}
            />
          ))}
        </div>
      )}

      {status === "empty" && (
        <p className="mt-2 text-xs text-purple-200/70 py-2">
          Lyrics are not available for this song.
        </p>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-300 py-2">Failed to load lyrics.</p>
      )}

      {status === "ready" && lines.length === 0 && (
        <p className="mt-2 text-[13px] leading-relaxed text-purple-200 whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-purple">
          {plainText}
        </p>
      )}

      {status === "ready" && lines.length > 0 && (
        <div
          ref={containerRef}
          className="mt-2 flex max-h-52 flex-col gap-1 overflow-y-auto py-2 scrollbar-purple"
        >
          {lines.map((line, index) => (
            <div
              key={`${line.time}-${index}`}
              ref={index === activeIndex ? activeRef : undefined}
              className={cn(
                "rounded px-1 py-0.5 text-[13px] leading-relaxed transition-colors",
                index === activeIndex
                  ? "bg-purple-400/20 text-white font-medium"
                  : "text-purple-200/55",
              )}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}