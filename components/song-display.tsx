"use client";

import { m } from "framer-motion";
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

export function SongDisplay({
  song,
  onClickArtist,
}: {
  song: QueueItem;
  onClickArtist?: (artistId: string) => void;
}) {
  return (
    <m.div
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
        {song.artists?.primary?.length ? (
          <p className="text-xs text-purple-200/80 truncate">
            {song.artists.primary.map((artist, i) => (
              <span key={artist.id}>
                {i > 0 && ", "}
                {artist.id && onClickArtist ? (
                  <button
                    type="button"
                    onClick={() => onClickArtist(artist.id)}
                    className="font-medium text-purple-200/90 transition-colors hover:text-pink-400 hover:underline cursor-pointer"
                  >
                    {artist.name}
                  </button>
                ) : (
                  artist.name
                )}
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </m.div>
  );
}
