import { Song } from "@/music/data";

export type QueueItem = Song;

export interface QueueManagerOptions {
  onUpdate?: (song: QueueItem | undefined) => void;
}

export interface QueueManager {
  songs: QueueItem[];

  getPendingSongs(): QueueItem[];
  getCurrentSong(): QueueItem | undefined;
  setIndex(id: string): void;
  setSongs(songs: QueueItem[]): void;

  previous(): void;
  next(): void;
}

export function createQueueManager(options: QueueManagerOptions): QueueManager {
  let items: QueueItem[] = [];
  let currentId: string | undefined;

  const getCurrentIndex = () => items.findIndex((song) => song.id === currentId);

  const onUpdate = () => {
    options.onUpdate?.(getCurrentSong());
  };

  const getCurrentSong = () => items.find((song) => song.id === currentId);

  const setIndex = (id: string) => {
    if (!items.some((song) => song.id === id) || id === currentId) return;
    currentId = id;
    onUpdate();
  };

  const setSongs = (songs: QueueItem[]) => {
    items = songs;
    if (!items.some((song) => song.id === currentId)) {
      currentId = undefined;
    }
  };

  const step = (delta: number) => {
    if (items.length === 0) return;
    const currentIndex = getCurrentIndex();
    let target = currentIndex + delta;
    if (target >= items.length) target = 0;
    else if (target < 0) target = items.length - 1;
    if (target === currentIndex) return;
    currentId = items[target].id;
    onUpdate();
  };

  return {
    get songs() {
      return items;
    },
    getPendingSongs() {
      return items.slice(getCurrentIndex() + 1);
    },
    getCurrentSong,
    setIndex,
    setSongs,
    next() {
      step(1);
    },
    previous() {
      step(-1);
    },
  };
}
