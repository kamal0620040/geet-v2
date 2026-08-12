"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { QueueItem } from "@/lib/queue-manager";

export function SongDisplaySkeleton() {
  return (
    <div className="flex flex-row items-center gap-4 mt-4 rounded-xl p-3">
      <div className="animate-shimmer size-14 shrink-0 rounded-md" />
      <div className="flex flex-col gap-2">
        <div className="animate-shimmer h-4 w-44 rounded-md" />
        <div className="animate-shimmer h-3 w-28 rounded-md" />
      </div>
    </div>
  );
}

export function SongDisplay({ song }: { song: QueueItem }) {
  return (
    <motion.div
      key={song.url}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
className="flex flex-1 flex-row items-center gap-3 mt-4 rounded-xl p-3 min-w-0"
    >
      {song.image && (
        <Image
          src={song.image[song.image.length - 1].url}
          alt="cover"
          className="size-14 rounded-md"
          width={56}
          height={56}
        />
      )}
      <div className="min-w-0">
        <p className="font-medium truncate">{song.name}</p>
        <p className="text-xs text-purple-200 truncate">
          {song.artists?.primary?.map((e) => e.name).join(", ")}
        </p>
      </div>
    </motion.div>
  );
}
