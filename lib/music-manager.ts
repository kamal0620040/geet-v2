import songs from '@/music/data.json';
import { Song } from '@/music/data';

export interface MusicManager {
    queue: number;
    analyser: AnalyserNode;
    init(): void;
    play(): void;
    previous(): void;
    next(): void;
    isPaused(): boolean;
    setTrack(index: number): void;
    timeUpdate(): void;
    pause(): void,
    destroy(): void;

    getTime(): number;
    setTime(time: number): void;
}

export interface MusicManagerOptions {
    duration: HTMLDivElement;
    onNext?: (song: Song) => void;
}

export function createMusicManager({
    duration,
    ...options
}: MusicManagerOptions): MusicManager {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const audio = new Audio();
    let source: MediaElementAudioSourceNode | undefined;

    let onDestroy: () => void;

    const updateDuration = (percent: number) => {
        duration.style.setProperty("width", `${percent}%`);
    };

    return {
        queue: 0,
        analyser,
        getTime(): number {
            return audio.currentTime;
        },
        setTime(time: number) {
            audio.currentTime = time;
        },
        isPaused(): boolean {
            return context.state === "suspended" || (audio != null && audio.paused)
        },
        init() {
            const onEnded = () => {
                this.next();
                this.play();
            }

            source = context.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(context.destination);

            audio.addEventListener("timeupdate", this.timeUpdate);
            audio.addEventListener("ended", onEnded);
            this.setTrack(0);

            onDestroy = () => {
                audio.removeEventListener("timeupdate", this.timeUpdate);
                audio.removeEventListener("ended", onEnded);
            }
        },
        play() {
            if(context.state === "suspended") {
                context.resume();
            }

            audio.play();
        },
        pause() {
            audio.pause();
        },
        setTrack(index: number) {
            this.queue = index;
            const wasPlaying = !this.isPaused();
            const song = songs[index];

            audio.src = song.url;

            updateDuration(0);
            options?.onNext?.(song as Song);

            if(wasPlaying) {
                this.play();
            }
        },
        previous() {
            this.setTrack(this.queue <= 0 ? songs.length - 1 : this.queue - 1);
        },
        next() {
            this.setTrack(this.queue >= songs.length - 1 ? 0 : this.queue + 1);
        },
        timeUpdate() {
            updateDuration((audio.currentTime / audio.duration) * 100);
        },
        destroy() {
            this.pause();
            onDestroy();
        }
    }
}