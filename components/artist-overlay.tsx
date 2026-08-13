"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Music, X } from "lucide-react";
import { getArtistDetail, ArtistDetail } from "@/lib/artist-api";
import { cn, decodeHtmlEntities, formatNumber } from "@/lib/utils";
import { useMusicPlayer } from "@/lib/player-context";
import { QueueItem } from "@/lib/queue-manager";

type ArtistOverlayStatus = "loading" | "ready" | "error";

export function ArtistOverlay({
  artistId,
  onClose,
}: {
  artistId: string | null;
  onClose: () => void;
}) {
  const { musicManager, setSongs } = useMusicPlayer();
  const [status, setStatus] = useState<ArtistOverlayStatus>("loading");
  const [artist, setArtist] = useState<ArtistDetail | null>(null);

  useEffect(() => {
    if (!artistId) return;
    let cancelled = false;

    getArtistDetail(artistId, 20)
      .then((data) => {
        if (cancelled) return;
        setArtist(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [artistId]);

  useEffect(() => {
    if (!artistId) return;
    const block = (e: KeyboardEvent) => {
      if (
        e.key === " " ||
        e.key.startsWith("Arrow")
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", block, true);
    return () => window.removeEventListener("keydown", block, true);
  }, [artistId]);

  const playArtist = () => {
    if (!musicManager || !artist || artist.topSongs.length === 0) return;
    musicManager.queueManager.setSongs(artist.topSongs);
    musicManager.queueManager.setIndex(artist.topSongs[0].id);
    setSongs(artist.topSongs);
    void musicManager.play().catch(() => {});
  };

  const playSong = (song: QueueItem) => {
    if (!musicManager || !artist) return;
    musicManager.queueManager.setSongs(artist.topSongs);
    musicManager.queueManager.setIndex(song.id);
    setSongs(artist.topSongs);
    void musicManager.play().catch(() => {});
  };

  const currentId = musicManager?.queueManager.getCurrentSong()?.id;
  const isLoading =
    status === "loading" || (artist !== null && artist.id !== artistId);

  return (
    <AnimatePresence>
      {artistId && (
        <motion.div
          key="artist-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-xl border border-purple-200/10 bg-purple-950/40 shadow-lg backdrop-blur-lg text-purple-200"
          >
            <div className="flex items-center justify-between px-4 pt-4 shrink-0">
              <h2 className="truncate text-xs font-semibold uppercase tracking-wider text-purple-200/80">
                {isLoading || status === "error" ? "Artist" : artist?.name ?? "Artist"}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close artist view"
                className="rounded-md p-1 text-purple-200/70 transition-colors hover:bg-purple-200/10 hover:text-purple-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {status === "error" && !isLoading && (
              <p className="py-6 text-center text-[13px] text-red-300">
                Failed to load artist.
              </p>
            )}

            {isLoading && (
              <>
                <div className="flex flex-col items-center gap-3 border-b border-purple-200/10 px-4 pb-4 pt-5 text-center sm:flex-row sm:text-left shrink-0">
                  <div className="size-20 shrink-0 rounded-xl animate-shimmer" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="h-5 w-40 rounded-md animate-shimmer" />
                    <div className="h-3 w-24 rounded-md animate-shimmer" />
                    <div className="mt-2 h-8 w-28 rounded-md animate-shimmer" />
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 pb-2 pt-3 shrink-0">
                  <div className="h-3 w-16 rounded-md animate-shimmer" />
                  <div className="h-3 w-10 rounded-md animate-shimmer" />
                </div>

                <div className="scrollbar-purple flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="flex flex-row items-center gap-3 p-2">
                      <div className="h-3 w-5 shrink-0 animate-shimmer" />
                      <div className="size-11 shrink-0 rounded-md animate-shimmer" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="h-3 w-3/4 rounded-md animate-shimmer" />
                        <div className="h-2.5 w-1/2 rounded-md animate-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {status === "ready" && artist && !isLoading && (
              <>
                <div className="flex flex-col items-center gap-3 border-b border-purple-200/10 px-4 pb-4 pt-5 text-center sm:flex-row sm:text-left shrink-0">
                  {artist.image[artist.image.length - 1]?.url ? (
                    <Image
                      src={artist.image[artist.image.length - 1].url}
                      alt={artist.name}
                      width={80}
                      height={80}
                      className="size-20 shrink-0 rounded-xl object-cover border border-purple-200/20"
                    />
                  ) : (
                    <div className="size-20 shrink-0 rounded-xl bg-purple-400/10 flex items-center justify-center">
                      <Music className="size-9 text-purple-300/40" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-lg font-bold text-purple-100">
                      {artist.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-purple-200/70">
                      {artist.followerCount
                        ? `${formatNumber(Number(artist.followerCount))} followers`
                        : artist.dominentLanguage || "Artist"}
                    </p>
                    <button
                      onClick={playArtist}
                      className="mt-3 rounded-md bg-purple-500/40 px-3 py-1.5 text-xs font-medium text-purple-100 transition-colors hover:bg-purple-500/50 cursor-pointer"
                    >
                      Play Top Songs
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 pb-2 pt-3 shrink-0">
                  <h3 className="text-xs font-semibold text-purple-100">
                    Top Songs
                  </h3>
                  <span className="text-[11px] text-purple-200/50">
                    {artist.topSongs.length} songs
                  </span>
                </div>

                <div className="scrollbar-purple flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-2">
                  {artist.topSongs.map((song, index) => (
                    <button
                      key={song.id}
                      type="button"
                      onClick={() => playSong(song)}
                      className={cn(
                        "group flex w-full cursor-pointer flex-row items-center gap-3 rounded-lg p-2 text-left transition-colors",
                        song.id === currentId
                          ? "bg-purple-400/20"
                          : "hover:bg-purple-200/10",
                      )}
                    >
                      <span className="w-5 shrink-0 text-center text-[11px] text-purple-200/40">
                        {index + 1}
                      </span>
                      {song.image[song.image.length - 1]?.url && (
                        <Image
                          src={song.image[song.image.length - 1].url}
                          alt={song.name}
                          width={48}
                          height={48}
                          className="size-11 shrink-0 rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-purple-100">
                          {decodeHtmlEntities(song.name)}
                        </p>
                        <p className="truncate text-[11px] text-purple-200/60">
                          {song.artists?.primary
                            ?.slice(0, 2)
                            ?.map((e) => e.name)
                            .join(", ")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}