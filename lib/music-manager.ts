import { Song } from "@/music/data";
import {
  createQueueManager,
  QueueItem,
  QueueManager,
} from "@/lib/queue-manager";

export interface EqSettings {
  bass: number;
  mid: number;
  treble: number;
}

export interface MusicManager {
  queueManager: QueueManager;
  analyser: AnalyserNode;

  play(): Promise<void>;
  pause(): void;
  setPlaying(song: Song): void;
  destroy(): void;

  isPaused(): boolean;
  getTime(): number;
  getDuration(): number;
  setTime(time: number): void;

  setEq(bass: number, mid: number, treble: number): void;
  getEq(): EqSettings;
}

export interface MusicManagerOptions {
  onNext?: (song: QueueItem | undefined) => void;
  onStateChange?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export function createMusicManager({
  ...options
}: MusicManagerOptions): MusicManager {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  let shouldPlay = false;

  // 3-Band Equalizer BiquadFilterNodes
  const bassFilter = context.createBiquadFilter();
  bassFilter.type = "lowshelf";
  bassFilter.frequency.value = 200;
  bassFilter.gain.value = 0;

  const midFilter = context.createBiquadFilter();
  midFilter.type = "peaking";
  midFilter.frequency.value = 1000;
  midFilter.Q.value = 1;
  midFilter.gain.value = 0;

  const trebleFilter = context.createBiquadFilter();
  trebleFilter.type = "highshelf";
  trebleFilter.frequency.value = 4000;
  trebleFilter.gain.value = 0;

  const onStateChange = () => {
    options.onStateChange?.();
  };
  const onTimeUpdate = () => {
    options.onTimeUpdate?.(audio.currentTime, audio.duration);
  };
  const onEnded = () => {
    manager.queueManager.next();
    manager.play();
  };

  const queueManager = createQueueManager({
    onUpdate: (song) => {
      if (song) manager.setPlaying(song);
      options?.onNext?.(song);
      options.onTimeUpdate?.(0, 0);
    },
  });

  const init = () => {
    const source = context.createMediaElementSource(audio);
    // Connect audio node chain: source -> bass -> mid -> treble -> analyser -> destination
    source.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(analyser);
    analyser.connect(context.destination);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onStateChange);
    audio.addEventListener("pause", onStateChange);
    audio.addEventListener("ended", onEnded);
    queueManager.setIndex(queueManager.songs[0]?.id ?? "");
  };

  const manager: MusicManager = {
    queueManager,
    analyser,
    getTime(): number {
      return audio.currentTime;
    },
    getDuration(): number {
      return audio.duration;
    },
    setTime(time: number) {
      audio.currentTime = time;
    },
    isPaused(): boolean {
      return context.state === "suspended" || (audio != null && audio.paused);
    },
    async play() {
      shouldPlay = true;

      if (!audio.src) return;

      if (context.state === "suspended") {
        await context.resume();
      }

      try {
        await audio.play();
      } catch (error) {
        if (!(error instanceof DOMException) || error.name !== "AbortError") {
          throw error;
        }
      }
    },
    pause() {
      shouldPlay = false;
      void audio.pause();
    },
    setPlaying(song) {
      const source = [...song.downloadUrl].sort(
        (a, b) => parseInt(b.quality) - parseInt(a.quality),
      )[0];
      audio.src = source?.url ?? "";

      if (shouldPlay) {
        void this.play();
      }
    },
    setEq(bass: number, mid: number, treble: number) {
      bassFilter.gain.value = bass;
      midFilter.gain.value = mid;
      trebleFilter.gain.value = treble;
    },
    getEq() {
      return {
        bass: bassFilter.gain.value,
        mid: midFilter.gain.value,
        treble: trebleFilter.gain.value,
      };
    },
    destroy() {
      this.pause();
      audio.removeEventListener("play", onStateChange);
      audio.removeEventListener("pause", onStateChange);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    },
  };

  init();

  return manager;
}