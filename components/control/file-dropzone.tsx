"use client";

import { useEffect, useRef, useState } from "react";
import { useMusicPlayer } from "@/lib/player-context";
import { QueueItem } from "@/lib/queue-manager";
import { m, AnimatePresence } from "framer-motion";

export function FileDropzone() {
  const { musicManager, setSongs } = useMusicPlayer();
  const [isDragging, setIsDragging] = useState(false);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDragging(false);

      if (!musicManager || !e.dataTransfer?.files?.length) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("audio/") ||
        /\.(mp3|wav|flac|ogg|m4a)$/i.test(file.name)
      );

      if (files.length === 0) return;

      const newSongs: QueueItem[] = files.map((file, idx) => {
        // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke
        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.push(objectUrl);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

        return {
          id: `local-${Date.now()}-${idx}`,
          name: nameWithoutExt,
          type: "song",
          year: new Date().getFullYear().toString(),
          releaseDate: "",
          duration: 0,
          label: "Local File",
          explicitContent: false,
          playCount: 0,
          language: "english",
          hasLyrics: false,
          lyricsId: null,
          url: objectUrl,
          copyright: "",
          album: {
            id: "local",
            name: "Local Audio",
            url: "",
          },
          artists: {
            primary: [
              {
                id: "local",
                name: "Local File",
                role: "artist",
                type: "artist",
                image: [],
                url: "",
              },
            ],
            featured: [],
            all: [],
          },
          image: [
            {
              quality: "500x500",
              url: "/favicon.ico",
            },
          ],
          downloadUrl: [
            {
              quality: "320kbps",
              url: objectUrl,
            },
          ],
        };
      });

      musicManager.queueManager.setSongs(newSongs);
      musicManager.queueManager.setIndex(newSongs[0].id);
      setSongs(newSongs);
      void musicManager.play().catch(() => {});
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [musicManager, setSongs]);

  return (
    <AnimatePresence>
      {isDragging && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md border-4 border-dashed border-purple-400 p-8 text-center"
        >
          <div className="size-20 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-200 mb-4 animate-bounce">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-purple-100">
            Drop Audio Files Here
          </h2>
          <p className="text-sm text-purple-200/70 mt-1">
            Supports MP3, WAV, FLAC, OGG, and M4A tracks
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}

