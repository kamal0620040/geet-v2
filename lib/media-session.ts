import { MusicManager } from "@/lib/music-manager";
import { QueueItem } from "@/lib/queue-manager";
import { decodeHtmlEntities } from "@/lib/utils";

export function setupMediaSession(manager: MusicManager) {
  if (globalThis.window === undefined || !("mediaSession" in navigator)) return;

  const ms = navigator.mediaSession;

  ms.setActionHandler("play", () => {
    void manager.play();
  });

  ms.setActionHandler("pause", () => {
    manager.pause();
  });

  ms.setActionHandler("previoustrack", () => {
    manager.queueManager.previous();
  });

  ms.setActionHandler("nexttrack", () => {
    manager.queueManager.next();
  });

  ms.setActionHandler("seekto", (details) => {
    if (details.seekTime !== undefined && details.seekTime !== null) {
      manager.setTime(details.seekTime);
    }
  });
}

export function updateMediaSessionMetadata(song: QueueItem | undefined) {
  if (globalThis.window === undefined || !("mediaSession" in navigator) || !song) {
    return;
  }

  const title = decodeHtmlEntities(song.name);
  const artist = song.artists?.primary?.map((a) => a.name).join(", ") || "Unknown Artist";
  const artwork = song.image?.map((img) => ({
    src: img.url,
    sizes: img.quality || "500x500",
    type: "image/jpeg",
  })) || [];

  navigator.mediaSession.metadata = new MediaMetadata({
    title,
    artist,
    album: song.album?.name ? decodeHtmlEntities(song.album.name) : "Neon Wave Lofi",
    artwork,
  });
}
