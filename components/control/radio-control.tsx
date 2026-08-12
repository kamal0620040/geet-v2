"use client";

import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useMusicPlayer } from "@/lib/player-context";

const buttonVariants = cva(
  "size-8 rounded-full p-1.5 cursor-pointer transition-colors",
  {
    variants: {
      active: {
        true: "bg-purple-500/40 text-purple-100 hover:bg-purple-500/50",
        false: "bg-purple-200/10 hover:bg-purple-200/20",
      },
    },
  },
);

export function RadioControl() {
  const { musicManager, currentSong, radioActive, startRadio, stopRadio } =
    useMusicPlayer();

  if (!musicManager || !currentSong) return null;

  return (
    <button
      aria-label={radioActive ? "Stop radio" : "Start radio"}
      title={radioActive ? "Stop radio" : "Start radio"}
      aria-pressed={radioActive}
      onClick={() => (radioActive ? stopRadio() : void startRadio(currentSong))}
      className={cn(buttonVariants({ active: radioActive }))}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
        <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
        <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
      </svg>
    </button>
  );
}
