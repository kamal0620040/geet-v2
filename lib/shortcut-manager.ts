import { MusicManager } from "@/lib/music-manager";

export interface ShortcutManagerOptions {
  musicManager: MusicManager;
}

export interface ShortcutManager {
  bind(): void;
  onPress(event: KeyboardEvent): void;
  destroy(): void;
}

export function createShortcutManager({
  musicManager,
}: ShortcutManagerOptions): ShortcutManager {
  const handler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    const isInput =
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable);

    if (isInput) return;

    switch (event.key) {
      case "ArrowUp":
        musicManager.queueManager.previous();
        event.preventDefault();
        break;
      case "ArrowDown":
        musicManager.queueManager.next();
        event.preventDefault();
        break;
      case "ArrowLeft":
        musicManager.setTime(musicManager.getTime() - 1);
        event.preventDefault();
        break;
      case "ArrowRight":
        musicManager.setTime(musicManager.getTime() + 1);
        event.preventDefault();
        break;
      case " ":
        if (musicManager.isPaused()) musicManager.play();
        else musicManager.pause();

        event.preventDefault();
        break;
    }
  };

  return {
    onPress: handler,
    bind() {
      window.addEventListener("keydown", handler);
    },
    destroy() {
      window.removeEventListener("keydown", handler);
    },
  };
}