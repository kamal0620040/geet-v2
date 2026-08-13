"use client";

import { useMusicPlayer } from "@/lib/player-context";
import { VisualizerMode } from "@/components/music-visualizer";

const modes: { id: VisualizerMode; label: string }[] = [
  { id: "spectrum", label: "Spectrum" },
  { id: "waveform", label: "Waveform" },
  { id: "radial", label: "Radial" },
];

export function Equalizer() {
  const { eq, setEq, visualizerMode, setVisualizerMode } = useMusicPlayer();

  const handleBassChange = (val: number) => {
    setEq({ ...eq, bass: val });
  };

  const handleMidChange = (val: number) => {
    setEq({ ...eq, mid: val });
  };

  const handleTrebleChange = (val: number) => {
    setEq({ ...eq, treble: val });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Visualizer Mode Switcher */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-200/70">
          Visualizer Mode
        </span>
        <div className="flex flex-row gap-1.5 mt-1.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setVisualizerMode(m.id)}
              className={`flex-1 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer ${
                visualizerMode === m.id
                  ? "bg-purple-500/30 text-purple-100 font-medium"
                  : "bg-purple-200/10 text-purple-200/60 hover:bg-purple-200/20 hover:text-purple-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Band Graphic Equalizer Sliders */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-200/70">
          3-Band Equalizer
        </span>
        <div className="flex flex-col gap-2.5 mt-2">
          {/* Bass */}
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-purple-200/80">
              <span>Bass (200Hz)</span>
              <span>{eq.bass > 0 ? `+${eq.bass}` : eq.bass} dB</span>
            </div>
            <input
              type="range"
              aria-label="Bass"
              min={-12}
              max={12}
              step={1}
              value={eq.bass}
              onChange={(e) => handleBassChange(Number(e.target.value))}
              className="h-1.5 w-full accent-purple-400 cursor-pointer rounded-lg bg-purple-200/20"
            />
          </div>

          {/* Mids */}
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-purple-200/80">
              <span>Mid (1kHz)</span>
              <span>{eq.mid > 0 ? `+${eq.mid}` : eq.mid} dB</span>
            </div>
            <input
              type="range"
              aria-label="Mid"
              min={-12}
              max={12}
              step={1}
              value={eq.mid}
              onChange={(e) => handleMidChange(Number(e.target.value))}
              className="h-1.5 w-full accent-purple-400 cursor-pointer rounded-lg bg-purple-200/20"
            />
          </div>

          {/* Treble */}
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-purple-200/80">
              <span>Treble (4kHz)</span>
              <span>{eq.treble > 0 ? `+${eq.treble}` : eq.treble} dB</span>
            </div>
            <input
              type="range"
              aria-label="Treble"
              min={-12}
              max={12}
              step={1}
              value={eq.treble}
              onChange={(e) => handleTrebleChange(Number(e.target.value))}
              className="h-1.5 w-full accent-purple-400 cursor-pointer rounded-lg bg-purple-200/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
